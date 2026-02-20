import React, { useState, useEffect } from 'react';
import {
    BarChart,
    LineChart,
    Calendar,
    Download,
    Printer,
    Filter,
    Plus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { API_URL } from '@/lib/config';
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

interface ReportSummary {
    totalSales: number;
    billsCount: number;
    avgBillValue: number;
    profitEstimate: number;
}

interface DetailedReportItem {
    id: string;
    date: string;
    category: string;
    cash: number;
    card: number;
    totalAmount: number;
}

const Reports: React.FC = () => {
    const navigate = useNavigate();
    const [reportType, setReportType] = useState('dailysales');
    const [summary, setSummary] = useState<ReportSummary>({ totalSales: 0, billsCount: 0, avgBillValue: 0, profitEstimate: 0 });
    const [detailed, setDetailed] = useState<DetailedReportItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [summaryRes, detailedRes] = await Promise.all([
                    fetch(`${API_URL}/reports/summary`),
                    fetch(`${API_URL}/reports/detailed`)
                ]);

                if (summaryRes.ok && detailedRes.ok) {
                    const summaryData = await summaryRes.json();
                    const detailedData = await detailedRes.json();
                    setSummary(summaryData);
                    setDetailed(detailedData);
                } else {
                    toast.error('Failed to load reports');
                }
            } catch (error) {
                console.error('Error loading reports:', error);
                toast.error('Error loading reports');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight font-display text-primary">Business Intelligence</h1>
                    <p className="text-muted-foreground">Insights, Sales Reports and Analytics.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={() => navigate('/billing')}>
                        <Plus className="mr-2 h-4 w-4" /> New Bill
                    </Button>
                    <Button variant="outline" onClick={() => toast.info('Export functionality coming soon')}>
                        <Download className="mr-2 h-4 w-4" /> Export CSV
                    </Button>
                    <Button variant="outline" onClick={() => toast.info('Print functionality coming soon')}>
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
                        <Button className="w-full md:w-auto" onClick={() => toast.success('Report updated!')}>
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
                        <div className="text-2xl font-bold">₹{summary.totalSales.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Lifetime</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Bills Count</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{summary.billsCount}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Bill Value</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{summary.avgBillValue.toLocaleString()}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Profit Estimate</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">₹{summary.profitEstimate.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">~20% Est. Margin</p>
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
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8">Loading...</TableCell>
                                </TableRow>
                            ) : detailed.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8">No records found</TableCell>
                                </TableRow>
                            ) : (
                                detailed.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>{item.date}</TableCell>
                                        <TableCell>{item.category}</TableCell>
                                        <TableCell className="text-right">₹{item.cash.toLocaleString()}</TableCell>
                                        <TableCell className="text-right">₹{item.card.toLocaleString()}</TableCell>
                                        <TableCell className="text-right font-bold">₹{item.totalAmount.toLocaleString()}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default Reports;
