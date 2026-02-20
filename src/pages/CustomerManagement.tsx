import React, { useState, useEffect } from 'react';
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
    Download,
    Plus,
    Edit
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { API_URL } from '@/lib/config';

interface Customer {
    id: string; // _id from backend mapped to id
    name: string;
    mobile: string;
    place: string;
    type: string;
    totalPurchase: number; // Derived/Enriched
    billsCount: number;    // Derived/Enriched
    pendingDue: number;    // Derived/Enriched
    lastPurchase: string;  // Derived/Enriched
}

const CustomerManagement: React.FC = () => {
    const navigate = useNavigate();
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [newCustomer, setNewCustomer] = useState({
        name: '',
        mobile: '',
        place: '',
        type: 'Retail'
    });
    const [editingId, setEditingId] = useState<string | null>(null);

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/customers`);
            if (response.ok) {
                const data = await response.json();
                setCustomers(data);
            } else {
                toast.error('Failed to fetch customers');
            }
        } catch (error) {
            console.error('Error fetching customers:', error);
            toast.error('Error fetching customers');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveCustomer = async () => {
        if (!newCustomer.name || !newCustomer.mobile) {
            toast.error('Name and Mobile are required');
            return;
        }

        try {
            const url = editingId
                ? `${API_URL}/customers/${editingId}`
                : `${API_URL}/customers`;

            const method = editingId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newCustomer)
            });

            if (response.ok) {
                toast.success(`Customer ${editingId ? 'updated' : 'added'} successfully`);
                setIsAddOpen(false);
                resetForm();
                fetchCustomers();
            } else {
                toast.error(`Failed to ${editingId ? 'update' : 'add'} customer`);
            }
        } catch (error) {
            toast.error('Error saving customer');
        }
    };

    const resetForm = () => {
        setNewCustomer({ name: '', mobile: '', place: '', type: 'Retail' });
        setEditingId(null);
    };

    const handleEdit = (customer: Customer) => {
        setNewCustomer({
            name: customer.name,
            mobile: customer.mobile,
            place: customer.place || '',
            type: customer.type || 'Retail'
        });
        setEditingId(customer.id);
        setIsAddOpen(true);
    };

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
        (c.place && c.place.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const totalDue = customers.reduce((acc, curr) => acc + (curr.pendingDue || 0), 0);

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight font-display text-primary">Customers</h1>
                    <p className="text-muted-foreground">Manage customer profiles, history and dues.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={() => navigate('/billing')}>
                        <Plus className="mr-2 h-4 w-4" />
                        New Bill
                    </Button>
                    <Dialog
                        open={isAddOpen}
                        onOpenChange={(open) => {
                            setIsAddOpen(open);
                            if (!open) resetForm();
                        }}
                    >
                        <DialogTrigger asChild>
                            <Button className="w-full md:w-auto" onClick={() => resetForm()}>
                                <UserPlus className="mr-2 h-4 w-4" />
                                Add Customer
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{editingId ? 'Edit Customer' : 'Add New Customer'}</DialogTitle>
                                <DialogDescription>
                                    {editingId ? 'Update details below.' : 'Enter customer details to create a profile.'}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input
                                        id="name"
                                        placeholder="Enter name"
                                        value={newCustomer.name}
                                        onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="mobile">Mobile Number</Label>
                                    <Input
                                        id="mobile"
                                        placeholder="10-digit mobile"
                                        value={newCustomer.mobile}
                                        onChange={(e) => setNewCustomer({ ...newCustomer, mobile: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="place">Place / City</Label>
                                    <Input
                                        id="place"
                                        placeholder="City name"
                                        value={newCustomer.place}
                                        onChange={(e) => setNewCustomer({ ...newCustomer, place: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Customer Type</Label>
                                    <Select
                                        value={newCustomer.type}
                                        onValueChange={(val) => setNewCustomer({ ...newCustomer, type: val })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Retail">Retail</SelectItem>
                                            <SelectItem value="Wholesale">Wholesale</SelectItem>
                                            <SelectItem value="VIP">VIP</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                                <Button onClick={handleSaveCustomer}>{editingId ? 'Update' : 'Save'} Customer</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
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
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8">Loading...</TableCell>
                                    </TableRow>
                                ) : filteredCustomers.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8">No customers found</TableCell>
                                    </TableRow>
                                ) : (
                                    filteredCustomers.map((customer) => (
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
                                                    <MapPin className="h-3 w-3" /> {customer.place || 'N/A'}
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                <Badge variant={customer.type === 'VIP' ? 'default' : 'secondary'} className="text-xs">
                                                    {customer.type}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex flex-col items-end">
                                                    <span className="font-semibold">₹{(customer.totalPurchase || 0).toLocaleString()}</span>
                                                    <span className="text-xs text-muted-foreground">{customer.billsCount || 0} Bills</span>
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
                                                        <DropdownMenuItem onClick={() => handleEdit(customer)}>
                                                            <Edit className="mr-2 h-4 w-4" /> Edit Details
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
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Quick Stats Panel */}
                <div className="flex flex-col gap-4">
                    <Card className="border-0 shadow-sm bg-primary text-primary-foreground">
                        <CardHeader className="pb-2">
                            <CardDescription className="text-primary-foreground/80">Total Outstanding Due</CardDescription>
                            <CardTitle className="text-3xl">₹{totalDue.toLocaleString()}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm opacity-80">
                                Across {customers.length} customers
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg">Top Customers</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            {[...customers]
                                .sort((a, b) => b.totalPurchase - a.totalPurchase)
                                .slice(0, 3)
                                .map((c, i) => (
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
