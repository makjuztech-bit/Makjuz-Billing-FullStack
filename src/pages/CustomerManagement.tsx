import React, { useState } from 'react';
import {
    Search,
    UserPlus,
    Filter,
    MoreHorizontal,
    Phone,
    MapPin,
    FileText,
    MessageSquare,
    Wallet,
    Download
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { toast } from 'sonner';

interface Customer {
    id: string;
    name: string;
    mobile: string;
    place: string;
    type: 'Retail' | 'Wholesale' | 'VIP';
    totalPurchase: number;
    billsCount: number;
    pendingDue: number;
    lastPurchase: string;
}

const mockCustomers: Customer[] = [
    {
        id: 'CUST-001',
        name: 'Priya Mahalakshmi',
        mobile: '9876543210',
        place: 'Kanchipuram',
        type: 'VIP',
        totalPurchase: 156000,
        billsCount: 12,
        pendingDue: 0,
        lastPurchase: '2024-03-10',
    },
    {
        id: 'CUST-002',
        name: 'Lakshmi Silks & Sarees',
        mobile: '9988776655',
        place: 'Chennai',
        type: 'Wholesale',
        totalPurchase: 850000,
        billsCount: 5,
        pendingDue: 45000,
        lastPurchase: '2024-03-05',
    },
    {
        id: 'CUST-003',
        name: 'Anitha S',
        mobile: '8877665544',
        place: 'Vellore',
        type: 'Retail',
        totalPurchase: 25000,
        billsCount: 3,
        pendingDue: 0,
        lastPurchase: '2024-02-28',
    },
    {
        id: 'CUST-004',
        name: 'Ravi Kumar',
        mobile: '7766554433',
        place: 'Kanchipuram',
        type: 'Retail',
        totalPurchase: 12500,
        billsCount: 1,
        pendingDue: 500,
        lastPurchase: '2024-03-01',
    },
];

const CustomerManagement: React.FC = () => {
    const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
    const [searchTerm, setSearchTerm] = useState('');

    const handleSendOffer = (mobile: string) => {
        toast.success(`Offer sent to ${mobile} via WhatsApp`);
    };

    const handlePayment = (name: string) => {
        toast.info(`Opening payment collection for ${name}`);
    };

    const handleDownloadLedger = (name: string) => {
        toast.success(`Downloading ledger for ${name}`);
    };

    const filteredCustomers = customers.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.mobile.includes(searchTerm) ||
        c.place.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight font-display text-primary">Customers</h1>
                    <p className="text-muted-foreground">Manage customer profiles, history and dues.</p>
                </div>
                <Button className="w-full md:w-auto">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add Customer
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-[1fr_300px]">
                {/* Main List */}
                <Card className="border-0 shadow-sm flex-1">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle>Customer Directory</CardTitle>
                            <div className="flex items-center gap-2">
                                <div className="relative w-full md:w-64">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        placeholder="Search customers..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-9 h-9"
                                    />
                                </div>
                                <Button variant="outline" size="icon" className="h-9 w-9">
                                    <Filter className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50">
                                    <TableHead>Customer</TableHead>
                                    <TableHead className="hidden md:table-cell">Place</TableHead>
                                    <TableHead className="hidden md:table-cell">Type</TableHead>
                                    <TableHead className="text-right">Purchases</TableHead>
                                    <TableHead className="text-right">Due</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredCustomers.map((customer) => (
                                    <TableRow key={customer.id} className="hover:bg-muted/5">
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-9 w-9 border">
                                                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${customer.name}`} />
                                                    <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-sm">{customer.name}</span>
                                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                        <Phone className="h-3 w-3" /> {customer.mobile}
                                                    </span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <MapPin className="h-3 w-3" /> {customer.place}
                                            </div>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            <Badge variant={customer.type === 'VIP' ? 'default' : 'secondary'} className="text-xs">
                                                {customer.type}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex flex-col items-end">
                                                <span className="font-semibold">₹{customer.totalPurchase.toLocaleString()}</span>
                                                <span className="text-xs text-muted-foreground">{customer.billsCount} Bills</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {customer.pendingDue > 0 ? (
                                                <span className="font-bold text-destructive">₹{customer.pendingDue.toLocaleString()}</span>
                                            ) : (
                                                <span className="text-muted-foreground">-</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem>
                                                        <FileText className="mr-2 h-4 w-4" /> View History
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleSendOffer(customer.mobile)}>
                                                        <MessageSquare className="mr-2 h-4 w-4" /> Send Offer
                                                    </DropdownMenuItem>
                                                    {customer.pendingDue > 0 && (
                                                        <DropdownMenuItem onClick={() => handlePayment(customer.name)}>
                                                            <Wallet className="mr-2 h-4 w-4" /> Collect Payment
                                                        </DropdownMenuItem>
                                                    )}
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onClick={() => handleDownloadLedger(customer.name)}>
                                                        <Download className="mr-2 h-4 w-4" /> Export Ledger
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Quick Stats Panel */}
                <div className="flex flex-col gap-4">
                    <Card className="border-0 shadow-sm bg-primary text-primary-foreground">
                        <CardHeader className="pb-2">
                            <CardDescription className="text-primary-foreground/80">Total Outstanding Due</CardDescription>
                            <CardTitle className="text-3xl">₹1,24,500</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm opacity-80">
                                Across 15 customers
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg">Top Customers</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            {mockCustomers.slice(0, 3).map((c, i) => (
                                <div key={c.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted font-bold text-xs">
                                            {i + 1}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium leading-none">{c.name}</p>
                                            <p className="text-xs text-muted-foreground">₹{c.totalPurchase.toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default CustomerManagement;
