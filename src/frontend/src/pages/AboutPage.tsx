import { Diamond, Lock, Rocket, Scissors, Shield, Zap } from "lucide-react";
import { motion } from "motion/react";

const FEATURE_HIGHLIGHTS = [
  {
    emoji: "⚡",
    icon: Zap,
    title: "Instant AI",
    desc: "Subject detection in seconds.",
  },
  {
    emoji: "🛡️",
    icon: Shield,
    title: "No Data Logs",
    desc: "Your images are never stored.",
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Upload",
    desc: "Select your JPG, PNG, or WebP image. Our AI starts analyzing the subject immediately.",
  },
  {
    step: "02",
    title: "Auto-Remove",
    desc: "The background is wiped away with pixel-perfect precision using pro-grade edge detection.",
  },
  {
    step: "03",
    title: "Download",
    desc: "Choose your format—PNG, JPG, or WebP—and save your high-res file instantly.",
  },
];

const FEATURE_GRID = [
  {
    emoji: "💎",
    icon: Diamond,
    title: "High-Resolution Exports",
    desc: "Unlike other tools, we don't blur your results. Get crisp, clean edges for your professional thumbnails.",
  },
  {
    emoji: "🚀",
    icon: Rocket,
    title: "No Daily Limits",
    desc: "Remove as many backgrounds as you need. ClearCut AI is built to keep up with a creator's workload.",
  },
  {
    emoji: "🔒",
    icon: Lock,
    title: "No Account Needed",
    desc: "Skip the login screens. We value your time and privacy, which is why we require zero sign-ups.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-full">
      {/* ── Hero ── */}
      <section className="bg-card/40 border-b border-border/60 py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 border border-primary/25 mb-6"
          >
            <Scissors className="w-7 h-7 text-primary" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="font-display text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight"
          >
            About <span className="text-primary">ClearCut AI</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.16 }}
            className="mt-5 text-muted-foreground text-base sm:text-lg font-body leading-relaxed max-w-2xl mx-auto"
          >
            ClearCut AI was developed by{" "}
            <span className="text-foreground font-semibold">
              Aditya Computers
            </span>{" "}
            to empower creators. As a professional thumbnail designer with 3
            years of experience, I know that speed and quality are
            non-negotiable. We offer this tool for free with no sign-ups
            required to keep your workflow uninterrupted.
          </motion.p>

          {/* Feature highlights */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.24 }}
            className="mt-8 flex flex-wrap justify-center gap-4"
          >
            {FEATURE_HIGHLIGHTS.map(({ emoji, title, desc }) => (
              <div
                key={title}
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-border/60 bg-background/60 backdrop-blur-sm"
                data-ocid={`highlight-${title.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <span className="text-lg leading-none">{emoji}</span>
                <div className="text-left">
                  <p className="text-sm font-semibold text-foreground">
                    {title}
                  </p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl font-bold text-foreground">
              Get Perfect Cutouts in 3 Steps
            </h2>
            <p className="text-muted-foreground mt-2 font-body">
              No account, no uploads to any server — pure on-device AI.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {HOW_IT_WORKS.map(({ step, title, desc }, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="flex flex-col gap-4 p-6 rounded-2xl border border-border/60 bg-card/60"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-2xl font-extrabold text-primary/40 tracking-widest leading-none">
                    {step}
                  </span>
                </div>
                <div>
                  <h3 className="font-display font-semibold text-foreground text-lg">
                    {title}
                  </h3>
                  <p className="text-muted-foreground text-sm mt-1.5 leading-relaxed font-body">
                    {desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Feature grid ── */}
      <section className="py-20 bg-card/30 border-t border-border/60">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl font-bold text-foreground">
              Why ClearCut AI?
            </h2>
            <p className="text-muted-foreground mt-2 font-body">
              Built for creators who demand results, not red tape.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {FEATURE_GRID.map(({ emoji, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="flex flex-col gap-3 p-6 rounded-2xl border border-border/60 bg-background/80 hover:border-primary/30 transition-smooth"
                data-ocid={`feature-${title.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <span className="text-3xl leading-none">{emoji}</span>
                <h3 className="font-display font-semibold text-foreground text-base">
                  {title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed font-body">
                  {desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
