import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Receipt,
  History,
  PauseCircle,
  Users,
  Package,
  Warehouse,
  Settings2,
  ShoppingCart,
  Truck,
  RotateCcw,
  ArrowLeftRight,
  Scissors,
  CalendarCheck,
  CreditCard,
  DollarSign,
  UserCog,
  BarChart3,
  FileText,
  MessageSquare,
  Settings,
  Shield,
  Database,
  Palette,
  ChevronDown,
  Store,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface NavItem {
  title: string;
  titleKey: string;
  url: string;
  icon: React.ElementType;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    label: 'Main',
    items: [
      { title: 'Dashboard', titleKey: 'nav.dashboard', url: '/dashboard', icon: LayoutDashboard },
      { title: 'New Bill', titleKey: 'nav.billing', url: '/billing', icon: Receipt },
      { title: 'Bill History', titleKey: 'nav.billHistory', url: '/bill-history', icon: History },
      { title: 'Hold Bills', titleKey: 'nav.holdBills', url: '/hold-bills', icon: PauseCircle },
    ],
  },
  {
    label: 'Customers',
    items: [
      { title: 'Customers', titleKey: 'nav.customers', url: '/customers', icon: Users },
      { title: 'Due/Credit', titleKey: 'nav.dues', url: '/dues', icon: CreditCard },
    ],
  },
  {
    label: 'Inventory',
    items: [
      { title: 'Saree Master', titleKey: 'nav.products', url: '/products', icon: Package },
      { title: 'Stock List', titleKey: 'nav.inventory', url: '/inventory', icon: Warehouse },
      { title: 'Stock Adjustment', titleKey: 'nav.stockAdjust', url: '/stock-adjustment', icon: Settings2 },
    ],
  },
  {
    label: 'Purchase',
    items: [
      { title: 'Purchase Entry', titleKey: 'nav.purchase', url: '/purchase', icon: ShoppingCart },
      { title: 'Suppliers', titleKey: 'nav.suppliers', url: '/suppliers', icon: Truck },
      { title: 'Purchase Return', titleKey: 'nav.purchaseReturn', url: '/purchase-return', icon: RotateCcw },
    ],
  },
  {
    label: 'Sales',
    items: [
      { title: 'Returns/Exchange', titleKey: 'nav.returns', url: '/returns', icon: ArrowLeftRight },
      { title: 'Alterations', titleKey: 'nav.alterations', url: '/alterations', icon: Scissors },
      { title: 'Order Booking', titleKey: 'nav.orders', url: '/orders', icon: CalendarCheck },
    ],
  },
  {
    label: 'Finance',
    items: [
      { title: 'Expenses', titleKey: 'nav.expenses', url: '/expenses', icon: DollarSign },
      { title: 'Staff & Commission', titleKey: 'nav.staff', url: '/staff', icon: UserCog },
    ],
  },
  {
    label: 'Reports',
    items: [
      { title: 'Reports', titleKey: 'nav.reports', url: '/reports', icon: BarChart3 },
      { title: 'GST Reports', titleKey: 'nav.gstReports', url: '/gst-reports', icon: FileText },
    ],
  },
  {
    label: 'Settings',
    items: [
      { title: 'WhatsApp', titleKey: 'nav.whatsapp', url: '/whatsapp', icon: MessageSquare },
      { title: 'Settings', titleKey: 'nav.settings', url: '/settings', icon: Settings },
      { title: 'Users & Roles', titleKey: 'nav.users', url: '/users', icon: Shield },
      { title: 'Backup', titleKey: 'nav.backup', url: '/backup', icon: Database },
      { title: 'Customization', titleKey: 'nav.customize', url: '/customize', icon: Palette },
    ],
  },
];

export const AppSidebar: React.FC = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';

  const isActive = (url: string) => location.pathname === url;

  return (
    <Sidebar className="border-r-0">
      <SidebarHeader className="border-b border-sidebar-border px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sidebar-primary">
            <Store className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-display text-lg font-semibold text-sidebar-foreground">
                Silk Saree
              </span>
              <span className="text-xs text-sidebar-foreground/70">POS System</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-2">
        {navGroups.map((group) => (
          <Collapsible key={group.label} defaultOpen className="group/collapsible">
            <SidebarGroup>
              <CollapsibleTrigger asChild>
                <SidebarGroupLabel className="flex cursor-pointer items-center justify-between px-2 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50 hover:text-sidebar-foreground/70">
                  {!collapsed && group.label}
                  {!collapsed && (
                    <ChevronDown className="h-3 w-3 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                  )}
                </SidebarGroupLabel>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.items.map((item) => (
                      <SidebarMenuItem key={item.url}>
                        <SidebarMenuButton
                          asChild
                          isActive={isActive(item.url)}
                          tooltip={collapsed ? t(item.titleKey) : undefined}
                        >
                          <NavLink
                            to={item.url}
                            className={cn(
                              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                              isActive(item.url)
                                ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                                : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                            )}
                          >
                            <item.icon className="h-4 w-4 shrink-0" />
                            {!collapsed && <span>{t(item.titleKey)}</span>}
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        ))}
      </SidebarContent>
    </Sidebar>
  );
};
