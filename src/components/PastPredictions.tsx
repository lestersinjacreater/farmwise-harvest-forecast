import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, LoaderCircle, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

type Prediction = {
  id: string;
  cropType: string;
  yieldValue: number;
  unit: string;
  date: string;
  rating?: number | null;
};

const PastPredictions = () => {
  const { user } = useAuth();
  const [pastPredictions, setPastPredictions] = useState<Prediction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState('Initializing data retrieval...');

  useEffect(() => {
    console.log('📊 Loading past predictions history...');
    setIsLoading(true);

    const loadingMessages = [
      'Initializing data retrieval...',
      'Connecting to prediction database...',
      'Querying user predictions...',
      'Processing prediction records...',
      'Preparing results for display...'
    ];

    let messageIndex = 0;
    const messageInterval = setInterval(() => {
      if (messageIndex < loadingMessages.length) {
        setLoadingMessage(loadingMessages[messageIndex]);
        messageIndex++;
      } else {
        clearInterval(messageInterval);
      }
    }, 800);

    setTimeout(() => {
      clearInterval(messageInterval);
      loadPredictionsFromStorage();
      setIsLoading(false);
      console.log('✅ Past predictions loaded successfully');
    }, 4000);

    return () => {
      clearInterval(messageInterval);
    };
  }, [user?.email]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'predictions') {
        loadPredictionsFromStorage();
      }
    };

    const handleLocalStorageChange = () => {
      loadPredictionsFromStorage();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('predictionsUpdated', handleLocalStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('predictionsUpdated', handleLocalStorageChange);
    };
  }, []);

  const loadPredictionsFromStorage = () => {
    const storedPredictions = localStorage.getItem('predictions');
    const predictions = storedPredictions ? JSON.parse(storedPredictions) : [];

    const formattedPredictions = predictions.map((pred: any) => ({
      id: pred.id,
      cropType: pred.crop,
      yieldValue: pred.yield,
      unit: pred.unit,
      date: pred.date,
      rating: pred.rating
    }));

    setPastPredictions(formattedPredictions);
    console.log('📊 Loaded', formattedPredictions.length, 'predictions from storage');
  };

  const handleDelete = (predictionId: string) => {
    const updatedPredictions = pastPredictions.filter(pred => pred.id !== predictionId);
    setPastPredictions(updatedPredictions);

    const storedPredictions = localStorage.getItem('predictions');
    if (storedPredictions) {
      const predictions = JSON.parse(storedPredictions);
      const filteredPredictions = predictions.filter((pred: any) => pred.id !== predictionId);
      localStorage.setItem('predictions', JSON.stringify(filteredPredictions));

      window.dispatchEvent(new Event('predictionsUpdated'));

      toast({
        title: "Prediction Deleted",
        description: "The prediction has been successfully removed.",
      });
    }
  };

  const handleRating = (predictionId: string, rating: number) => {
    setPastPredictions(prevPredictions =>
      prevPredictions.map(pred =>
        pred.id === predictionId ? { ...pred, rating } : pred
      )
    );

    const storedPredictions = localStorage.getItem('predictions');
    if (storedPredictions) {
      const predictions = JSON.parse(storedPredictions);
      const updatedPredictions = predictions.map((pred: any) =>
        pred.id === predictionId ? { ...pred, rating } : pred
      );

      localStorage.setItem('predictions', JSON.stringify(updatedPredictions));
      window.dispatchEvent(new Event('predictionsUpdated'));

      toast({
        title: "Rating Saved",
        description: `You rated this prediction ${rating} star${rating !== 1 ? 's' : ''}.`,
      });
    }
  };

  const renderStarRating = (prediction: Prediction) => {
    const { id, rating } = prediction;

    return (
      <div className="flex mt-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={`star-${id}-${star}`}
            className={`h-4 w-4 cursor-pointer transition-colors ${
              rating && rating >= star
                ? 'text-yellow-500 fill-yellow-500'
                : 'text-gray-300 hover:text-yellow-400'
            }`}
            onClick={() => handleRating(id, star)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="container py-8">
      <Card className="glass-panel rounded-lg shadow-md animate-fade-in">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Past Predictions</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          {isLoading ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <LoaderCircle className="h-4 w-4 text-primary animate-spin" />
                <p className="text-sm text-muted-foreground">{loadingMessage}</p>
              </div>
              <div className="space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-5 w-5/6" />
                <Skeleton className="h-5 w-2/3" />
              </div>
            </div>
          ) : pastPredictions.length > 0 ? (
            <div className="grid gap-4">
              {pastPredictions.map((prediction) => (
                <div key={prediction.id} className="border rounded-md p-3">
                  <p className="text-sm font-medium">
                    Crop: {prediction.cropType}
                  </p>
                  <p className="text-sm">
                    Yield: {prediction.yieldValue} {prediction.unit}
                  </p>
                  <p className="text-xs text-gray-500">
                    Date: {prediction.date}
                  </p>
                  <div className="mt-1">
                    <p className="text-xs text-gray-600 mb-1">Rate this prediction:</p>
                    {renderStarRating(prediction)}
                  </div>
                  <button
                    onClick={() => handleDelete(prediction.id)}
                    className="mt-2 text-red-500 hover:text-red-700 flex items-center gap-1"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No past predictions available.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PastPredictions;