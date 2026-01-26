import React, { useState } from 'react';
import {
    Receipt,
    Plus,
    Trash2,
    FileText,
    Calendar
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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

interface Expense {
    id: string;
    type: string;
    amount: number;
    date: string;
    note: string;
}

const Expenses: React.FC = () => {
    const [expenses, setExpenses] = useState<Expense[]>([
        { id: '1', type: 'Rent', amount: 25000, date: '2024-03-01', note: 'Shop Rent March' },
        { id: '2', type: 'Electricity', amount: 3400, date: '2024-03-05', note: 'EB Bill' },
    ]);

    // Form state
    const [type, setType] = useState('Tea/Coffee');
    const [amount, setAmount] = useState('');
    const [note, setNote] = useState('');

    const handleAdd = () => {
        if (!amount) return;
        const newExpense: Expense = {
            id: Math.random().toString(),
            type,
            amount: Number(amount),
            date: new Date().toISOString().split('T')[0],
            note
        };
        setExpenses([newExpense, ...expenses]);
        setAmount('');
        setNote('');
        toast.success('Expense recorded');
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight font-display text-primary">Expense Tracker</h1>
                <p className="text-muted-foreground">Manage shop operational costs.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-[350px_1fr]">
                {/* Entry Form */}
                <Card className="h-fit">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Plus className="h-5 w-5" /> New Expense
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Expense Type</Label>
                            <Select value={type} onValueChange={setType}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Rent">Rent</SelectItem>
                                    <SelectItem value="Salary">Salary</SelectItem>
                                    <SelectItem value="Electricity">Electricity</SelectItem>
                                    <SelectItem value="Transport">Transport</SelectItem>
                                    <SelectItem value="Packaging">Packaging</SelectItem>
                                    <SelectItem value="Tea/Coffee">Tea & Snacks</SelectItem>
                                    <SelectItem value="Marketing">Marketing</SelectItem>
                                    <SelectItem value="Others">Others</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Amount (₹)</Label>
                            <Input
                                type="number"
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Date</Label>
                            <Input type="date" defaultValue={new Date().toISOString().split('T')[0]} />
                        </div>
                        <div className="space-y-2">
                            <Label>Notes</Label>
                            <Textarea
                                placeholder="Description..."
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                            />
                        </div>
                        <Button className="w-full" onClick={handleAdd}>Save Expense</Button>
                    </CardContent>
                </Card>

                {/* List */}
                <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <Card className="bg-primary/5 border-primary/20">
                            <CardContent className="p-4">
                                <p className="text-sm font-medium text-muted-foreground">Today</p>
                                <p className="text-2xl font-bold">₹{expenses.reduce((s, e) => s + (e.date === new Date().toISOString().split('T')[0] ? e.amount : 0), 0)}</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4">
                                <p className="text-sm font-medium text-muted-foreground">This Month</p>
                                <p className="text-2xl font-bold">₹{expenses.reduce((s, e) => s + e.amount, 0).toLocaleString()}</p>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Note</TableHead>
                                        <TableHead className="text-right">Amount</TableHead>
                                        <TableHead className="w-[50px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {expenses.map((expense) => (
                                        <TableRow key={expense.id}>
                                            <TableCell className="font-mono text-xs text-muted-foreground">{expense.date}</TableCell>
                                            <TableCell><span className="font-medium">{expense.type}</span></TableCell>
                                            <TableCell className="text-sm text-muted-foreground">{expense.note}</TableCell>
                                            <TableCell className="text-right font-semibold">₹{expense.amount.toLocaleString()}</TableCell>
                                            <TableCell>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Expenses;
