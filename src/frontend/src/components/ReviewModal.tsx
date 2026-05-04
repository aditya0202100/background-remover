import { createActor } from "@/backend";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useActor } from "@caffeineai/core-infrastructure";
import { Star, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

interface ReviewModalProps {
  onClose: () => void;
}

export default function ReviewModal({ onClose }: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { actor } = useActor(createActor);

  const handleSubmit = async () => {
    if (rating === 0 || !name.trim()) return;
    setIsSubmitting(true);
    try {
      if (actor) {
        await actor.submitReview(name.trim(), BigInt(rating), comment.trim());
      }
      toast.success("Thanks for your review! \u2B50");
      onClose();
    } catch {
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayRating = hovered > 0 ? hovered : rating;

  return (
    <AnimatePresence>
      <motion.div
        key="review-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: "rgba(0,0,0,0.7)" }}
        data-ocid="review.dialog"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          key="review-card"
          initial={{ opacity: 0, scale: 0.92, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 8 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative w-full max-w-md rounded-2xl bg-card border border-border/60 shadow-card p-8 flex flex-col gap-6"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            type="button"
            data-ocid="review.close-button"
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors duration-200"
            aria-label="Close review modal"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Heading */}
          <div className="text-center">
            <h2 className="font-display font-bold text-foreground text-xl tracking-tight">
              How did we do?
            </h2>
            <p className="text-muted-foreground text-sm mt-1.5 font-body">
              Your feedback helps us improve ClearCut AI.
            </p>
          </div>

          {/* Name field */}
          <div className="flex flex-col gap-1.5">
            <label
              className="text-sm font-medium text-foreground"
              htmlFor="review-modal-name"
            >
              Your Name <span className="text-destructive">*</span>
            </label>
            <input
              id="review-modal-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
              className="h-9 w-full rounded-md border border-input bg-background/60 px-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 transition-colors duration-200"
              data-ocid="review.name_input"
            />
          </div>

          {/* Stars */}
          <fieldset
            className="flex items-center justify-center gap-2 border-none p-0 m-0"
            aria-label="Rate from 1 to 5 stars"
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                data-ocid={`review.star.${star}`}
                aria-label={`${star} star${star > 1 ? "s" : ""}`}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHovered(star)}
                onMouseLeave={() => setHovered(0)}
                className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
              >
                <Star
                  className={[
                    "w-9 h-9 transition-all duration-150",
                    star <= displayRating
                      ? "fill-yellow-400 text-yellow-400 scale-110"
                      : "text-muted-foreground/40 hover:text-yellow-300",
                  ].join(" ")}
                />
              </button>
            ))}
          </fieldset>

          {rating > 0 && (
            <p className="text-xs text-center text-muted-foreground font-body -mt-2">
              {rating === 1 && "Poor"}
              {rating === 2 && "Fair"}
              {rating === 3 && "Good"}
              {rating === 4 && "Very good"}
              {rating === 5 && "Excellent! \u2728"}
            </p>
          )}

          {/* Comment */}
          <div className="flex flex-col gap-1.5">
            <Textarea
              value={comment}
              data-ocid="review.textarea"
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us about your experience\u2026"
              rows={3}
              className="resize-none font-body text-sm"
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2">
            <Button
              type="button"
              data-ocid="review.submit-button"
              onClick={handleSubmit}
              disabled={rating === 0 || !name.trim() || isSubmitting}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-display font-semibold transition-smooth shadow-glow-primary"
            >
              {isSubmitting ? "Submitting\u2026" : "Submit Review"}
            </Button>
            <button
              type="button"
              data-ocid="review.cancel-button"
              onClick={onClose}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 text-center py-1"
            >
              Maybe Later
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
