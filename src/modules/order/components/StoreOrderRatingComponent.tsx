import React, { useState } from "react";
import RatingComponent from "../../../shared/components/RatingComponent";

interface StoreOrderRatingComponentProps {
  storeId: string;
  initialRating: number;
  onSubmit: (rating: number) => Promise<void>;
}

const StoreOrderRatingComponent: React.FC<StoreOrderRatingComponentProps> = ({
  storeId,
  initialRating,
  onSubmit,
}) => {
  const [rating, setRating] = useState(initialRating);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRate = async (value: number) => {
    setLoading(true);
    setError(null);
    try {
      await onSubmit(value);
      setRating(value);
    } catch (err: any) {
      setError(err.message || "Failed to submit rating");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <RatingComponent
        value={rating}
        readOnly={false}
        size="medium"
        precision={1}
        onChange={handleRate}
      />
      {loading && <span>Saving...</span>}
      {error && <span style={{ color: "red" }}>{error}</span>}
    </div>
  );
};

export default StoreOrderRatingComponent;
