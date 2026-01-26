import React, { useState } from 'react';
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

const GstReports: React.FC = () => {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight font-display text-primary">GST Reports</h1>
                    <p className="text-muted-foreground">GSTR-1, GSTR-3B Sales Data & HSN Summaries.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" /> Download JSON
                    </Button>
                    <Button variant="outline">
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
                        <Button className="w-full md:w-auto">
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
                        <div className="text-2xl font-bold">₹8,50,000</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total CGST + SGST</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-destructive">₹42,500</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">B2B Invoices</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">5</div>
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
                            <TableRow>
                                <TableCell className="font-mono">5007</TableCell>
                                <TableCell>Woven fabrics of Silk (Sarees)</TableCell>
                                <TableCell className="text-right">₹6,50,000</TableCell>
                                <TableCell className="text-right">5%</TableCell>
                                <TableCell className="text-right font-bold">₹32,500</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-mono">5208</TableCell>
                                <TableCell>Woven fabrics of Cotton</TableCell>
                                <TableCell className="text-right">₹2,00,000</TableCell>
                                <TableCell className="text-right">5%</TableCell>
                                <TableCell className="text-right font-bold">₹10,000</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default GstReports;
