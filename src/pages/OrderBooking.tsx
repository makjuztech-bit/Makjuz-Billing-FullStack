import React from 'react';
import {
    CalendarDays,
    User,
    ShoppingBag,
    CreditCard,
    Plus,
    Check
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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

const OrderBooking: React.FC = () => {
    const handleSave = () => {
        toast.success('Order Booking Saved Successfully');
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight font-display text-primary">Pre-Order / Booking</h1>
                <p className="text-muted-foreground">Book orders for weddings and bulk purchases with advance payment.</p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
                {/* Booking Form */}
                <Card className="border-0 shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ShoppingBag className="h-5 w-5" /> Order Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Customer Mobile</Label>
                                <Input placeholder="9988776655" />
                            </div>
                            <div className="space-y-2">
                                <Label>Customer Name</Label>
                                <Input placeholder="Name" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Items / Requirement Description</Label>
                            <Textarea
                                placeholder="e.g. 50x Red Cotton Sarees for Wedding return gift. Specific contrast border required."
                                className="min-h-[100px]"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label>Delivery Date</Label>
                                <Input type="date" />
                            </div>
                            <div className="space-y-2">
                                <Label>Total Estimated (₹)</Label>
                                <Input type="number" placeholder="0" />
                            </div>
                            <div className="space-y-2">
                                <Label>Advance Paid (₹)</Label>
                                <Input type="number" placeholder="0" className="border-green-300 bg-green-50" />
                            </div>
                        </div>

                        <Button size="lg" className="w-full md:w-auto" onClick={handleSave}>
                            <Check className="mr-2 h-5 w-5" /> Confirm Booking
                        </Button>
                    </CardContent>
                </Card>

                {/* Recent Bookings */}
                <div className="space-y-4">
                    <Card className="h-full border-0 shadow-sm flex flex-col">
                        <CardHeader className="border-b pb-3">
                            <div className="flex justify-between items-center">
                                <CardTitle>Recent Orders</CardTitle>
                                <Button variant="ghost" size="sm">View All</Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0 flex-1">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Due Date</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>
                                            <div className="font-medium">Mrs. Revathi</div>
                                            <div className="text-xs text-muted-foreground">Order for 50pcs</div>
                                        </TableCell>
                                        <TableCell>15-Apr</TableCell>
                                        <TableCell><Badge>Booked</Badge></TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            <div className="font-medium">Karthik Wedding</div>
                                            <div className="text-xs text-muted-foreground">Muhurtham silk</div>
                                        </TableCell>
                                        <TableCell>20-Mar</TableCell>
                                        <TableCell><Badge variant="outline" className="text-green-600 bg-green-50">Ready</Badge></TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default OrderBooking;
