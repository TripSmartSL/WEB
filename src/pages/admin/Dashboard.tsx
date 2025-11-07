import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Map, MessageSquare, TrendingUp } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';

const Dashboard = () => {
  const stats = [
    { title: 'Total Bookings', value: '156', icon: Calendar, trend: '+12%' },
    { title: 'Active Tours', value: '12', icon: Map, trend: '+3%' },
    { title: 'Total Reviews', value: '423', icon: MessageSquare, trend: '+8%' },
    { title: 'Revenue', value: '$48,250', icon: TrendingUp, trend: '+15%' },
  ];

  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className="shadow-card">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-green-600 mt-1">{stat.trend} from last month</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Recent Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center justify-between border-b pb-3">
                    <div>
                      <p className="font-medium">Booking #{1000 + i}</p>
                      <p className="text-sm text-muted-foreground">Sigiriya Rock Fortress</p>
                    </div>
                    <span className="text-sm font-medium text-primary">$250</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Recent Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="border-b pb-3">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-sm">User {i}</p>
                      <span className="text-yellow-500">★★★★★</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Amazing experience! Highly recommended.
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
