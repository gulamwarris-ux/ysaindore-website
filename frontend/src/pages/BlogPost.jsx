import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, CalendarCheck } from "lucide-react";
import { fetchPost } from "../lib/api";
import { useEnquiry } from "../components/site/enquiry";

export default function BlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { openEnquiry } = useEnquiry();
  const [post, setPost] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchPost(slug).then(setPost).catch(() => setError(true));
  }, [slug]);

  if (error) return (
    <main className="pt-40 pb-24 text-center min-h-screen">
      <h1 className="text-3xl font-bold text-ysa-navy">Article not found</h1>
      <Link to="/blog" className="mt-4 inline-block text-ysa-blue font-semibold">← Back to Blog</Link>
    </main>
  );

  if (!post) return <main className="pt-40 min-h-screen"><div className="max-w-3xl mx-auto px-5 h-96 rounded-2xl bg-ysa-mist animate-pulse" /></main>;

  return (
    <main className="pt-28 pb-24 min-h-screen bg-white" data-testid="blog-post-page">
      <article className="max-w-3xl mx-auto px-5 md:px-8">
        <button onClick={() => navigate("/blog")} className="inline-flex items-center gap-1.5 text-sm font-semibold text-ysa-blue mb-8" data-testid="back-to-blog">
          <ArrowLeft className="h-4 w-4" /> All Articles
        </button>
        <div className="flex items-center gap-3 text-xs">
          <span className="font-bold text-ysa-green uppercase tracking-wide">{post.category}</span>
          <span className="flex items-center gap-1 text-ysa-navy/40"><Clock className="h-3 w-3" /> {post.read_minutes} min read</span>
        </div>
        <h1 className="mt-4 text-3xl md:text-5xl font-extrabold text-ysa-navy tracking-tight leading-[1.1]">{post.title}</h1>
        <div className="mt-4 text-ysa-navy/50 text-sm">By {post.author} · {post.published_at}</div>
        <div className="mt-8 rounded-2xl overflow-hidden aspect-[16/9]">
          <img src={post.cover} alt={post.title} className="w-full h-full object-cover" />
        </div>
        <div className="mt-8 prose-lg space-y-5 text-ysa-navy/80 text-lg leading-relaxed">
          {post.body.split("\n\n").map((para, i) => <p key={i}>{para}</p>)}
        </div>

        <div className="mt-12 rounded-2xl bg-ysa-mist p-8 text-center">
          <h3 className="text-xl font-bold text-ysa-navy">Want to see this in a real classroom?</h3>
          <button onClick={() => openEnquiry("demo")} data-testid="post-book-demo"
            className="mt-4 inline-flex items-center gap-2 bg-ysa-blue hover:bg-ysa-navy text-white font-semibold px-6 py-3.5 rounded-xl transition-all hover:-translate-y-1">
            <CalendarCheck className="h-5 w-5" /> Book a Free Demo
          </button>
        </div>
      </article>
    </main>
  );
}
