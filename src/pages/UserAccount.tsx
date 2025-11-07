import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Eye, User, Calendar } from 'lucide-react';
import type { UserBooking } from '@/types';

const mockUserBookings: UserBooking[] = [
  { id: 1, tour: 'Sigiriya Rock Fortress', date: '2025-11-15', guests: 2, totalPrice: 240, status: 'confirmed', bookingDate: '2025-10-10' },
  { id: 2, tour: 'Yala Safari', date: '2025-12-05', guests: 3, totalPrice: 285, status: 'pending', bookingDate: '2025-10-15' },
  { id: 3, tour: 'Ella Trek', date: '2025-10-20', guests: 2, totalPrice: 170, status: 'cancelled', bookingDate: '2025-09-25' },
];

const UserAccount = () => {
  const { user } = useAuth();
  const [bookings] = useState<UserBooking[]>(mockUserBookings);
  const [selectedBooking, setSelectedBooking] = useState<UserBooking | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'default';
      case 'pending': return 'secondary';
      case 'cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Account</h1>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="bookings">My Bookings</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground mb-2">Name</h4>
                    <p className="text-lg">{user?.name}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground mb-2">Email</h4>
                    <p className="text-lg">{user?.email}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground mb-2">Account Type</h4>
                    <Badge variant="outline">{user?.role}</Badge>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground mb-2">Member Since</h4>
                    <p className="text-lg">October 2025</p>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <Button variant="outline">Edit Profile</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  My Bookings
                </CardTitle>
              </CardHeader>
              <CardContent>
                {bookings.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">You haven't made any bookings yet</p>
                    <Button>Browse Tours</Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Tour</TableHead>
                          <TableHead className="hidden md:table-cell">Tour Date</TableHead>
                          <TableHead className="hidden sm:table-cell">Guests</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {bookings.map((booking) => (
                          <TableRow key={booking.id}>
                            <TableCell className="font-medium">#{booking.id}</TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium">{booking.tour}</div>
                                <div className="text-xs text-muted-foreground md:hidden">{booking.date}</div>
                              </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">{booking.date}</TableCell>
                            <TableCell className="hidden sm:table-cell">{booking.guests}</TableCell>
                            <TableCell>
                              <Badge variant={getStatusColor(booking.status)}>
                                {booking.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button 
                                    variant="outline" 
                                    size="icon"
                                    onClick={() => setSelectedBooking(booking)}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                  <DialogHeader>
                                    <DialogTitle>Booking Details - #{booking.id}</DialogTitle>
                                  </DialogHeader>
                                  {selectedBooking && (
                                    <div className="space-y-4">
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                          <h4 className="font-semibold text-sm text-muted-foreground">Tour</h4>
                                          <p className="text-lg">{selectedBooking.tour}</p>
                                        </div>
                                        <div>
                                          <h4 className="font-semibold text-sm text-muted-foreground">Tour Date</h4>
                                          <p className="text-lg">{selectedBooking.date}</p>
                                        </div>
                                        <div>
                                          <h4 className="font-semibold text-sm text-muted-foreground">Booking Date</h4>
                                          <p className="text-lg">{selectedBooking.bookingDate}</p>
                                        </div>
                                        <div>
                                          <h4 className="font-semibold text-sm text-muted-foreground">Number of Guests</h4>
                                          <p className="text-lg">{selectedBooking.guests} guests</p>
                                        </div>
                                        <div>
                                          <h4 className="font-semibold text-sm text-muted-foreground">Total Price</h4>
                                          <p className="text-lg font-bold">${selectedBooking.totalPrice}</p>
                                        </div>
                                        <div>
                                          <h4 className="font-semibold text-sm text-muted-foreground">Status</h4>
                                          <Badge variant={getStatusColor(selectedBooking.status)} className="text-sm">
                                            {selectedBooking.status.toUpperCase()}
                                          </Badge>
                                        </div>
                                      </div>
                                      <div className="p-4 bg-muted rounded-lg">
                                        <h4 className="font-semibold mb-2">Booking Information</h4>
                                        <p className="text-sm text-muted-foreground">
                                          {selectedBooking.status === 'confirmed' && 
                                            "Your booking is confirmed! We'll send you a reminder closer to your tour date."}
                                          {selectedBooking.status === 'pending' && 
                                            "Your booking is pending confirmation. We'll notify you once it's confirmed."}
                                          {selectedBooking.status === 'cancelled' && 
                                            "This booking has been cancelled. If you have any questions, please contact support."}
                                        </p>
                                      </div>
                                      {selectedBooking.status === 'confirmed' && (
                                        <div className="flex gap-2 pt-4">
                                          <Button variant="outline">Modify Booking</Button>
                                          <Button variant="destructive">Cancel Booking</Button>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </DialogContent>
                              </Dialog>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserAccount;
