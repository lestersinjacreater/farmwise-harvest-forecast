import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

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

  useEffect(() => {
    console.log('📊 Loading past predictions history...');
    
    setIsLoading(true);
    
    // Fetch past predictions from storage with a 4-second delay
    setTimeout(() => {
      const storedPredictions = localStorage.getItem(`pastPredictions-${user?.email}`);
      const predictions = storedPredictions ? JSON.parse(storedPredictions) : [];
      setPastPredictions(predictions);
      
      setIsLoading(false);
      console.log('✅ Past predictions loaded successfully');
    }, 4000); // Changed from 3000 to 4000ms
  }, [user?.email]);

  return (
    <div className="container py-8">
      <Card className="glass-panel rounded-lg shadow-md animate-fade-in">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Past Predictions</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-5 w-5/6" />
              <Skeleton className="h-5 w-2/3" />
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
