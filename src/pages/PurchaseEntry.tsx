import React, { useState } from 'react';
import {
    Barcode,
    Search,
    Plus,
    Trash2,
    Save,
    Printer,
    Truck,
    CalendarIcon
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useData } from '@/contexts/DataContext';
import { PurchaseItem, Purchase } from '@/types';
import { useEffect } from 'react';
import { API_URL } from '@/lib/config';
import { toast } from 'sonner';

const PurchaseEntry: React.FC = () => {
    const { suppliers, sarees, addPurchase } = useData();
    const [items, setItems] = useState<PurchaseItem[]>([]);
    const [supplier, setSupplier] = useState('');
    const [billNo, setBillNo] = useState('');
    const [purchaseType, setPurchaseType] = useState('gst');
    const [billDate, setBillDate] = useState(new Date().toISOString().split('T')[0]);

    // Item Entry State
    const [barcode, setBarcode] = useState('');
    const [itemName, setItemName] = useState('');
    const [category, setCategory] = useState('');
    const [qty, setQty] = useState(1);
    const [costPrice, setCostPrice] = useState(0);
    const [mrp, setMrp] = useState(0);
    const [sellingPrice, setSellingPrice] = useState(0);

    // Auto-fill on barcode match
    useEffect(() => {
        if (barcode) {
            const found = sarees.find(s => s.barcode === barcode || s.sareeCode === barcode);
            if (found) {
                setItemName(found.name);
                setCategory(found.category);
                setCostPrice(found.purchasePrice);
                setMrp(found.mrp);
                setSellingPrice(found.sellingPrice);
            }
        }
    }, [barcode, sarees]);

    const handleAddItem = () => {
        if (!itemName || costPrice <= 0) {
            toast.error('Please enter valid product details');
            return;
        }

        const newItem: PurchaseItem = {
            id: Math.random().toString(36).substr(2, 9),
            barcode: barcode || `GEN-${Date.now().toString().slice(-6)}`,
            name: itemName,
            category,
            qty,
            costPrice,
            mrp,
            sellingPrice,
            totalCost: qty * costPrice,
        };

        setItems([...items, newItem]);
        resetEntryForm();
        toast.success('Item added to purchase list');
    };

    const resetEntryForm = () => {
        setBarcode('');
        setItemName('');
        setCategory('');
        setQty(1);
        setCostPrice(0);
        setMrp(0);
        setSellingPrice(0);
    };

    const handleRemoveItem = (id: string) => {
        setItems(items.filter((i) => i.id !== id));
    };

    const [paidAmount, setPaidAmount] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState('Cash');
    const [purchaseHistory, setPurchaseHistory] = useState<any[]>([]);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Filter/Search History
    const [historySearch, setHistorySearch] = useState('');

    // Fetch history
    const fetchHistory = async () => {
        setIsRefreshing(true);
        try {
            const res = await fetch(`${API_URL}/purchases`);
            const data = await res.json();
            setPurchaseHistory(data);
        } catch (error) {
            toast.error('Failed to load purchase history');
        } finally {
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const handleSavePurchase = async () => {
        if (items.length === 0 || !supplier || !billNo) {
            toast.error('Please fill all bill details and add items');
            return;
        }

        const supplierObj = suppliers.find(s => s.id === supplier);

        const newPurchase = {
            billNo,
            date: billDate,
            supplierId: supplier,
            supplierName: supplierObj?.name || 'Unknown',
            items,
            totalAmount: items.reduce((sum, item) => sum + (item.totalCost || 0), 0),
            paidAmount: paidAmount,
            paymentMethod: paymentMethod,
            purchaseType: purchaseType as 'gst' | 'nongst'
        };

        try {
            const res = await fetch(`${API_URL}/purchases`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newPurchase)
            });

            if (res.ok) {
                toast.success('Purchase entry saved successfully!');
                setItems([]);
                setSupplier('');
                setBillNo('');
                setPaidAmount(0);
                fetchHistory(); // Refresh history
            } else {
                toast.error('Failed to save purchase');
            }
        } catch (error) {
            toast.error('Network error while saving');
        }
    };

    const handleUpdatePayment = async (purchaseId: string, amount: number, method: string) => {
        try {
            const res = await fetch(`${API_URL}/purchases/${purchaseId}/payment`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount, method })
            });

            if (res.ok) {
                toast.success('Payment updated successfully');
                fetchHistory();
            } else {
                toast.error('Failed to update payment');
            }
        } catch (error) {
            toast.error('Error updating payment');
        }
    };

    const totalAmount = items.reduce((sum, item) => sum + (item.totalCost || 0), 0);

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight font-display text-primary">Purchase Entry</h1>
                <p className="text-muted-foreground">Manage inward stock and supplier payments.</p>
            </div>

            <Tabs defaultValue="new" className="w-full">
                <TabsList className="mb-4">
                    <TabsTrigger value="new">New Purchase</TabsTrigger>
                    <TabsTrigger value="history" onClick={fetchHistory}>Purchase History / Credit Pay</TabsTrigger>
                </TabsList>

                <TabsContent value="new">
                    <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
                        <div className="space-y-6">
                            {/* Supplier & Bill Details */}
                            <Card className="border-0 shadow-sm">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Truck className="h-5 w-5" /> Supplier Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <div className="space-y-2">
                                            <Label>Supplier Name</Label>
                                            <Select value={supplier} onValueChange={setSupplier}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Supplier" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {suppliers.map(s => (
                                                        <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Bill Number</Label>
                                            <Input
                                                placeholder="Enter Invoice No"
                                                value={billNo}
                                                onChange={(e) => setBillNo(e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Bill Date</Label>
                                            <div className="relative">
                                                <CalendarIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                                <Input type="date" className="pl-9" value={billDate} onChange={e => setBillDate(e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Purchase Type</Label>
                                            <Select value={purchaseType} onValueChange={setPurchaseType}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="gst">GST Purchase</SelectItem>
                                                    <SelectItem value="nongst">Non-GST / Cash</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Item Entry */}
                            <Card className="border-0 shadow-sm">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Plus className="h-5 w-5" /> Add Products
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 items-end">
                                        <div className="space-y-2">
                                            <Label>Product Code / Barcode</Label>
                                            <div className="relative">
                                                <Barcode className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                                <Input
                                                    placeholder="Enter Product Code"
                                                    value={barcode}
                                                    onChange={(e) => setBarcode(e.target.value)}
                                                    className="pl-9"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2 md:col-span-2 lg:col-span-3">
                                            <Label>Product Name</Label>
                                            <Input
                                                placeholder="Enter jewel name / description"
                                                value={itemName}
                                                onChange={(e) => setItemName(e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Category</Label>
                                            <Select value={category} onValueChange={setCategory}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Category" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Gold">Gold</SelectItem>
                                                    <SelectItem value="Diamond">Diamond</SelectItem>
                                                    <SelectItem value="Silver">Silver</SelectItem>
                                                    <SelectItem value="Stone">Stone</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Cost Price</Label>
                                            <Input
                                                type="number"
                                                placeholder="0.00"
                                                value={costPrice}
                                                onChange={(e) => setCostPrice(Number(e.target.value))}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>MRP</Label>
                                            <Input
                                                type="number"
                                                placeholder="0.00"
                                                value={mrp}
                                                onChange={(e) => setMrp(Number(e.target.value))}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Selling Price</Label>
                                            <Input
                                                type="number"
                                                placeholder="0.00"
                                                value={sellingPrice}
                                                onChange={(e) => setSellingPrice(Number(e.target.value))}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Qty</Label>
                                            <Input
                                                type="number"
                                                value={qty}
                                                onChange={(e) => setQty(Number(e.target.value))}
                                            />
                                        </div>
                                        <div className="space-y-2 md:col-span-2 lg:col-span-1">
                                            <Button onClick={handleAddItem} className="w-full">
                                                Add to List
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Items Table */}
                            <Card className="border-0 shadow-sm">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-lg">Items List</CardTitle>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-muted/50">
                                                <TableHead>Product Code</TableHead>
                                                <TableHead>Item</TableHead>
                                                <TableHead className="text-right">Cost</TableHead>
                                                <TableHead className="text-right">Selling</TableHead>
                                                <TableHead className="text-center">Qty</TableHead>
                                                <TableHead className="text-right">Total Cost</TableHead>
                                                <TableHead className="w-[50px]"></TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {items.map((item) => (
                                                <TableRow key={item.id}>
                                                    <TableCell className="font-mono text-xs">{item.barcode}</TableCell>
                                                    <TableCell>
                                                        <div className="flex flex-col">
                                                            <span className="font-medium">{item.name}</span>
                                                            <span className="text-xs text-muted-foreground">{item.category}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right">₹{item.costPrice.toLocaleString()}</TableCell>
                                                    <TableCell className="text-right">₹{item.sellingPrice.toLocaleString()}</TableCell>
                                                    <TableCell className="text-center">{item.qty}</TableCell>
                                                    <TableCell className="text-right font-semibold">₹{item.totalCost.toLocaleString()}</TableCell>
                                                    <TableCell>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                                            onClick={() => handleRemoveItem(item.id)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                            {items.length === 0 && (
                                                <TableRow>
                                                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                                                        No items added yet.
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Summary Panel */}
                        <div className="space-y-6">
                            <Card className="border-0 shadow-sm sticky top-20">
                                <CardHeader>
                                    <CardTitle>Purchase Summary</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Total Qty</span>
                                            <span className="font-medium">{items.reduce((sum, i) => sum + i.qty, 0)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Total Amount</span>
                                            <span className="font-bold">₹{(totalAmount || 0).toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <Separator />
                                    <div className="space-y-3">
                                        <Label className="text-primary font-semibold">Payment Details</Label>
                                        <div className="space-y-1">
                                            <Label className="text-xs">Initial Paid Amount</Label>
                                            <Input
                                                type="number"
                                                value={paidAmount}
                                                onChange={e => setPaidAmount(Number(e.target.value))}
                                                placeholder="Enter amount paid"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs">Payment Method</Label>
                                            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Cash">Cash</SelectItem>
                                                    <SelectItem value="UPI">UPI / Digital</SelectItem>
                                                    <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="flex justify-between items-center pt-2">
                                            <span className="text-sm font-medium">Due Balance:</span>
                                            <span className="text-lg font-bold text-destructive">₹{(totalAmount - paidAmount).toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <div className="pt-4 grid gap-3">
                                        <Button size="lg" onClick={handleSavePurchase}>
                                            <Save className="mr-2 h-5 w-5" />
                                            Save Purchase
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="history">
                    <Card className="border-0 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Purchase History & Pending Dues</CardTitle>
                                <CardDescription>View all inward entries and update payments for credit purchases.</CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <div className="relative w-64">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        placeholder="Search Bill No / Supplier..."
                                        className="pl-9"
                                        value={historySearch}
                                        onChange={e => setHistorySearch(e.target.value)}
                                    />
                                </div>
                                <Button variant="outline" size="sm" onClick={fetchHistory} disabled={isRefreshing}>
                                    {isRefreshing ? 'Refreshing...' : 'Refresh'}
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/50">
                                        <TableHead>Date</TableHead>
                                        <TableHead>Bill No</TableHead>
                                        <TableHead>Supplier</TableHead>
                                        <TableHead className="text-right">Total</TableHead>
                                        <TableHead className="text-right">Paid</TableHead>
                                        <TableHead className="text-right">Due</TableHead>
                                        <TableHead className="text-center">Status</TableHead>
                                        <TableHead className="w-[100px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {purchaseHistory
                                        .filter(p => p.billNo.toLowerCase().includes(historySearch.toLowerCase()) || p.supplierName.toLowerCase().includes(historySearch.toLowerCase()))
                                        .map((p) => {
                                            const due = p.totalAmount - p.paidAmount;
                                            return (
                                                <TableRow key={p.id || p._id}>
                                                    <TableCell>{p.date}</TableCell>
                                                    <TableCell className="font-medium">{p.billNo}</TableCell>
                                                    <TableCell>{p.supplierName}</TableCell>
                                                    <TableCell className="text-right">₹{(p.totalAmount || 0).toLocaleString()}</TableCell>
                                                    <TableCell className="text-right text-green-600">₹{(p.paidAmount || 0).toLocaleString()}</TableCell>
                                                    <TableCell className="text-right font-bold text-destructive">₹{(due || 0).toLocaleString()}</TableCell>
                                                    <TableCell className="text-center">
                                                        <Badge variant={p.paymentStatus === 'Paid' ? 'outline' : p.paymentStatus === 'Partial' ? 'secondary' : 'destructive'} className="capitalize">
                                                            {p.paymentStatus}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        {due > 0 && (
                                                            <PaymentUpdateDialog purchase={p} onUpdate={handleUpdatePayment} />
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

const PaymentUpdateDialog: React.FC<{ purchase: any, onUpdate: (id: string, amt: number, method: string) => void }> = ({ purchase, onUpdate }) => {
    const [amount, setAmount] = useState(0);
    const [method, setMethod] = useState('UPI');
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm">Pay Now</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Update Payment - {purchase.billNo}</DialogTitle>
                    <DialogDescription>
                        Recording payment for {purchase.supplierName}. Remaining Due: ₹{(purchase.totalAmount - purchase.paidAmount).toLocaleString()}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="amount" className="text-right">Amount</Label>
                        <Input
                            id="amount"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                            className="col-span-3 text-lg font-bold"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="method" className="text-right">Method</Label>
                        <Select value={method} onValueChange={setMethod}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Cash">Cash</SelectItem>
                                <SelectItem value="UPI">UPI / Digital</SelectItem>
                                <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={() => {
                        onUpdate(purchase.id || purchase._id, amount, method);
                        setOpen(false);
                    }}>Complete Payment</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default PurchaseEntry;
