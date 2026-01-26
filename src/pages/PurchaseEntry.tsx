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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

interface PurchaseItem {
    id: string;
    barcode: string;
    name: string;
    category: string;
    qty: number;
    costPrice: number;
    mrp: number;
    sellingPrice: number;
    totalCost: number;
}

const PurchaseEntry: React.FC = () => {
    const [items, setItems] = useState<PurchaseItem[]>([]);
    const [supplier, setSupplier] = useState('');
    const [billNo, setBillNo] = useState('');
    const [purchaseType, setPurchaseType] = useState('gst');

    // Item Entry State
    const [barcode, setBarcode] = useState('');
    const [itemName, setItemName] = useState('');
    const [category, setCategory] = useState('');
    const [qty, setQty] = useState(1);
    const [costPrice, setCostPrice] = useState(0);
    const [mrp, setMrp] = useState(0);
    const [sellingPrice, setSellingPrice] = useState(0);

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

    const handleSavePurchase = () => {
        toast.success('Purchase entry saved successfully!');
        setItems([]);
        setSupplier('');
        setBillNo('');
    };

    const totalAmount = items.reduce((sum, item) => sum + item.totalCost, 0);

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight font-display text-primary">Purchase Entry</h1>
                <p className="text-muted-foreground">Inward stock from suppliers/weavers.</p>
            </div>

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
                                            <SelectItem value="sup1">Weaver Raman</SelectItem>
                                            <SelectItem value="sup2">Silk House TN</SelectItem>
                                            <SelectItem value="sup3">Coimbatore Cottons</SelectItem>
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
                                        <Input type="date" className="pl-9" />
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
                                    <Label>Barcode</Label>
                                    <div className="relative">
                                        <Barcode className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            placeholder="Scan or Auto"
                                            value={barcode}
                                            onChange={(e) => setBarcode(e.target.value)}
                                            className="pl-9"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2 md:col-span-2 lg:col-span-3">
                                    <Label>Product Name</Label>
                                    <Input
                                        placeholder="Enter saree Name / Description"
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
                                            <SelectItem value="Silk">Silk</SelectItem>
                                            <SelectItem value="Cotton">Cotton</SelectItem>
                                            <SelectItem value="Fancy">Fancy</SelectItem>
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
                                        <TableHead>Barcode</TableHead>
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
                                    <span className="text-muted-foreground">Unique Items</span>
                                    <span className="font-medium">{items.length}</span>
                                </div>
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <span className="text-lg font-semibold">Total Amount</span>
                                <span className="text-2xl font-bold text-primary">₹{totalAmount.toLocaleString()}</span>
                            </div>
                            <div className="pt-4 grid gap-3">
                                <Button size="lg" onClick={handleSavePurchase}>
                                    <Save className="mr-2 h-5 w-5" />
                                    Save Purchase
                                </Button>
                                <Button variant="outline">
                                    <Printer className="mr-2 h-4 w-4" />
                                    Print Report
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default PurchaseEntry;
