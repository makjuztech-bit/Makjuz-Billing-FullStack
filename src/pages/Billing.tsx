import React, { useState } from 'react';
import {
  Search,
  Barcode,
  User,
  Phone,
  MapPin,
  Plus,
  Minus,
  Trash2,
  Save,
  Printer,
  MessageSquare,
  Pause,
  X,
  CreditCard,
  Banknote,
  Smartphone,
  Building2,
  Gift,
  Scissors,
  Sparkles,
} from 'lucide-react';
import { useRef, useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';
import ReactBarcode from 'react-barcode';
import { useLanguage } from '@/contexts/LanguageContext';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { Checkbox } from '@/components/ui/checkbox';
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
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Saree } from '@/types';
import { API_URL } from '@/lib/config';

interface BillItem {
  id: string;
  barcode: string;
  name: string;
  designType: string;
  color: string;
  borderType: string;
  zariType: string;
  blouseIncluded: boolean;
  mrp: number;
  sellingPrice: number;
  discountPercent: number;
  qty: number;
  stockType: 'unique' | 'bulk';
}

interface ExtraService {
  id: string;
  name: string;
  nameTamil: string;
  price: number;
  enabled: boolean;
}

const extraServices: ExtraService[] = [
  { id: 'fallpico', name: 'Fall + Pico', nameTamil: 'ஃபால் + பிகோ', price: 250, enabled: false },
  { id: 'blouse', name: 'Blouse Stitching', nameTamil: 'பிளவுஸ் தையல்', price: 500, enabled: false },
  { id: 'aari', name: 'Aari Work', nameTamil: 'ஆரி வேலை', price: 1500, enabled: false },
  { id: 'gift', name: 'Gift Packing', nameTamil: 'பரிசு பேக்கிங்', price: 150, enabled: false },
];

const paymentMethods = [
  { id: 'cash', name: 'Cash', nameTamil: 'ரொக்கம்', icon: Banknote },
  { id: 'upi', name: 'UPI', nameTamil: 'UPI', icon: Smartphone },
  { id: 'card', name: 'Card', nameTamil: 'கார்டு', icon: CreditCard },
  { id: 'bank', name: 'Bank', nameTamil: 'வங்கி', icon: Building2 },
  { id: 'credit', name: 'Credit', nameTamil: 'கடன்', icon: CreditCard },
];

export const Billing: React.FC = () => {
  const { t, language } = useLanguage();
  const { sarees, addBill, settings } = useData();
  const [items, setItems] = useState<BillItem[]>([]);
  const [services, setServices] = useState<ExtraService[]>(extraServices);
  const [barcodeInput, setBarcodeInput] = useState('');
  const barcodeInputRef = useRef<HTMLInputElement>(null);

  // Search Dialog State
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<Saree[]>([]);

  const [customerName, setCustomerName] = useState('');
  const [customerMobile, setCustomerMobile] = useState('');
  const [customerPlace, setCustomerPlace] = useState('');
  const [customerType, setCustomerType] = useState('retail');
  const [customerGst, setCustomerGst] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);

  // Print Preview State
  const [isPrintPreviewOpen, setIsPrintPreviewOpen] = useState(false);
  const [lastBill, setLastBill] = useState<any>(null);
  const invoiceRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: invoiceRef,
    documentTitle: `Invoice-${lastBill?.billNo || lastBill?.id || 'new'}`,
    onAfterPrint: () => setIsPrintPreviewOpen(false),
  });

  // Fetch Customer Details
  useEffect(() => {
    const fetchCustomer = async () => {
      if (customerMobile.length === 10) {
        try {
          const res = await fetch(`${API_URL}/customers/search?query=${customerMobile}`);
          const data = await res.json();
          if (data && data.length > 0) {
            const customer = data[0];
            setCustomerName(customer.name);
            setCustomerPlace(customer.place);
            if (customer.type) setCustomerType(customer.type);
            toast.success('Customer details found!');
          }
        } catch (error) {
          console.error("Error fetching customer:", error);
        }
      }
    };

    // Debounce slightly or just run on length check
    const timeoutId = setTimeout(() => {
      fetchCustomer();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [customerMobile]);

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + item.sellingPrice * item.qty, 0);
  const servicesTotal = services.filter((s) => s.enabled).reduce((sum, s) => sum + s.price, 0);
  const totalBeforeDiscount = subtotal + servicesTotal;
  const discountValue = discountAmount || (totalBeforeDiscount * discountPercent) / 100;
  const gstAmount = 0; // GST logic can be added based on settings
  const roundOff = Math.round(totalBeforeDiscount - discountValue + gstAmount) - (totalBeforeDiscount - discountValue + gstAmount);
  const grandTotal = Math.round(totalBeforeDiscount - discountValue + gstAmount);

  // Auto-focus barcode input on mount
  useEffect(() => {
    if (barcodeInputRef.current) {
      barcodeInputRef.current.focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      // F1: Focus Barcode
      if (e.key === 'F1') {
        e.preventDefault();
        barcodeInputRef.current?.focus();
      }
      // F2: Save & Print
      if (e.key === 'F2') {
        e.preventDefault();
        handleSaveBill(true);
      }
      // F3: Save Only
      if (e.key === 'F3') {
        e.preventDefault();
        handleSaveBill(false);
      }
      // F4: Hold Bill
      if (e.key === 'F4') {
        e.preventDefault();
        handleHoldBill();
      }
      // F10: New Bill
      if (e.key === 'F10') {
        e.preventDefault();
        setItems([]);
        setCustomerName('');
        setCustomerMobile('');
        setCustomerPlace('');
        setDiscountPercent(0);
        setPaymentMethod('cash');
        toast.info('Form cleared for new bill');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const addItemToBill = (saree: Saree) => {
    if (saree.stockQty <= 0) {
      toast.error(`${saree.name} is out of stock!`);
      return;
    }

    const existingItem = items.find(i => i.barcode === saree.barcode);

    if (existingItem) {
      if (existingItem.stockType === 'unique') {
        toast.warning('Unique items cannot have quantity > 1');
        return;
      }

      if (existingItem.qty + 1 > saree.stockQty) {
        toast.error(`Only ${saree.stockQty} units available in stock`);
        return;
      }

      updateItemQty(existingItem.id, 1);
      toast.success(`Quantity updated for ${saree.name}`);
    } else {
      const newProduct: BillItem = {
        id: saree.id,
        barcode: saree.barcode,
        name: saree.name,
        designType: saree.designType,
        color: saree.color,
        borderType: saree.borderType,
        zariType: saree.zariType,
        blouseIncluded: saree.blouseIncluded,
        mrp: saree.mrp,
        sellingPrice: saree.sellingPrice,
        discountPercent: 0,
        qty: 1,
        stockType: saree.stockType
      };
      setItems((prev) => [...prev, newProduct]);
      toast.success(`${saree.name} added`);
    }
    setSearchOpen(false);

    // Maintain focus
    setTimeout(() => {
      if (barcodeInputRef.current) {
        barcodeInputRef.current.focus();
      }
    }, 100);
  };

  const handleBarcodeSearch = () => {
    if (barcodeInput) {
      // 1. Try Exact Match
      const exactMatch = sarees.find(s => s.barcode.toLowerCase() === barcodeInput.toLowerCase() || s.sareeCode.toLowerCase() === barcodeInput.toLowerCase());

      if (exactMatch) {
        addItemToBill(exactMatch);
        setBarcodeInput('');
        return;
      }

      // 2. Try Search by Name/Category
      const partialMatches = sarees.filter(s =>
        s.name.toLowerCase().includes(barcodeInput.toLowerCase()) ||
        s.category.toLowerCase().includes(barcodeInput.toLowerCase()) ||
        s.color.toLowerCase().includes(barcodeInput.toLowerCase())
      );

      if (partialMatches.length > 0) {
        setSearchResults(partialMatches);
        setSearchOpen(true);
      } else {
        toast.error('No matching products found');
        setBarcodeInput(''); // Clear if nothing at all
      }
    }
  };

  const updateItemQty = (id: string, delta: number) => {
    const saree = sarees.find(s => s.id === id);
    if (!saree && delta > 0) return;

    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          if (item.stockType === 'unique' && delta > 0) {
            toast.warning('Unique items cannot have quantity > 1');
            return item;
          }

          if (delta > 0 && item.qty + delta > (saree?.stockQty || 0)) {
            toast.error(`Only ${saree?.stockQty} units available in stock`);
            return item;
          }

          return { ...item, qty: Math.max(1, item.qty + delta) };
        }
        return item;
      })
    );
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleService = (id: string) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  };

  const handleSaveBill = (print: boolean) => {
    if (items.length === 0) {
      toast.error("No items in bill");
      return;
    }

    const billData: any = { // Using any to bypass local interface vs global interface mismatch for now
      id: Date.now().toString(), // Backend will ignore or overwrite
      items: items.map(item => ({
        sareeId: item.id,
        barcode: item.barcode,
        name: item.name,
        qty: item.qty,
        sellingPrice: item.sellingPrice,
        mrp: item.mrp,
        total: item.sellingPrice * item.qty
      })),
      customerName,
      customerMobile,
      customerPlace,
      customerType,
      customerGst,
      subtotal,
      discountPercent,
      discountAmount: discountValue,
      gstAmount,
      roundOff,
      grandTotal,
      paymentMethod,
      status: 'Paid',
      date: new Date().toISOString().split('T')[0]
    };

    const saveProcess = async () => {
      try {
        await addBill(billData);
        setLastBill(billData);

        if (print) {
          setIsPrintPreviewOpen(true);
          toast.success('Bill saved! Opening print preview...');
        } else {
          toast.success('Bill saved successfully!');
        }

        // Clear form
        setItems([]);
        setCustomerName('');
        setCustomerMobile('');
        setCustomerPlace('');
        setDiscountPercent(0);
        setPaymentMethod('cash');
      } catch (error) {
        console.error("Save failed:", error);
        toast.error("Failed to save bill. Please try again.");
      }
    };

    saveProcess();
  };

  const handleSavePrint = () => handleSaveBill(true);
  const handleSaveOnly = () => handleSaveBill(false);

  const handleWhatsApp = () => {
    if (!customerMobile || customerMobile.length < 10) {
      toast.error("Valid customer mobile required for WhatsApp");
      return;
    }
    const text = `Namaste ${customerName || 'Customer'}! Thank you for shopping with My Silk Store. Your bill for ₹${grandTotal} has been generated.`;
    window.open(`https://wa.me/91${customerMobile}?text=${encodeURIComponent(text)}`, '_blank');
    toast.success('WhatsApp link opened!');
  };

  const handleHoldBill = () => {
    if (items.length === 0) {
      toast.error("No items to hold");
      return;
    }

    const billData: any = {
      items: items.map(item => ({
        sareeId: item.id,
        barcode: item.barcode,
        name: item.name,
        qty: item.qty,
        sellingPrice: item.sellingPrice,
        mrp: item.mrp,
        total: item.sellingPrice * item.qty
      })),
      customerName,
      customerMobile,
      customerPlace,
      customerType,
      subtotal,
      grandTotal,
      status: 'Hold',
      date: new Date().toISOString().split('T')[0]
    };

    addBill(billData);
    toast.info('Bill has been put on hold');

    // Clear form
    setItems([]);
    setCustomerName('');
    setCustomerMobile('');
    setCustomerPlace('');
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col gap-4 lg:flex-row">
      {/* Left Panel - Customer & Products */}
      <div className="flex flex-1 flex-col gap-4 overflow-auto">
        {/* Customer Panel */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 font-display text-lg">
              <User className="h-5 w-5 text-primary" />
              {t('billing.customer')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="customerName">Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="customerName"
                    placeholder="Customer name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerMobile">{t('billing.mobile')}</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="customerMobile"
                    placeholder="Mobile number"
                    value={customerMobile}
                    onChange={(e) => setCustomerMobile(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerPlace">Place</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="customerPlace"
                    placeholder="City/Town"
                    value={customerPlace}
                    onChange={(e) => setCustomerPlace(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Customer Type</Label>
                <Select value={customerType} onValueChange={setCustomerType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="wholesale">Wholesale</SelectItem>
                    <SelectItem value="vip">VIP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Barcode/Search Panel */}
        <Card className="border-0 shadow-sm">
          <CardContent className="py-4">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Barcode className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  ref={barcodeInputRef}
                  autoFocus
                  placeholder={t('billing.scanBarcode') + ' / Saree Code'}
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleBarcodeSearch()}
                  className="h-12 pl-12 text-lg"
                />
              </div>
              <Button variant="gold" size="lg" onClick={handleBarcodeSearch}>
                <Search className="mr-2 h-5 w-5" />
                {t('common.search')}
              </Button>
              <Button variant="outline" size="lg">
                <Plus className="mr-2 h-5 w-5" />
                Manual Add
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Items Table */}
        <Card className="flex-1 border-0 shadow-sm overflow-auto">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[100px]">Code</TableHead>
                  <TableHead>Saree Details</TableHead>
                  <TableHead className="text-center">Blouse</TableHead>
                  <TableHead className="text-right">MRP</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-center">Qty</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id} className="hover:bg-muted/30">
                    <TableCell className="font-mono text-sm">{item.barcode}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.color} • {item.borderType} • {item.zariType}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {item.blouseIncluded ? (
                        <Badge variant="outline" className="bg-success/10 text-success">Yes</Badge>
                      ) : (
                        <Badge variant="outline">No</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground line-through">
                      ₹{item.mrp.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      ₹{item.sellingPrice.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => updateItemQty(item.id, -1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center font-semibold">{item.qty}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => updateItemQty(item.id, 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-bold">
                      ₹{(item.sellingPrice * item.qty).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:bg-destructive/10"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {items.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                      Scan barcode or search saree to add items
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Right Panel - Services & Summary */}
      <div className="flex w-full flex-col gap-4 lg:w-96">
        {/* Extra Services */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 font-display text-lg">
              <Scissors className="h-5 w-5 text-primary" />
              Extra Services
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {services.map((service) => (
              <div
                key={service.id}
                className={`flex items-center justify-between rounded-lg border p-3 transition-colors ${service.enabled ? 'border-primary bg-primary/5' : 'border-border'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <Checkbox
                    id={service.id}
                    checked={service.enabled}
                    onCheckedChange={() => toggleService(service.id)}
                  />
                  <label htmlFor={service.id} className="cursor-pointer">
                    <p className="font-medium">{service.name}</p>
                    <p className="text-xs text-muted-foreground font-tamil">{service.nameTamil}</p>
                  </label>
                </div>
                <span className="font-semibold">₹{service.price}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Bill Summary */}
        <Card className="flex-1 border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-lg">Bill Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Summary Lines */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t('billing.subtotal')}</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              {servicesTotal > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Services</span>
                  <span>₹{servicesTotal.toLocaleString()}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t('billing.discount')}</span>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={discountPercent}
                    onChange={(e) => {
                      setDiscountPercent(Number(e.target.value));
                      setDiscountAmount(0);
                    }}
                    className="h-8 w-16 text-center"
                    placeholder="%"
                  />
                  <span>%</span>
                </div>
              </div>
              {gstAmount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t('billing.gst')}</span>
                  <span>₹{gstAmount.toLocaleString()}</span>
                </div>
              )}
              {roundOff !== 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Round Off</span>
                  <span>{roundOff > 0 ? '+' : ''}₹{roundOff.toFixed(2)}</span>
                </div>
              )}
            </div>

            <Separator />

            {/* Grand Total */}
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold">{t('billing.grandTotal')}</span>
              <span className="text-2xl font-bold text-primary">
                ₹{grandTotal.toLocaleString()}
              </span>
            </div>

            <Separator />

            {/* Payment Methods */}
            <div className="space-y-2">
              <Label>{t('billing.payment')}</Label>
              <div className="grid grid-cols-3 gap-2">
                {paymentMethods.map((method) => (
                  <Button
                    key={method.id}
                    variant={paymentMethod === method.id ? 'default' : 'outline'}
                    size="sm"
                    className="flex flex-col gap-1 h-auto py-2"
                    onClick={() => setPaymentMethod(method.id)}
                  >
                    <method.icon className="h-4 w-4" />
                    <span className="text-xs">{language === 'ta' ? method.nameTamil : method.name}</span>
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button variant="billOutline" onClick={handleHoldBill}>
            <Pause className="mr-2 h-5 w-5" />
            {t('billing.holdBill')}
          </Button>
          <Button variant="info" onClick={handleWhatsApp}>
            <MessageSquare className="mr-2 h-5 w-5" />
            WhatsApp
          </Button>
          <Button variant="billSecondary" onClick={handleSaveOnly}>
            <Save className="mr-2 h-5 w-5" />
            Save Only
          </Button>
          <Button variant="billPrimary" onClick={handleSavePrint}>
            <Printer className="mr-2 h-5 w-5" />
            {t('billing.savePrint')}
          </Button>
        </div>
      </div>

      {/* Product Search Dialog */}
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Product Search Results</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-auto border rounded-md mt-2">
            <Table>
              <TableHeader className="sticky top-0 bg-background z-10">
                <TableRow>
                  <TableHead>Barcode</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Color</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {searchResults.map(saree => (
                  <TableRow key={saree.id} className="cursor-pointer hover:bg-muted/50" onClick={() => addItemToBill(saree)}>
                    <TableCell className="font-mono">{saree.barcode}</TableCell>
                    <TableCell>{saree.name}</TableCell>
                    <TableCell>{saree.category}</TableCell>
                    <TableCell>{saree.color}</TableCell>
                    <TableCell className="text-right">₹{saree.sellingPrice.toLocaleString()}</TableCell>
                    <TableCell>
                      <Button size="sm" variant="ghost" className="h-6 opacity-0 group-hover:opacity-100">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="pt-2 text-xs text-muted-foreground text-center">
            Found {searchResults.length} matching items. Click to add to bill.
          </div>
        </DialogContent>
      </Dialog>

      {/* Invoice Print Preview Dialog */}
      <Dialog open={isPrintPreviewOpen} onOpenChange={setIsPrintPreviewOpen}>
        <DialogContent className="max-w-[800px] h-[90vh] flex flex-col p-0 overflow-hidden bg-zinc-100">
          <div className="flex-1 overflow-auto p-8">
            {/* Printable Content */}
            <div
              ref={invoiceRef}
              className="bg-white p-10 shadow-lg mx-auto w-[210mm] min-h-[297mm] text-black text-sm"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {/* Header */}
              <div className="flex justify-between items-start border-b-2 border-primary pb-6 mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-primary uppercase tracking-tighter">{settings?.shopName || 'MY SILK STORE'}</h1>
                  <p className="text-muted-foreground max-w-[250px] mt-1">
                    {settings?.address1 || '123 Silk Street'}, {settings?.address2 || 'Kanchipuram, Tamil Nadu - 631501'}
                  </p>
                  <p className="text-sm font-medium mt-1">PH: +91 {settings?.phone || '98765 43210'}</p>
                </div>
                <div className="text-right">
                  <h2 className="text-xl font-bold uppercase tracking-widest text-zinc-400">Tax Invoice</h2>
                  <div className="mt-4 space-y-1">
                    <p><span className="font-bold">Bill No:</span> {lastBill?.id?.slice(-6).toUpperCase()}</p>
                    <p><span className="font-bold">Date:</span> {lastBill?.date}</p>
                    <p><span className="font-bold">Order Type:</span> Retail</p>
                  </div>
                </div>
              </div>

              {/* Customer Details */}
              <div className="grid grid-cols-2 gap-8 mb-8 bg-zinc-50 p-4 rounded-lg">
                <div>
                  <p className="text-xs uppercase font-bold text-zinc-400 mb-1">Billed To</p>
                  <p className="font-bold text-lg">{lastBill?.customerName || 'Cash Customer'}</p>
                  {lastBill?.customerMobile && <p>Mob: {lastBill.customerMobile}</p>}
                  {lastBill?.customerPlace && <p>Place: {lastBill.customerPlace}</p>}
                </div>
              </div>

              {/* Table */}
              <table className="w-full mb-8">
                <thead>
                  <tr className="border-b-2 border-zinc-200">
                    <th className="text-left py-3 px-2 font-bold uppercase text-xs">#</th>
                    <th className="text-left py-3 px-2 font-bold uppercase text-xs">Description</th>
                    <th className="text-right py-3 px-2 font-bold uppercase text-xs">MRP</th>
                    <th className="text-right py-3 px-2 font-bold uppercase text-xs">Rate</th>
                    <th className="text-center py-3 px-2 font-bold uppercase text-xs">Qty</th>
                    <th className="text-right py-3 px-2 font-bold uppercase text-xs">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {lastBill?.items.map((item: any, idx: number) => (
                    <tr key={idx}>
                      <td className="py-4 px-2">{idx + 1}</td>
                      <td className="py-4 px-2">
                        <p className="font-bold">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.barcode}</p>
                      </td>
                      <td className="py-4 px-2 text-right">₹{item.mrp.toLocaleString()}</td>
                      <td className="py-4 px-2 text-right">₹{item.sellingPrice.toLocaleString()}</td>
                      <td className="py-4 px-2 text-center">{item.qty}</td>
                      <td className="py-4 px-2 text-right font-bold">₹{item.total.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Summary */}
              <div className="flex justify-end mb-8">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Subtotal</span>
                    <span className="font-bold">₹{lastBill?.subtotal.toLocaleString()}</span>
                  </div>
                  {lastBill?.discountAmount > 0 && (
                    <div className="flex justify-between text-destructive">
                      <span>Discount ({lastBill?.discountPercent}%)</span>
                      <span className="font-bold">-₹{lastBill?.discountAmount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-2 border-t-2 border-primary mt-2">
                    <span className="text-lg font-bold">Grand Total</span>
                    <span className="text-xl font-black text-primary">₹{lastBill?.grandTotal.toLocaleString()}</span>
                  </div>
                  <div className="text-right text-[10px] text-muted-foreground italic">
                    {paymentMethod.toUpperCase()} PAYMENT
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t pt-8 mt-12 grid grid-cols-2 gap-8 h-40">
                <div className="flex flex-col justify-end">
                  <div className="mb-4">
                    <ReactBarcode value={lastBill?.id || '000000'} height={30} width={1.5} fontSize={10} />
                  </div>
                  <p className="text-xs text-muted-foreground">Thank you for shopping with {settings?.shopName || 'vv collection'}!</p>
                  <p className="text-[10px] text-muted-foreground mt-1 text-zinc-400">All disputes subject to local jurisdiction.</p>
                </div>
                <div className="flex flex-col items-center justify-end">
                  <div className="w-40 border-b border-zinc-400 mb-2"></div>
                  <p className="font-bold uppercase text-xs">Authorized Signatory</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border-t p-4 flex justify-end gap-3 no-print">
            <Button variant="outline" onClick={() => setIsPrintPreviewOpen(false)}>Close Preview</Button>
            <Button variant="billPrimary" onClick={handlePrint} size="lg">
              <Printer className="mr-2 h-5 w-5" />
              Print Now
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Billing;
