
import { useState, useEffect } from 'react';
import { Star, Trash2 } from 'lucide-react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface Prediction {
  id: string;
  date: string;
  crop: string;
  yield: number;
  unit: string;
  rating: number | null;
}

const PastPredictions = () => {
  const { toast } = useToast();
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    console.log('🔄 Fetching past prediction data from localStorage...');
    
    // Get predictions from localStorage
    const storedPredictions = localStorage.getItem('predictions');
    
    if (storedPredictions) {
      console.log('📡 Found predictions in localStorage');
      const parsedPredictions = JSON.parse(storedPredictions);
      
      // Ensure all dates are between February this year and now
      const filteredPredictions = parsedPredictions.map((pred: Prediction) => {
        const predDate = new Date(pred.date);
        // If date is before February 1st of this year, update it to a date between Feb and now
        if (predDate.getFullYear() < currentYear || 
            (predDate.getFullYear() === currentYear && predDate.getMonth() < 1)) {
          
          // Set to a random date between February 1st and now
          const startDate = new Date(currentYear, 1, 1); // February 1st
          const now = new Date();
          const randomTime = startDate.getTime() + Math.random() * (now.getTime() - startDate.getTime());
          const newDate = new Date(randomTime);
          
          return {
            ...pred,
            date: newDate.toISOString().split('T')[0]
          };
        }
        return pred;
      });
      
      console.log('✅ Processed prediction data:', filteredPredictions);
      setPredictions(filteredPredictions);
      
      // Update localStorage with the normalized dates
      localStorage.setItem('predictions', JSON.stringify(filteredPredictions));
    } else {
      console.log('ℹ️ No stored predictions found');
      setPredictions([]);
    }
  }, []);

  // Handle prediction added event from localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      console.log('🔄 Local storage changed, updating predictions list');
      const storedPredictions = localStorage.getItem('predictions');
      if (storedPredictions) {
        const parsedPredictions = JSON.parse(storedPredictions);
        setPredictions(parsedPredictions);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleRating = (id: string, rating: number) => {
    console.log(`⭐ User rated prediction ${id} with ${rating} stars`);
    console.log('📤 Updating rating in localStorage...');
    
    const updatedPredictions = predictions.map(pred => 
      pred.id === id ? { ...pred, rating } : pred
    );
    
    // Save updated predictions back to localStorage
    localStorage.setItem('predictions', JSON.stringify(updatedPredictions));
    console.log('✅ Rating saved successfully to localStorage');
    
    setPredictions(updatedPredictions);
  };

  const handleDelete = (id: string) => {
    console.log(`🗑️ User is attempting to delete prediction ${id}`);
    setDeleting(id);
    console.log('📤 Removing from localStorage...');
    
    setTimeout(() => {
      // Filter out the deleted prediction
      const filteredPredictions = predictions.filter(pred => pred.id !== id);
      
      // Update localStorage
      localStorage.setItem('predictions', JSON.stringify(filteredPredictions));
      console.log(`✅ Prediction ${id} deleted successfully from localStorage`);
      
      setPredictions(filteredPredictions);
      setDeleting(null);
      
      toast({
        title: "Prediction deleted",
        description: "The prediction record has been removed from your history",
      });
    }, 800);
  };

  const toggleExpand = (id: string) => {
    setExpanded(expanded === id ? null : id);
  };

  console.log('🔄 Rendering past predictions component with', predictions.length, 'items');

  if (predictions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Past Predictions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            You don't have any saved predictions yet. Make a prediction and save it to see it here.
          </p>
        </CardContent>
      </Card>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Past Predictions</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Crop</TableHead>
              <TableHead>Yield</TableHead>
              <TableHead className="text-right">Rating</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {predictions.map((prediction) => (
              <TableRow 
                key={prediction.id} 
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => toggleExpand(prediction.id)}
              >
                <TableCell>{formatDate(prediction.date)}</TableCell>
                <TableCell>{prediction.crop}</TableCell>
                <TableCell>
                  {prediction.yield.toLocaleString()} {prediction.unit.split('/')[0]}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={18}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRating(prediction.id, star);
                        }}
                        className={`cursor-pointer ${
                          (prediction.rating && star <= prediction.rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(prediction.id);
                    }}
                    className="p-1 rounded-full hover:bg-red-100 transition-colors"
                    disabled={deleting === prediction.id}
                  >
                    <Trash2 
                      size={16} 
                      className={`${
                        deleting === prediction.id 
                          ? 'text-red-300 animate-pulse' 
                          : 'text-red-500'
                      }`} 
                    />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default PastPredictions;
