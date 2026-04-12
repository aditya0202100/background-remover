import { AlertTriangle, Cookie, Scale, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";

const SECTIONS = [
  {
    icon: ShieldCheck,
    title: "Data Protection & Privacy",
    content:
      'ClearCut AI is built on a "Privacy-First" architecture. We do not store, view, or share your uploaded images. All background removal processing is performed in temporary, session-based memory and is permanently purged the moment you close your browser tab.',
  },
  {
    icon: Cookie,
    title: "Cookies & Third-Party Ads",
    content:
      "We use Google AdSense to serve ads. These third-party vendors use cookies to serve ads based on your prior visits to this or other websites. You may opt-out of personalized advertising by visiting Google Ads Settings.",
  },
  {
    icon: AlertTriangle,
    title: "Disclaimer of Liability",
    content:
      'This tool is provided "as-is" without any warranties. Aditya Computers is not liable for any technical inaccuracies, data loss, or how users choose to utilize the generated images. Users are responsible for ensuring they have the legal right to the images they upload.',
  },
  {
    icon: Scale,
    title: "Your Legal Rights",
    content:
      "As no personal data is collected or stored on our servers, there is no data to delete or port. However, for any inquiries regarding our technical processes or to report a bug, you can reach out via our contact channels.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-full">
      {/* ── Header ── */}
      <section className="bg-card/40 border-b border-border/60 py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 border border-primary/25 mb-6"
          >
            <ShieldCheck className="w-7 h-7 text-primary" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="font-display text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight"
          >
            Privacy Policy &amp; Terms
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.16 }}
            className="mt-3 text-sm font-semibold text-primary/80 tracking-wide uppercase"
          >
            Updated: April 2026
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.22 }}
            className="mt-4 text-muted-foreground font-body text-base leading-relaxed"
          >
            Your privacy is the foundation of ClearCut AI. Read how we handle
            your data — and why we collect almost none of it.
          </motion.p>
        </div>
      </section>

      {/* ── Sections ── */}
      <section className="py-16 bg-background">
        <div className="max-w-3xl mx-auto px-6 flex flex-col gap-6">
          {SECTIONS.map(({ icon: Icon, title, content }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="flex gap-5 p-6 rounded-2xl border border-border/60 bg-card/60 hover:border-primary/25 transition-smooth"
              data-ocid={`privacy-section-${i + 1}`}
            >
              <div className="shrink-0 w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mt-0.5">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-display font-bold text-foreground text-lg mb-2">
                  {title}
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed font-body">
                  {content}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Footer note ── */}
      <section className="bg-card/30 border-t border-border/60 py-10">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-sm text-muted-foreground font-body">
            © 2026 ClearCut AI &nbsp;|&nbsp; Powered by Aditya Computers
          </p>
        </div>
      </section>
    </div>
  );
}
