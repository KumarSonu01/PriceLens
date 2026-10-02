import { useEffect, useState, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Star } from "lucide-react";
import api from "../../api/axios";
import Card from "../ui/Card";
import Button from "../ui/Button";
import Select from "../ui/Select";
import Textarea from "../ui/Textarea";
import Rating from "../ui/Rating";

const ReviewSection = ({ productId }) => {
  const { userInfo } = useSelector((state) => state.auth);

  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchReviews = useCallback(async () => {
    try {
      const { data } = await api.get(`/reviews/product/${productId}`);
      setReviews(Array.isArray(data) ? data : []);
    } catch {
      // silent fail
    }
  }, [productId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const submitReview = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error("Please enter your review comment");
      return;
    }

    try {
      setLoading(true);
      await api.post("/reviews", {
        productId,
        rating,
        comment,
      });

      toast.success("Review submitted successfully");
      setComment("");
      setRating(5);
      fetchReviews();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  const { averageRating, ratingDistribution } = useMemo(() => {
    if (!reviews || reviews.length === 0) {
      return { averageRating: 0, ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } };
    }
    const sum = reviews.reduce((acc, r) => acc + (r.rating || 5), 0);
    const avg = (sum / reviews.length).toFixed(1);

    const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      const star = Math.min(5, Math.max(1, Math.round(r.rating || 5)));
      dist[star] = (dist[star] || 0) + 1;
    });

    return { averageRating: avg, ratingDistribution: dist };
  }, [reviews]);

  return (
    <Card className="p-6 space-y-8">
      {/* Header and Rating Distribution */}
      <div className="grid md:grid-cols-12 gap-8 border-b border-line pb-8 items-center">
        <div className="md:col-span-5 space-y-2">
          <span className="text-xs font-mono uppercase tracking-wider text-muted">
            BUYER FEEDBACK
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-text">
            Customer Reviews & Ratings
          </h2>
          <div className="flex items-baseline gap-3 pt-2">
            <span className="text-5xl font-mono font-bold text-text tabular-nums">
              {averageRating}
            </span>
            <div>
              <Rating rating={Number(averageRating)} size="md" />
              <p className="text-xs text-muted mt-1 font-mono">
                Based on {reviews.length} buyer reviews
              </p>
            </div>
          </div>
        </div>

        {/* Rating Distribution Bars */}
        <div className="md:col-span-7 space-y-1.5">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = ratingDistribution[stars] || 0;
            const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
            return (
              <div key={stars} className="flex items-center gap-3 text-xs font-mono">
                <span className="w-12 text-muted shrink-0 flex items-center gap-1">
                  <span>{stars}</span>
                  <Star className="w-3 h-3 fill-warn text-warn" />
                </span>
                <div className="flex-1 h-2 bg-surface-2 rounded-full overflow-hidden border border-line">
                  <div
                    className="h-full bg-signal rounded-full"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-8 text-right text-muted tabular-nums">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Review Submission Form */}
      {userInfo ? (
        <form onSubmit={submitReview} className="space-y-4 bg-surface-2/40 border border-line p-5 rounded-lg">
          <h3 className="text-sm font-bold tracking-tight text-text uppercase font-mono">
            Write a Product Assessment
          </h3>
          <div className="grid sm:grid-cols-4 gap-4">
            <div className="sm:col-span-1">
              <label className="text-xs font-mono text-muted uppercase block mb-1.5">
                Rating
              </label>
              <Select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
              >
                <option value={5}>5 ★ - Outstanding</option>
                <option value={4}>4 ★ - Good</option>
                <option value={3}>3 ★ - Average</option>
                <option value={2}>2 ★ - Below Average</option>
                <option value={1}>1 ★ - Poor</option>
              </Select>
            </div>
            <div className="sm:col-span-3">
              <label className="text-xs font-mono text-muted uppercase block mb-1.5">
                Experience Feedback
              </label>
              <Textarea
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share details regarding build quality, battery, or seller delivery speed..."
                required
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              type="submit"
              variant="signal"
              size="sm"
              loading={loading}
            >
              Post Assessment
            </Button>
          </div>
        </form>
      ) : (
        <div className="p-4 bg-surface-2/50 border border-line rounded-lg text-center text-xs text-muted">
          <span>Sign in to post a buyer review. </span>
          <a href="/login" className="text-signal underline font-semibold ml-1">
            Log in here
          </a>
        </div>
      )}

      {/* Review List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-xs text-muted text-center py-6 font-mono">
            No customer reviews posted yet for this hardware model.
          </p>
        ) : (
          reviews.map((r) => (
            <div
              key={r._id}
              className="p-4 rounded-md border border-line bg-surface-2/20 space-y-2"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-surface-2 border border-line flex items-center justify-center font-mono text-xs font-bold text-text">
                    {r.user?.name?.charAt(0) || "U"}
                  </div>
                  <span className="font-semibold text-xs text-text">
                    {r.user?.name || "Verified Buyer"}
                  </span>
                </div>
                <Rating rating={r.rating} size="xs" />
              </div>
              <p className="text-xs text-text/90 leading-relaxed pl-8">
                {r.comment}
              </p>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

export default ReviewSection;