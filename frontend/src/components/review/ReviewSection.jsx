import {
  useEffect,
  useState,
} from "react";

import {
  useSelector,
} from "react-redux";

import toast from "react-hot-toast";

import api from "../../api/axios";

const ReviewSection = ({
  productId,
}) => {
  const { userInfo } =
    useSelector(
      (state) => state.auth
    );

  const [reviews, setReviews] =
    useState([]);

  const [rating, setRating] =
    useState(5);

  const [comment, setComment] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const fetchReviews =
    async () => {
      try {
        const { data } =
          await api.get(
            `/reviews/product/${productId}`
          );

        setReviews(data);
      } catch (error) {
        console.log(error);
      }
    };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const submitReview =
    async (e) => {
      e.preventDefault();

      try {
        setLoading(true);

        await api.post(
          "/reviews",
          {
            productId,
            rating,
            comment,
          }
        );

        toast.success(
          "Review added"
        );

        setComment("");

        setRating(5);

        fetchReviews();
      } catch (error) {
        toast.error(
          error.response?.data
            ?.message ||
            "Failed to add review"
        );
      } finally {
        setLoading(false);
      }
    };

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce(
            (
              total,
              review
            ) =>
              total +
              review.rating,
            0
          ) / reviews.length
        ).toFixed(1)
      : 0;

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold">
          Reviews & Ratings
        </h2>

        <p className="text-gray-500 mt-2">
          ⭐ {averageRating} (
          {reviews.length}{" "}
          reviews)
        </p>
      </div>

      {userInfo && (
        <form
          onSubmit={
            submitReview
          }
          className="mb-10"
        >
          <select
            value={rating}
            onChange={(e) =>
              setRating(
                Number(
                  e.target.value
                )
              )
            }
            className="border rounded p-3 w-full mb-4"
          >
            <option value={5}>
              5 Stars
            </option>
            <option value={4}>
              4 Stars
            </option>
            <option value={3}>
              3 Stars
            </option>
            <option value={2}>
              2 Stars
            </option>
            <option value={1}>
              1 Star
            </option>
          </select>

          <textarea
            rows="4"
            value={comment}
            onChange={(e) =>
              setComment(
                e.target.value
              )
            }
            placeholder="Write your review..."
            className="border rounded p-3 w-full mb-4"
          />

          <button
            disabled={loading}
            className="bg-black text-white px-6 py-3 rounded"
          >
            {loading
              ? "Posting..."
              : "Submit Review"}
          </button>
        </form>
      )}

      <div className="space-y-5">
        {reviews.map(
          (review) => (
            <div
              key={
                review._id
              }
              className="border rounded-xl p-4"
            >
              <h4 className="font-bold">
                {
                  review.user
                    ?.name
                }
              </h4>

              <p className="text-yellow-500">
                {"⭐".repeat(
                  review.rating
                )}
              </p>

              <p className="mt-2 text-gray-700">
                {
                  review.comment
                }
              </p>
            </div>
          )
        )}

        {reviews.length ===
          0 && (
          <p className="text-gray-500">
            No reviews yet
          </p>
        )}
      </div>
    </div>
  );
};

export default ReviewSection;