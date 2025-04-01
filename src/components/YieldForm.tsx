import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface YieldFormProps {
  onPredict: (result: { yield: number; unit: string, id: string }) => void;
}

interface FormData {
  location: string;
  landSize: string;
  cropType: string;
  soilType: string;
  irrigationMethod: string;
}

const YieldForm: React.FC<YieldFormProps> = ({ onPredict }) => {
  const [formData, setFormData] = useState<FormData>({
    location: 'Nairobi',
    landSize: '1',
    cropType: 'Maize',
    soilType: 'Loam',
    irrigationMethod: 'Drip',
  });

  useEffect(() => {
    // Load saved form data from localStorage on component mount
    const savedFormData = localStorage.getItem('lastFormData');
    if (savedFormData) {
      setFormData(JSON.parse(savedFormData));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.location || !formData.landSize || !formData.cropType || !formData.soilType || !formData.irrigationMethod) {
      alert('Please fill in all fields.');
      return;
    }

    // Make a prediction (replace with actual ML model call)
    const predictedYield = Math.random() * 5000 + 500; // Example prediction
    const unit = 'kg/hectare';

    // Save prediction to localStorage
    const prediction = {
      yield: predictedYield,
      unit: unit,
      location: formData.location,
      landSize: formData.landSize,
      crop: formData.cropType,
      soil: formData.soilType,
      irrigation: formData.irrigationMethod
    };
    
    const savePrediction = (prediction: any) => {
      // Add a predicted id, date, and null rating
      const predictionWithMeta = {
        ...prediction,
        id: uuidv4(),
        date: new Date().toISOString().split('T')[0],
        rating: null
      };
      
      // Get existing predictions or initialize empty array
      const existingPredictions = JSON.parse(localStorage.getItem('predictions') || '[]');
      
      // Add new prediction to array
      const updatedPredictions = [...existingPredictions, predictionWithMeta];
      
      // Save back to localStorage
      localStorage.setItem('predictions', JSON.stringify(updatedPredictions));
      
      // Also save form data for reports
      localStorage.setItem('lastFormData', JSON.stringify(formData));
      
      return predictionWithMeta;
    };

    const predictionWithMeta = savePrediction(prediction);

    // Pass the prediction result to the parent component
    onPredict({ yield: predictedYield, unit: unit, id: predictionWithMeta.id });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="location">Location</Label>
        <Select onValueChange={(value) => setFormData(prev => ({ ...prev, location: value }))} defaultValue={formData.location}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Nairobi">Nairobi</SelectItem>
            <SelectItem value="Mombasa">Mombasa</SelectItem>
            <SelectItem value="Kisumu">Kisumu</SelectItem>
            <SelectItem value="Nakuru">Nakuru</SelectItem>
            <SelectItem value="Eldoret">Eldoret</SelectItem>
            <SelectItem value="Kiambu">Kiambu</SelectItem>
            <SelectItem value="Nyeri">Nyeri</SelectItem>
            <SelectItem value="Meru">Meru</SelectItem>
            <SelectItem value="Kakamega">Kakamega</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="landSize">Land Size (hectares)</Label>
        <Input
          type="number"
          id="landSize"
          name="landSize"
          value={formData.landSize}
          onChange={handleChange}
          placeholder="Enter land size"
          min="0"
          step="0.1"
        />
      </div>
      <div>
        <Label htmlFor="cropType">Crop Type</Label>
        <Select onValueChange={(value) => setFormData(prev => ({ ...prev, cropType: value }))} defaultValue={formData.cropType}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select crop type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Maize">Maize</SelectItem>
            <SelectItem value="Beans">Beans</SelectItem>
            <SelectItem value="Wheat">Wheat</SelectItem>
            <SelectItem value="Rice">Rice</SelectItem>
            <SelectItem value="Potatoes">Potatoes</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="soilType">Soil Type</Label>
        <Select onValueChange={(value) => setFormData(prev => ({ ...prev, soilType: value }))} defaultValue={formData.soilType}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select soil type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Loam">Loam</SelectItem>
            <SelectItem value="Clay">Clay</SelectItem>
            <SelectItem value="Sandy">Sandy</SelectItem>
            <SelectItem value="Silt">Silt</SelectItem>
            <SelectItem value="Peat">Peat</SelectItem>
            <SelectItem value="Chalky">Chalky</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="irrigationMethod">Irrigation Method</Label>
        <Select onValueChange={(value) => setFormData(prev => ({ ...prev, irrigationMethod: value }))} defaultValue={formData.irrigationMethod}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select irrigation method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Drip">Drip</SelectItem>
            <SelectItem value="Sprinkler">Sprinkler</SelectItem>
            <SelectItem value="Flood">Flood</SelectItem>
            <SelectItem value="Manual">Manual</SelectItem>
            <SelectItem value="None">None</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" className="w-full">Predict Yield</Button>
    </form>
  );
};

export default YieldForm;
