import React, { useState } from 'react';
import {
    Palette,
    Layout,
    Type,
    Languages,
    Save,
    Undo
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

const AdminCustomization: React.FC = () => {
    return (
        <div className="flex flex-col gap-6 max-w-4xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold tracking-tight font-display text-primary">Admin Customization</h1>
                <p className="text-muted-foreground">Tailor the software look and feel to your brand.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Visual Theme */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Palette className="h-5 w-5" /> Theme & Colors
                        </CardTitle>
                        <CardDescription>Customize primary colors and appearance.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Primary Color (Brand Color)</Label>
                            <div className="flex gap-2">
                                <div className="h-8 w-8 rounded-full bg-orange-800 cursor-pointer ring-2 ring-primary ring-offset-2"></div>
                                <div className="h-8 w-8 rounded-full bg-blue-800 cursor-pointer"></div>
                                <div className="h-8 w-8 rounded-full bg-green-800 cursor-pointer"></div>
                                <div className="h-8 w-8 rounded-full bg-purple-800 cursor-pointer"></div>
                                <div className="h-8 w-8 rounded-full bg-red-800 cursor-pointer"></div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Background Pattern</Label>
                            <Select defaultValue="silk">
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="silk">Silk Texture (Subtle)</SelectItem>
                                    <SelectItem value="minimal">Minimal / Plain</SelectItem>
                                    <SelectItem value="geometric">Geometric Shapes</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Dashboard Widgets */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Layout className="h-5 w-5" /> Dashboard Layout
                        </CardTitle>
                        <CardDescription>Toggle visible widgets on home screen.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Label>Show Today's Sales</Label>
                            <Switch defaultChecked={true} />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label>Show Pending Dues</Label>
                            <Switch defaultChecked={true} />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label>Show Fast Moving Items</Label>
                            <Switch defaultChecked={true} />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label>Show Low Stock Alerts</Label>
                            <Switch defaultChecked={true} />
                        </div>
                    </CardContent>
                </Card>

                {/* Invoice Customization */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Type className="h-5 w-5" /> Invoice Design
                        </CardTitle>
                        <CardDescription>Setup invoice headers, footers and disclaimers.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Header Font</Label>
                                <Select defaultValue="serif">
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="serif">Traditional Serif (Playfair)</SelectItem>
                                        <SelectItem value="sans">Modern Sans (Inter)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Footer Message</Label>
                                <Input defaultValue="Thank you! Visit Again." />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label>Terms & Conditions (appearing at bottom)</Label>
                                <Input defaultValue="Goods once sold cannot be returned. Exchange within 7 days." />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex justify-end gap-4 mt-4">
                <Button variant="outline">
                    <Undo className="mr-2 h-4 w-4" /> Reset to Default
                </Button>
                <Button className="w-40">
                    <Save className="mr-2 h-4 w-4" /> Save Changes
                </Button>
            </div>
        </div>
    );
};

export default AdminCustomization;
