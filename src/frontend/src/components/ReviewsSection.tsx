import { createActor } from "@/backend";
import type { Analytics, Review } from "@/backend";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ChevronDown,
  MessageSquare,
  Star,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

const STAR_INDICES = [1, 2, 3, 4, 5] as const;
const SKELETON_BARS = ["5", "4", "3", "2", "1"] as const;
const SKELETON_ROWS = ["a", "b", "c", "d"] as const;

function relativeTime(timestampNs: bigint): string {
  const ms = Number(timestampNs) / 1_000_000;
  const diff = Date.now() - ms;
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months === 1 ? "" : "s"} ago`;
  return `${Math.floor(months / 12)} year${Math.floor(months / 12) === 1 ? "" : "s"} ago`;
}

function StarRow({ rating, filled }: { rating: number; filled: boolean }) {
  return (
    <div className="flex items-center gap-0.5">
      {STAR_INDICES.map((star) => (
        <Star
          key={`star-${star}`}
          className={`w-4 h-4 ${
            star <= rating
              ? filled
                ? "fill-amber-400 text-amber-400"
                : "fill-amber-400/40 text-amber-400/40"
              : "fill-muted text-muted-foreground/30"
          }`}
        />
      ))}
    </div>
  );
}

function ReviewSkeleton() {
  return (
    <div className="flex flex-col gap-3 p-4 rounded-xl border border-border/50 bg-card/60">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-16" />
      </div>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-3/4" />
    </div>
  );
}

function AnalyticsSkeleton() {
  return (
    <div className="rounded-2xl border border-border/60 bg-card/80 p-6 flex flex-col gap-5">
      <Skeleton className="h-6 w-36" />
      <Skeleton className="h-16 w-28 mx-auto" />
      <Skeleton className="h-3 w-32 mx-auto" />
      {SKELETON_BARS.map((bar) => (
        <div key={`skel-bar-${bar}`} className="flex items-center gap-3">
          <Skeleton className="h-3 w-8" />
          <Skeleton className="h-2 flex-1 rounded-full" />
          <Skeleton className="h-3 w-6" />
        </div>
      ))}
    </div>
  );
}

function SubmitReviewForm({ onSuccess }: { onSuccess: () => void }) {
  const { actor, isFetching } = useActor(createActor);
  const [hovered, setHovered] = useState(0);
  const [selected, setSelected] = useState(0);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      await actor.submitReview(name.trim(), BigInt(selected), comment.trim());
    },
    onSuccess: () => {
      setSubmitted(true);
      toast.success("Thanks for your review!");
      void qc.invalidateQueries({ queryKey: ["reviews"] });
      void qc.invalidateQueries({ queryKey: ["analytics"] });
      onSuccess();
    },
    onError: () => {
      toast.error("Failed to submit review. Please try again.");
    },
  });

  if (submitted) {
    return (
      <div
        className="flex flex-col items-center gap-3 py-6 text-center"
        data-ocid="review.success_state"
      >
        <div className="w-12 h-12 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center">
          <Star className="w-6 h-6 text-accent fill-accent" />
        </div>
        <p className="font-display font-semibold text-foreground">
          Review submitted!
        </p>
        <p className="text-sm text-muted-foreground">
          Thank you for sharing your feedback.
        </p>
      </div>
    );
  }

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (!name.trim() || selected === 0) return;
        mutation.mutate();
      }}
      data-ocid="review.form"
    >
      <div className="flex flex-col gap-1.5">
        <label
          className="text-sm font-medium text-foreground"
          htmlFor="review-form-name"
        >
          Your Name <span className="text-destructive">*</span>
        </label>
        <input
          id="review-form-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          required
          className="h-9 w-full rounded-md border border-input bg-background/60 px-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 transition-colors duration-200"
          data-ocid="review.name_input"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-foreground">Your rating</span>
        <div className="flex items-center gap-1">
          {STAR_INDICES.map((star) => (
            <button
              key={`rate-${star}`}
              type="button"
              aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => setSelected(star)}
              data-ocid={`review.star.${star}`}
              className="transition-smooth"
            >
              <Star
                className={`w-7 h-7 transition-smooth ${
                  star <= (hovered || selected)
                    ? "fill-amber-400 text-amber-400 scale-110"
                    : "fill-muted text-muted-foreground/40"
                }`}
              />
            </button>
          ))}
        </div>
        {selected === 0 && mutation.isError && (
          <p
            className="text-xs text-destructive"
            data-ocid="review.field_error"
          >
            Please select a rating.
          </p>
        )}
      </div>
      <div className="flex flex-col gap-1.5">
        <label
          className="text-sm font-medium text-foreground"
          htmlFor="review-comment"
        >
          Comment{" "}
          <span className="text-muted-foreground font-normal">(optional)</span>
        </label>
        <Textarea
          id="review-comment"
          placeholder="Tell us what you think…"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          className="bg-background/60 border-border/60 focus:border-primary/50 resize-none"
          data-ocid="review.textarea"
        />
      </div>
      <Button
        type="submit"
        disabled={
          selected === 0 || !name.trim() || mutation.isPending || isFetching
        }
        className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow-primary transition-smooth"
        data-ocid="review.submit_button"
      >
        {mutation.isPending ? "Submitting…" : "Submit Review"}
      </Button>
    </form>
  );
}

function DeleteReviewButton({
  reviewId,
  onDeleted,
}: { reviewId: bigint; onDeleted: () => void }) {
  const { actor } = useActor(createActor);
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!actor) return;
    setPending(true);
    setError("");
    try {
      const ok = await actor.deleteReview(reviewId, password);
      if (ok) {
        onDeleted();
        setOpen(false);
        setPassword("");
      } else {
        setError("Incorrect password.");
      }
    } catch {
      setError("Something went wrong.");
    } finally {
      setPending(false);
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        aria-label="Delete review"
        onClick={() => setOpen(true)}
        className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10 transition-smooth"
        data-ocid="review.delete_button"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-1.5"
      data-ocid="review.delete_form"
    >
      <input
        type="password"
        placeholder="Admin password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          setError("");
        }}
        className="h-7 w-36 rounded-md border border-border/60 bg-background/80 px-2 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50"
        data-ocid="review.delete_password_input"
      />
      {error && (
        <span
          className="text-xs text-destructive"
          data-ocid="review.delete_error_state"
        >
          {error}
        </span>
      )}
      <button
        type="submit"
        disabled={pending || !password}
        className="h-7 px-2 rounded-md bg-destructive/80 hover:bg-destructive text-destructive-foreground text-xs font-medium transition-smooth disabled:opacity-50"
        data-ocid="review.delete_confirm_button"
      >
        {pending ? "…" : "Delete"}
      </button>
      <button
        type="button"
        onClick={() => {
          setOpen(false);
          setPassword("");
          setError("");
        }}
        className="h-7 px-2 rounded-md border border-border/50 text-muted-foreground hover:text-foreground text-xs transition-smooth"
        data-ocid="review.delete_cancel_button"
      >
        Cancel
      </button>
    </form>
  );
}

export default function ReviewsSection() {
  const { actor, isFetching } = useActor(createActor);
  const [showAll, setShowAll] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const qc = useQueryClient();

  const {
    data: reviews,
    isLoading: reviewsLoading,
    isError: reviewsError,
  } = useQuery<Review[]>({
    queryKey: ["reviews"],
    queryFn: async () => {
      if (!actor) return [];
      const raw = await actor.getReviews();
      return [...raw].sort((a, b) => Number(b.timestamp - a.timestamp));
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30_000,
  });

  const {
    data: analytics,
    isLoading: analyticsLoading,
    isError: analyticsError,
  } = useQuery<Analytics>({
    queryKey: ["analytics"],
    queryFn: async () => {
      if (!actor)
        return { starCounts: [], totalCount: BigInt(0), averageRating: 0 };
      return actor.getAnalytics();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30_000,
  });

  const displayed = reviews ? (showAll ? reviews : reviews.slice(0, 10)) : [];
  const hasMore = (reviews?.length ?? 0) > 10;

  const starLabels = ["5★", "4★", "3★", "2★", "1★"];
  const starCountsDesc = analytics?.starCounts
    ? [...analytics.starCounts].reverse()
    : [];
  const maxCount = starCountsDesc.reduce(
    (m, c) => (Number(c) > m ? Number(c) : m),
    1,
  );

  return (
    <section
      className="py-20 border-t border-border/60 bg-card/30"
      data-ocid="reviews.section"
      id="reviews"
    >
      <div className="max-w-5xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10"
        >
          <div>
            <h2 className="font-display text-3xl font-bold text-foreground">
              What Users Are Saying
            </h2>
            <p className="text-muted-foreground mt-1.5 font-body text-sm">
              Real feedback from real users — no filters.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowForm((v) => !v)}
            className="border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/60 transition-smooth shrink-0"
            data-ocid="review.open_modal_button"
          >
            <Star className="w-3.5 h-3.5 mr-1.5" />
            {showForm ? "Close" : "Leave a Review"}
          </Button>
        </motion.div>

        {/* Review form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-8 p-6 rounded-2xl border border-primary/20 bg-card/80 shadow-card"
            data-ocid="review.dialog"
          >
            <h3 className="font-display font-semibold text-foreground text-lg mb-4">
              Share your experience
            </h3>
            <SubmitReviewForm onSuccess={() => setShowForm(false)} />
          </motion.div>
        )}

        {/* 2-col grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* LEFT: reviews list ~60% */}
          <div
            className="lg:col-span-3 flex flex-col gap-4"
            data-ocid="reviews.list"
          >
            {reviewsLoading &&
              SKELETON_ROWS.map((row) => (
                <ReviewSkeleton key={`rev-skel-${row}`} />
              ))}

            {reviewsError && (
              <div
                className="flex items-center gap-3 p-4 rounded-xl border border-destructive/20 bg-destructive/5 text-destructive text-sm"
                data-ocid="reviews.error_state"
              >
                <MessageSquare className="w-4 h-4 shrink-0" />
                Reviews temporarily unavailable.
              </div>
            )}

            {!reviewsLoading && !reviewsError && displayed.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center gap-4 py-12 rounded-2xl border border-dashed border-border/60 bg-card/40"
                data-ocid="reviews.empty_state"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Star className="w-7 h-7 text-primary" />
                </div>
                <div className="text-center">
                  <p className="font-display font-semibold text-foreground">
                    Be the first to review!
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Share your experience with ClearCut AI.
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowForm(true)}
                  className="border-primary/30 text-primary hover:bg-primary/10 transition-smooth"
                  data-ocid="reviews.empty_state.open_modal_button"
                >
                  Leave a Review
                </Button>
              </motion.div>
            )}

            {displayed.map((review, i) => (
              <motion.div
                key={`review-${String(review.timestamp)}`}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: Math.min(i * 0.06, 0.3) }}
                className="group flex flex-col gap-3 p-4 rounded-xl border border-border/50 bg-card/60 hover:bg-card/80 transition-smooth"
                data-ocid={`reviews.item.${i + 1}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <StarRow rating={Number(review.rating)} filled />
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-muted-foreground">
                      {relativeTime(review.timestamp)}
                    </span>
                    <DeleteReviewButton
                      reviewId={
                        (review as Review & { id: bigint }).id ?? BigInt(0)
                      }
                      onDeleted={() => {
                        void qc.invalidateQueries({ queryKey: ["reviews"] });
                        void qc.invalidateQueries({ queryKey: ["analytics"] });
                      }}
                    />
                  </div>
                </div>
                {review.comment && (
                  <p className="text-sm text-foreground/80 font-body leading-relaxed">
                    {review.comment}
                  </p>
                )}
              </motion.div>
            ))}

            {!reviewsLoading && hasMore && !showAll && (
              <button
                type="button"
                onClick={() => setShowAll(true)}
                className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl border border-border/50 text-sm text-muted-foreground hover:text-foreground hover:border-primary/30 transition-smooth"
                data-ocid="reviews.pagination_next"
              >
                <ChevronDown className="w-4 h-4" />
                Show {(reviews?.length ?? 0) - 10} more reviews
              </button>
            )}
          </div>

          {/* RIGHT: analytics ~40% */}
          <div className="lg:col-span-2" data-ocid="reviews.analytics">
            {analyticsLoading && <AnalyticsSkeleton />}

            {analyticsError && (
              <div
                className="p-6 rounded-2xl border border-destructive/20 bg-destructive/5 text-destructive text-sm flex items-center gap-2"
                data-ocid="analytics.error_state"
              >
                <TrendingUp className="w-4 h-4 shrink-0" />
                Analytics temporarily unavailable.
              </div>
            )}

            {!analyticsLoading && !analyticsError && analytics && (
              <motion.div
                initial={{ opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45 }}
                className="rounded-2xl border border-border/60 bg-card/80 p-6 flex flex-col gap-5 shadow-card sticky top-6"
              >
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <h3 className="font-display font-semibold text-foreground">
                    Rating Overview
                  </h3>
                </div>

                {/* Average rating display */}
                <div className="flex flex-col items-center gap-2 py-4 rounded-xl bg-primary/5 border border-primary/15">
                  <div className="flex items-end gap-1.5">
                    <span className="font-display text-5xl font-extrabold text-primary leading-none">
                      {analytics.averageRating > 0
                        ? analytics.averageRating.toFixed(1)
                        : "—"}
                    </span>
                    <Star className="w-7 h-7 fill-amber-400 text-amber-400 mb-1" />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Based on{" "}
                    <span className="font-semibold text-foreground">
                      {Number(analytics.totalCount)}
                    </span>{" "}
                    review{Number(analytics.totalCount) !== 1 ? "s" : ""}
                  </p>
                  {Number(analytics.totalCount) > 0 && (
                    <div className="mt-1">
                      <StarRow
                        rating={Math.round(analytics.averageRating)}
                        filled
                      />
                    </div>
                  )}
                </div>

                {/* Distribution bars */}
                <div className="flex flex-col gap-2.5">
                  {starCountsDesc.map((count, i) => {
                    const starNum = 5 - i;
                    const pct =
                      maxCount > 0 ? (Number(count) / maxCount) * 100 : 0;
                    return (
                      <div key={starNum} className="flex items-center gap-2.5">
                        <span className="text-xs text-muted-foreground w-5 text-right shrink-0">
                          {starLabels[i]}
                        </span>
                        <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${pct}%` }}
                            viewport={{ once: true }}
                            transition={{
                              duration: 0.6,
                              delay: i * 0.08,
                              ease: "easeOut",
                            }}
                            className="h-full rounded-full bg-primary"
                          />
                        </div>
                        <span className="text-xs text-muted-foreground w-5 shrink-0">
                          {Number(count)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
