import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import TourFormDialog from '@/components/admin/TourFormDialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Edit, Trash2, Plus, Eye } from 'lucide-react';
import { toast } from 'sonner';
import toursData from '@/data/tours.json';
import type { Tour, DayItinerary } from '@/types';

const ManageTours = () => {
  const [tours, setTours] = useState<Tour[]>(toursData);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [editingTour, setEditingTour] = useState<Tour | null>(null);

  const handleDelete = (id: number) => {
    setTours(tours.filter(t => t.id !== id));
    toast.success('Tour deleted successfully');
  };

  const handleSaveTour = (tour: Tour) => {
    if (editingTour) {
      setTours(tours.map(t => t.id === tour.id ? tour : t));
    } else {
      setTours([...tours, tour]);
    }
    setEditingTour(null);
  };

  const handleEdit = (tour: Tour) => {
    setEditingTour(tour);
    setFormDialogOpen(true);
  };

  const handleAddNew = () => {
    setEditingTour(null);
    setFormDialogOpen(true);
  };

  return (
    <AdminLayout>
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Manage Tours</h1>
          <Button className="gap-2" onClick={handleAddNew}>
            <Plus className="h-4 w-4" />
            Add New Tour
          </Button>
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>All Tours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden md:table-cell">Category</TableHead>
                    <TableHead className="hidden lg:table-cell">Location</TableHead>
                    <TableHead className="hidden sm:table-cell">Price</TableHead>
                    <TableHead className="hidden xl:table-cell">Rating</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tours.map((tour) => (
                    <TableRow key={tour.id}>
                      <TableCell className="font-medium">#{tour.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img 
                            src={tour.image} 
                            alt={tour.name}
                            className="w-12 h-12 rounded object-cover"
                          />
                          <span className="font-medium">{tour.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant="outline">{tour.category}</Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">{tour.location}</TableCell>
                      <TableCell className="hidden sm:table-cell font-semibold">${tour.price}</TableCell>
                      <TableCell className="hidden xl:table-cell">
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-500">★</span>
                          <span>{tour.rating}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="icon"
                                onClick={() => setSelectedTour(tour)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Tour Details - {tour.name}</DialogTitle>
                              </DialogHeader>
                              {selectedTour && (
                                <div className="space-y-4">
                                  <img 
                                    src={selectedTour.image} 
                                    alt={selectedTour.name}
                                    className="w-full h-64 object-cover rounded-lg"
                                  />
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <h4 className="font-semibold text-sm text-muted-foreground">Name</h4>
                                      <p className="text-lg">{selectedTour.name}</p>
                                    </div>
                                    <div>
                                      <h4 className="font-semibold text-sm text-muted-foreground">Category</h4>
                                      <Badge variant="outline">{selectedTour.category}</Badge>
                                    </div>
                                    <div>
                                      <h4 className="font-semibold text-sm text-muted-foreground">Location</h4>
                                      <p className="text-lg">{selectedTour.location}</p>
                                    </div>
                                    <div>
                                      <h4 className="font-semibold text-sm text-muted-foreground">Duration</h4>
                                      <p className="text-lg">{selectedTour.duration}</p>
                                    </div>
                                    <div>
                                      <h4 className="font-semibold text-sm text-muted-foreground">Price</h4>
                                      <p className="text-lg font-bold">${selectedTour.price}</p>
                                    </div>
                                    <div>
                                      <h4 className="font-semibold text-sm text-muted-foreground">Rating</h4>
                                      <p className="text-lg">★ {selectedTour.rating} ({selectedTour.reviewsCount} reviews)</p>
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-sm text-muted-foreground mb-2">Description</h4>
                                    <p className="text-foreground">{selectedTour.description}</p>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-sm text-muted-foreground mb-2">Highlights</h4>
                                    <ul className="list-disc list-inside space-y-1">
                                      {selectedTour.highlights.map((highlight, idx) => (
                                        <li key={idx}>{highlight}</li>
                                      ))}
                                    </ul>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-sm text-muted-foreground mb-2">Included</h4>
                                    <ul className="list-disc list-inside space-y-1">
                                      {selectedTour.included.map((item, idx) => (
                                        <li key={idx}>{item}</li>
                                      ))}
                                    </ul>
                                  </div>
                                  <div className="flex gap-2 pt-4">
                                    <Button 
                                      variant="outline" 
                                      className="gap-2"
                                      onClick={() => {
                                        handleEdit(selectedTour);
                                        setSelectedTour(null);
                                      }}
                                    >
                                      <Edit className="h-4 w-4" />
                                      Edit Tour
                                    </Button>
                                    <Button 
                                      variant="destructive" 
                                      className="gap-2"
                                      onClick={() => {
                                        handleDelete(selectedTour.id);
                                        setSelectedTour(null);
                                      }}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                      Delete Tour
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => handleEdit(tour)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => handleDelete(tour.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <TourFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        tour={editingTour}
        onSave={handleSaveTour}
      />
    </AdminLayout>
  );
};

export default ManageTours;
