import React, { useState } from 'react';
import {
    Building2,
    Phone,
    MapPin,
    FileText,
    Wallet,
    Search,
    Plus
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';

import { useData } from '@/contexts/DataContext';
import { Supplier } from '@/types';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

const SupplierManagement: React.FC = () => {
    const { suppliers, addSupplier, updateSupplier, deleteSupplier } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [newSupplier, setNewSupplier] = useState<Partial<Supplier>>({});

    const handleSave = async () => {
        if (!newSupplier.name) {
            toast.error('Supplier name is required');
            return;
        }

        const supplierData = {
            name: newSupplier.name || '',
            contactPerson: newSupplier.contactPerson || '',
            mobile: newSupplier.mobile || '',
            gstin: newSupplier.gstin || '',
            location: newSupplier.location || '',
            pendingDue: newSupplier.pendingDue || 0
        };

        if (isEditing && newSupplier.id) {
            await updateSupplier(newSupplier.id, supplierData);
            toast.success('Supplier updated successfully');
        } else {
            await addSupplier(supplierData as Supplier);
            toast.success('Supplier added successfully');
        }

        setIsAddOpen(false);
        setIsEditing(false);
        setNewSupplier({});
    };

    const handleEdit = (supplier: Supplier) => {
        setNewSupplier(supplier);
        setIsEditing(true);
        setIsAddOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this supplier?')) {
            await deleteSupplier(id);
            toast.success('Supplier deleted');
        }
    };

    const filteredSuppliers = suppliers.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight font-display text-primary">Suppliers</h1>
                    <p className="text-muted-foreground">Manage vendors and payments.</p>
                </div>
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => { setIsEditing(false); setNewSupplier({}); }}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Supplier
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{isEditing ? 'Edit Supplier' : 'Add New Supplier'}</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label>Supplier Name</Label>
                                <Input
                                    value={newSupplier.name || ''}
                                    onChange={e => setNewSupplier({ ...newSupplier, name: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Contact Person</Label>
                                <Input
                                    value={newSupplier.contactPerson || ''}
                                    onChange={e => setNewSupplier({ ...newSupplier, contactPerson: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Mobile</Label>
                                <Input
                                    value={newSupplier.mobile || ''}
                                    onChange={e => setNewSupplier({ ...newSupplier, mobile: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>GSTIN</Label>
                                <Input
                                    value={newSupplier.gstin || ''}
                                    onChange={e => setNewSupplier({ ...newSupplier, gstin: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Location</Label>
                                <Input
                                    value={newSupplier.location || ''}
                                    onChange={e => setNewSupplier({ ...newSupplier, location: e.target.value })}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleSave}>Save Supplier</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-6 md:grid-cols-[1fr_300px]">
                {/* Supplier List */}
                <Card className="border-0 shadow-sm flex-1">
                    <CardHeader className="pb-3 border-b">
                        <div className="flex items-center justify-between">
                            <CardTitle>Supplier Directory</CardTitle>
                            <div className="relative w-full md:w-64">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search suppliers..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-9 h-9"
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Supplier Details</TableHead>
                                    <TableHead className="hidden md:table-cell">Contact</TableHead>
                                    <TableHead className="hidden md:table-cell">Location</TableHead>
                                    <TableHead className="text-right">Passbook</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredSuppliers.map((supplier) => (
                                    <TableRow key={supplier.id} className="hover:bg-muted/5">
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-orange-100 text-orange-700">
                                                    <Building2 className="h-5 w-5" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{supplier.name}</span>
                                                    <span className="text-xs text-muted-foreground">GST: {supplier.gstin}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium">{supplier.contactPerson}</span>
                                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                    <Phone className="h-3 w-3" /> {supplier.mobile}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            <div className="flex items-center gap-1 text-muted-foreground">
                                                <MapPin className="h-3 w-3" /> {supplier.location}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex flex-col items-end">
                                                <span className="text-xs text-muted-foreground">Pending Due</span>
                                                {supplier.pendingDue > 0 ? (
                                                    <span className="font-bold text-destructive">₹{supplier.pendingDue.toLocaleString()}</span>
                                                ) : (
                                                    <Badge variant="outline" className="text-green-600 bg-green-50">Settled</Badge>
                                                )}
                                            </div>
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
                                                    <DropdownMenuItem onClick={() => handleEdit(supplier)}>
                                                        <FileText className="mr-2 h-4 w-4" /> Edit Details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => toast.info('Purchase History coming soon')}>
                                                        <Plus className="mr-2 h-4 w-4" /> View Purchase History
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => toast.info('Record Payment coming soon')}>
                                                        <Wallet className="mr-2 h-4 w-4" /> Record Payment
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(supplier.id)}>
                                                        <MoreHorizontal className="mr-2 h-4 w-4" /> Delete Supplier
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
                            <CardTitle className="text-lg">Total Payable</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">
                                ₹{filteredSuppliers.reduce((sum, s) => sum + s.pendingDue, 0).toLocaleString()}
                            </div>
                            <p className="text-sm opacity-80 mt-2">To {filteredSuppliers.filter(s => s.pendingDue > 0).length} suppliers</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default SupplierManagement;
