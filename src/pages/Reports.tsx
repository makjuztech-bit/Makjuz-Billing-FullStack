import React, { useState } from 'react';
import {
    BarChart,
    LineChart,
    Calendar,
    Download,
    Printer,
    Filter
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

const Reports: React.FC = () => {
    const [reportType, setReportType] = useState('dailysales');

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight font-display text-primary">Business Intelligence</h1>
                    <p className="text-muted-foreground">Insights, Sales Reports and Analytics.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" /> Export CSV
                    </Button>
                    <Button variant="outline">
                        <Printer className="mr-2 h-4 w-4" /> Print
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <Card className="border-0 shadow-sm">
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="w-full md:w-[250px] space-y-2">
                            <Label>Report Type</Label>
                            <Select value={reportType} onValueChange={setReportType}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="dailysales">Daily Sales</SelectItem>
                                    <SelectItem value="stock">Stock Analysis</SelectItem>
                                    <SelectItem value="category">Category Performance</SelectItem>
                                    <SelectItem value="staff">Salesman Report</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="w-full md:w-[200px] space-y-2">
                            <Label>From Date</Label>
                            <Input type="date" />
                        </div>
                        <div className="w-full md:w-[200px] space-y-2">
                            <Label>To Date</Label>
                            <Input type="date" />
                        </div>
                        <Button className="w-full md:w-auto">
                            <Filter className="mr-2 h-4 w-4" /> Generate
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹12,45,000</div>
                        <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Bills Count</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">482</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Bill Value</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹2,580</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Profit Estimate</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">₹3,10,000</div>
                        <p className="text-xs text-muted-foreground">Approx. Margin</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-0 shadow-sm flex-1">
                <CardHeader>
                    <CardTitle>Detailed Sales Report</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50">
                                <TableHead>Date</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead className="text-right">Cash</TableHead>
                                <TableHead className="text-right">Card/UPI</TableHead>
                                <TableHead className="text-right">Total Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell>12 Mar 2024</TableCell>
                                <TableCell>Silk Sarees</TableCell>
                                <TableCell className="text-right">₹45,000</TableCell>
                                <TableCell className="text-right">₹22,000</TableCell>
                                <TableCell className="text-right font-bold">₹67,000</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>11 Mar 2024</TableCell>
                                <TableCell>Cotton & Fancy</TableCell>
                                <TableCell className="text-right">₹12,000</TableCell>
                                <TableCell className="text-right">₹8,500</TableCell>
                                <TableCell className="text-right font-bold">₹20,500</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default Reports;
