import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from 'lucide-react';

type PredictionResultProps = {
  prediction: {
    yield: number;
    unit: string;
    id?: string;
  };
};

const PredictionResult = ({ prediction }: PredictionResultProps) => {
  const [rating, setRating] = useState<number | null>(null);
  
  useEffect(() => {
    // Check if this prediction has a saved rating
    if (prediction.id) {
      const storedPredictions = localStorage.getItem('predictions');
      if (storedPredictions) {
        const predictions = JSON.parse(storedPredictions);
        const currentPrediction = predictions.find((p: any) => p.id === prediction.id);
        if (currentPrediction && currentPrediction.rating !== null) {
          setRating(currentPrediction.rating);
        }
      }
    }
  }, [prediction.id]);

  const handleRating = (rating: number) => {
    // Get existing predictions
    const storedPredictions = localStorage.getItem('predictions');
    if (storedPredictions) {
      const predictions = JSON.parse(storedPredictions);
      
      // Find the most recent prediction (assuming it's the one we're viewing)
      if (predictions.length > 0) {
        const latestPrediction = predictions[predictions.length - 1];
        latestPrediction.rating = rating;
        
        // Save back to localStorage
        localStorage.setItem('predictions', JSON.stringify(predictions));
        setRating(rating);
      }
    }
  };

  // Format the yield value with commas for thousands
  const formattedYield = prediction.yield.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return (
    <Card className="glass-panel rounded-lg shadow-md animate-fade-in">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Prediction Result</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-2">Estimated Crop Yield</p>
          <div className="text-4xl font-bold text-farm-leaf mb-2">
            {formattedYield} <span className="text-2xl">{prediction.unit}</span>
          </div>
          <p className="text-sm text-muted-foreground">
            This prediction is based on your farm details and our machine learning model.
          </p>
          
          <div className="mt-4">
            <p className="mb-2">Rate this prediction:</p>
            <div className="flex gap-1 justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  className={`h-6 w-6 cursor-pointer ${
                    rating && rating >= star 
                      ? 'text-yellow-500 fill-yellow-500' 
                      : 'text-gray-300'
                  }`}
                  onClick={() => handleRating(star)}
                />
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PredictionResult;
