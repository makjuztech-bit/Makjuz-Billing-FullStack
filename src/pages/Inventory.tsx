import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

import { useData } from '@/contexts/DataContext';
import { Saree } from '@/types';

const Inventory: React.FC = () => {
    const { sarees, updateSaree } = useData();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');

    const [editingItem, setEditingItem] = useState<Saree | null>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editForm, setEditForm] = useState<Partial<Saree>>({});

    const handleMarkDamaged = async (id: string, barcode: string) => {
        if (confirm(`Mark ${barcode} as Damaged? This will move it to damaged stock.`)) {
            await updateSaree(id, { status: 'damaged' });
            toast.success(`Marked ${barcode} as Damaged`);
        }
    };

    const handleEditClick = (item: Saree) => {
        setEditingItem(item);
        setEditForm({
            name: item.name,
            category: item.category,
            rackLocation: item.rackLocation,
            purchasePrice: item.purchasePrice,
            sellingPrice: item.sellingPrice,
            mrp: item.mrp
        });
        setIsEditOpen(true);
    };

    const handleSaveEdit = async () => {
        if (editingItem && editingItem.id) {
            await updateSaree(editingItem.id, editForm);
            setIsEditOpen(false);
            setEditingItem(null);
            toast.success('Stock details updated');
        }
    };

    const handleTransfer = (barcode: string) => {
        toast.info(`Transfer feature pending for ${barcode}`);
    };

    const filteredItems = sarees.filter((item) => {
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
                    <Button variant="outline" onClick={() => navigate('/billing')}>
                        <Plus className="mr-2 h-4 w-4" />
                        New Bill
                    </Button>
                    <Button variant="outline">
                        <Printer className="mr-2 h-4 w-4" />
                        Print Tags
                    </Button>
                    <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Export
                    </Button>
                    <Button onClick={() => navigate('/products')}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Stock
                    </Button>
                </div>
            </div>

            <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                    <CardTitle>Stock List</CardTitle>
                    <CardDescription>
                        Total Items: {filteredItems.reduce((sum, item) => sum + (item.stockQty || 0), 0)} | Value: ₹
                        {filteredItems.reduce((sum, item) => sum + ((item.purchasePrice || 0) * (item.stockQty || 0)), 0).toLocaleString()}
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
                                    <TableHead className="text-center">Stock</TableHead>
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
                                        <TableCell className="text-right text-muted-foreground">₹{item.purchasePrice.toLocaleString()}</TableCell>
                                        <TableCell className="text-right font-semibold">₹{item.sellingPrice.toLocaleString()}</TableCell>
                                        <TableCell className="text-center">
                                            <span className={`font-medium ${item.stockQty <= 2 ? 'text-destructive font-bold' : ''}`}>
                                                {item.stockQty}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge
                                                variant="outline"
                                                className={`
                          ${item.status === 'available' && item.stockQty > 0 ? 'bg-green-50 text-green-700 border-green-200' : ''}
                          ${item.status === 'sold' || item.stockQty <= 0 ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
                          ${item.status === 'damaged' ? 'bg-red-50 text-red-700 border-red-200' : ''}
                        `}
                                            >
                                                {item.stockQty <= 0 ? 'Out of Stock' : (item.status === 'available' ? 'Available' : item.status.charAt(0).toUpperCase() + item.status.slice(1))}
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
                                                    <DropdownMenuItem onClick={() => handleEditClick(item)}>
                                                        <Tag className="mr-2 h-4 w-4" /> Update Price
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleEditClick(item)}>
                                                        <Edit className="mr-2 h-4 w-4" /> Edit Details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleTransfer(item.barcode)}>
                                                        <ArrowRightLeft className="mr-2 h-4 w-4" /> Transfer Branch
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        className="text-destructive focus:text-destructive"
                                                        onClick={() => handleMarkDamaged(item.id || (item as any)._id, item.barcode)}
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

            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Edit Stock Details</DialogTitle>
                        <DialogDescription>
                            Update product information for {editingItem?.barcode}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Product Name</label>
                            <Input
                                value={editForm.name ?? ''}
                                onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Category</label>
                                <Select
                                    value={editForm.category ?? ''}
                                    onValueChange={val => setEditForm({ ...editForm, category: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Silk">Silk</SelectItem>
                                        <SelectItem value="Soft Silk">Soft Silk</SelectItem>
                                        <SelectItem value="Cotton">Cotton</SelectItem>
                                        <SelectItem value="Fancy">Fancy</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Rack / Location</label>
                                <Input
                                    value={editForm.rackLocation ?? ''}
                                    onChange={e => setEditForm({ ...editForm, rackLocation: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Cost Price</label>
                                <Input
                                    type="number"
                                    value={editForm.purchasePrice || 0}
                                    onChange={e => setEditForm({ ...editForm, purchasePrice: Number(e.target.value) })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">MRP</label>
                                <Input
                                    type="number"
                                    value={editForm.mrp || 0}
                                    onChange={e => setEditForm({ ...editForm, mrp: Number(e.target.value) })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Selling Price</label>
                                <Input
                                    type="number"
                                    className="border-green-300 bg-green-50"
                                    value={editForm.sellingPrice || 0}
                                    onChange={e => setEditForm({ ...editForm, sellingPrice: Number(e.target.value) })}
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                        <Button onClick={handleSaveEdit}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div >
    );
};

export default Inventory;
