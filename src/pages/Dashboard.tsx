import React from 'react';
import {
  TrendingUp,
  Receipt,
  Banknote,
  Smartphone,
  CreditCard,
  Clock,
  RotateCcw,
  Package,
  AlertTriangle,
  Star,
  Plus,
  ShoppingCart,
  ArrowLeftRight,
  BarChart3,
  CalendarCheck,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

interface StatCard {
  titleKey: string;
  value: string;
  subValue?: string;
  icon: React.ElementType;
  trend?: { value: string; positive: boolean };
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'info' | 'destructive';
}

const quickActions = [
  { label: 'New Bill', icon: Plus, path: '/billing', variant: 'gold' as const },
  { label: 'Purchase Entry', icon: ShoppingCart, path: '/purchase', variant: 'maroon' as const },
  { label: 'Add Stock', icon: Package, path: '/products', variant: 'default' as const },
  { label: 'Return/Exchange', icon: ArrowLeftRight, path: '/returns', variant: 'outline' as const },
  { label: 'Reports', icon: BarChart3, path: '/reports', variant: 'outline' as const },
  { label: 'Order Booking', icon: CalendarCheck, path: '/orders', variant: 'outline' as const },
];

export const Dashboard: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { bills, sarees, orders, settings } = useData();

  // Statistics Calculation
  const today = new Date().toISOString().split('T')[0];
  const todaysBills = bills.filter(b => b.date === today && (b.status === 'Paid' || b.status === 'Due'));
  const totalSalesToday = todaysBills.reduce((sum, b) => sum + (b.grandTotal || 0), 0);

  const totalStockValue = sarees.reduce((sum, s) => sum + ((s.purchasePrice || 0) * (s.stockQty || 0)), 0);
  const totalStockCount = sarees.reduce((sum, s) => sum + (s.stockQty || 0), 0);

  const lowStockItems = sarees
    .filter(s => s.stockQty < 3 && s.status === 'available')
    .slice(0, 5);

  const recentBillsData = bills
    .slice(0, 5)
    .map(b => ({
      id: b.billNo || b.id,
      customer: b.customerName || 'Unknown',
      amount: `₹${b.grandTotal.toLocaleString()}`,
      time: b.date,
      status: b.status
    }));

  const [bestSelling, setBestSelling] = React.useState<{ name: string; sales: number; revenue: string }[]>([]);

  React.useEffect(() => {
    const fetchBestSelling = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/reports/bestselling');
        if (res.ok) {
          setBestSelling(await res.json());
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchBestSelling();
  }, []);

  const stats: StatCard[] = [
    {
      titleKey: 'dashboard.todaySales',
      value: `₹${totalSalesToday.toLocaleString()}`,
      subValue: `${todaysBills.length} bills`,
      icon: TrendingUp,
      color: 'primary',
      visible: settings?.visibleWidgets?.todaySales !== false
    },
    {
      titleKey: 'dashboard.stockValue',
      value: `₹${totalStockValue.toLocaleString()}`,
      subValue: `${totalStockCount} items`,
      icon: Package,
      color: 'success',
      visible: true // Always visible
    },
    {
      titleKey: 'dashboard.orders',
      value: `${orders.filter(o => o.status === 'Booked').length}`,
      subValue: 'Pending Orders',
      icon: ShoppingCart,
      color: 'warning',
      visible: true // Always visible
    },
    {
      titleKey: 'dashboard.lowStock',
      value: `${lowStockItems.length}`,
      subValue: 'Items need reorder',
      icon: AlertTriangle,
      color: 'destructive',
      visible: settings?.visibleWidgets?.lowStock !== false
    }
  ].filter(s => (s as any).visible) as StatCard[];

  const getColorClasses = (color: StatCard['color']) => {
    switch (color) {
      case 'primary':
        return 'bg-primary/10 text-primary';
      case 'secondary':
        return 'bg-secondary/20 text-secondary-foreground';
      case 'success':
        return 'bg-success/10 text-success';
      case 'warning':
        return 'bg-warning/10 text-warning';
      case 'info':
        return 'bg-info/10 text-info';
      case 'destructive':
        return 'bg-destructive/10 text-destructive';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            {t('common.welcome')}, {user?.name}!
          </h1>
          <p className="mt-1 text-muted-foreground">
            Here's what's happening at your store today
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          {new Date().toLocaleDateString('en-IN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-3">
            {quickActions.map((action) => (
              <Button
                key={action.label}
                variant={action.variant}
                size="lg"
                className="flex items-center gap-2"
                onClick={() => navigate(action.path)}
              >
                <action.icon className="h-5 w-5" />
                {action.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card
            key={stat.titleKey}
            className="stat-card border-0 shadow-sm animate-fade-in"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    {t(stat.titleKey)}
                  </p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  {stat.subValue && (
                    <p className="text-xs text-muted-foreground">{stat.subValue}</p>
                  )}
                </div>
                <div className={`rounded-lg p-2.5 ${getColorClasses(stat.color)}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
              {stat.trend && (
                <div className="mt-3 flex items-center gap-1">
                  <Badge
                    variant="outline"
                    className={stat.trend.positive ? 'border-success/30 bg-success/10 text-success' : 'border-destructive/30 bg-destructive/10 text-destructive'}
                  >
                    {stat.trend.value}
                  </Badge>
                  <span className="text-xs text-muted-foreground">vs yesterday</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Bills */}
        <Card className="border-0 shadow-sm lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="font-display text-lg">Recent Bills</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate('/billing')}>
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentBillsData.map((bill) => (
                <div
                  key={bill.id}
                  className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/30 p-3 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Receipt className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{bill.id}</p>
                      <p className="text-sm text-muted-foreground">{bill.customer}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">{bill.amount}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{bill.time}</span>
                      <Badge
                        variant="outline"
                        className={bill.status === 'Paid' ? 'badge-paid' : 'badge-pending'}
                      >
                        {bill.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
              {recentBillsData.length === 0 && <p className="text-center text-muted-foreground">No recent bills</p>}
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alert */}
        {settings?.visibleWidgets?.lowStock !== false && (
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                <CardTitle className="font-display text-lg">{t('dashboard.lowStock')}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {lowStockItems.map((item, index) => (
                  <div
                    key={index}
                    className="rounded-lg border border-warning/30 bg-warning/5 p-3"
                  >
                    <p className="font-medium text-foreground">{item.name}</p>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Stock: <span className="font-semibold text-warning">{item.stockQty}</span>
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Type: {item.stockType}
                      </span>
                    </div>
                  </div>
                ))}
                {lowStockItems.length === 0 && <p className="text-center text-muted-foreground">No stock alerts</p>}
              </div>
              <Button variant="outline" className="mt-4 w-full" onClick={() => navigate('/products')}>
                View All Stock
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Best Selling */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-secondary" />
            <CardTitle className="font-display text-lg">{t('dashboard.bestSelling')} Categories</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {bestSelling.map((item, index) => (
              <div
                key={item.name}
                className="flex items-center gap-3 rounded-lg border border-border/50 bg-muted/30 p-4"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-gold font-bold text-secondary-foreground">
                  #{index + 1}
                </div>
                <div>
                  <p className="font-medium text-foreground">{item.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.sales} sold • {item.revenue}
                  </p>
                </div>
              </div>
            ))}
            {bestSelling.length === 0 && (
              <div className="col-span-full text-center text-muted-foreground py-8">
                No sales data available yet
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
