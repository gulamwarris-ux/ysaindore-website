import React, { createContext, useContext, useState, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { toast } from "sonner";
import { Loader2, Send } from "lucide-react";
import { submitEnquiry } from "../../lib/api";

const EnquiryContext = createContext(null);
export const useEnquiry = () => useContext(EnquiryContext);

const TITLES = {
  demo: { title: "Book a Free Demo Class", desc: "Experience concept-based learning first-hand. We'll call you to schedule." },
  contact: { title: "Send Us a Message", desc: "Have a question? We'd love to help your child thrive." },
  assessment: { title: "Board Selection Assessment", desc: "Tell us about your child and we'll guide you to the right board." },
  admission: { title: "Admission Enquiry", desc: "Start the journey — we'll reach out with the details." },
};

const GRADES = ["Grade 3", "Grade 4", "Grade 5", "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10"];

export const EnquiryProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [kind, setKind] = useState("demo");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", grade: "", message: "" });

  const openEnquiry = useCallback((k = "demo") => {
    setKind(k);
    setOpen(true);
  }, []);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e?.target ? e.target.value : e }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      toast.error("Please enter your name and phone number.");
      return;
    }
    setLoading(true);
    try {
      await submitEnquiry({
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim() || null,
        grade: form.grade || null,
        message: form.message.trim() || null,
        kind,
      });
      toast.success("Thank you! Our team will contact you shortly.");
      setOpen(false);
      setForm({ name: "", phone: "", email: "", grade: "", message: "" });
    } catch (err) {
      toast.error("Something went wrong. Please try again or call us.");
    } finally {
      setLoading(false);
    }
  };

  const meta = TITLES[kind] || TITLES.demo;

  return (
    <EnquiryContext.Provider value={{ openEnquiry }}>
      {children}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[480px] rounded-2xl" data-testid="enquiry-dialog">
          <DialogHeader>
            <DialogTitle className="text-2xl text-ysa-navy">{meta.title}</DialogTitle>
            <DialogDescription className="text-ysa-blue/70">{meta.desc}</DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} className="space-y-4 pt-2">
            <div className="grid gap-2">
              <Label htmlFor="eq-name">Parent / Student Name *</Label>
              <Input id="eq-name" data-testid="enquiry-name" value={form.name} onChange={set("name")} placeholder="Your full name" className="rounded-xl" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="eq-phone">Phone *</Label>
                <Input id="eq-phone" data-testid="enquiry-phone" value={form.phone} onChange={set("phone")} placeholder="Mobile number" className="rounded-xl" />
              </div>
              <div className="grid gap-2">
                <Label>Grade</Label>
                <Select value={form.grade} onValueChange={set("grade")}>
                  <SelectTrigger data-testid="enquiry-grade" className="rounded-xl"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {GRADES.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="eq-email">Email</Label>
              <Input id="eq-email" data-testid="enquiry-email" type="email" value={form.email} onChange={set("email")} placeholder="you@example.com" className="rounded-xl" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="eq-msg">Message</Label>
              <Textarea id="eq-msg" data-testid="enquiry-message" value={form.message} onChange={set("message")} placeholder="Anything you'd like us to know" className="rounded-xl min-h-[80px]" />
            </div>
            <Button type="submit" disabled={loading} data-testid="enquiry-submit"
              className="w-full rounded-xl bg-ysa-blue hover:bg-ysa-navy text-white h-12 text-base font-semibold transition-all">
              {loading ? <Loader2 className="animate-spin" /> : <>Submit <Send className="ml-1 h-4 w-4" /></>}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </EnquiryContext.Provider>
  );
};
