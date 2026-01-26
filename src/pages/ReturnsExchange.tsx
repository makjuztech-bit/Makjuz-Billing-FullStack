import React, { useState } from 'react';
import {
    ArrowLeft,
    RotateCcw,
    Search,
    Check,
    AlertTriangle,
    Banknote,
    RefreshCw,
    Scissors
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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

interface ReturnItem {
    id: string;
    barcode: string;
    name: string;
    price: number;
    condition: 'good' | 'damaged' | 'altered';
    selected: boolean;
}

const ReturnsExchange: React.FC = () => {
    const [billNo, setBillNo] = useState('');
    const [billFound, setBillFound] = useState(false);
    const [items, setItems] = useState<ReturnItem[]>([]);
    const [returnAction, setReturnAction] = useState('exchange');

    const handleSearch = () => {
        if (!billNo) return;
        toast.info(`Searching for Bill ${billNo}`);
        // Mock result
        setItems([
            { id: '1', barcode: 'KS-101', name: 'Kanchipuram Silk Red', price: 25000, condition: 'good', selected: false },
            { id: '2', barcode: 'KS-102', name: 'Soft Silk Blue', price: 8000, condition: 'good', selected: false },
        ]);
        setBillFound(true);
    };

    const toggleSelection = (id: string) => {
        setItems(items.map(i => i.id === id ? { ...i, selected: !i.selected } : i));
    };

    const updateCondition = (id: string, condition: 'good' | 'damaged' | 'altered') => {
        setItems(items.map(i => i.id === id ? { ...i, condition } : i));
    };

    const calculateRefund = () => {
        return items.filter(i => i.selected).reduce((sum, i) => {
            let val = i.price;
            if (i.condition === 'altered') val *= 0.5; // deduction for altered
            return sum + val;
        }, 0);
    };

    const handleProcess = () => {
        const amount = calculateRefund();
        if (amount <= 0) {
            toast.error('Select items to return');
            return;
        }
        toast.success(`Processed ${returnAction.toUpperCase()} for ₹${amount}`);
        setBillFound(false);
        setBillNo('');
        setItems([]);
    };

    return (
        <div className="flex flex-col gap-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon">
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight font-display text-primary">Sales Return / Exchange</h1>
                    <p className="text-muted-foreground">Process customer returns and exchanges.</p>
                </div>
            </div>

            <Card className="border-0 shadow-sm">
                <CardHeader>
                    <CardTitle>Find Bill</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4 max-w-lg">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Scan QR or Enter Bill No"
                                value={billNo}
                                onChange={(e) => setBillNo(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <Button onClick={handleSearch}>Find Details</Button>
                    </div>
                </CardContent>
            </Card>

            {billFound && (
                <Card className="border-0 shadow-sm animate-in fade-in slide-in-from-bottom-4">
                    <CardHeader>
                        <CardTitle>Select Items to Return</CardTitle>
                        <CardDescription>Bill Date: 12-Mar-2024 | Customer: Priya</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/50">
                                        <TableHead className="w-[50px]">Return</TableHead>
                                        <TableHead>Product</TableHead>
                                        <TableHead className="text-right">Price</TableHead>
                                        <TableHead className="w-[200px]">Condition</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {items.map((item) => (
                                        <TableRow key={item.id} className={item.selected ? 'bg-primary/5' : ''}>
                                            <TableCell>
                                                <input
                                                    type="checkbox"
                                                    checked={item.selected}
                                                    onChange={() => toggleSelection(item.id)}
                                                    className="accent-primary h-4 w-4"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{item.name}</span>
                                                    <span className="text-xs text-muted-foreground">{item.barcode}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right font-semibold">₹{item.price.toLocaleString()}</TableCell>
                                            <TableCell>
                                                <Select
                                                    value={item.condition}
                                                    onValueChange={(v: any) => updateCondition(item.id, v)}
                                                    disabled={!item.selected}
                                                >
                                                    <SelectTrigger className="h-8">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="good">Good (Unused)</SelectItem>
                                                        <SelectItem value="damaged">Damaged</SelectItem>
                                                        <SelectItem value="altered">Altered/Stitched</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center bg-muted/20 p-4 rounded-lg">
                            <div className="space-y-3">
                                <Label className="text-base">Return Action</Label>
                                <RadioGroup defaultValue="exchange" onValueChange={setReturnAction} className="flex gap-4">
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="exchange" id="r1" />
                                        <Label htmlFor="r1" className="cursor-pointer flex items-center gap-1">
                                            <RefreshCw className="h-4 w-4" /> Exchange
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="refund" id="r2" />
                                        <Label htmlFor="r2" className="cursor-pointer flex items-center gap-1">
                                            <Banknote className="h-4 w-4" /> Refund Cash
                                        </Label>
                                    </div>
                                </RadioGroup>
                            </div>

                            <div className="text-right">
                                <div className="text-sm text-muted-foreground">Total Refund Value</div>
                                <div className="text-3xl font-bold text-primary">₹{calculateRefund().toLocaleString()}</div>
                                {items.some(i => i.selected && i.condition === 'altered') && (
                                    <div className="text-xs text-orange-600 flex items-center justify-end gap-1 mt-1">
                                        <AlertTriangle className="h-3 w-3" /> Alteration deduction applied
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t">
                            <Button variant="outline" onClick={() => setBillFound(false)}>Cancel</Button>
                            <Button size="lg" onClick={handleProcess} disabled={calculateRefund() === 0}>
                                <Check className="mr-2 h-5 w-5" />
                                Complete {returnAction === 'exchange' ? 'Exchange' : 'Refund'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default ReturnsExchange;
