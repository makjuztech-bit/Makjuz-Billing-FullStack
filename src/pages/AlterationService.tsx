import React, { useState } from 'react';
import {
    Scissors,
    Ruler,
    Calendar,
    User,
    Phone,
    CheckCircle2,
    Clock,
    Printer
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';

interface AlterationJob {
    id: string;
    customer: string;
    mobile: string;
    items: string; // concise description
    services: string[]; // e.g. Fall, Pico, Blouse
    status: 'Pending' | 'In Progress' | 'Ready' | 'Delivered';
    deliveryDate: string;
    amount: number;
}

const mockJobs: AlterationJob[] = [
    { id: 'JOB-101', customer: 'Deepa', mobile: '9988776655', items: '1x Kanchi Silk', services: ['Fall', 'Pico', 'Blouse Stitching'], status: 'In Progress', deliveryDate: '2024-03-25', amount: 850 },
    { id: 'JOB-102', customer: 'Sujatha', mobile: '9876543210', items: '2x Cotton', services: ['Fall', 'Pico'], status: 'Ready', deliveryDate: '2024-03-22', amount: 300 },
];

const AlterationService: React.FC = () => {
    const [jobs, setJobs] = useState<AlterationJob[]>(mockJobs);

    const handleStatusChange = (id: string) => {
        toast.success('Status updated and SMS sent to customer');
    };

    const handlePrint = (id: string) => {
        toast.info('Printing Service Slip...');
        // Print logic
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight font-display text-primary">Alterations & Tailoring</h1>
                <p className="text-muted-foreground">Manage fall, pico, embroidery and stitching services.</p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[400px_1fr]">
                {/* New Job Form */}
                <div className="space-y-6">
                    <Card className="border-l-4 border-l-primary shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Scissors className="h-5 w-5" /> New Job Entry
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Customer Mobile</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input placeholder="Search or Enter Mobile" className="pl-9" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Customer Name</Label>
                                <Input placeholder="Name" />
                            </div>
                            <div className="space-y-2">
                                <Label>Saree / Item Details</Label>
                                <Input placeholder="e.g. Red Kanchipuram" />
                            </div>

                            <div className="space-y-3 pt-2">
                                <Label>Services Required</Label>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox id="s1" />
                                        <label htmlFor="s1" className="text-sm font-medium">Fall + Pico</label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox id="s2" />
                                        <label htmlFor="s2" className="text-sm font-medium">Blouse Stitch</label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox id="s3" />
                                        <label htmlFor="s3" className="text-sm font-medium">Aari Work</label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox id="s4" />
                                        <label htmlFor="s4" className="text-sm font-medium">Polishing</label>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Est. Delivery</Label>
                                    <Input type="date" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Charges (₹)</Label>
                                    <Input type="number" placeholder="0" />
                                </div>
                            </div>

                            <Button className="w-full mt-2">Create Job Ticket</Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Job List */}
                <div className="space-y-6">
                    <Card className="border-0 shadow-sm h-full flex flex-col">
                        <CardHeader className="border-b pb-3">
                            <div className="flex justify-between items-center">
                                <CardTitle>Active Jobs</CardTitle>
                                <Badge variant="secondary">{jobs.length} Active</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0 flex-1">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Job ID</TableHead>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Service</TableHead>
                                        <TableHead>Delivery</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="w-[100px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {jobs.map((job) => (
                                        <TableRow key={job.id}>
                                            <TableCell className="font-mono text-xs">{job.id}</TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{job.customer}</span>
                                                    <span className="text-xs text-muted-foreground">{job.mobile}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-wrap gap-1">
                                                    {job.services.map(s => (
                                                        <Badge key={s} variant="outline" className="text-[10px] bg-muted/50">{s}</Badge>
                                                    ))}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-sm">{job.deliveryDate}</TableCell>
                                            <TableCell>
                                                <Badge className={`
                                                    ${job.status === 'Ready' ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}
                                                    ${job.status === 'In Progress' ? 'bg-blue-100 text-blue-800 hover:bg-blue-100' : ''}
                                                `}>
                                                    {job.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <Button variant="ghost" size="icon" onClick={() => handlePrint(job.id)}>
                                                        <Printer className="h-4 w-4 text-muted-foreground" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" onClick={() => handleStatusChange(job.id)}>
                                                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
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
            </div>
        </div>
    );
};

export default AlterationService;
