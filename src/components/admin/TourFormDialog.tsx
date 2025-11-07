import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { X, Plus, GripVertical, Upload } from 'lucide-react';
import type { Tour, DayItinerary, TourFormDialogProps } from '@/types';

const TourFormDialog = ({ open, onOpenChange, tour, onSave }: TourFormDialogProps) => {
  const [formData, setFormData] = useState<Tour>({
    id: '0',
    name: '',
    category: '',
    location: '',
    price: 0,
    duration: '',
    rating: 5.0,
    reviewsCount: 0,
    images: ['/placeholder.svg'],
    description: '',
    highlights: [''],
    included: [''],
    numberOfDays: 1,
    itinerary: [{
      day: 1,
      title: '',
      stops: [{ name: '', duration: '', admissionIncluded: false, description: '' }],
      meals: [],
      accommodation: ''
    }],
  });

  const [draggedImage, setDraggedImage] = useState<number | null>(null);

  useEffect(() => {
    if (tour) {
      setFormData(tour);
    } else {
      setFormData({
        id: '0', // Use 0 or a temporary ID for new tours
        name: '',
        category: '',
        location: '',
        price: 0,
        duration: '',
        rating: 5.0,
        reviewsCount: 0,
        images: ['/placeholder.svg'],
        description: '',
        highlights: [''],
        included: [''],
        numberOfDays: 1,
        itinerary: [{
          day: 1,
          title: '',
          stops: [{ name: '', duration: '', admissionIncluded: false, description: '' }],
          meals: [],
          accommodation: ''
        }],
      });
    }
  }, [tour, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    toast.success(tour ? 'Tour updated successfully' : 'Tour created successfully');
    onOpenChange(false);
  };

  const handleArrayChange = (field: 'highlights' | 'included', index: number, value: string) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayItem = (field: 'highlights' | 'included') => {
    setFormData({ ...formData, [field]: [...formData[field], ''] });
  };

  const removeArrayItem = (field: 'highlights' | 'included', index: number) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newArray });
  };

  const handleNumberOfDaysChange = (days: number) => {
    const currentItinerary = formData.itinerary;
    const newItinerary: DayItinerary[] = [];

    for (let i = 0; i < days; i++) {
      if (currentItinerary[i]) {
        newItinerary.push(currentItinerary[i]);
      } else {
        newItinerary.push({
          day: i + 1,
          title: '',
          stops: [{ name: '', duration: '', admissionIncluded: false, description: '' }],
          meals: [],
          accommodation: ''
        });
      }
    }

    setFormData({ ...formData, numberOfDays: days, itinerary: newItinerary });
  };

  const updateItineraryDay = (dayIndex: number, field: keyof DayItinerary, value: any) => {
    const newItinerary = [...formData.itinerary];
    newItinerary[dayIndex] = { ...newItinerary[dayIndex], [field]: value };
    setFormData({ ...formData, itinerary: newItinerary });
  };

  const addStop = (dayIndex: number) => {
    const newItinerary = [...formData.itinerary];
    newItinerary[dayIndex].stops.push({ name: '', duration: '', admissionIncluded: false, description: '' });
    setFormData({ ...formData, itinerary: newItinerary });
  };

  const removeStop = (dayIndex: number, stopIndex: number) => {
    const newItinerary = [...formData.itinerary];
    newItinerary[dayIndex].stops = newItinerary[dayIndex].stops.filter((_, i) => i !== stopIndex);
    setFormData({ ...formData, itinerary: newItinerary });
  };

  const updateStop = (dayIndex: number, stopIndex: number, field: string, value: any) => {
    const newItinerary = [...formData.itinerary];
    newItinerary[dayIndex].stops[stopIndex] = {
      ...newItinerary[dayIndex].stops[stopIndex],
      [field]: value
    };
    setFormData({ ...formData, itinerary: newItinerary });
  };

  const addImage = () => {
    setFormData({ ...formData, images: [...formData.images, ''] });
  };

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages.length ? newImages : ['/placeholder.svg'] });
  };

  const updateImage = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  };

  const handleDragStart = (index: number) => {
    setDraggedImage(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (index: number) => {
    if (draggedImage === null) return;
    
    const newImages = [...formData.images];
    const draggedItem = newImages[draggedImage];
    newImages.splice(draggedImage, 1);
    newImages.splice(index, 0, draggedItem);
    
    setFormData({ ...formData, images: newImages });
    setDraggedImage(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{tour ? 'Edit Tour' : 'Add New Tour'}</DialogTitle>
          <DialogDescription>
            Create a detailed multi-day tour with itinerary, images, and all tour information
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Tour Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cultural">Cultural</SelectItem>
                    <SelectItem value="Nature">Nature</SelectItem>
                    <SelectItem value="Adventure">Adventure</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price (USD) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="numberOfDays">Number of Days *</Label>
                <Input
                  id="numberOfDays"
                  type="number"
                  min="1"
                  max="30"
                  value={formData.numberOfDays}
                  onChange={(e) => handleNumberOfDaysChange(Number(e.target.value))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration Description *</Label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="e.g., 8 Days / 7 Nights"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                required
              />
            </div>
          </div>

          {/* Images with Drag and Drop */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Tour Images</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {formData.images.map((image, index) => (
                <div
                  key={index}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(index)}
                  className="flex gap-2 items-center p-2 border rounded-lg bg-muted/50 cursor-move hover:bg-muted transition-colors"
                >
                  <GripVertical className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1 flex gap-2">
                    <Input
                      value={image}
                      onChange={(e) => updateImage(index, e.target.value)}
                      placeholder="Image URL"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Button type="button" variant="outline" onClick={addImage} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Image
            </Button>
          </div>

          {/* Highlights */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Highlights</h3>
            {formData.highlights.map((highlight, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={highlight}
                  onChange={(e) => handleArrayChange('highlights', index, e.target.value)}
                  placeholder="Enter highlight"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeArrayItem('highlights', index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={() => addArrayItem('highlights')}>
              <Plus className="h-4 w-4 mr-2" />
              Add Highlight
            </Button>
          </div>

          {/* What's Included */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">What's Included</h3>
            {formData.included.map((item, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={item}
                  onChange={(e) => handleArrayChange('included', index, e.target.value)}
                  placeholder="Enter included item"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeArrayItem('included', index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={() => addArrayItem('included')}>
              <Plus className="h-4 w-4 mr-2" />
              Add Included Item
            </Button>
          </div>

          {/* Day-by-Day Itinerary */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Day-by-Day Itinerary</h3>
            {formData.itinerary.map((day, dayIndex) => (
              <div key={dayIndex} className="border rounded-lg p-4 space-y-4 bg-muted/30">
                <h4 className="font-semibold text-primary">Day {day.day}</h4>
                
                <div className="space-y-2">
                  <Label>Day Title</Label>
                  <Input
                    value={day.title}
                    onChange={(e) => updateItineraryDay(dayIndex, 'title', e.target.value)}
                    placeholder="e.g., Airport to Sigiriya / Dambulla"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Stops</Label>
                  {day.stops.map((stop, stopIndex) => (
                    <div key={stopIndex} className="border rounded p-3 space-y-2 bg-background">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Stop {stopIndex + 1}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeStop(dayIndex, stopIndex)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <Input
                        value={stop.name}
                        onChange={(e) => updateStop(dayIndex, stopIndex, 'name', e.target.value)}
                        placeholder="Stop name (e.g., Dambulla Cave Temple)"
                      />
                      <Input
                        value={stop.duration}
                        onChange={(e) => updateStop(dayIndex, stopIndex, 'duration', e.target.value)}
                        placeholder="Duration (e.g., 2 hours)"
                      />
                      <Textarea
                        value={stop.description}
                        onChange={(e) => updateStop(dayIndex, stopIndex, 'description', e.target.value)}
                        placeholder="Stop description"
                        rows={2}
                      />
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={stop.admissionIncluded}
                          onChange={(e) => updateStop(dayIndex, stopIndex, 'admissionIncluded', e.target.checked)}
                          className="rounded"
                        />
                        <Label className="text-sm">Admission included</Label>
                      </div>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addStop(dayIndex)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Stop
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Meals Included</Label>
                    <Input
                      value={day.meals.join(', ')}
                      onChange={(e) => updateItineraryDay(dayIndex, 'meals', e.target.value.split(',').map(m => m.trim()))}
                      placeholder="e.g., Breakfast, Lunch, Dinner"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Accommodation</Label>
                    <Input
                      value={day.accommodation}
                      onChange={(e) => updateItineraryDay(dayIndex, 'accommodation', e.target.value)}
                      placeholder="e.g., Overnight at Sigiriya Hotel"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2 pt-4 sticky bottom-0 bg-background pb-4 border-t">
            <Button type="submit" className="flex-1">
              {tour ? 'Update Tour' : 'Create Tour'}
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TourFormDialog;
