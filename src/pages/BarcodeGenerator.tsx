import React, { useState, useRef } from 'react';
import Barcode from 'react-barcode';
import { useReactToPrint } from 'react-to-print';
import {
    Printer,
    RotateCcw,
    Search,
    Package,
    Settings2
} from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { Saree } from '@/types';
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
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const BarcodeGenerator: React.FC = () => {
    const { sarees } = useData();

    // State
    const [mode, setMode] = useState<'single' | 'sequence' | 'product'>('product');
    const [prefix, setPrefix] = useState('KS-');
    const [startNum, setStartNum] = useState(1001);
    const [count, setCount] = useState(24);
    const [copies, setCopies] = useState(1);
    const [labelType, setLabelType] = useState('A4-24'); // A4-24, A4-40, A4-65, Thermal

    const [selectedProduct, setSelectedProduct] = useState<Saree | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSeries, setIsSeries] = useState(false);

    // Formatting options
    const [showText, setShowText] = useState(true);
    const [width, setWidth] = useState(1.5);
    const [height, setHeight] = useState(30);

    const componentRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        contentRef: componentRef,
        documentTitle: `Barcodes-${new Date().toISOString().split('T')[0]}`,
    });

    const filteredSarees = sarees.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.barcode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.sareeCode.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 5);

    const generateCodes = () => {
        const codes = [];
        if (mode === 'product') {
            if (!selectedProduct) return [];
            if (isSeries) {
                // Sequential series starting from product's number
                const baseBarcode = selectedProduct.barcode;
                const match = baseBarcode.match(/^(.*?)(\d+)$/);
                const basePrefix = match ? match[1] : baseBarcode;
                const baseNum = match ? parseInt(match[2]) : 0;

                for (let i = 0; i < count; i++) {
                    codes.push(`${basePrefix}${baseNum + i}`);
                }
            } else {
                for (let i = 0; i < count; i++) {
                    codes.push(selectedProduct.barcode);
                }
            }
        } else if (mode === 'single') {
            const val = `${prefix}${startNum}`;
            for (let i = 0; i < count; i++) {
                codes.push(val);
            }
        } else {
            // Sequence
            for (let i = 0; i < count; i++) {
                const numStr = (startNum + i).toString();
                codes.push(`${prefix}${numStr}`);
            }
        }

        const finalCodes: string[] = [];
        codes.forEach(c => {
            for (let j = 0; j < copies; j++) {
                finalCodes.push(c);
            }
        });

        return finalCodes;
    };

    const barcodes = generateCodes();

    const getGridClass = () => {
        switch (labelType) {
            case 'A4-24': return 'grid-cols-2 gap-x-4 gap-y-8';
            case 'A4-40': return 'grid-cols-2 gap-x-2 gap-y-4';
            case 'A4-65': return 'grid-cols-2 gap-2';
            case 'Thermal': return 'grid-cols-1 gap-4 w-[300px] mx-auto';
            default: return 'grid-cols-2';
        }
    };

    return (
        <div className="flex flex-col gap-6 max-w-7xl mx-auto">
            <div className="flex items-center justify-between no-print">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight font-display text-primary">Barcode Generator</h1>
                    <p className="text-muted-foreground">Select products and generate barcode labels for printing.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => {
                        setStartNum(1001);
                        setCount(24);
                        setSelectedProduct(null);
                        setSearchTerm('');
                    }}>
                        <RotateCcw className="mr-2 h-4 w-4" /> Reset
                    </Button>
                    <Button onClick={handlePrint} disabled={barcodes.length === 0}>
                        <Printer className="mr-2 h-4 w-4" /> Print Labels
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[380px_1fr] no-print">
                {/* Controls */}
                <Card className="h-fit border-0 shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Settings2 className="h-5 w-5" /> Configuration
                        </CardTitle>
                        <CardDescription>Setup your label sequence or select product</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-3">
                            <Label>Generation Mode</Label>
                            <Select value={mode} onValueChange={(v: any) => setMode(v)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="product">Existing Product</SelectItem>
                                    <SelectItem value="sequence">Sequential Series</SelectItem>
                                    <SelectItem value="single">Single Manual Code</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {mode === 'product' ? (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Search Product</Label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            placeholder="Name, Code or Barcode..."
                                            className="pl-9"
                                            value={searchTerm}
                                            onChange={e => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                    {searchTerm && !selectedProduct && (
                                        <div className="mt-2 border rounded-md divide-y shadow-sm bg-white">
                                            {filteredSarees.map(s => (
                                                <div
                                                    key={s.id}
                                                    className="p-2 hover:bg-muted/50 cursor-pointer flex items-center justify-between"
                                                    onClick={() => {
                                                        setSelectedProduct(s);
                                                        setSearchTerm(s.name);
                                                        setCount(s.stockQty || 1);
                                                    }}
                                                >
                                                    <div>
                                                        <p className="text-sm font-medium">{s.name}</p>
                                                        <p className="text-xs text-muted-foreground">{s.sareeCode}</p>
                                                    </div>
                                                    <Badge variant="outline">₹{s.sellingPrice}</Badge>
                                                </div>
                                            ))}
                                            {filteredSarees.length === 0 && (
                                                <div className="p-4 text-center text-xs text-muted-foreground">No matches found</div>
                                            )}
                                        </div>
                                    )}
                                </div>
                                {selectedProduct && (
                                    <div className="space-y-4 pt-2">
                                        <div className="flex items-center justify-between p-2 bg-secondary/20 rounded-md">
                                            <div className="flex flex-col">
                                                <Label className="text-xs text-muted-foreground uppercase font-bold">Series Mode</Label>
                                                <span className="text-sm font-medium">Print distinct barcodes?</span>
                                            </div>
                                            <Switch checked={isSeries} onCheckedChange={setIsSeries} />
                                        </div>

                                        {isSeries && (
                                            <div className="p-3 bg-muted rounded-lg border border-dashed text-xs space-y-2">
                                                <p className="text-muted-foreground">Generating sequence starting from:</p>
                                                <p className="font-mono font-bold text-primary">{selectedProduct.barcode}</p>
                                                <p className="text-[10px] text-muted-foreground italic">*The system will increment the numeric part of the barcode.</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase text-muted-foreground">Link with Product Details (Optional)</Label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            placeholder="Search product template..."
                                            className="h-8 pl-9 text-xs"
                                            value={searchTerm}
                                            onChange={e => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                    {searchTerm && !selectedProduct && (
                                        <div className="mt-1 border rounded-md divide-y shadow-sm bg-white overflow-hidden">
                                            {filteredSarees.map(s => (
                                                <div
                                                    key={s.id}
                                                    className="p-2 hover:bg-muted/50 cursor-pointer flex items-center justify-between text-xs"
                                                    onClick={() => {
                                                        setSelectedProduct(s);
                                                        setSearchTerm(s.name);
                                                        // Auto-fill prefix/num from product
                                                        const match = s.barcode.match(/^(.*?)(\d+)$/);
                                                        if (match) {
                                                            setPrefix(match[1]);
                                                            setStartNum(parseInt(match[2]));
                                                        }
                                                    }}
                                                >
                                                    <span className="font-medium truncate mr-2">{s.name}</span>
                                                    <Badge variant="outline" className="text-[10px]">₹{s.sellingPrice}</Badge>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {selectedProduct && (
                                        <div className="flex items-center justify-between gap-2 p-2 bg-primary/5 rounded border border-primary/20">
                                            <span className="text-xs font-bold truncate">{selectedProduct.name}</span>
                                            <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => {
                                                setSelectedProduct(null);
                                                setSearchTerm('');
                                            }}>
                                                <RotateCcw className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    )}
                                </div>

                                <Separator />

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-2">
                                        <Label>Prefix</Label>
                                        <Input value={prefix} onChange={e => setPrefix(e.target.value)} placeholder="KS-" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Starting #</Label>
                                        <Input type="number" value={startNum} onChange={e => setStartNum(Number(e.target.value))} />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                                <Label>Label Count</Label>
                                <Input type="number" value={count} onChange={e => setCount(Number(e.target.value))} />
                            </div>
                            <div className="space-y-2">
                                <Label>Copies per Code</Label>
                                <Input type="number" value={copies} onChange={e => setCopies(Number(e.target.value))} />
                            </div>
                        </div>

                        <Separator />

                        <div className="space-y-3">
                            <Label>Paper Format</Label>
                            <Select value={labelType} onValueChange={setLabelType}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="A4-24">A4 Sheet (24 Labels)</SelectItem>
                                    <SelectItem value="A4-40">A4 Sheet (40 Labels)</SelectItem>
                                    <SelectItem value="A4-65">A4 Sheet (65 Labels)</SelectItem>
                                    <SelectItem value="Thermal">Thermal Printer Roll</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center justify-between">
                            <Label>Show Barcode Text</Label>
                            <Switch checked={showText} onCheckedChange={setShowText} />
                        </div>

                        <Separator />

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                                <Label>Barcode Width</Label>
                                <Input
                                    type="number"
                                    step="0.1"
                                    min="1"
                                    max="4"
                                    value={width}
                                    onChange={e => setWidth(parseFloat(e.target.value))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Barcode Height</Label>
                                <Input
                                    type="number"
                                    min="10"
                                    max="100"
                                    value={height}
                                    onChange={e => setHeight(Number(e.target.value))}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Preview Area */}
                <div className="bg-muted/30 p-8 rounded-lg min-h-[500px] border flex justify-center overflow-auto">
                    <div
                        ref={componentRef}
                        className={`bg-white p-8 shadow-sm ${labelType !== 'Thermal' ? 'w-[210mm] min-h-[297mm]' : 'w-[100mm] min-h-[150mm]'}`}
                        style={{ margin: '0 auto' }}
                    >
                        {barcodes.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2">
                                <Package className="h-12 w-12 opacity-20" />
                                <p>Select a product or series to see preview</p>
                            </div>
                        ) : (
                            <div className={`grid ${getGridClass()}`}>
                                {barcodes.map((code, idx) => (
                                    <div key={`${code}-${idx}`} className="flex flex-col items-center justify-center border border-dashed border-gray-200 p-2 min-h-[110px] text-black">
                                        <div className="text-[10px] font-bold mb-1 uppercase tracking-wider">My Silk Store</div>
                                        {selectedProduct && (
                                            <div className="text-[9px] truncate w-full text-center px-2">{selectedProduct.name}</div>
                                        )}
                                        <Barcode
                                            value={code}
                                            width={width}
                                            height={height}
                                            fontSize={10}
                                            displayValue={showText}
                                            margin={0}
                                        />
                                        <div className="flex justify-between w-full px-2 mt-1">
                                            <span className="text-[10px] font-bold">₹{selectedProduct?.sellingPrice || '0'}</span>
                                            <span className="text-[9px] font-mono">{selectedProduct?.sareeCode || ''}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style>
                {`
                    @media print {
                        .no-print { display: none !important; }
                        body { background: white; margin: 0; padding: 0; }
                        @page { margin: 10mm; size: auto; }
                    }
                `}
            </style>
        </div >
    );
};

export default BarcodeGenerator;
