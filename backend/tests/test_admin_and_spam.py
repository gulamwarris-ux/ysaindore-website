"""Backend tests for admin auth, honeypot, and rate limit."""
import os
import time
import pytest
import requests

BASE_URL = (os.environ.get("REACT_APP_BACKEND_URL") or "https://curious-minds-53.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"

ADMIN_TOKEN = os.environ.get("ADMIN_TOKEN")
NONADMIN_TOKEN = os.environ.get("NONADMIN_TOKEN")


@pytest.fixture(scope="session")
def http():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


def _admin_headers():
    return {"Authorization": f"Bearer {ADMIN_TOKEN}"}


def _nonadmin_headers():
    return {"Authorization": f"Bearer {NONADMIN_TOKEN}"}


# ---------- Auth allowlist ----------
class TestAdminAuthAllowlist:
    def test_admin_enquiries_no_token_401(self, http):
        r = http.get(f"{API}/admin/enquiries", timeout=30)
        assert r.status_code == 401, r.text

    def test_admin_enquiries_nonadmin_403(self, http):
        r = http.get(f"{API}/admin/enquiries", headers=_nonadmin_headers(), timeout=30)
        assert r.status_code == 403, r.text

    def test_admin_enquiries_admin_200(self, http):
        r = http.get(f"{API}/admin/enquiries", headers=_admin_headers(), timeout=30)
        assert r.status_code == 200, r.text
        assert isinstance(r.json(), list)

    def test_auth_me_admin_is_admin_true(self, http):
        r = http.get(f"{API}/auth/me", headers=_admin_headers(), timeout=30)
        assert r.status_code == 200, r.text
        d = r.json()
        assert d["email"] == "drarifa@ysaindore.com"
        assert d["is_admin"] is True

    def test_auth_me_nonadmin_is_admin_false(self, http):
        r = http.get(f"{API}/auth/me", headers=_nonadmin_headers(), timeout=30)
        assert r.status_code == 200
        assert r.json()["is_admin"] is False

    def test_auth_me_no_token_401(self, http):
        r = http.get(f"{API}/auth/me", timeout=30)
        assert r.status_code == 401


# ---------- Admin CRUD ----------
class TestAdminCRUD:
    def test_patch_and_delete_flow(self, http):
        # Seed an enquiry directly via public endpoint
        r = http.post(f"{API}/enquiries", json={"name": "TEST_AdminCRUD", "phone": "9111111111", "kind": "contact"}, timeout=30)
        assert r.status_code == 200, r.text
        eid = r.json()["id"]

        # non-admin PATCH forbidden
        rp0 = http.patch(f"{API}/admin/enquiries/{eid}", json={"status": "contacted"}, headers=_nonadmin_headers(), timeout=30)
        assert rp0.status_code == 403

        # admin PATCH
        rp = http.patch(f"{API}/admin/enquiries/{eid}", json={"status": "contacted"}, headers=_admin_headers(), timeout=30)
        assert rp.status_code == 200, rp.text
        assert rp.json()["status"] == "contacted"

        # verify persisted via list
        rl = http.get(f"{API}/admin/enquiries", headers=_admin_headers(), timeout=30)
        row = next((x for x in rl.json() if x["id"] == eid), None)
        assert row is not None
        assert row["status"] == "contacted"

        # non-admin DELETE forbidden
        rd0 = http.delete(f"{API}/admin/enquiries/{eid}", headers=_nonadmin_headers(), timeout=30)
        assert rd0.status_code == 403

        # admin DELETE
        rd = http.delete(f"{API}/admin/enquiries/{eid}", headers=_admin_headers(), timeout=30)
        assert rd.status_code == 200, rd.text

        # verify gone -> PATCH now 404
        rp2 = http.patch(f"{API}/admin/enquiries/{eid}", json={"status": "resolved"}, headers=_admin_headers(), timeout=30)
        assert rp2.status_code == 404

    def test_export_csv(self, http):
        r = http.get(f"{API}/admin/enquiries/export", headers=_admin_headers(), timeout=30)
        assert r.status_code == 200, r.text
        ctype = r.headers.get("content-type", "")
        assert "text/csv" in ctype, ctype
        body = r.text
        # Header row present
        assert body.startswith("Name,Phone,Email,Grade,Type,Status,Message,Received"), body[:120]

    def test_export_forbidden_for_nonadmin(self, http):
        r = http.get(f"{API}/admin/enquiries/export", headers=_nonadmin_headers(), timeout=30)
        assert r.status_code == 403


# ---------- Honeypot ----------
class TestHoneypot:
    def test_honeypot_returns_200_but_not_stored(self, http):
        unique_name = f"TEST_HONEYPOT_{int(time.time()*1000)}"
        payload = {"name": unique_name, "phone": "9000000000", "kind": "contact", "company": "spam-bot-inc"}
        r = http.post(f"{API}/enquiries", json=payload, timeout=30)
        assert r.status_code == 200, r.text
        # verify NOT persisted
        rl = http.get(f"{API}/admin/enquiries", headers=_admin_headers(), timeout=30)
        names = [x["name"] for x in rl.json()]
        assert unique_name not in names, "Honeypot enquiry was stored — spam not blocked"


# ---------- Rate limit ----------
# Run LAST so it doesn't affect earlier tests. IP is the shared preview client, so once
# tripped, later POSTs from same IP may 429 too — this is expected per playbook.
class TestRateLimit:
    def test_rate_limit_triggers_429(self, http):
        got_429 = False
        # Try up to 20 quick posts; RL_MAX=8 per 600s window
        for i in range(20):
            r = http.post(f"{API}/enquiries",
                          json={"name": f"TEST_RL_{i}", "phone": "9000000001", "kind": "contact"},
                          timeout=30)
            if r.status_code == 429:
                got_429 = True
                break
            assert r.status_code == 200, f"unexpected status {r.status_code}: {r.text}"
        assert got_429, "Rate limit never fired within 20 requests"
