import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2, LogOut, Download, Trash2, Search, Inbox, RefreshCw } from "lucide-react";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "../components/ui/alert-dialog";
import { useAuth } from "../context/AuthContext";
import { adminList, adminUpdate, adminDelete, adminExport } from "../lib/api";

const KIND_LABEL = { demo: "Demo", contact: "Contact", assessment: "Assessment", admission: "Admission" };
const KIND_STYLE = {
  demo: "bg-ysa-blue/10 text-ysa-blue", contact: "bg-slate-100 text-slate-600",
  assessment: "bg-ysa-yellow/20 text-[#8a6a00]", admission: "bg-ysa-green/10 text-ysa-green",
};
const STATUS_STYLE = {
  new: "bg-red-100 text-red-600", contacted: "bg-amber-100 text-amber-700", resolved: "bg-emerald-100 text-emerald-700",
};

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [kind, setKind] = useState("all");
  const [status, setStatus] = useState("all");

  const load = async () => {
    setLoading(true);
    try { setRows(await adminList()); } catch { toast.error("Failed to load enquiries."); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const doLogout = async () => { await logout(); navigate("/login", { replace: true }); };

  const changeStatus = async (id, s) => {
    setRows((r) => r.map((x) => (x.id === id ? { ...x, status: s } : x)));
    try { await adminUpdate(id, s); toast.success("Status updated"); }
    catch { toast.error("Update failed"); load(); }
  };

  const remove = async (id) => {
    try { await adminDelete(id); setRows((r) => r.filter((x) => x.id !== id)); toast.success("Enquiry deleted"); }
    catch { toast.error("Delete failed"); }
  };

  const exportCsv = async () => {
    try {
      const blob = await adminExport();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = "enquiries.csv"; a.click();
      URL.revokeObjectURL(url);
    } catch { toast.error("Export failed"); }
  };

  const filtered = useMemo(() => rows.filter((r) => {
    if (kind !== "all" && r.kind !== kind) return false;
    if (status !== "all" && r.status !== status) return false;
    if (q) {
      const s = q.toLowerCase();
      return [r.name, r.phone, r.email, r.message, r.grade].some((v) => (v || "").toLowerCase().includes(s));
    }
    return true;
  }), [rows, q, kind, status]);

  const stats = useMemo(() => ({
    total: rows.length,
    new: rows.filter((r) => r.status === "new").length,
    demo: rows.filter((r) => r.kind === "demo").length,
    resolved: rows.filter((r) => r.status === "resolved").length,
  }), [rows]);

  return (
    <main className="min-h-screen bg-ysa-mist" data-testid="admin-dashboard">
      <header className="bg-white border-b border-ysa-mist sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src="/logo.png" alt="YSA" className="h-9 w-9 rounded-lg object-contain" />
            <div className="font-extrabold text-ysa-navy text-sm">Admin · Enquiries</div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-sm text-ysa-navy/60">{user?.email}</span>
            <button onClick={doLogout} data-testid="admin-logout"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-ysa-navy/70 hover:text-ysa-blue px-3 py-2 rounded-lg hover:bg-ysa-mist">
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-5 md:px-8 py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { k: "Total Enquiries", v: stats.total, c: "text-ysa-navy" },
            { k: "New / Unread", v: stats.new, c: "text-red-500" },
            { k: "Demo Bookings", v: stats.demo, c: "text-ysa-blue" },
            { k: "Resolved", v: stats.resolved, c: "text-emerald-600" },
          ].map((s) => (
            <div key={s.k} className="bg-white rounded-2xl p-5 shadow-soft border border-white" data-testid="admin-stat">
              <div className={`text-3xl font-extrabold ${s.c}`}>{s.v}</div>
              <div className="text-xs text-ysa-navy/50 mt-1 font-medium">{s.k}</div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-soft border border-white overflow-hidden">
          <div className="p-4 md:p-5 flex flex-col md:flex-row gap-3 md:items-center border-b border-ysa-mist">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ysa-navy/40" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, phone, email…"
                className="pl-9 rounded-xl" data-testid="admin-search" />
            </div>
            <Select value={kind} onValueChange={setKind}>
              <SelectTrigger className="w-full md:w-40 rounded-xl" data-testid="admin-filter-kind"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="demo">Demo</SelectItem>
                <SelectItem value="contact">Contact</SelectItem>
                <SelectItem value="assessment">Assessment</SelectItem>
                <SelectItem value="admission">Admission</SelectItem>
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-full md:w-40 rounded-xl" data-testid="admin-filter-status"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
            <button onClick={load} className="inline-flex items-center gap-1.5 text-sm font-semibold text-ysa-navy/70 hover:text-ysa-blue px-3 py-2.5 rounded-xl border border-ysa-mist" data-testid="admin-refresh">
              <RefreshCw className="h-4 w-4" /> Refresh
            </button>
            <button onClick={exportCsv} className="inline-flex items-center gap-1.5 text-sm font-semibold text-white bg-ysa-blue hover:bg-ysa-navy px-4 py-2.5 rounded-xl" data-testid="admin-export">
              <Download className="h-4 w-4" /> Export CSV
            </button>
          </div>

          {loading ? (
            <div className="py-24 flex justify-center"><Loader2 className="h-7 w-7 animate-spin text-ysa-blue" /></div>
          ) : filtered.length === 0 ? (
            <div className="py-24 flex flex-col items-center text-ysa-navy/40" data-testid="admin-empty">
              <Inbox className="h-10 w-10 mb-3" /> No enquiries found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-ysa-navy/50 border-b border-ysa-mist">
                    <th className="px-5 py-3 font-semibold">Name</th>
                    <th className="px-5 py-3 font-semibold">Contact</th>
                    <th className="px-5 py-3 font-semibold">Type</th>
                    <th className="px-5 py-3 font-semibold">Grade</th>
                    <th className="px-5 py-3 font-semibold hidden lg:table-cell">Message</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                    <th className="px-5 py-3 font-semibold">Received</th>
                    <th className="px-5 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r) => (
                    <tr key={r.id} className="border-b border-ysa-mist/70 hover:bg-ysa-mist/40" data-testid={`admin-row-${r.id}`}>
                      <td className="px-5 py-3.5 font-semibold text-ysa-navy">{r.name}</td>
                      <td className="px-5 py-3.5 text-ysa-navy/70">
                        <div>{r.phone}</div>
                        {r.email && <div className="text-xs text-ysa-navy/40">{r.email}</div>}
                      </td>
                      <td className="px-5 py-3.5">
                        <Badge className={`${KIND_STYLE[r.kind]} border-0 font-semibold`}>{KIND_LABEL[r.kind]}</Badge>
                      </td>
                      <td className="px-5 py-3.5 text-ysa-navy/70">{r.grade || "—"}</td>
                      <td className="px-5 py-3.5 text-ysa-navy/60 max-w-[220px] truncate hidden lg:table-cell">{r.message || "—"}</td>
                      <td className="px-5 py-3.5">
                        <Select value={r.status} onValueChange={(s) => changeStatus(r.id, s)}>
                          <SelectTrigger className={`h-8 w-32 rounded-lg border-0 font-semibold ${STATUS_STYLE[r.status]}`} data-testid={`admin-status-${r.id}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="contacted">Contacted</SelectItem>
                            <SelectItem value="resolved">Resolved</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-5 py-3.5 text-ysa-navy/50 text-xs whitespace-nowrap">
                        {new Date(r.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                      </td>
                      <td className="px-5 py-3.5">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button className="text-ysa-navy/40 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50" data-testid={`admin-delete-${r.id}`} aria-label="Delete">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="rounded-2xl">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete this enquiry?</AlertDialogTitle>
                              <AlertDialogDescription>This permanently removes {r.name}'s enquiry. This cannot be undone.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => remove(r.id)} className="rounded-xl bg-red-500 hover:bg-red-600" data-testid={`admin-delete-confirm-${r.id}`}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
