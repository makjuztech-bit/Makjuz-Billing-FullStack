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
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
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
}

interface ExtraService {
  id: string;
  name: string;
  nameTamil: string;
  price: number;
  enabled: boolean;
}

const sampleProducts: BillItem[] = [
  {
    id: '1',
    barcode: 'KS-2024-001',
    name: 'Kanchipuram Pure Silk',
    designType: 'Temple',
    color: 'Maroon',
    borderType: 'Heavy Zari',
    zariType: 'Pure Gold',
    blouseIncluded: true,
    mrp: 25000,
    sellingPrice: 22500,
    discountPercent: 10,
    qty: 1,
  },
];

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
  const [items, setItems] = useState<BillItem[]>(sampleProducts);
  const [services, setServices] = useState<ExtraService[]>(extraServices);
  const [barcodeInput, setBarcodeInput] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerMobile, setCustomerMobile] = useState('');
  const [customerPlace, setCustomerPlace] = useState('');
  const [customerType, setCustomerType] = useState('retail');
  const [customerGst, setCustomerGst] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + item.sellingPrice * item.qty, 0);
  const servicesTotal = services.filter((s) => s.enabled).reduce((sum, s) => sum + s.price, 0);
  const totalBeforeDiscount = subtotal + servicesTotal;
  const discountValue = discountAmount || (totalBeforeDiscount * discountPercent) / 100;
  const gstAmount = 0; // GST logic can be added based on settings
  const roundOff = Math.round(totalBeforeDiscount - discountValue + gstAmount) - (totalBeforeDiscount - discountValue + gstAmount);
  const grandTotal = Math.round(totalBeforeDiscount - discountValue + gstAmount);

  const handleBarcodeSearch = () => {
    if (barcodeInput) {
      toast.success(`Searching for barcode: ${barcodeInput}`);
      setBarcodeInput('');
    }
  };

  const updateItemQty = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
      )
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

  const handleSavePrint = () => {
    toast.success('Bill saved and sent to printer!');
  };

  const handleWhatsApp = () => {
    toast.success('Invoice sent via WhatsApp!');
  };

  const handleHoldBill = () => {
    toast.info('Bill has been put on hold');
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
            {customerType === 'wholesale' && (
              <div className="mt-4">
                <Label htmlFor="customerGst">GST Number (B2B)</Label>
                <Input
                  id="customerGst"
                  placeholder="Enter GST number"
                  value={customerGst}
                  onChange={(e) => setCustomerGst(e.target.value)}
                  className="mt-2 max-w-xs"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Barcode/Search Panel */}
        <Card className="border-0 shadow-sm">
          <CardContent className="py-4">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Barcode className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder={t('billing.scanBarcode') + ' / Saree Code'}
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleBarcodeSearch()}
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
                className={`flex items-center justify-between rounded-lg border p-3 transition-colors ${
                  service.enabled ? 'border-primary bg-primary/5' : 'border-border'
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
          <Button variant="billSecondary">
            <Save className="mr-2 h-5 w-5" />
            Save Only
          </Button>
          <Button variant="billPrimary" onClick={handleSavePrint}>
            <Printer className="mr-2 h-5 w-5" />
            {t('billing.savePrint')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Billing;
