import React, { useState } from 'react';
import { Search, PlayCircle, Trash2, Clock, ShoppingBag, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

interface HeldBill {
    id: string;
    customerName: string;
    mobile: string;
    timestamp: Date;
    items: number;
    totalAmount: number;
    reason?: string;
}

const mockHeldBills: HeldBill[] = [
    {
        id: 'HB-101',
        customerName: 'Lakshmi Narayanan',
        mobile: '9840012345',
        timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 mins ago
        items: 3,
        totalAmount: 45000,
        reason: 'Checking other colors',
    },
    {
        id: 'HB-102',
        customerName: 'Guest Customer',
        mobile: '',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        items: 1,
        totalAmount: 8500,
        reason: 'Forgot wallet',
    },
    {
        id: 'HB-103',
        customerName: 'Sarah J',
        mobile: '9988776655',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        items: 5,
        totalAmount: 125000,
        reason: 'Pending confirmation',
    },
];

const HoldBill: React.FC = () => {
    const navigate = useNavigate();
    const [heldBills, setHeldBills] = useState<HeldBill[]>(mockHeldBills);
    const [searchTerm, setSearchTerm] = useState('');

    const handleResume = (id: string) => {
        toast.success(`Resuming bill ${id}...`);
        // In a real app, this would load the bill data into the Billing context
        navigate('/billing');
    };

    const handleDelete = (id: string) => {
        setHeldBills(prev => prev.filter(bill => bill.id !== id));
        toast.success(`Held bill ${id} removed.`);
    };

    const filteredBills = heldBills.filter(bill =>
        bill.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bill.mobile.includes(searchTerm) ||
        bill.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight font-display text-primary">Held Bills</h1>
                <p className="text-muted-foreground">Resume or clear suspended transactions.</p>
            </div>

            <div className="flex w-full items-center gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search by name, mobile or ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredBills.map((bill) => (
                    <Card key={bill.id} className="overflow-hidden transition-all hover:shadow-md border-l-4 border-l-orange-500">
                        <CardHeader className="pb-3 bg-muted/20">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        {bill.customerName || 'Walk-in Customer'}
                                    </CardTitle>
                                    <CardDescription className="flex items-center gap-1 text-xs">
                                        <Clock className="h-3 w-3" />
                                        {formatDistanceToNow(bill.timestamp, { addSuffix: true })}
                                    </CardDescription>
                                </div>
                                <Badge variant="outline" className="font-mono bg-background">
                                    {bill.id}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <User className="h-4 w-4" />
                                        <span>{bill.mobile || 'No Mobile'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <ShoppingBag className="h-4 w-4" />
                                        <span>{bill.items} items</span>
                                    </div>
                                </div>

                                {bill.reason && (
                                    <div className="rounded-md bg-yellow-50 p-2 text-xs text-yellow-800 border border-yellow-100">
                                        <span className="font-semibold">Note:</span> {bill.reason}
                                    </div>
                                )}

                                <Separator />

                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-muted-foreground">Total Value</span>
                                    <span className="text-xl font-bold text-primary">₹{bill.totalAmount.toLocaleString()}</span>
                                </div>

                                <div className="flex gap-2 pt-2">
                                    <Button
                                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                                        onClick={() => handleResume(bill.id)}
                                    >
                                        <PlayCircle className="mr-2 h-4 w-4" />
                                        Resume
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="text-destructive hover:bg-destructive hover:text-white border-destructive/20"
                                        onClick={() => handleDelete(bill.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {filteredBills.length === 0 && (
                    <div className="col-span-full py-12 text-center text-muted-foreground border-2 border-dashed rounded-lg">
                        <ShoppingBag className="mx-auto h-12 w-12 opacity-20" />
                        <p className="mt-2 text-lg font-medium">No held bills found</p>
                        <p className="text-sm">Active held bills will appear here.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HoldBill;
