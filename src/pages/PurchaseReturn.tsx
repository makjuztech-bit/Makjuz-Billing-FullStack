import React, { useState } from 'react';
import {
    ArrowLeft,
    Truck,
    RotateCcw,
    Search,
    CheckCircle,
    X
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
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

const PurchaseReturn: React.FC = () => {
    const [supplier, setSupplier] = useState('');
    const [purchaseBill, setPurchaseBill] = useState('');
    const [returnItems, setReturnItems] = useState<any[]>([]);

    const handleSearchBill = () => {
        if (!purchaseBill) return;
        toast.info(`Fetching details for Bill: ${purchaseBill}`);
        // Mock items
        setReturnItems([
            { id: 1, barcode: 'KS-001', name: 'Silk Saree Red', cost: 15000, qty: 1, reason: '' },
            { id: 2, barcode: 'KS-002', name: 'Silk Saree Blue', cost: 12000, qty: 1, reason: '' },
        ]);
    };

    const handleReturn = () => {
        toast.success(`Items returned to ${supplier || 'Supplier'}`);
        setReturnItems([]);
        setPurchaseBill('');
    };

    return (
        <div className="flex flex-col gap-6 max-w-5xl mx-auto">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon">
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight font-display text-primary">Purchase Return</h1>
                    <p className="text-muted-foreground">Return defective stock to suppliers (Debit Note).</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <RotateCcw className="h-5 w-5" /> Return Details
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label>Select Supplier</Label>
                            <Select value={supplier} onValueChange={setSupplier}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Choose Supplier" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="sup1">Weaver Raman</SelectItem>
                                    <SelectItem value="sup2">Silk House TN</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Original Purchase Bill No</Label>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Enter Bill No"
                                    value={purchaseBill}
                                    onChange={(e) => setPurchaseBill(e.target.value)}
                                />
                                <Button size="icon" onClick={handleSearchBill}>
                                    <Search className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    {returnItems.length > 0 && (
                        <div className="space-y-4">
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-muted/50">
                                            <TableHead className="w-[50px]">Select</TableHead>
                                            <TableHead>Item</TableHead>
                                            <TableHead className="text-right">Cost Price</TableHead>
                                            <TableHead>Return Reason</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {returnItems.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell>
                                                    <input type="checkbox" className="rounded border-gray-300" />
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">{item.name}</span>
                                                        <span className="text-xs text-muted-foreground">{item.barcode}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">₹{item.cost.toLocaleString()}</TableCell>
                                                <TableCell>
                                                    <Input placeholder="Why returning?" className="h-8" />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t">
                                <Button variant="outline" onClick={() => setReturnItems([])}>Cancel</Button>
                                <Button variant="destructive" onClick={handleReturn}>
                                    <Truck className="mr-2 h-4 w-4" />
                                    Confirm Return
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default PurchaseReturn;
