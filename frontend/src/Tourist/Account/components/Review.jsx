import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axiosInstance from "@/axiosInstance";

const Review = () => {
  const [searchParams] = useSearchParams();
  const [reviewType, setReviewType] = useState("");
  const [eventId, setEventId] = useState("");
  const [details, setDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const type = searchParams.get("type");
    const eventId = searchParams.get("eventId");

    setReviewType(type);
    setEventId(eventId);

    // Fetch event/tour guide details based on type
    const fetchDetails = async () => {
      try {
        setIsLoading(true);
        let endpoint = `/api/tourist/get${type}Details?eventId=${eventId}`;
        if (type === "tourGuide") {
          endpoint += `&itineraryId=${itineraryId}`;
        }
        const response = await axiosInstance.get(endpoint);
        setDetails(response.data);
      } catch (error) {
        console.error("Error fetching review details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [searchParams]);

  const handleSubmitReview = async () => {
    try {
      const payload = {
        eventId,
        rating,
        comment,
      };
      if (reviewType === "tourGuide") {
        payload.itineraryId = itineraryId;
      }

      const response = await axiosInstance.post(`/api/tourist/add${reviewType}Review`, payload);
      if (response.status === 200) {
        alert("Review submitted successfully!");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  if (isLoading) {
    return <p>Loading review details...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Review {reviewType === "tourGuide" ? "Tour Guide" : reviewType}</h1>
      {details && (
        <div className="mb-4">
          <p className="font-semibold">Name: {details.name}</p>
          <p>Description: {details.description || "No description available"}</p>
          {/* Add more details as needed */}
        </div>
      )}
      <div className="mb-4">
        <label className="block font-semibold mb-2">Rating:</label>
        <input
          type="number"
          min="1"
          max="5"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className="border rounded-md px-2 py-1"
        />
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-2">Comment:</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="border rounded-md px-2 py-1 w-full"
          rows="4"
        ></textarea>
      </div>
      <button
        onClick={handleSubmitReview}
        className="bg-primary text-white px-4 py-2 rounded-md"
      >
        Submit Review
      </button>
    </div>
  );
};

export default Review;
