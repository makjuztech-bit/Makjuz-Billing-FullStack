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

const stats: StatCard[] = [
  {
    titleKey: 'dashboard.todaySales',
    value: '₹2,45,750',
    subValue: '32 bills',
    icon: TrendingUp,
    trend: { value: '+12%', positive: true },
    color: 'primary',
  },
  {
    titleKey: 'dashboard.cashSales',
    value: '₹1,25,000',
    subValue: '18 transactions',
    icon: Banknote,
    color: 'success',
  },
  {
    titleKey: 'dashboard.upiSales',
    value: '₹85,250',
    subValue: '10 transactions',
    icon: Smartphone,
    color: 'info',
  },
  {
    titleKey: 'dashboard.cardSales',
    value: '₹35,500',
    subValue: '4 transactions',
    icon: CreditCard,
    color: 'secondary',
  },
  {
    titleKey: 'dashboard.creditPending',
    value: '₹45,000',
    subValue: '8 customers',
    icon: Clock,
    color: 'warning',
  },
  {
    titleKey: 'dashboard.returns',
    value: '₹12,500',
    subValue: '2 returns',
    icon: RotateCcw,
    color: 'destructive',
  },
  {
    titleKey: 'dashboard.stockValue',
    value: '₹45,80,000',
    subValue: '1,250 sarees',
    icon: Package,
    color: 'primary',
  },
  {
    titleKey: 'dashboard.profit',
    value: '₹32,450',
    subValue: '15.2% margin',
    icon: TrendingUp,
    trend: { value: '+8%', positive: true },
    color: 'success',
  },
];

const lowStockItems = [
  { name: 'Kanchipuram Pure Silk - Maroon', stock: 2, threshold: 5 },
  { name: 'Banarasi Silk - Golden', stock: 1, threshold: 3 },
  { name: 'Mysore Silk - Green', stock: 3, threshold: 5 },
];

const recentBills = [
  { id: 'INV-2024-0032', customer: 'Lakshmi Devi', amount: '₹15,500', time: '10 mins ago', status: 'Paid' },
  { id: 'INV-2024-0031', customer: 'Meena Kumari', amount: '₹8,750', time: '25 mins ago', status: 'Paid' },
  { id: 'INV-2024-0030', customer: 'Rajan Kumar', amount: '₹22,000', time: '1 hour ago', status: 'Credit' },
  { id: 'INV-2024-0029', customer: 'Priya Sharma', amount: '₹12,350', time: '2 hours ago', status: 'Paid' },
];

const bestSelling = [
  { name: 'Kanchipuram Silk', sales: 45, revenue: '₹8,50,000' },
  { name: 'Banarasi Silk', sales: 32, revenue: '₹5,20,000' },
  { name: 'Mysore Silk', sales: 28, revenue: '₹3,80,000' },
  { name: 'Chanderi Silk', sales: 18, revenue: '₹2,40,000' },
];

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
              <Button variant="ghost" size="sm" onClick={() => navigate('/bill-history')}>
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentBills.map((bill) => (
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
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alert */}
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
                      Stock: <span className="font-semibold text-warning">{item.stock}</span>
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Min: {item.threshold}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="mt-4 w-full" onClick={() => navigate('/inventory')}>
              View All Stock
            </Button>
          </CardContent>
        </Card>
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
