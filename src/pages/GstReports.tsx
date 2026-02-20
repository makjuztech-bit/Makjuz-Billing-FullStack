import React, { useState, useEffect } from 'react';
import {
    FileText,
    Download,
    Printer,
    CalendarDays
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import { API_URL } from '@/lib/config';

interface HsnItem {
    code: string;
    description: string;
    taxable: number;
    tax: number;
    rate: number;
}

interface GstData {
    totalTaxable: number;
    totalTax: number;
    b2bCount: number;
    hsnSummary: HsnItem[];
}

const GstReports: React.FC = () => {
    const [data, setData] = useState<GstData>({ totalTaxable: 0, totalTax: 0, b2bCount: 0, hsnSummary: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchGstData();
    }, []);

    const fetchGstData = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/reports/gst`);
            if (response.ok) {
                const result = await response.json();
                setData(result);
            } else {
                toast.error('Failed to fetch GST data');
            }
        } catch (error) {
            console.error('Error fetching GST data:', error);
            toast.error('Error fetching GST data');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight font-display text-primary">GST Reports</h1>
                    <p className="text-muted-foreground">GSTR-1, GSTR-3B Sales Data & HSN Summaries.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={() => toast.info('JSON Download coming soon')}>
                        <Download className="mr-2 h-4 w-4" /> Download JSON
                    </Button>
                    <Button variant="outline" onClick={() => toast.info('Excel Export coming soon')}>
                        <FileText className="mr-2 h-4 w-4" /> Export Excel
                    </Button>
                </div>
            </div>

            <Card className="border-0 shadow-sm">
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="w-full md:w-[250px] space-y-2">
                            <Label>Month of Return</Label>
                            <Input type="month" />
                        </div>
                        <Button className="w-full md:w-auto" onClick={() => { fetchGstData(); toast.success('Data refreshed'); }}>
                            Fetch Data
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Taxable Value</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{data.totalTaxable.toLocaleString()}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total CGST + SGST</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-destructive">₹{data.totalTax.toLocaleString()}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">B2B Invoices</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.b2bCount}</div>
                        <p className="text-xs text-muted-foreground">Wholesale</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-0 shadow-sm flex-1">
                <CardHeader>
                    <CardTitle>HSN Summary (GSTR-1)</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50">
                                <TableHead>HSN Code</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead className="text-right">Taxable Val</TableHead>
                                <TableHead className="text-right">GST %</TableHead>
                                <TableHead className="text-right">Tax Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8">Loading...</TableCell>
                                </TableRow>
                            ) : data.hsnSummary.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8">No data found</TableCell>
                                </TableRow>
                            ) : (
                                data.hsnSummary.map((item) => (
                                    <TableRow key={item.code}>
                                        <TableCell className="font-mono">{item.code}</TableCell>
                                        <TableCell>{item.description}</TableCell>
                                        <TableCell className="text-right">₹{item.taxable.toLocaleString()}</TableCell>
                                        <TableCell className="text-right">{item.rate}%</TableCell>
                                        <TableCell className="text-right font-bold">₹{item.tax.toLocaleString()}</TableCell>
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

export default GstReports;
