import React, { useState } from 'react';
import {
    Users,
    Shield,
    Percent,
    UserPlus
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';

interface Staff {
    id: string;
    name: string;
    role: string;
    commissionType: 'Percentage' | 'Fixed';
    commissionValue: number;
    active: boolean;
    salesThisMonth: number;
}

const mockStaff: Staff[] = [
    { id: '1', name: 'Ramesh', role: 'Salesman', commissionType: 'Percentage', commissionValue: 1, active: true, salesThisMonth: 450000 },
    { id: '2', name: 'Suresh', role: 'Salesman', commissionType: 'Fixed', commissionValue: 50, active: true, salesThisMonth: 320000 },
    { id: '3', name: 'Meena', role: 'Cashier', commissionType: 'Percentage', commissionValue: 0, active: true, salesThisMonth: 0 },
];

const StaffManagement: React.FC = () => {
    const [staffList, setStaffList] = useState<Staff[]>(mockStaff);

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight font-display text-primary">Staff & Commissions</h1>
                    <p className="text-muted-foreground">Manage employees, roles and sales incentives.</p>
                </div>
                <Button>
                    <UserPlus className="mr-2 h-4 w-4" /> Add Employee
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Sales Staff</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Commissions Paid (This Month)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹24,500</div>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-0 shadow-sm">
                <CardHeader>
                    <CardTitle>Employee Directory</CardTitle>
                    <CardDescription>Manage access and commission rates.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50">
                                <TableHead>Employee</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Commission Structure</TableHead>
                                <TableHead className="text-right">Sales (Month)</TableHead>
                                <TableHead className="text-right">Est. Commission</TableHead>
                                <TableHead className="text-center">Active</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {staffList.map((staff) => (
                                <TableRow key={staff.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback>{staff.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium">{staff.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="capitalize">{staff.role}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 text-sm">
                                            <Percent className="h-4 w-4 text-muted-foreground" />
                                            {staff.commissionValue > 0 ? (
                                                <span>
                                                    {staff.commissionValue}
                                                    {staff.commissionType === 'Percentage' ? '%' : ' per item'}
                                                </span>
                                            ) : (
                                                <span className="text-muted-foreground">None</span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">₹{staff.salesThisMonth.toLocaleString()}</TableCell>
                                    <TableCell className="text-right font-semibold text-green-600">
                                        ₹{Math.floor(staff.commissionType === 'Percentage' ? (staff.salesThisMonth * staff.commissionValue / 100) : 0).toLocaleString()}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Switch checked={staff.active} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default StaffManagement;
