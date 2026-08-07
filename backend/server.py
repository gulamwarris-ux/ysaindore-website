from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Depends
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import io
import csv
import time
import logging
import asyncio
from collections import defaultdict
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import List, Optional, Literal
import uuid
import httpx
from datetime import datetime, timezone, timedelta


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Email (Emergent managed Resend proxy)
EMAIL_BASE_URL = "https://integrations.emergentagent.com"
EMAIL_KEY = os.environ["EMERGENT_EMAIL_KEY"]
EMAIL_FROM_NAME = os.environ["EMAIL_FROM_NAME"]
OWNER_EMAIL = os.environ.get("OWNER_EMAIL", "info@ysaindore.com")
ADMIN_EMAILS = {e.strip().lower() for e in os.environ.get("ADMIN_EMAILS", "").split(",") if e.strip()}

AUTH_SESSION_URL = "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data"
SESSION_DAYS = 7

# Lightweight in-memory rate limiter for public enquiry form
_rl = defaultdict(list)
RL_MAX = 8
RL_WINDOW = 600  # seconds

def rate_ok(ip: str) -> bool:
    now = time.time()
    q = _rl[ip]
    while q and q[0] < now - RL_WINDOW:
        q.pop(0)
    if len(q) >= RL_MAX:
        return False
    q.append(now)
    return True

app = FastAPI(title="Young Scientist Academy API")
api_router = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


# ---------- Models ----------
class Enquiry(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    phone: str
    email: Optional[str] = None
    grade: Optional[str] = None
    kind: Literal["demo", "contact", "assessment", "admission"] = "contact"
    message: Optional[str] = None
    status: Literal["new", "contacted", "resolved"] = "new"
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class EnquiryCreate(BaseModel):
    name: str
    phone: str
    email: Optional[EmailStr] = None
    grade: Optional[str] = None
    kind: Literal["demo", "contact", "assessment", "admission"] = "contact"
    message: Optional[str] = None
    company: Optional[str] = None  # honeypot — must stay empty


class StatusUpdate(BaseModel):
    status: Literal["new", "contacted", "resolved"]


class SessionExchange(BaseModel):
    session_id: str


class BlogPost(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    slug: str
    title: str
    excerpt: str
    body: str
    category: str
    author: str
    cover: str
    read_minutes: int = 4
    published_at: str


# ---------- Email helper ----------
KIND_LABEL = {"demo": "Free Demo Booking", "contact": "Contact Enquiry",
              "assessment": "Board Assessment Enquiry", "admission": "Admission Enquiry"}


async def send_owner_email(enq: Enquiry):
    label = KIND_LABEL.get(enq.kind, "Enquiry")
    rows = ""
    for k, v in [("Name", enq.name), ("Phone", enq.phone), ("Email", enq.email or "-"),
                 ("Grade", enq.grade or "-"), ("Type", label),
                 ("Message", enq.message or "-"), ("Received", enq.created_at)]:
        rows += (f'<tr><td style="padding:8px 12px;font-weight:600;color:#0A1930;'
                 f'background:#F0F4FA;border:1px solid #E2E8F0;">{k}</td>'
                 f'<td style="padding:8px 12px;color:#475569;border:1px solid #E2E8F0;">{v}</td></tr>')
    html = (
        f'<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;">'
        f'<div style="background:#0F3D8C;color:#fff;padding:20px 24px;border-radius:12px 12px 0 0;">'
        f'<h2 style="margin:0;">New {label}</h2>'
        f'<p style="margin:4px 0 0;color:#F5B400;">Young Scientist Academy, Indore</p></div>'
        f'<table style="width:100%;border-collapse:collapse;font-size:14px;">{rows}</table>'
        f'<p style="color:#94a3b8;font-size:12px;margin-top:16px;">Sent automatically from ysaindore.com</p></div>'
    )
    payload = {"to": [OWNER_EMAIL], "subject": f"New {label} — {enq.name}",
               "html": html, "from_name": EMAIL_FROM_NAME}
    if enq.email:
        payload["contact_email"] = enq.email
    try:
        async with httpx.AsyncClient(timeout=30) as c:
            resp = await c.post(f"{EMAIL_BASE_URL}/api/v1/email/send",
                                headers={"X-Email-Key": EMAIL_KEY}, json=payload)
        resp.raise_for_status()
    except Exception as e:
        logger.error(f"Email send failed: {e}")


# ---------- Routes ----------
@api_router.get("/")
async def root():
    return {"message": "Young Scientist Academy API"}


@api_router.post("/enquiries", response_model=Enquiry)
async def create_enquiry(payload: EnquiryCreate, request: Request):
    # Honeypot: bots fill hidden field. Pretend success, store nothing.
    if payload.company:
        return Enquiry(**payload.model_dump(exclude={"company"}))
    ip = request.client.host if request.client else "unknown"
    if not rate_ok(ip):
        raise HTTPException(status_code=429, detail="Too many requests. Please try again shortly.")
    enq = Enquiry(**payload.model_dump(exclude={"company"}))
    await db.enquiries.insert_one(enq.model_dump())
    asyncio.create_task(send_owner_email(enq))
    return enq


# ---------- Auth ----------
async def _session_token(request: Request) -> Optional[str]:
    token = request.cookies.get("session_token")
    if not token:
        auth = request.headers.get("Authorization", "")
        if auth.startswith("Bearer "):
            token = auth.split(" ", 1)[1]
    return token


async def get_current_user(request: Request):
    token = await _session_token(request)
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    sess = await db.user_sessions.find_one({"session_token": token}, {"_id": 0})
    if not sess:
        raise HTTPException(status_code=401, detail="Invalid session")
    expires_at = sess["expires_at"]
    if isinstance(expires_at, str):
        expires_at = datetime.fromisoformat(expires_at)
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=401, detail="Session expired")
    user = await db.users.find_one({"user_id": sess["user_id"]}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user


async def get_current_admin(user=Depends(get_current_user)):
    if user["email"].lower() not in ADMIN_EMAILS:
        raise HTTPException(status_code=403, detail="Not authorised for admin access")
    return user


@api_router.post("/auth/session")
async def auth_session(body: SessionExchange, response: Response):
    try:
        async with httpx.AsyncClient(timeout=30) as c:
            resp = await c.get(AUTH_SESSION_URL, headers={"X-Session-ID": body.session_id})
        resp.raise_for_status()
        data = resp.json()
    except Exception as e:
        logger.error(f"Auth session exchange failed: {e}")
        raise HTTPException(status_code=401, detail="Authentication failed")

    email = data["email"]
    existing = await db.users.find_one({"email": email}, {"_id": 0})
    if existing:
        user_id = existing["user_id"]
        await db.users.update_one({"user_id": user_id},
                                  {"$set": {"name": data.get("name"), "picture": data.get("picture")}})
    else:
        user_id = f"user_{uuid.uuid4().hex[:12]}"
        await db.users.insert_one({
            "user_id": user_id, "email": email, "name": data.get("name"),
            "picture": data.get("picture"), "created_at": datetime.now(timezone.utc).isoformat(),
        })

    session_token = data["session_token"]
    expires_at = datetime.now(timezone.utc) + timedelta(days=SESSION_DAYS)
    await db.user_sessions.insert_one({
        "user_id": user_id, "session_token": session_token,
        "expires_at": expires_at.isoformat(), "created_at": datetime.now(timezone.utc).isoformat(),
    })
    response.set_cookie("session_token", session_token, httponly=True, secure=True,
                        samesite="none", path="/", max_age=SESSION_DAYS * 24 * 3600)
    return {"user_id": user_id, "email": email, "name": data.get("name"),
            "picture": data.get("picture"), "is_admin": email.lower() in ADMIN_EMAILS}


@api_router.get("/auth/me")
async def auth_me(user=Depends(get_current_user)):
    return {"user_id": user["user_id"], "email": user["email"], "name": user.get("name"),
            "picture": user.get("picture"), "is_admin": user["email"].lower() in ADMIN_EMAILS}


@api_router.post("/auth/logout")
async def auth_logout(request: Request, response: Response):
    token = await _session_token(request)
    if token:
        await db.user_sessions.delete_one({"session_token": token})
    response.delete_cookie("session_token", path="/", samesite="none", secure=True)
    return {"status": "logged_out"}


# ---------- Admin ----------
@api_router.get("/admin/enquiries", response_model=List[Enquiry])
async def admin_list_enquiries(admin=Depends(get_current_admin)):
    docs = await db.enquiries.find({}, {"_id": 0}).sort("created_at", -1).to_list(2000)
    return docs


@api_router.patch("/admin/enquiries/{enquiry_id}", response_model=Enquiry)
async def admin_update_enquiry(enquiry_id: str, body: StatusUpdate, admin=Depends(get_current_admin)):
    res = await db.enquiries.find_one_and_update(
        {"id": enquiry_id}, {"$set": {"status": body.status}},
        projection={"_id": 0}, return_document=True)
    if not res:
        raise HTTPException(status_code=404, detail="Enquiry not found")
    return res


@api_router.delete("/admin/enquiries/{enquiry_id}")
async def admin_delete_enquiry(enquiry_id: str, admin=Depends(get_current_admin)):
    res = await db.enquiries.delete_one({"id": enquiry_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Enquiry not found")
    return {"status": "deleted"}


@api_router.get("/admin/enquiries/export")
async def admin_export_enquiries(admin=Depends(get_current_admin)):
    docs = await db.enquiries.find({}, {"_id": 0}).sort("created_at", -1).to_list(5000)
    buf = io.StringIO()
    writer = csv.writer(buf)
    writer.writerow(["Name", "Phone", "Email", "Grade", "Type", "Status", "Message", "Received"])
    for d in docs:
        writer.writerow([d.get("name"), d.get("phone"), d.get("email", ""), d.get("grade", ""),
                         d.get("kind"), d.get("status", "new"), d.get("message", ""), d.get("created_at")])
    buf.seek(0)
    return StreamingResponse(iter([buf.getvalue()]), media_type="text/csv",
                             headers={"Content-Disposition": "attachment; filename=enquiries.csv"})


@api_router.get("/blog", response_model=List[BlogPost])
async def list_blog():
    docs = await db.blog_posts.find({}, {"_id": 0}).sort("published_at", -1).to_list(100)
    return docs


@api_router.get("/blog/{slug}", response_model=BlogPost)
async def get_blog(slug: str):
    doc = await db.blog_posts.find_one({"slug": slug}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Post not found")
    return doc


# ---------- Seed ----------
SEED_POSTS = [
    {
        "slug": "concept-based-learning-vs-rote",
        "title": "Concept-Based Learning vs Rote Memorisation: What Actually Helps Your Child",
        "excerpt": "Why understanding the 'why' behind every idea builds confidence that lasts far beyond exam day.",
        "category": "Learning Science",
        "author": "Dr. Arifa Sheikh",
        "cover": "https://images.pexels.com/photos/8471859/pexels-photo-8471859.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        "read_minutes": 5,
        "published_at": "2026-05-28",
        "body": "Rote learning gets marks in the short term, but it rarely survives the next class. When a child memorises a formula without understanding where it comes from, the knowledge collapses the moment a question is framed differently.\n\nConcept-based learning flips this. We start with a phenomenon a child can see, touch or predict, and let the definition emerge from that experience. A student who has watched why a balloon expands over warm water will never forget the gas laws.\n\nAt Young Scientist Academy every topic follows the same arc: Observe, Think, Experiment, Understand, Apply and finally Excel. This is not slower learning; it is learning that compounds. By Grade 10 the difference between a memoriser and a thinker is enormous.",
    },
    {
        "slug": "choosing-right-board-cbse-icse-ib-state",
        "title": "CBSE, ICSE, IB or State Board? A Calm Guide for Confused Parents",
        "excerpt": "Each board rewards a different kind of learner. Here is how to match the board to your child, not the trend.",
        "category": "Board Guidance",
        "author": "Dr. Arifa Sheikh",
        "cover": "https://images.pexels.com/photos/8471975/pexels-photo-8471975.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        "read_minutes": 6,
        "published_at": "2026-05-20",
        "body": "The board debate causes more parental anxiety than almost any other decision. The truth is simpler than the noise: there is no 'best' board, only a best fit.\n\nCBSE rewards structured, exam-oriented learners and aligns tightly with national competitive exams. ICSE goes broader and deeper, ideal for children who enjoy language and detail. IB prizes inquiry, projects and independent thinking. State boards offer strong regional grounding and value.\n\nThe right question is not 'which board is toughest' but 'how does my child learn best'. Our Board Selection Assessment looks at learning style, strengths and long-term goals to give parents a clear, unbiased recommendation.",
    },
    {
        "slug": "olympiad-preparation-without-pressure",
        "title": "Preparing for Olympiads Without Burning Out",
        "excerpt": "Olympiads should sharpen curiosity, not crush it. Our approach to joyful, rigorous problem solving.",
        "category": "Competitions",
        "author": "Young Scientist Academy",
        "cover": "https://images.unsplash.com/photo-1764408721535-2dcb912db83e?crop=entropy&cs=srgb&fm=jpg&q=85&w=940",
        "read_minutes": 4,
        "published_at": "2026-05-10",
        "body": "Olympiad medals look impressive, but the real prize is the way of thinking they build. A well-prepared child stops fearing hard problems and starts enjoying them.\n\nWe never drill children with hundreds of past papers. Instead we teach a small number of powerful problem-solving strategies, then let students apply them to fresh, unfamiliar problems. Small batches mean every attempt gets discussed.\n\nParents often tell us their child became more confident in regular school work after Olympiad training. That transfer of confidence is exactly the point.",
    },
    {
        "slug": "hands-on-experiments-at-home",
        "title": "Five Safe Science Experiments You Can Do at Home This Weekend",
        "excerpt": "Simple, low-cost activities that turn your kitchen into a laboratory and spark real curiosity.",
        "category": "Activities",
        "author": "Young Scientist Academy",
        "cover": "https://images.unsplash.com/photo-1585980243496-fe29a36bd382?crop=entropy&cs=srgb&fm=jpg&q=85&w=940",
        "read_minutes": 4,
        "published_at": "2026-04-30",
        "body": "Curiosity does not switch off when class ends. These five experiments need nothing more than what is already in your home.\n\n1. Dancing raisins in fizzy water to see gas and buoyancy. 2. A homemade density tower with honey, water and oil. 3. Invisible ink with lemon juice. 4. A balloon inflated by baking soda and vinegar. 5. A rainbow made by refracting sunlight through a glass of water.\n\nAsk your child to predict what will happen before each step. That single habit, prediction before observation, is the heart of scientific thinking.",
    },
]


@app.on_event("startup")
async def seed_blog():
    count = await db.blog_posts.count_documents({})
    if count == 0:
        posts = [BlogPost(**p).model_dump() for p in SEED_POSTS]
        await db.blog_posts.insert_many(posts)
        logger.info(f"Seeded {len(posts)} blog posts")


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
