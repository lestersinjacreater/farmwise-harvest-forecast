
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { LoaderCircle } from 'lucide-react';

type Prediction = {
  id: string;
  cropType: string;
  yieldValue: number;
  unit: string;
  date: string;
};

const PastPredictions = () => {
  const { user } = useAuth();
  const [pastPredictions, setPastPredictions] = useState<Prediction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState('Initializing data retrieval...');

  useEffect(() => {
    console.log('📊 Loading past predictions history...');
    
    setIsLoading(true);
    
    // Show a series of loading messages to simulate backend processing
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
    
    // Fetch past predictions from storage with a 4-second delay
    setTimeout(() => {
      clearInterval(messageInterval);
      
      // Get predictions from localStorage
      const storedPredictions = localStorage.getItem('predictions');
      const predictions = storedPredictions ? JSON.parse(storedPredictions) : [];
      
      // Map to correct format
      const formattedPredictions = predictions.map((pred: any) => ({
        id: pred.id,
        cropType: pred.crop,
        yieldValue: pred.yield,
        unit: pred.unit,
        date: pred.date
      }));
      
      setPastPredictions(formattedPredictions);
      
      setIsLoading(false);
      console.log('✅ Past predictions loaded successfully:', formattedPredictions.length, 'records');
    }, 4000);
    
    return () => {
      clearInterval(messageInterval);
    };
  }, [user?.email]);

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
