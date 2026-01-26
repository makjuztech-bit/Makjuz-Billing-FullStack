import React, { useState } from 'react';
import {
    Search,
    Filter,
    Plus,
    MoreHorizontal,
    Edit,
    AlertTriangle,
    ArrowRightLeft,
    Tag,
    Download,
    Printer
} from 'lucide-react';
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
import { toast } from 'sonner';

interface InventoryItem {
    barcode: string;
    name: string;
    category: string;
    costPrice: number;
    sellingPrice: number;
    status: 'Available' | 'Sold' | 'Damaged' | 'Held';
    rackLocation: string;
    addedDate: string;
    supplier: string;
}

const mockInventory: InventoryItem[] = [
    {
        barcode: 'KS-2024-001',
        name: 'Kanchipuram Red Bridal',
        category: 'Silk',
        costPrice: 15000,
        sellingPrice: 22000,
        status: 'Available',
        rackLocation: 'A1-05',
        addedDate: '2024-02-15',
        supplier: 'Weaver Raman',
    },
    {
        barcode: 'KS-2024-002',
        name: 'Soft Silk Blue Motif',
        category: 'Soft Silk',
        costPrice: 5000,
        sellingPrice: 7500,
        status: 'Available',
        rackLocation: 'B2-10',
        addedDate: '2024-02-20',
        supplier: 'Silk House TN',
    },
    {
        barcode: 'CT-2024-105',
        name: 'Cotton Daily Wear',
        category: 'Cotton',
        costPrice: 800,
        sellingPrice: 1200,
        status: 'Sold',
        rackLocation: '-',
        addedDate: '2024-01-10',
        supplier: 'Coimbatore Cottons',
    },
    {
        barcode: 'FC-2024-055',
        name: 'Fancy Designer Saree',
        category: 'Fancy',
        costPrice: 2500,
        sellingPrice: 4000,
        status: 'Damaged',
        rackLocation: 'D-Bin',
        addedDate: '2024-03-01',
        supplier: 'Mumbai Fashions',
    },
];

const Inventory: React.FC = () => {
    const [items, setItems] = useState<InventoryItem[]>(mockInventory);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');

    const handleMarkDamaged = (barcode: string) => {
        toast.warning(`Marked ${barcode} as Damaged`);
        setItems((prev) =>
            prev.map((item) => (item.barcode === barcode ? { ...item, status: 'Damaged' } : item))
        );
    };

    const handlePriceUpdate = (barcode: string) => {
        toast.info(`Updating price for ${barcode}`);
    };

    const handleTransfer = (barcode: string) => {
        toast.success(`Initiated transfer for ${barcode}`);
    };

    const filteredItems = items.filter((item) => {
        const matchesSearch =
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.barcode.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight font-display text-primary">Inventory</h1>
                    <p className="text-muted-foreground">Manage stock, prices, and status.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline">
                        <Printer className="mr-2 h-4 w-4" />
                        Print Tags
                    </Button>
                    <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Export
                    </Button>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Stock
                    </Button>
                </div>
            </div>

            <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                    <CardTitle>Stock List</CardTitle>
                    <CardDescription>
                        Total Items: {filteredItems.length} | Value: ₹
                        {filteredItems.reduce((sum, item) => sum + item.sellingPrice, 0).toLocaleString()}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end">
                        <div className="flex-1 space-y-2">
                            <label className="text-sm font-medium">Search</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Scan barcode or search name..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                        </div>

                        <div className="w-full md:w-48 space-y-2">
                            <label className="text-sm font-medium">Category</label>
                            <Select value={filterCategory} onValueChange={setFilterCategory}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All Categories" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Categories</SelectItem>
                                    <SelectItem value="Silk">Silk</SelectItem>
                                    <SelectItem value="Soft Silk">Soft Silk</SelectItem>
                                    <SelectItem value="Cotton">Cotton</SelectItem>
                                    <SelectItem value="Fancy">Fancy</SelectItem>
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

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50">
                                    <TableHead className="w-[120px]">Barcode</TableHead>
                                    <TableHead>Product Name</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead className="hidden md:table-cell">Rack</TableHead>
                                    <TableHead className="text-right">Cost</TableHead>
                                    <TableHead className="text-right">Selling Price</TableHead>
                                    <TableHead className="text-center">Status</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredItems.map((item) => (
                                    <TableRow key={item.barcode} className="hover:bg-muted/5">
                                        <TableCell className="font-mono font-medium text-xs">{item.barcode}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{item.name}</span>
                                                <span className="text-xs text-muted-foreground hidden lg:block">Added: {item.addedDate}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{item.category}</TableCell>
                                        <TableCell className="hidden md:table-cell font-mono text-xs">{item.rackLocation}</TableCell>
                                        <TableCell className="text-right text-muted-foreground">₹{item.costPrice.toLocaleString()}</TableCell>
                                        <TableCell className="text-right font-semibold">₹{item.sellingPrice.toLocaleString()}</TableCell>
                                        <TableCell className="text-center">
                                            <Badge
                                                variant="outline"
                                                className={`
                          ${item.status === 'Available' ? 'bg-green-50 text-green-700 border-green-200' : ''}
                          ${item.status === 'Sold' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
                          ${item.status === 'Damaged' ? 'bg-red-50 text-red-700 border-red-200' : ''}
                        `}
                                            >
                                                {item.status}
                                            </Badge>
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
                                                    <DropdownMenuItem onClick={() => handlePriceUpdate(item.barcode)}>
                                                        <Tag className="mr-2 h-4 w-4" /> Update Price
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => { }}>
                                                        <Edit className="mr-2 h-4 w-4" /> Edit Details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleTransfer(item.barcode)}>
                                                        <ArrowRightLeft className="mr-2 h-4 w-4" /> Transfer Branch
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        className="text-destructive focus:text-destructive"
                                                        onClick={() => handleMarkDamaged(item.barcode)}
                                                    >
                                                        <AlertTriangle className="mr-2 h-4 w-4" /> Mark Damaged
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Inventory;
