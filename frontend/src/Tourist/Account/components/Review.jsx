import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Loading from '@/components/Loading';
import { Header } from '@/components/HeaderTourist';
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

        // Fetch details of the event or item to be reviewed
        fetchDetails(type, eventId);
    }, [searchParams]);

    // Fetch details about the event/item being reviewed
    const fetchDetails = async (type, eventId) => {
        try {
            setIsLoading(true);
            console.log(type, eventId);
            if (type === "activity") {
                const response = await axiosInstance.get(`/api/tourist/activities/getActivity/${eventId}`);
            } else {
                const response = await axiosInstance.get(`/api/tourist/itineraries/getItinerary/${eventId}`);
                setDetails(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching details:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle rating submission
    const handleSubmitRating = async () => {
        try {
            if (reviewType === "activity") {
                const response = await axiosInstance.put('/api/tourist/rateActivity', { activityId: eventId, rating });
                if (response.status === 200) {
                    alert("Rating submitted successfully!");
                }
            } else if (reviewType === "itinerary") {
                const response = await axiosInstance.put('/api/tourist/rateItinerary', { itineraryId: eventId, rating });
                if (response.status === 200) {
                    alert("Rating submitted successfully!");
                }
            } else {
                const response = await axiosInstance.put('/api/tourist/rateTourGuide', { itineraryId: eventId, rating });
                if (response.status === 200) {
                    alert("Rating submitted successfully!");
                }
            }
        } catch (error) {
            alert("Failed to submit rating");
        }
    };

    // Handle comment submission
    const handleSubmitComment = async () => {
        try {
            if (reviewType === "activity") {
                const response = await axiosInstance.post('/api/tourist/comment', { type: reviewType, id: eventId, comment });
                if (response.status === 200) {
                    alert("Comment submitted successfully!");
                }
            } else if (reviewType === "itinerary") {
                const response = await axiosInstance.post('/api/tourist/comment', { type: reviewType, id: eventId, comment });
                if (response.status === 200) {
                    alert("Comment submitted successfully!");
                }
            } else {
                const response = await axiosInstance.post('/api/tourist/comment', { type: reviewType, id: details.creatorId, comment });
                if (response.status === 200) {
                    alert("Comment submitted successfully!");
                }
            }
        } catch (error) {
            alert("Failed to submit comment");
        }
    };

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div>
            <Header />
            <div className="p-6">
                <h1>Review {reviewType}</h1>
                {reviewType === "activity" ? (
                    <p>Activity: {details.name}</p>
                ) : reviewType === "itinerary" ? (
                    <p>Itinerary: {details.Name}</p>
                ) : (
                    <p>Tour Guide: {details.creatorId.username || details.creatorId}</p>
                )}

                {/* Rating Section */}
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
                    <button
                        onClick={handleSubmitRating}
                        className="bg-primary text-white px-4 py-2 rounded-md mt-2"
                        id="tab-button"
                    >
                        Submit Rating
                    </button>
                </div>

                {/* Comment Section */}
                <div className="mb-4">
                    <label className="block font-semibold mb-2">Comment:</label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="border rounded-md px-2 py-1 w-full"
                        rows="4"
                    ></textarea>
                    <button
                        onClick={handleSubmitComment}
                        className="bg-primary text-white px-4 py-2 rounded-md mt-2"
                        id="tab-button"
                    >
                        Submit Comment
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Review;
