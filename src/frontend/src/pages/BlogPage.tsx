import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Calendar,
  Clock,
  Crown,
  ExternalLink,
  Mail,
  Sparkles,
  Tag,
} from "lucide-react";
import { motion } from "motion/react";
import React from "react";

function AuthorCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      className="gradient-accent-card relative overflow-hidden rounded-3xl shadow-lg p-8 md:p-10"
      data-ocid="blog.author_card"
    >
      {/* Decorative floating circles */}
      <span className="pointer-events-none absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/5" />
      <span className="pointer-events-none absolute top-4 right-32 w-24 h-24 rounded-full bg-white/5" />
      <span className="pointer-events-none absolute -bottom-8 -left-8 w-40 h-40 rounded-full bg-white/5" />
      <span className="pointer-events-none absolute bottom-6 left-40 w-16 h-16 rounded-full bg-white/5" />

      <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-6">
        {/* Avatar with glow ring */}
        <div className="relative shrink-0">
          <div
            className="absolute inset-0 rounded-full blur-xl opacity-60"
            style={{
              background: "oklch(0.94 0.006 265 / 0.35)",
              transform: "scale(1.3)",
            }}
          />
          <div
            className="relative flex items-center justify-center w-24 h-24 rounded-full border-4 border-white/30 text-white font-extrabold text-3xl select-none"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.36 0.22 295) 0%, oklch(0.58 0.17 162) 100%)",
            }}
          >
            ASR
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col items-center sm:items-start gap-3 min-w-0">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight">
            ADITYA SINGH RAJPUT
          </h2>

          <span className="inline-flex items-center px-4 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-bold tracking-widest uppercase border border-white/30">
            WEB DEVELOPER
          </span>

          <p className="text-white/80 text-sm md:text-base font-medium">
            Building blazing-fast web tools — one pixel at a time.
          </p>

          <a
            href="mailto:mkaditya36@gmail.com"
            className="inline-flex items-center gap-2 text-white/90 hover:text-white text-sm font-medium underline-offset-4 hover:underline transition-smooth"
            data-ocid="blog.author_email_link"
          >
            <Mail size={15} />
            mkaditya36@gmail.com
          </a>
        </div>
      </div>
    </motion.div>
  );
}

interface PostCardProps {
  id: string;
  version: string;
  badgeLabel: string;
  badgeColor: string;
  date: string;
  readTime: string;
  title: string;
  sections: { icon: React.ReactNode; heading: string; body: string }[];
  tags: string[];
  animDelay?: number;
  ocid: string;
}

function PostCard({
  id,
  version,
  badgeLabel,
  badgeColor,
  date,
  readTime,
  title,
  sections,
  tags,
  animDelay = 0,
  ocid,
}: PostCardProps) {
  return (
    <motion.article
      id={id}
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: animDelay, ease: [0.4, 0, 0.2, 1] }}
      className="bg-card border border-border rounded-2xl shadow-card overflow-hidden"
      data-ocid={ocid}
    >
      {/* Post header bar */}
      <div className="border-b border-border px-6 md:px-8 py-5 flex flex-wrap items-center gap-3">
        <Badge
          className="text-xs font-bold tracking-widest px-3 py-1 rounded-full border-0"
          style={{
            background: `${badgeColor}26`,
            color: badgeColor,
          }}
        >
          {badgeLabel}
        </Badge>
        <span
          className="text-xs font-bold tracking-widest px-2 py-0.5 rounded-full"
          style={{
            background: "oklch(0.63 0.27 304 / 0.12)",
            color: "oklch(0.75 0.2 304)",
          }}
        >
          {version}
        </span>
        <div className="flex items-center gap-4 ml-auto text-muted-foreground text-xs">
          <span className="flex items-center gap-1.5">
            <Calendar size={13} />
            {date}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={13} />
            {readTime}
          </span>
        </div>
      </div>

      <div className="px-6 md:px-8 py-7 space-y-8">
        {/* Title */}
        <h2 className="text-xl md:text-2xl font-extrabold text-foreground leading-snug">
          {title}
        </h2>

        {sections.map((section, i) => (
          <React.Fragment key={section.heading}>
            {i > 0 && <hr className="border-border" />}
            <section className="space-y-3">
              <h3 className="text-base font-bold text-primary flex items-center gap-2">
                {section.icon}
                {section.heading}
              </h3>
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                {section.body}
              </p>
            </section>
          </React.Fragment>
        ))}
      </div>

      {/* Post footer */}
      <div className="border-t border-border px-6 md:px-8 py-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-muted-foreground text-xs font-medium">
          By{" "}
          <span className="text-foreground font-semibold">
            Aditya Singh Rajput
          </span>
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <Tag size={12} className="text-muted-foreground" />
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="text-xs px-2 py-0.5 rounded-md"
              data-ocid={`blog.post_tag.${tag.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </motion.article>
  );
}

function ShoutoutsSection() {
  return (
    <section
      className="pt-12 mt-4 border-t border-border/40"
      data-ocid="shoutouts.section"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h2 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          Shoutouts &amp; Special Thanks
        </h2>
        <p className="text-muted-foreground mt-1.5 text-sm font-body">
          Celebrating the people behind our best ideas
        </p>
      </motion.div>

      <div className="flex justify-center w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="shoutout-card max-w-md w-full"
          data-ocid="shoutouts.ruchi_card"
        >
          <div className="shoutout-card-inner">
            {/* Holographic overlay */}
            <div className="shoutout-holographic absolute inset-0 z-0" />

            {/* Sparkle dots */}
            <span
              className="shoutout-sparkle w-1.5 h-1.5"
              style={
                {
                  top: "18%",
                  left: "8%",
                  "--dur": "2.2s",
                  "--delay": "0s",
                } as React.CSSProperties
              }
            />
            <span
              className="shoutout-sparkle w-1 h-1"
              style={
                {
                  top: "12%",
                  right: "15%",
                  "--dur": "3s",
                  "--delay": "0.4s",
                } as React.CSSProperties
              }
            />
            <span
              className="shoutout-sparkle w-2 h-2"
              style={
                {
                  bottom: "20%",
                  right: "8%",
                  "--dur": "2.8s",
                  "--delay": "0.8s",
                } as React.CSSProperties
              }
            />
            <span
              className="shoutout-sparkle w-1 h-1"
              style={
                {
                  bottom: "30%",
                  left: "12%",
                  "--dur": "2s",
                  "--delay": "1.2s",
                } as React.CSSProperties
              }
            />
            <span
              className="shoutout-sparkle w-1.5 h-1.5"
              style={
                {
                  top: "55%",
                  left: "5%",
                  "--dur": "3.5s",
                  "--delay": "0.6s",
                } as React.CSSProperties
              }
            />

            <div className="relative z-10 p-6">
              {/* Top badge */}
              <div className="flex items-start justify-between mb-5">
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase"
                  style={{
                    background: "oklch(0.82 0.18 75 / 0.15)",
                    color: "oklch(0.82 0.18 75)",
                    border: "1px solid oklch(0.82 0.18 75 / 0.35)",
                  }}
                >
                  <Crown className="w-3 h-3" />
                  Founding Idea
                </span>
                <span className="text-amber-400 text-lg select-none">✦</span>
              </div>

              {/* Name */}
              <div className="mb-1">
                <h3
                  className="font-display text-3xl font-extrabold tracking-tight leading-tight"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.82 0.18 75) 0%, oklch(0.94 0.1 75) 50%, oklch(0.72 0.17 162) 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  👑 RUCHI
                </h3>
              </div>

              {/* Title badge */}
              <span
                className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold mb-4"
                style={{
                  background: "oklch(0.63 0.27 304 / 0.15)",
                  color: "oklch(0.75 0.2 304)",
                  border: "1px solid oklch(0.63 0.27 304 / 0.3)",
                }}
              >
                NEET Aspirant
              </span>

              {/* Divider */}
              <div
                className="h-px mb-4"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, oklch(0.82 0.18 75 / 0.5), transparent)",
                }}
              />

              {/* Shoutout text */}
              <p
                className="text-sm font-body leading-relaxed mb-5"
                style={{ color: "oklch(0.85 0.01 265)" }}
              >
                ✨ She suggested the idea of AI background generation — the
                standout feature of{" "}
                <span
                  className="font-semibold"
                  style={{ color: "oklch(0.82 0.18 75)" }}
                >
                  v1.2
                </span>
                , bringing creative freedom directly into your browser.
              </p>

              {/* View in Blog link */}
              <a
                href="#v1-2"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-smooth"
                style={{
                  background: "oklch(0.82 0.18 75 / 0.12)",
                  color: "oklch(0.82 0.18 75)",
                  border: "1px solid oklch(0.82 0.18 75 / 0.3)",
                }}
                data-ocid="shoutouts.ruchi_blog_link"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                View v1.2 Post Above ↑
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

const BLOG_POSTS: PostCardProps[] = [
  {
    id: "v1-2",
    version: "v1.2",
    badgeLabel: "LATEST RELEASE",
    badgeColor: "oklch(0.72 0.17 162)",
    date: "May 2, 2026",
    readTime: "3 min read",
    title: "ClearCut AI v1.2 — Background Editor & More",
    sections: [
      {
        icon: <BookOpen size={16} />,
        heading: "What We Built Before v1.2",
        body: "When ClearCut AI launched, it shipped with a powerful set of features for creators: a one-click background removal engine powered by on-device AI (no data ever leaves your browser), support for uploading JPG, PNG, and WebP images, a crisp before/after comparison preview, and multi-format downloads in PNG, JPG, and WebP. We also included full legal pages (Terms of Service, Privacy Policy) and an About page — making ClearCut AI a complete, trustworthy product from day one.",
      },
      {
        icon: (
          <span
            className="inline-block w-4 h-4 rounded-full"
            style={{ background: "oklch(0.72 0.17 162)" }}
          />
        ),
        heading: "What's New in v1.2 — The Background Editor",
        body: "v1.2 brings the most-requested feature: a full Background Editor that appears immediately after your background is removed. Choose from 12 professional preset colors (whites, grays, blues, greens, and more), dial in any shade with the custom color picker, pick one of 8 curated background photos (forests, mountains, cities, sunsets), upload your own image as a background, or describe any scene and let our built-in AI generator (powered by Pollinations.ai — free, no account needed) create it for you. Every option updates your preview instantly, and your downloads always include the background of your choice.",
      },
    ],
    tags: ["v1.2", "Background Editor", "AI", "New Feature"],
    animDelay: 0.1,
    ocid: "blog.post_card.1",
  },
  {
    id: "v1-1",
    version: "v1.1",
    badgeLabel: "UI REFRESH",
    badgeColor: "oklch(0.63 0.27 304)",
    date: "February 2026",
    readTime: "2 min read",
    title: "ClearCut AI v1.1 — New Look & More Downloads",
    sections: [
      {
        icon: <BookOpen size={16} />,
        heading: "What Was There in v1.0",
        body: "Our initial launch shipped with fully on-device AI background removal, a before/after preview, single-format PNG download, and a reset button. It worked — but the interface was raw and we knew creators deserved better.",
      },
      {
        icon: (
          <span
            className="inline-block w-4 h-4 rounded-full"
            style={{ background: "oklch(0.63 0.27 304)" }}
          />
        ),
        heading: "What's New in v1.1 — Visual Overhaul",
        body: "v1.1 is a complete visual overhaul built to match the Clearcut brand. The upload interface was simplified to a clean single button replacing the old drag-and-drop zone. A rich dark theme was applied across every page. Multi-format download arrived — users can now save their cutout as PNG, JPG, or WebP with always-visible format buttons. We also added three essential pages: Terms of Service, Privacy Policy, and an About page — rounding out ClearCut AI as a fully professional product.",
      },
    ],
    tags: ["v1.1", "UI Refresh", "Multi-format Download", "Dark Theme"],
    animDelay: 0.2,
    ocid: "blog.post_card.2",
  },
  {
    id: "v1-0",
    version: "v1.0",
    badgeLabel: "INITIAL LAUNCH",
    badgeColor: "oklch(0.7 0.15 50)",
    date: "January 2026",
    readTime: "2 min read",
    title: "ClearCut AI v1.0 — We're Live!",
    sections: [
      {
        icon: <BookOpen size={16} />,
        heading: "The Origin Story",
        body: "ClearCut AI started with a simple frustration: background removal tools either cost money, require a login, or send your images to a server you don't control. We set out to build something different — a tool that does everything in your browser, for free, with zero accounts required.",
      },
      {
        icon: (
          <span
            className="inline-block w-4 h-4 rounded-full"
            style={{ background: "oklch(0.7 0.15 50)" }}
          />
        ),
        heading: "What Launched in v1.0",
        body: "The first version of ClearCut AI shipped with drag-and-drop image upload (JPG, PNG, WebP), fully on-device ML background removal powered by @imgly/background-removal — no data ever leaves your browser, a side-by-side before/after preview so you can see the result immediately, single-click PNG download, and a reset button to start fresh. It was lean, fast, and private by design.",
      },
    ],
    tags: ["v1.0", "Launch", "Background Removal", "On-Device AI"],
    animDelay: 0.3,
    ocid: "blog.post_card.3",
  },
];

export default function BlogPage() {
  return (
    <main
      className="min-h-screen bg-background px-4 py-12 md:py-16"
      data-ocid="blog.page"
    >
      <div className="mx-auto max-w-3xl space-y-10">
        {/* Page heading */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-2"
        >
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
            ClearCut Updates
          </h1>
          <p className="text-muted-foreground text-base md:text-lg">
            The latest features, improvements, and news from ClearCut AI.
          </p>
        </motion.div>

        <AuthorCard />

        {/* Blog posts in reverse chronological order */}
        {BLOG_POSTS.map((post) => (
          <PostCard key={post.id} {...post} />
        ))}

        {/* Shoutouts section after all posts */}
        <ShoutoutsSection />
      </div>
    </main>
  );
}
