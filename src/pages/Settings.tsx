import React, { useState } from 'react';
import {
    Building2,
    Printer,
    Database,
    Lock,
    Globe
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

const Settings: React.FC = () => {
    const handleSave = () => {
        toast.success('Settings Saved Successfully');
    };

    return (
        <div className="flex flex-col gap-6 max-w-4xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold tracking-tight font-display text-primary">Settings</h1>
                <p className="text-muted-foreground">Configure shop details, hardware and preferences.</p>
            </div>

            <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="general">Generic</TabsTrigger>
                    <TabsTrigger value="billing">Billing & Print</TabsTrigger>
                    <TabsTrigger value="data">Data & Backup</TabsTrigger>
                    <TabsTrigger value="advanced">Modules</TabsTrigger>
                </TabsList>

                {/* General Settings */}
                <TabsContent value="general" className="mt-6 space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Building2 className="h-5 w-5" /> Shop Details
                            </CardTitle>
                            <CardDescription>This information will appear on invoices.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Shop Name</Label>
                                    <Input defaultValue="Lakshmi Silks & Sarees" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Phone Number</Label>
                                    <Input defaultValue="9876543210" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Address Line 1</Label>
                                    <Input defaultValue="123, West Mada Street" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Address Line 2</Label>
                                    <Input defaultValue="Kanchipuram - 631501" />
                                </div>
                                <div className="space-y-2">
                                    <Label>GSTIN</Label>
                                    <Input defaultValue="33ABCDE1234F1Z5" />
                                </div>
                            </div>
                            <Button onClick={handleSave}>Save Changes</Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Billing Settings */}
                <TabsContent value="billing" className="mt-6 space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Printer className="h-5 w-5" /> Invoicing
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Enable GST Billing</Label>
                                    <p className="text-sm text-muted-foreground">Toggle tax calculation on bills.</p>
                                </div>
                                <Switch defaultChecked={true} />
                            </div>
                            <div className="flex items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Tamil Description</Label>
                                    <p className="text-sm text-muted-foreground">Print item names in Tamil on invoice.</p>
                                </div>
                                <Switch defaultChecked={true} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Default Printer</Label>
                                    <Input defaultValue="Thermal 80mm" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Bill Prefix</Label>
                                    <Input defaultValue="SILK-" />
                                </div>
                            </div>
                            <Button onClick={handleSave}>Save Preferences</Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Data Backup */}
                <TabsContent value="data" className="mt-6 space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Database className="h-5 w-5" /> Backup & Restore
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Auto Daily Backup</Label>
                                    <p className="text-sm text-muted-foreground">Backup data to local drive at 10 PM.</p>
                                </div>
                                <Switch defaultChecked={true} />
                            </div>
                            <div className="flex gap-4">
                                <Button variant="outline">Backup To Cloud (Google Drive)</Button>
                                <Button>Create Local Backup Now</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Advanced */}
                <TabsContent value="advanced" className="mt-6 space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Lock className="h-5 w-5" /> Module Management (Admin Only)
                            </CardTitle>
                            <CardDescription>Enable or disable features based on license.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-2">
                                <Label>Alteration Service Module</Label>
                                <Switch defaultChecked={true} />
                            </div>
                            <div className="flex items-center justify-between p-2">
                                <Label>Wholesale Billing Mode</Label>
                                <Switch defaultChecked={true} />
                            </div>
                            <div className="flex items-center justify-between p-2">
                                <Label>Supplier Management</Label>
                                <Switch defaultChecked={true} />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default Settings;
