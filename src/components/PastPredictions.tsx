
import { useState, useEffect } from 'react';
import { Star, Trash2 } from 'lucide-react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
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

  useEffect(() => {
    console.log('🔄 Fetching past prediction data from API...');
    
    // Simulate API fetch delay
    setTimeout(() => {
      console.log('📡 Received past predictions from server');
      // Mock data for past predictions - updated with 2025 dates
      const mockPredictions: Prediction[] = [
        { 
          id: 'pred-001', 
          date: '2025-01-15', 
          crop: 'Maize', 
          yield: 3500, 
          unit: 'kg/hectare', 
          rating: 4 
        },
        { 
          id: 'pred-002', 
          date: '2025-02-22', 
          crop: 'Beans', 
          yield: 1200, 
          unit: 'kg/hectare', 
          rating: 3 
        },
        { 
          id: 'pred-003', 
          date: '2025-03-05', 
          crop: 'Sweet Potatoes', 
          yield: 8000, 
          unit: 'kg/hectare', 
          rating: null 
        },
        { 
          id: 'pred-004', 
          date: '2025-04-18', 
          crop: 'Cassava', 
          yield: 12000, 
          unit: 'kg/hectare', 
          rating: 5 
        },
        { 
          id: 'pred-005', 
          date: '2025-05-27', 
          crop: 'Tomatoes', 
          yield: 4500, 
          unit: 'kg/hectare', 
          rating: null 
        }
      ];
      
      console.log('✅ Processed prediction data:', mockPredictions);
      setPredictions(mockPredictions);
    }, 800);
  }, []);

  const handleRating = (id: string, rating: number) => {
    console.log(`⭐ User rated prediction ${id} with ${rating} stars`);
    console.log('📤 Sending rating to backend API...');
    
    // Simulate API call
    setTimeout(() => {
      console.log('✅ Rating saved successfully on server');
      setPredictions(prevPredictions => 
        prevPredictions.map(pred => 
          pred.id === id ? { ...pred, rating } : pred
        )
      );
    }, 300);
  };

  const handleDelete = (id: string) => {
    console.log(`🗑️ User is attempting to delete prediction ${id}`);
    setDeleting(id);
    console.log('📤 Sending delete request to backend API...');
    
    // Simulate API call with delay
    setTimeout(() => {
      console.log(`✅ Prediction ${id} deleted successfully from database`);
      setPredictions(prevPredictions => 
        prevPredictions.filter(pred => pred.id !== id)
      );
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
            Loading your past predictions...
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
