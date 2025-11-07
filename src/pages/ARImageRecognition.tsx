import { useState } from 'react';
import { Upload, X, Sparkles, MapPin, Calendar, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import type { LocationDetails } from '@/types';

const locationDatabase: Record<string, LocationDetails> = {
  sigiriya: {
    name: 'Sigiriya Rock Fortress',
    description: 'An ancient rock fortress and palace ruins, a UNESCO World Heritage Site.',
    history: 'Built during the reign of King Kashyapa (477-495 AD), Sigiriya is one of the most important urban planning sites of the first millennium. The fortress complex includes gardens, ponds, and structures built on the massive rock.',
    bestTime: 'Early morning (6 AM - 9 AM) to avoid heat and crowds',
    activities: ['Rock Climbing', 'Photography', 'Historical Tours', 'Garden Walks'],
    tips: ['Wear comfortable shoes', 'Bring water', 'Start early morning', 'Protect from sun'],
  },
  temple: {
    name: 'Temple of the Tooth',
    description: 'Sacred Buddhist temple housing the relic of the tooth of Buddha.',
    history: 'Located in Kandy, this temple has been a place of worship and pilgrimage since 1595. It is one of the most sacred places of worship for Buddhists worldwide.',
    bestTime: 'During morning puja (5:30 AM - 7:00 AM) or evening puja (6:30 PM - 8:00 PM)',
    activities: ['Temple Visit', 'Cultural Shows', 'Museum Tour', 'Kandy Lake Walk'],
    tips: ['Dress modestly', 'Remove shoes', 'Respect religious customs', 'Photography restrictions apply'],
  },
  galle: {
    name: 'Galle Fort',
    description: 'A 17th-century Dutch fort and UNESCO World Heritage Site.',
    history: 'Built by the Portuguese in 1588 and extensively fortified by the Dutch from 1649 onwards. The fort showcases a unique blend of European architecture and South Asian traditions.',
    bestTime: 'Sunset (5 PM - 7 PM) for stunning ocean views',
    activities: ['Walking Tours', 'Shopping', 'Lighthouse Visit', 'Beach Activities', 'Dining'],
    tips: ['Explore narrow streets', 'Visit lighthouse', 'Try local cuisine', 'Shop for souvenirs'],
  },
  ella: {
    name: 'Ella',
    description: 'A small mountain town surrounded by tea plantations and waterfalls.',
    history: 'Ella became popular during the British colonial era for its tea plantations. The iconic Nine Arch Bridge, built in 1921, is a marvel of colonial-era railway construction.',
    bestTime: 'Year-round, but dry season (January-April) is ideal',
    activities: ['Hiking', 'Train Rides', 'Tea Plantation Tours', 'Waterfall Visits'],
    tips: ['Hike Little Adams Peak', 'Take the train ride', 'Visit Nine Arch Bridge', 'Try Ceylon tea'],
  },
};

const ARImageRecognition = () => {
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [locationInfo, setLocationInfo] = useState<LocationDetails | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        analyzeImage(file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = (filename: string) => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis with dummy data
    setTimeout(() => {
      const lowerFilename = filename.toLowerCase();
      let detectedLocation: LocationDetails | null = null;

      if (lowerFilename.includes('sigiriya') || lowerFilename.includes('rock')) {
        detectedLocation = locationDatabase.sigiriya;
      } else if (lowerFilename.includes('temple') || lowerFilename.includes('tooth') || lowerFilename.includes('kandy')) {
        detectedLocation = locationDatabase.temple;
      } else if (lowerFilename.includes('galle') || lowerFilename.includes('fort')) {
        detectedLocation = locationDatabase.galle;
      } else if (lowerFilename.includes('ella') || lowerFilename.includes('bridge')) {
        detectedLocation = locationDatabase.ella;
      } else {
        // Default to random location for demo
        const locations = Object.values(locationDatabase);
        detectedLocation = locations[Math.floor(Math.random() * locations.length)];
      }

      setLocationInfo(detectedLocation);
      setIsAnalyzing(false);
      
      toast({
        title: 'Location Identified!',
        description: `Found information about ${detectedLocation.name}`,
      });
    }, 2000);
  };

  const handleClear = () => {
    setSelectedImage(null);
    setLocationInfo(null);
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">AI-Powered Recognition</span>
          </div>
          <h1 className="text-5xl font-bold mb-4">Discover Sri Lanka</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Upload an image of any tourist location in Sri Lanka and get detailed information instantly
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="shadow-card h-full">
              <CardHeader>
                <CardTitle>Upload Image</CardTitle>
              </CardHeader>
              <CardContent>
                {!selectedImage ? (
                  <label className="flex flex-col items-center justify-center w-full h-96 border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent/50 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="mb-2 text-sm text-muted-foreground">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground">PNG, JPG, JPEG (MAX. 10MB)</p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </label>
                ) : (
                  <div className="relative">
                    <img
                      src={selectedImage}
                      alt="Uploaded location"
                      className="w-full h-96 object-cover rounded-lg"
                    />
                    <Button
                      size="icon"
                      variant="destructive"
                      className="absolute top-2 right-2"
                      onClick={handleClear}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    {isAnalyzing && (
                      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
                          <p className="text-sm font-medium">Analyzing image...</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Information Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <AnimatePresence mode="wait">
              {locationInfo ? (
                <motion.div
                  key="info"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Card className="shadow-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-primary" />
                        {locationInfo.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h3 className="font-semibold mb-2">Description</h3>
                        <p className="text-sm text-muted-foreground">{locationInfo.description}</p>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-2">Historical Background</h3>
                        <p className="text-sm text-muted-foreground">{locationInfo.history}</p>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-2 flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Best Time to Visit
                        </h3>
                        <p className="text-sm text-muted-foreground">{locationInfo.bestTime}</p>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-2 flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Activities
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {locationInfo.activities.map((activity, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium"
                            >
                              {activity}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-2">Travel Tips</h3>
                        <ul className="space-y-1">
                          {locationInfo.tips.map((tip, index) => (
                            <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                              <span className="text-primary mt-1">•</span>
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Card className="shadow-card h-96 flex items-center justify-center">
                    <CardContent className="text-center">
                      <Sparkles className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        Upload an image to discover location details
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ARImageRecognition;
