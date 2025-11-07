import { useState, useEffect } from "react";
import { Calendar, Users, Mail, Phone, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "react-router-dom";
import toursData from "@/data/tours.json";
import StripePaymentForm from "@/components/StripePaymentForm";

const Booking = () => {
  const { toast } = useToast();
  const location = useLocation();
  const [showPayment, setShowPayment] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    tourId: "",
    guests: "1",
    date: "",
  });

  useEffect(() => {
    if (location.state?.tourId) {
      setFormData((prev) => ({ ...prev, tourId: String(location.state.tourId) }));
    }
  }, [location]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    toast({
      title: "Booking Confirmed!",
      description: "Your payment was successful. We'll send you a confirmation email shortly.",
    });
    setFormData({
      name: "",
      email: "",
      phone: "",
      tourId: "",
      guests: "1",
      date: "",
    });
    setShowPayment(false);
  };

  const handlePaymentCancel = () => {
    setShowPayment(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const selectedTour = toursData.find((t) => t.id === Number(formData.tourId));

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4">Book Your Adventure</h1>
          <p className="text-lg text-muted-foreground">
            Fill out the form below and we'll confirm your booking within 24 hours
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!showPayment ? (
            <motion.div
              key="booking-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Booking Form */}
                <div className="lg:col-span-2">
                  <Card className="shadow-card">
                    <CardHeader>
                      <CardTitle>Booking Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="name">Full Name *</Label>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="pl-10"
                                required
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="email">Email Address *</Label>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="pl-10"
                                required
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number *</Label>
                            <div className="relative">
                              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                id="phone"
                                name="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleChange}
                                className="pl-10"
                                required
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="guests">Number of Guests *</Label>
                            <div className="relative">
                              <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                id="guests"
                                name="guests"
                                type="number"
                                min="1"
                                value={formData.guests}
                                onChange={handleChange}
                                className="pl-10"
                                required
                              />
                            </div>
                          </div>

                          <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="tourId">Select Tour *</Label>
                            <select
                              id="tourId"
                              name="tourId"
                              value={formData.tourId}
                              onChange={handleChange}
                              className="w-full p-2 border rounded-md bg-background"
                              required
                            >
                              <option value="">Choose a tour...</option>
                              {toursData.map((tour) => (
                                <option key={tour.id} value={tour.id}>
                                  {tour.name} - ${tour.price} per person
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="date">Preferred Date *</Label>
                            <div className="relative">
                              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                id="date"
                                name="date"
                                type="date"
                                value={formData.date}
                                onChange={handleChange}
                                className="pl-10"
                                required
                              />
                            </div>
                          </div>
                        </div>

                        <Button
                          type="submit"
                          size="lg"
                          className="w-full bg-gradient-sunset hover:shadow-glow"
                        >
                          Proceed to Payment
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </div>

                {/* Booking Summary */}
                <div className="lg:col-span-1">
                  <Card className="shadow-card sticky top-24">
                    <CardHeader>
                      <CardTitle>Booking Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {selectedTour ? (
                        <>
                          <div className="aspect-video rounded-lg overflow-hidden">
                            <img
                              src={selectedTour.image}
                              alt={selectedTour.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg mb-2">{selectedTour.name}</h3>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Price per person</span>
                                <span className="font-medium">${selectedTour.price}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Guests</span>
                                <span className="font-medium">{formData.guests}</span>
                              </div>
                              <div className="flex justify-between pt-2 border-t">
                                <span className="font-semibold">Total</span>
                                <span className="font-bold text-primary text-lg">
                                  ${selectedTour.price * Number(formData.guests)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          Select a tour to see booking summary
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="payment"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="max-w-lg mx-auto"
            >
              <StripePaymentForm
                amount={selectedTour ? selectedTour.price * Number(formData.guests) : 0}
                onSuccess={handlePaymentSuccess}
                onCancel={handlePaymentCancel}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Booking;
