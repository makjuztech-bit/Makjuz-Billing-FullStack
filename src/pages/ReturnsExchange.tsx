import React, { useState, useEffect } from 'react';
import {
    ArrowLeft,
    RotateCcw,
    Search,
    Check,
    AlertTriangle,
    Banknote,
    RefreshCw,
    Scissors,
    Barcode,
    User,
    Calendar,
    Receipt,
    Verified
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';

interface BillItem {
    barcode: string;
    name: string;
    qty: number;
    returnedQty: number;
    sellingPrice: number;
    total: number;
}

interface Bill {
    id: string;
    billNo: string;
    customerName: string;
    customerMobile: string;
    items: BillItem[];
    grandTotal: number;
    date: string;
}

interface ReturnCartItem extends BillItem {
    returnQty: number;
    condition: 'good' | 'damaged' | 'altered';
    isVerified: boolean;
    selected: boolean;
}

const ReturnsExchange: React.FC = () => {
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
    const [returnItems, setReturnItems] = useState<ReturnCartItem[]>([]);
    const [verificationBarcode, setVerificationBarcode] = useState('');
    const [refundMethod, setRefundMethod] = useState<'cash' | 'upi' | 'store_credit'>('cash');
    const [processing, setProcessing] = useState(false);

    const handleSearch = async () => {
        if (!searchQuery) return;
        setIsSearching(true);
        try {
            const res = await fetch(`http://localhost:5000/api/bills/search?query=${searchQuery}`);
            const data = await res.json();

            if (data.length > 0) {
                const bill = data[0]; // Take the most recent/exact match
                setSelectedBill(bill);
                setReturnItems(bill.items.map((item: BillItem) => ({
                    ...item,
                    returnQty: 1,
                    condition: 'good',
                    isVerified: false,
                    selected: false
                })));
                toast.success('Bill found');
            } else {
                toast.error('No bill found with this number or mobile');
            }
        } catch (error) {
            toast.error('Search failed');
        } finally {
            setIsSearching(false);
        }
    };

    const handleVerifyBarcode = () => {
        const item = returnItems.find(i => i.barcode === verificationBarcode);
        if (item) {
            setReturnItems(returnItems.map(i =>
                i.barcode === verificationBarcode
                    ? { ...i, isVerified: true, selected: true }
                    : i
            ));
            setVerificationBarcode('');
            toast.success(`${item.name} verified for return`);
        } else {
            toast.error('This item is not part of the selected bill');
        }
    };

    const toggleSelection = (barcode: string) => {
        setReturnItems(returnItems.map(i =>
            i.barcode === barcode ? { ...i, selected: !i.selected } : i
        ));
    };

    const updateReturnQty = (barcode: string, qty: number) => {
        const item = selectedBill?.items.find(i => i.barcode === barcode);
        if (!item) return;

        const maxProcessable = item.qty - item.returnedQty;
        const validQty = Math.max(1, Math.min(qty, maxProcessable));

        setReturnItems(returnItems.map(i =>
            i.barcode === barcode ? { ...i, returnQty: validQty } : i
        ));
    };

    const calculateRefund = () => {
        return returnItems
            .filter(i => i.selected)
            .reduce((sum, i) => {
                let refund = i.sellingPrice * i.returnQty;
                if (i.condition === 'damaged') refund *= 0.7; // 30% deduction
                if (i.condition === 'altered') refund *= 0.5; // 50% deduction
                return sum + refund;
            }, 0);
    };

    const handleProcessReturn = async () => {
        const itemsToProcess = returnItems.filter(i => i.selected);
        if (itemsToProcess.length === 0) {
            toast.error('Select at least one item to return');
            return;
        }

        const unverified = itemsToProcess.filter(i => !i.isVerified);
        if (unverified.length > 0) {
            toast.error(`Please verify barcode for ${unverified[0].name}`);
            return;
        }

        setProcessing(true);
        try {
            const response = await fetch('http://localhost:5000/api/returns', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    originalBillId: selectedBill?.id,
                    itemsToReturn: itemsToProcess.map(i => ({
                        barcode: i.barcode,
                        qty: i.returnQty,
                        condition: i.condition,
                        refundAmount: i.sellingPrice * i.returnQty // simplified for demo
                    })),
                    totalRefundAmount: calculateRefund(),
                    refundMethod,
                    processedBy: user?.name
                })
            });

            if (response.ok) {
                toast.success('Return processed successfully');
                setSelectedBill(null);
                setReturnItems([]);
                setSearchQuery('');
            } else {
                toast.error('Failed to process return');
            }
        } catch (error) {
            toast.error('Error processing return');
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight font-display text-primary">Sales Return / Exchange</h1>
                    <p className="text-muted-foreground">Search bills and process returns/exchanges securely.</p>
                </div>
                {selectedBill && (
                    <Button variant="outline" onClick={() => setSelectedBill(null)}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Reset Search
                    </Button>
                )}
            </div>

            {!selectedBill ? (
                <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Search className="h-5 w-5 text-primary" /> Find Original Bill
                        </CardTitle>
                        <CardDescription>Enter Bill Number or Customer Mobile Number to load purchase history.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="INV-2024-0001 or 9876543210"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9 h-12 text-lg"
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                />
                            </div>
                            <Button onClick={handleSearch} disabled={isSearching} size="lg" className="h-12 px-8">
                                {isSearching ? 'Searching...' : 'Find Bill'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Bill Info Summary */}
                        <Card className="md:col-span-1 border-0 shadow-md">
                            <CardHeader className="pb-3 text-primary bg-primary/5">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Receipt className="h-5 w-5" /> Bill Summary
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4 space-y-4">
                                <div className="space-y-1">
                                    <Label className="text-muted-foreground">Bill No</Label>
                                    <p className="font-bold text-lg">{selectedBill.billNo}</p>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-muted-foreground">Customer</Label>
                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4" />
                                        <span className="font-medium">{selectedBill.customerName}</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground ml-6">{selectedBill.customerMobile}</p>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-muted-foreground">Bill Date</Label>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        <span className="font-medium">{selectedBill.date}</span>
                                    </div>
                                </div>
                                <Separator />
                                <div className="flex justify-between items-center text-primary">
                                    <span className="font-medium">Total Value</span>
                                    <span className="text-xl font-bold">₹{selectedBill.grandTotal.toLocaleString()}</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Barcode Verification */}
                        <Card className="md:col-span-2 border-0 shadow-md border-2 border-primary/20">
                            <CardHeader className="pb-3 flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Barcode className="h-5 w-5 text-primary" /> Verify Product
                                    </CardTitle>
                                    <CardDescription>Scan product barcode to confirm match with original bill.</CardDescription>
                                </div>
                                <Verified className={`h-8 w-8 ${verificationBarcode ? 'text-primary animate-pulse' : 'text-muted/30'}`} />
                            </CardHeader>
                            <CardContent>
                                <div className="flex gap-4">
                                    <Input
                                        placeholder="Scan item barcode here..."
                                        value={verificationBarcode}
                                        onChange={(e) => setVerificationBarcode(e.target.value)}
                                        className="h-14 text-xl font-mono text-center tracking-widest border-2 border-primary"
                                        onKeyPress={(e) => e.key === 'Enter' && handleVerifyBarcode()}
                                        autoFocus
                                    />
                                    <Button onClick={handleVerifyBarcode} size="lg" className="h-14">Verify Item</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Items List */}
                    <Card className="border-0 shadow-lg overflow-hidden">
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead className="w-[80px]">Return</TableHead>
                                <TableHead>Product</TableHead>
                                <TableHead>Original Qty</TableHead>
                                <TableHead>Returned</TableHead>
                                <TableHead>Return Qty</TableHead>
                                <TableHead>Condition</TableHead>
                                <TableHead className="text-right">Price</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {returnItems.map((item) => (
                                <TableRow key={item.barcode} className={item.selected ? 'bg-primary/5 transition-colors' : ''}>
                                    <TableCell>
                                        <div className="flex items-center justify-center">
                                            {item.isVerified ? (
                                                <Badge className="h-6 w-6 rounded-full p-0 flex items-center justify-center bg-green-500 hover:bg-green-600 text-white border-0">
                                                    <Check className="h-4 w-4" />
                                                </Badge>
                                            ) : (
                                                <input
                                                    type="checkbox"
                                                    checked={item.selected}
                                                    onChange={() => toggleSelection(item.barcode)}
                                                    className="accent-primary h-5 w-5 rounded border-gray-300"
                                                />
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-bold flex items-center gap-1">
                                                {item.name}
                                                {item.isVerified && <Verified className="h-3 w-3 text-primary" />}
                                            </span>
                                            <span className="text-xs font-mono text-muted-foreground">{item.barcode}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium">{item.qty}</TableCell>
                                    <TableCell>
                                        <Badge variant={item.returnedQty > 0 ? 'destructive' : 'outline'}>
                                            {item.returnedQty}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Input
                                            type="number"
                                            value={item.returnQty}
                                            onChange={(e) => updateReturnQty(item.barcode, parseInt(e.target.value))}
                                            className="w-20 h-8"
                                            disabled={!item.selected}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Select
                                            value={item.condition}
                                            onValueChange={(v: any) => setReturnItems(returnItems.map(i => i.barcode === item.barcode ? { ...i, condition: v } : i))}
                                            disabled={!item.selected}
                                        >
                                            <SelectTrigger className="h-8 w-[140px]">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="good">Good (Salable)</SelectItem>
                                                <SelectItem value="damaged">Damaged (30% off)</SelectItem>
                                                <SelectItem value="altered">Altered (50% off)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell className="text-right font-bold text-lg">₹{item.sellingPrice.toLocaleString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Card>

                    {/* Refund Footer */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                        <Card className="border-0 shadow-md">
                            <CardHeader>
                                <CardTitle className="text-lg">Refund Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Refund Method</Label>
                                    <RadioGroup value={refundMethod} onValueChange={(v: any) => setRefundMethod(v)} className="flex gap-4">
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="cash" id="cash" />
                                            <Label htmlFor="cash">Cash</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="upi" id="upi" />
                                            <Label htmlFor="upi">UPI</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="store_credit" id="credit" />
                                            <Label htmlFor="credit">Store Credit</Label>
                                        </div>
                                    </RadioGroup>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="bg-primary p-6 rounded-2xl shadow-xl text-primary-foreground flex flex-col items-end gap-2">
                            <span className="text-primary-foreground/80 font-medium">Estimated Refund Amount</span>
                            <div className="text-4xl font-black">₹{calculateRefund().toLocaleString()}</div>
                            <Button
                                size="lg"
                                className="w-full mt-4 bg-white text-primary hover:bg-white/90 font-bold h-14 text-xl"
                                onClick={handleProcessReturn}
                                disabled={processing || calculateRefund() <= 0}
                            >
                                {processing ? 'Processing...' : 'Process Return & Re-Stock'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReturnsExchange;
