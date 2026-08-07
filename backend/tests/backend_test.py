"""Backend tests for Young Scientist Academy API."""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL") or "https://curious-minds-53.preview.emergentagent.com"
BASE_URL = BASE_URL.rstrip("/")
API = f"{BASE_URL}/api"


@pytest.fixture(scope="session")
def http():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ---------- Blog ----------
class TestBlog:
    def test_list_blog_returns_seeded_posts(self, http):
        r = http.get(f"{API}/blog", timeout=30)
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        assert len(data) >= 4
        p = data[0]
        for key in ("slug", "title", "cover", "body", "category"):
            assert key in p and p[key]

    def test_get_blog_by_valid_slug(self, http):
        # First fetch list to get a real slug
        r = http.get(f"{API}/blog", timeout=30)
        slug = r.json()[0]["slug"]
        r2 = http.get(f"{API}/blog/{slug}", timeout=30)
        assert r2.status_code == 200
        assert r2.json()["slug"] == slug

    def test_get_blog_specific_seeded_slug(self, http):
        # As per seed data
        r = http.get(f"{API}/blog/concept-based-learning-vs-rote", timeout=30)
        assert r.status_code == 200
        assert r.json()["slug"] == "concept-based-learning-vs-rote"

    def test_get_blog_invalid_slug_returns_404(self, http):
        r = http.get(f"{API}/blog/does-not-exist-xyz", timeout=30)
        assert r.status_code == 404


# ---------- Enquiries ----------
class TestEnquiries:
    created_ids = []

    def test_create_enquiry_demo(self, http):
        payload = {
            "name": "TEST_Demo Parent",
            "phone": "9926000920",
            "email": "test_demo@example.com",
            "grade": "Grade 6",
            "kind": "demo",
            "message": "Please arrange a demo",
        }
        r = http.post(f"{API}/enquiries", json=payload, timeout=30)
        assert r.status_code == 200, r.text
        d = r.json()
        assert d["id"]
        assert d["name"] == payload["name"]
        assert d["kind"] == "demo"
        TestEnquiries.created_ids.append(d["id"])

    def test_create_enquiry_contact_minimal(self, http):
        payload = {"name": "TEST_Contact Only", "phone": "9999999999"}
        r = http.post(f"{API}/enquiries", json=payload, timeout=30)
        assert r.status_code == 200, r.text
        d = r.json()
        assert d["kind"] == "contact"
        TestEnquiries.created_ids.append(d["id"])

    def test_create_enquiry_assessment(self, http):
        payload = {"name": "TEST_Assessment", "phone": "9876543210", "kind": "assessment"}
        r = http.post(f"{API}/enquiries", json=payload, timeout=30)
        assert r.status_code == 200
        assert r.json()["kind"] == "assessment"
        TestEnquiries.created_ids.append(r.json()["id"])

    def test_create_enquiry_invalid_kind_rejected(self, http):
        r = http.post(f"{API}/enquiries", json={"name": "x", "phone": "1", "kind": "bogus"}, timeout=30)
        assert r.status_code in (400, 422)

    def test_create_enquiry_missing_required(self, http):
        r = http.post(f"{API}/enquiries", json={"name": "only"}, timeout=30)
        assert r.status_code in (400, 422)

    def test_list_enquiries_returns_recent_first(self, http):
        r = http.get(f"{API}/enquiries", timeout=30)
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        # ensure created ones are present
        ids = [d["id"] for d in data]
        for cid in TestEnquiries.created_ids:
            assert cid in ids
        # sort check (desc)
        if len(data) >= 2:
            assert data[0]["created_at"] >= data[1]["created_at"]
