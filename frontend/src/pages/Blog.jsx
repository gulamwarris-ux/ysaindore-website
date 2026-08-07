import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Clock } from "lucide-react";
import { fetchBlog } from "../lib/api";
import { Reveal } from "../components/site/Reveal";

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchBlog().then((d) => setPosts(d)).finally(() => setLoading(false));
  }, []);

  return (
    <main className="pt-28 pb-24 min-h-screen bg-ysa-mist" data-testid="blog-page">
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        <Reveal className="max-w-2xl mb-12">
          <span className="text-xs font-bold tracking-[0.22em] text-ysa-green uppercase">The YSA Journal</span>
          <h1 className="mt-3 text-4xl md:text-6xl font-extrabold text-ysa-navy tracking-tight">Ideas for curious families.</h1>
          <p className="mt-4 text-ysa-navy/60 text-lg">Learning science, board guidance and hands-on activities from our mentors.</p>
        </Reveal>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => <div key={i} className="h-80 rounded-2xl bg-white/60 animate-pulse" />)}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 3) * 0.08}>
                <Link to={`/blog/${p.slug}`} data-testid={`blog-card-${i}`}
                  className="group block h-full bg-white rounded-2xl overflow-hidden border border-white shadow-soft hover:shadow-lift hover:-translate-y-1 transition-all">
                  <div className="aspect-[16/10] overflow-hidden">
                    <img src={p.cover} alt={p.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 text-xs">
                      <span className="font-bold text-ysa-green uppercase tracking-wide">{p.category}</span>
                      <span className="flex items-center gap-1 text-ysa-navy/40"><Clock className="h-3 w-3" /> {p.read_minutes} min</span>
                    </div>
                    <h3 className="mt-3 text-lg font-bold text-ysa-navy leading-snug group-hover:text-ysa-blue transition-colors">{p.title}</h3>
                    <p className="mt-2 text-sm text-ysa-navy/60 line-clamp-3">{p.excerpt}</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-ysa-blue">Read article <ArrowUpRight className="h-4 w-4" /></span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
