import React, { useState } from 'react';
import {
    History,
    Wallet,
    Search,
    MessageSquare,
    Phone
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
import { toast } from 'sonner';

interface DueRecord {
    id: string;
    customer: string;
    mobile: string;
    billRef: string;
    amount: number;
    dueDate: string;
    daysOverdue: number;
}

const mockDues: DueRecord[] = [
    { id: '1', customer: 'Lakshmi Silks', mobile: '9988776655', billRef: 'SILK-105', amount: 45000, dueDate: '2024-03-01', daysOverdue: 15 },
    { id: '2', customer: 'Ravi Kumar', mobile: '8877665544', billRef: 'SILK-122', amount: 500, dueDate: '2024-03-10', daysOverdue: 5 },
];

const DueManagement: React.FC = () => {
    const [dues, setDues] = useState<DueRecord[]>(mockDues);

    const handleCollect = (id: string, amount: number) => {
        toast.info(`Opening payment collection for ₹${amount}`);
    };

    const handleReminder = (mobile: string, amount: number) => {
        toast.success(`WhatsApp reminder sent to ${mobile} for ₹${amount}`);
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight font-display text-primary">Due Management</h1>
                    <p className="text-muted-foreground">Track and collect customer credits.</p>
                </div>
                <Card className="bg-destructive text-destructive-foreground border-none">
                    <CardContent className="p-4 flex items-center gap-4">
                        <Wallet className="h-8 w-8 opacity-80" />
                        <div>
                            <p className="text-sm opacity-90">Total Outstanding</p>
                            <p className="text-2xl font-bold">₹45,500</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-0 shadow-sm">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Pending Collections</CardTitle>
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input placeholder="Search Customer..." className="pl-9 h-9" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50">
                                <TableHead>Customer</TableHead>
                                <TableHead>Bill Ref</TableHead>
                                <TableHead className="text-right">Due Amount</TableHead>
                                <TableHead>Due Date</TableHead>
                                <TableHead className="text-center">Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {dues.map((due) => (
                                <TableRow key={due.id}>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{due.customer}</span>
                                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                <Phone className="h-3 w-3" /> {due.mobile}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-mono text-xs">{due.billRef}</TableCell>
                                    <TableCell className="text-right font-bold text-destructive">₹{due.amount.toLocaleString()}</TableCell>
                                    <TableCell>{due.dueDate}</TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant="outline" className="text-orange-600 bg-orange-50 border-orange-200">
                                            {due.daysOverdue} Days Overdue
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="outline" size="sm" onClick={() => handleReminder(due.mobile, due.amount)}>
                                                <MessageSquare className="h-4 w-4 text-green-600" />
                                            </Button>
                                            <Button size="sm" onClick={() => handleCollect(due.id, due.amount)}>
                                                Collect
                                            </Button>
                                        </div>
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

export default DueManagement;
