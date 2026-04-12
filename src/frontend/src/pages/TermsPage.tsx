import { FileText } from "lucide-react";
import { motion } from "motion/react";

const TERMS_SECTIONS = [
  {
    num: "01",
    title: "Agreement to Terms",
    content:
      "By accessing ClearCut AI, provided by Aditya Computers, you agree to be bound by these terms. If you do not agree, please discontinue use of the service immediately.",
  },
  {
    num: "02",
    title: "Intellectual Property",
    content:
      "You retain all rights to the images you upload. ClearCut AI does not claim ownership of your content. However, the website's code, design, and branding are the exclusive property of Aditya Computers.",
  },
  {
    num: "03",
    title: "User Responsibility",
    content:
      "Users are strictly prohibited from uploading images that violate copyrights, contain illegal content, or infringe on the privacy of others. You are solely responsible for the legality of the assets you process.",
  },
  {
    num: "04",
    title: "Limitation of Liability",
    content:
      "In no event shall Aditya Computers or its affiliates be liable for any damages (including data loss or profit loss) arising out of the use or inability to use the services on this website, even if notified of such possibility.",
  },
  {
    num: "05",
    title: "No Warranties",
    content:
      'The service is provided "as-is." We do not guarantee that the AI will be 100% accurate or that the service will be uninterrupted. We reserve the right to modify or discontinue the tool at any time without notice.',
  },
  {
    num: "06",
    title: "Governing Law",
    content:
      "Any claim related to ClearCut AI shall be governed by the laws of your jurisdiction without regard to its conflict of law provisions.",
  },
];

export default function TermsPage() {
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
            <FileText className="w-7 h-7 text-primary" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="font-display text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight"
          >
            Terms of Service
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.16 }}
            className="mt-3 text-sm font-semibold text-primary/80 tracking-wide uppercase"
          >
            Effective Date: April 2026
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.22 }}
            className="mt-4 text-muted-foreground font-body text-base leading-relaxed"
          >
            By using ClearCut AI, you agree to the following terms. Please read
            them carefully before proceeding.
          </motion.p>
        </div>
      </section>

      {/* ── Terms list ── */}
      <section className="py-16 bg-background">
        <div className="max-w-3xl mx-auto px-6 flex flex-col gap-5">
          {TERMS_SECTIONS.map(({ num, title, content }, i) => (
            <motion.div
              key={num}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className="flex gap-5 p-6 rounded-2xl border border-border/60 bg-card/60 hover:border-primary/25 transition-smooth"
              data-ocid={`terms-section-${num}`}
            >
              {/* Section number */}
              <div className="shrink-0">
                <span className="font-mono text-2xl font-extrabold text-primary/30 leading-none tracking-widest">
                  {num}
                </span>
              </div>
              <div className="min-w-0">
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

      {/* ── Footer line ── */}
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
