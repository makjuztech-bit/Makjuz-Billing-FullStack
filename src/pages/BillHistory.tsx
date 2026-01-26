import React, { useState } from 'react';
import {
  Search,
  Filter,
  Printer,
  Download,
  MessageSquare,
  Ban,
  Eye,
  Calendar as CalendarIcon,
  CreditCard,
  User,
  MoreHorizontal
} from 'lucide-react';
import { format } from 'date-fns';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'; // Assuming these exist or will use simple input for date
import { Calendar } from '@/components/ui/calendar'; // Assuming shadcn calendar
import { toast } from 'sonner';

// Mock Data
interface BillRecord {
  billNo: string;
  date: string;
  customerName: string;
  mobile: string;
  amount: number;
  paymentMode: 'Cash' | 'UPI' | 'Card' | 'Split';
  status: 'Completed' | 'Cancelled' | 'Held';
  salesman: string;
  itemCount: number;
}

const initialBills: BillRecord[] = [
  {
    billNo: 'SILK-001',
    date: '2024-03-10T10:30:00',
    customerName: 'Priya Mahalakshmi',
    mobile: '9876543210',
    amount: 25750,
    paymentMode: 'Card',
    status: 'Completed',
    salesman: 'Ramesh',
    itemCount: 3,
  },
  {
    billNo: 'SILK-002',
    date: '2024-03-10T11:15:00',
    customerName: 'Karthik Raja',
    mobile: '9988776655',
    amount: 4500,
    paymentMode: 'UPI',
    status: 'Completed',
    salesman: 'Suresh',
    itemCount: 1,
  },
  {
    billNo: 'SILK-003',
    date: '2024-03-10T12:00:00',
    customerName: 'Unknown',
    mobile: '-',
    amount: 1200,
    paymentMode: 'Cash',
    status: 'Cancelled',
    salesman: 'Ramesh',
    itemCount: 1,
  },
  {
    billNo: 'SILK-004',
    date: '2024-03-10T12:45:00',
    customerName: 'Anitha S',
    mobile: '8877665544',
    amount: 15600,
    paymentMode: 'Split',
    status: 'Completed',
    salesman: 'Meena',
    itemCount: 2,
  },
];

const BillHistory: React.FC = () => {
  const { t } = useLanguage();
  const [bills, setBills] = useState<BillRecord[]>(initialBills);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPayment, setFilterPayment] = useState<string>('all');

  const handleReprint = (billNo: string, type: 'thermal' | 'a4') => {
    toast.info(`Printing Bill ${billNo} in ${type.toUpperCase()} format...`);
  };

  const handleWhatsApp = (billNo: string, mobile: string) => {
    if (mobile === '-' || mobile.length < 10) {
      toast.error('Invalid mobile number for this bill');
      return;
    }
    toast.success(`Invoice ${billNo} sent to ${mobile} via WhatsApp!`);
  };

  const handleDownload = (billNo: string) => {
    toast.success(`Downloading PDF for ${billNo}...`);
  };

  const handleCancel = (billNo: string) => {
    // In real app, check permissions and ask for reason
    toast.warning(`Bill ${billNo} cancellation request sent to Admin`);
  };

  const filteredBills = bills.filter(bill => {
    const matchesSearch = 
      bill.billNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.mobile.includes(searchTerm);
    
    const matchesStatus = filterStatus === 'all' || bill.status.toLowerCase() === filterStatus.toLowerCase();
    const matchesPayment = filterPayment === 'all' || bill.paymentMode.toLowerCase() === filterPayment.toLowerCase();

    return matchesSearch && matchesStatus && matchesPayment;
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-display text-primary">Bill History</h1>
          <p className="text-muted-foreground">Manage and track past transactions</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Excel
          </Button>
          <Button variant="default">
            <Printer className="mr-2 h-4 w-4" />
            Day Report
          </Button>
        </div>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle>Transactions</CardTitle>
          <CardDescription>
            List of all bills generated. Use filters to find specific transactions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end">
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by Bill No, Name, Mobile..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            
            <div className="w-full md:w-48 space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="held">Held</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-full md:w-48 space-y-2">
              <label className="text-sm font-medium">Payment Mode</label>
              <Select value={filterPayment} onValueChange={setFilterPayment}>
                <SelectTrigger>
                  <SelectValue placeholder="All Modes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Modes</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="upi">UPI</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="split">Split</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-full md:w-auto">
              <Button variant="secondary" className="w-full md:w-auto">
                <Filter className="mr-2 h-4 w-4" />
                More Filters
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[120px]">Bill No</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Mode</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBills.map((bill) => (
                  <TableRow key={bill.billNo} className="hover:bg-muted/5">
                    <TableCell className="font-mono font-medium">{bill.billNo}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(bill.date).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{bill.customerName}</span>
                        <span className="text-xs text-muted-foreground">{bill.mobile}</span>
                      </div>
                    </TableCell>
                    <TableCell>{bill.itemCount}</TableCell>
                    <TableCell className="font-semibold text-primary">
                      ₹{bill.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="flex w-fit items-center gap-1">
                        {bill.paymentMode === 'Card' && <CreditCard className="h-3 w-3" />}
                        {bill.paymentMode}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          bill.status === 'Completed'
                            ? 'default' // Changed from 'success' as it might not be in theme
                            : bill.status === 'Cancelled'
                            ? 'destructive'
                            : 'secondary'
                        }
                        className={
                          bill.status === 'Completed' ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''
                        }
                      >
                        {bill.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => {}}>
                            <Eye className="mr-2 h-4 w-4" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleReprint(bill.billNo, 'thermal')}>
                            <Printer className="mr-2 h-4 w-4" /> Reprint Thermal
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleReprint(bill.billNo, 'a4')}>
                            <Printer className="mr-2 h-4 w-4" /> Reprint A4
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDownload(bill.billNo)}>
                            <Download className="mr-2 h-4 w-4" /> Save PDF
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleWhatsApp(bill.billNo, bill.mobile)}>
                            <MessageSquare className="mr-2 h-4 w-4" /> Send WhatsApp
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {bill.status !== 'Cancelled' && (
                            <DropdownMenuItem 
                              className="text-destructive focus:text-destructive"
                              onClick={() => handleCancel(bill.billNo)}
                            >
                              <Ban className="mr-2 h-4 w-4" /> Cancel Bill
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredBills.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      No bills found matching your filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BillHistory;
