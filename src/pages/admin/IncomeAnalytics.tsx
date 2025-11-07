import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, Calendar, ChartBar } from 'lucide-react';
import { motion } from 'framer-motion';

const IncomeAnalytics = () => {
  // Mock income data
  const todayIncome = 2450;
  const monthlyIncome = 45890;
  const yearlyIncome = 389750;
  const lastMonthIncome = 42300;
  const monthlyGrowth = ((monthlyIncome - lastMonthIncome) / lastMonthIncome * 100).toFixed(1);

  const stats = [
    {
      title: "Today's Income",
      value: `$${todayIncome.toLocaleString()}`,
      icon: DollarSign,
      trend: '+12%',
      description: 'Compared to yesterday',
      bgGradient: 'from-blue-500/20 to-cyan-500/20',
      iconColor: 'text-blue-500',
    },
    {
      title: 'Monthly Income',
      value: `$${monthlyIncome.toLocaleString()}`,
      icon: Calendar,
      trend: `+${monthlyGrowth}%`,
      description: 'Compared to last month',
      bgGradient: 'from-green-500/20 to-emerald-500/20',
      iconColor: 'text-green-500',
    },
    {
      title: 'Yearly Income',
      value: `$${yearlyIncome.toLocaleString()}`,
      icon: TrendingUp,
      trend: '+28%',
      description: 'Compared to last year',
      bgGradient: 'from-purple-500/20 to-pink-500/20',
      iconColor: 'text-purple-500',
    },
  ];

  // Mock monthly breakdown data
  const monthlyBreakdown = [
    { month: 'Jan', income: 32450 },
    { month: 'Feb', income: 28900 },
    { month: 'Mar', income: 35670 },
    { month: 'Apr', income: 42100 },
    { month: 'May', income: 38450 },
    { month: 'Jun', income: 41230 },
    { month: 'Jul', income: 44890 },
    { month: 'Aug', income: 42300 },
    { month: 'Sep', income: 45890 },
    { month: 'Oct', income: 0 },
    { month: 'Nov', income: 0 },
    { month: 'Dec', income: 0 },
  ];

  const topTours = [
    { name: 'Sigiriya Rock Fortress Tour', bookings: 145, revenue: 34800 },
    { name: 'Ella Train Journey & Nine Arch Bridge', bookings: 132, revenue: 31680 },
    { name: 'Yala National Park Safari', bookings: 98, revenue: 29400 },
    { name: 'Galle Fort Historical Walk', bookings: 87, revenue: 20880 },
    { name: 'Temple of the Tooth Tour', bookings: 76, revenue: 13680 },
  ];

  return (
    <AdminLayout>
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Income Analytics</h1>
          <p className="text-muted-foreground">Track your tour revenue and performance</p>
        </div>

        {/* Income Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="shadow-card overflow-hidden relative">
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} pointer-events-none`} />
                  <CardHeader className="relative z-10 flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </CardTitle>
                    <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <div className="text-3xl font-bold mb-1">{stat.value}</div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-green-600 font-medium">{stat.trend}</span>
                      <span className="text-muted-foreground">{stat.description}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Breakdown */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ChartBar className="h-5 w-5" />
                Monthly Revenue Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {monthlyBreakdown.filter(m => m.income > 0).map((month, index) => {
                  const maxIncome = Math.max(...monthlyBreakdown.map(m => m.income));
                  const widthPercent = (month.income / maxIncome) * 100;
                  return (
                    <div key={month.month} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{month.month}</span>
                        <span className="text-muted-foreground">${month.income.toLocaleString()}</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${widthPercent}%` }}
                          transition={{ delay: index * 0.1, duration: 0.5 }}
                          className="h-full bg-gradient-primary rounded-full"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Top Performing Tours */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Top Performing Tours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topTours.map((tour, index) => (
                  <div
                    key={tour.name}
                    className="flex items-center justify-between p-3 rounded-lg bg-accent/50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                          {index + 1}
                        </span>
                        <p className="font-medium text-sm">{tour.name}</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 ml-8">
                        {tour.bookings} bookings
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">${tour.revenue.toLocaleString()}</p>
                    </div>
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

export default IncomeAnalytics;
