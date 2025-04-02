
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, BarChart2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from '@/hooks/use-toast';
import { Skeleton } from "@/components/ui/skeleton";

type PredictionResultProps = {
  prediction: {
    yield: number;
    unit: string;
    id?: string;
    confidenceLevel?: number;
  };
};

const PredictionResult = ({ prediction }: PredictionResultProps) => {
  const [rating, setRating] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [confidenceLevel, setConfidenceLevel] = useState<number>(prediction.confidenceLevel || 0);
  
  useEffect(() => {
    // Simulate loading of prediction results
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
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
    
    // Set confidence level
    if (prediction.confidenceLevel) {
      setConfidenceLevel(prediction.confidenceLevel);
    }
    
    return () => clearTimeout(timer);
  }, [prediction.id, prediction.confidenceLevel]);

  const handleRating = (rating: number) => {
    if (!prediction.id) return;
    
    // Get existing predictions
    const storedPredictions = localStorage.getItem('predictions');
    if (storedPredictions) {
      const predictions = JSON.parse(storedPredictions);
      
      // Find the prediction with matching ID
      const predictionIndex = predictions.findIndex((p: any) => p.id === prediction.id);
      if (predictionIndex !== -1) {
        predictions[predictionIndex].rating = rating;
        
        // Save back to localStorage
        localStorage.setItem('predictions', JSON.stringify(predictions));
        setRating(rating);
        
        // Dispatch custom event to notify other components
        window.dispatchEvent(new Event('predictionsUpdated'));
        
        toast({
          title: "Rating Saved",
          description: `You rated this prediction ${rating} star${rating !== 1 ? 's' : ''}.`,
        });
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
        {isLoading ? (
          <div className="text-center space-y-4">
            <Skeleton className="h-6 w-3/4 mx-auto" />
            <Skeleton className="h-10 w-1/2 mx-auto" />
            <Skeleton className="h-4 w-5/6 mx-auto" />
            <div className="flex gap-1 justify-center mt-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <Skeleton key={star} className="h-6 w-6 rounded-full" />
              ))}
            </div>
            <Skeleton className="h-10 w-48 mx-auto mt-4" />
          </div>
        ) : (
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">Estimated Crop Yield</p>
            <div className="text-4xl font-bold text-farm-leaf mb-2">
              {formattedYield} <span className="text-2xl">{prediction.unit}</span>
            </div>
            
            {/* Confidence Level Indicator */}
            <div className="mt-3 mb-4">
              <p className="text-sm text-muted-foreground mb-1">Prediction Confidence</p>
              <div className="flex items-center justify-center gap-2">
                <div className="w-full max-w-[200px] bg-gray-200 h-2.5 rounded-full">
                  <div 
                    className="bg-farm-leaf h-2.5 rounded-full" 
                    style={{ width: `${confidenceLevel}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{confidenceLevel}%</span>
              </div>
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
                    className={`h-6 w-6 cursor-pointer transition-colors ${
                      rating && rating >= star 
                        ? 'text-yellow-500 fill-yellow-500' 
                        : 'text-gray-300 hover:text-yellow-400'
                    }`}
                    onClick={() => handleRating(star)}
                  />
                ))}
              </div>
            </div>
            
            <div className="mt-6">
              <Link to="/reports">
                <Button variant="outline" className="flex items-center gap-2">
                  <BarChart2 className="h-4 w-4" />
                  View Detailed Analytics
                </Button>
              </Link>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PredictionResult;
