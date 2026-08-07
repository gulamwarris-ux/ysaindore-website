import React, { useState } from "react";
import { Phone, MessageCircle, MapPin, Mail, Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Reveal } from "./Reveal";
import { CONTACT } from "../../data/content";
import { submitEnquiry } from "../../lib/api";

export const Contact = () => {
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) return toast.error("Please add your name and phone.");
    setLoading(true);
    try {
      await submitEnquiry({ ...form, email: form.email || null, message: form.message || null, kind: "contact" });
      toast.success("Message sent! We'll be in touch soon.");
      setForm({ name: "", phone: "", email: "", message: "" });
    } catch { toast.error("Something went wrong. Please try again."); }
    finally { setLoading(false); }
  };

  return (
    <section id="contact" className="py-24 md:py-32 bg-white" data-testid="contact-section">
      <div className="max-w-7xl mx-auto px-5 md:px-8 grid lg:grid-cols-2 gap-10">
        <Reveal>
          <span className="text-xs font-bold tracking-[0.22em] text-ysa-green uppercase">Get in Touch</span>
          <h2 className="mt-3 text-3xl md:text-5xl font-extrabold text-ysa-navy tracking-tight">Visit us or drop a message.</h2>
          <p className="mt-4 text-ysa-navy/60 text-lg">We'd love to meet your family and show you how we learn.</p>

          <div className="mt-8 space-y-3">
            <a href={`tel:${CONTACT.phoneIntl}`} data-testid="contact-call" className="flex items-center gap-4 p-4 rounded-2xl bg-ysa-mist hover:bg-ysa-blue hover:text-white group transition-colors">
              <span className="h-11 w-11 rounded-xl bg-white group-hover:bg-white/15 flex items-center justify-center"><Phone className="h-5 w-5 text-ysa-blue group-hover:text-ysa-yellow" /></span>
              <div><div className="text-xs opacity-60">Call us</div><div className="font-bold">{CONTACT.phone}</div></div>
            </a>
            <a href={`https://wa.me/${CONTACT.whatsapp}`} target="_blank" rel="noreferrer" data-testid="contact-whatsapp" className="flex items-center gap-4 p-4 rounded-2xl bg-ysa-mist hover:bg-ysa-green hover:text-white group transition-colors">
              <span className="h-11 w-11 rounded-xl bg-white group-hover:bg-white/15 flex items-center justify-center"><MessageCircle className="h-5 w-5 text-ysa-green group-hover:text-white" /></span>
              <div><div className="text-xs opacity-60">WhatsApp</div><div className="font-bold">Chat with us</div></div>
            </a>
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-ysa-mist">
              <span className="h-11 w-11 rounded-xl bg-white flex items-center justify-center"><MapPin className="h-5 w-5 text-ysa-blue" /></span>
              <div><div className="text-xs opacity-60">Location</div><div className="font-bold text-ysa-navy">Indore, Madhya Pradesh</div></div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl overflow-hidden border border-ysa-mist h-56">
            <iframe title="Young Scientist Academy location" src={CONTACT.mapEmbed} width="100%" height="100%" style={{ border: 0 }} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <form onSubmit={submit} className="bg-ysa-mist/60 border border-ysa-mist rounded-2xl p-7 md:p-8 space-y-4" data-testid="contact-form">
            <div className="grid gap-2"><Label htmlFor="c-name">Name *</Label><Input id="c-name" data-testid="contact-name" value={form.name} onChange={set("name")} className="rounded-xl bg-white" placeholder="Your name" /></div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="grid gap-2"><Label htmlFor="c-phone">Phone *</Label><Input id="c-phone" data-testid="contact-phone" value={form.phone} onChange={set("phone")} className="rounded-xl bg-white" placeholder="Mobile number" /></div>
              <div className="grid gap-2"><Label htmlFor="c-email">Email</Label><Input id="c-email" type="email" data-testid="contact-email" value={form.email} onChange={set("email")} className="rounded-xl bg-white" placeholder="you@example.com" /></div>
            </div>
            <div className="grid gap-2"><Label htmlFor="c-msg">Message</Label><Textarea id="c-msg" data-testid="contact-message" value={form.message} onChange={set("message")} className="rounded-xl bg-white min-h-[120px]" placeholder="How can we help?" /></div>
            <button type="submit" disabled={loading} data-testid="contact-submit" className="w-full inline-flex items-center justify-center gap-2 bg-ysa-blue hover:bg-ysa-navy text-white font-semibold h-12 rounded-xl transition-all">
              {loading ? <Loader2 className="animate-spin" /> : <>Send Message <Send className="h-4 w-4" /></>}
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  );
};
