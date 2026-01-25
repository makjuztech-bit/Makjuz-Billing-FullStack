import React, { useState } from 'react';
import {
  Search,
  Plus,
  Filter,
  Download,
  Upload,
  Printer,
  Copy,
  Save,
  RotateCcw,
  Image as ImageIcon,
  Barcode,
  Tag,
  Package,
  Edit,
  Trash2,
  Eye,
  ChevronDown,
  X,
  Check,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

// Saree attribute options
const categories = [
  { value: 'kanchipuram', label: 'Kanchipuram Silk', labelTa: 'காஞ்சிபுரம் பட்டு' },
  { value: 'banarasi', label: 'Banarasi Silk', labelTa: 'பனாரஸ் பட்டு' },
  { value: 'mysore', label: 'Mysore Silk', labelTa: 'மைசூர் பட்டு' },
  { value: 'chanderi', label: 'Chanderi Silk', labelTa: 'சந்தேரி பட்டு' },
  { value: 'tussar', label: 'Tussar Silk', labelTa: 'துஸ்ஸர் பட்டு' },
  { value: 'patola', label: 'Patola Silk', labelTa: 'பட்டோலா பட்டு' },
  { value: 'paithani', label: 'Paithani Silk', labelTa: 'பைதானி பட்டு' },
  { value: 'cotton', label: 'Cotton Silk', labelTa: 'காட்டன் பட்டு' },
];

const zariTypes = [
  { value: 'pure_gold', label: 'Pure Gold Zari', labelTa: 'தூய தங்க ஜரி' },
  { value: 'pure_silver', label: 'Pure Silver Zari', labelTa: 'தூய வெள்ளி ஜரி' },
  { value: 'tested_zari', label: 'Tested Zari', labelTa: 'டெஸ்டட் ஜரி' },
  { value: 'half_fine', label: 'Half Fine Zari', labelTa: 'ஹாஃப் ஃபைன் ஜரி' },
  { value: 'imitation', label: 'Imitation Zari', labelTa: 'இமிடேஷன் ஜரி' },
  { value: 'copper', label: 'Copper Zari', labelTa: 'காப்பர் ஜரி' },
];

const borderTypes = [
  { value: 'temple', label: 'Temple Border', labelTa: 'கோவில் பார்டர்' },
  { value: 'peacock', label: 'Peacock Border', labelTa: 'மயில் பார்டர்' },
  { value: 'mango', label: 'Mango Border', labelTa: 'மாங்காய் பார்டர்' },
  { value: 'checks', label: 'Checks Border', labelTa: 'செக்ஸ் பார்டர்' },
  { value: 'plain', label: 'Plain Border', labelTa: 'ப்ளெயின் பார்டர்' },
  { value: 'contrast', label: 'Contrast Border', labelTa: 'கான்ட்ராஸ்ட் பார்டர்' },
  { value: 'heavy', label: 'Heavy Border', labelTa: 'ஹெவி பார்டர்' },
];

const designTypes = [
  { value: 'traditional', label: 'Traditional', labelTa: 'பாரம்பரியம்' },
  { value: 'contemporary', label: 'Contemporary', labelTa: 'நவீன' },
  { value: 'bridal', label: 'Bridal', labelTa: 'மணப்பெண்' },
  { value: 'party', label: 'Party Wear', labelTa: 'பார்ட்டி வேர்' },
  { value: 'casual', label: 'Casual', labelTa: 'கேஷுவல்' },
  { value: 'festive', label: 'Festive', labelTa: 'பண்டிகை' },
];

const colors = [
  { value: 'maroon', label: 'Maroon', labelTa: 'மரூன்', hex: '#800000' },
  { value: 'red', label: 'Red', labelTa: 'சிவப்பு', hex: '#DC143C' },
  { value: 'green', label: 'Green', labelTa: 'பச்சை', hex: '#228B22' },
  { value: 'blue', label: 'Blue', labelTa: 'நீலம்', hex: '#000080' },
  { value: 'purple', label: 'Purple', labelTa: 'ஊதா', hex: '#800080' },
  { value: 'pink', label: 'Pink', labelTa: 'இளஞ்சிவப்பு', hex: '#FF69B4' },
  { value: 'orange', label: 'Orange', labelTa: 'ஆரஞ்சு', hex: '#FF8C00' },
  { value: 'yellow', label: 'Yellow', labelTa: 'மஞ்சள்', hex: '#FFD700' },
  { value: 'gold', label: 'Gold', labelTa: 'தங்கம்', hex: '#DAA520' },
  { value: 'cream', label: 'Cream', labelTa: 'க்ரீம்', hex: '#FFFDD0' },
  { value: 'white', label: 'White', labelTa: 'வெள்ளை', hex: '#FFFAFA' },
  { value: 'black', label: 'Black', labelTa: 'கருப்பு', hex: '#1a1a1a' },
];

const materials = [
  { value: 'pure_silk', label: 'Pure Silk', labelTa: 'தூய பட்டு' },
  { value: 'art_silk', label: 'Art Silk', labelTa: 'ஆர்ட் சில்க்' },
  { value: 'silk_cotton', label: 'Silk Cotton', labelTa: 'பட்டு காட்டன்' },
  { value: 'organza', label: 'Organza Silk', labelTa: 'ஆர்கன்சா' },
  { value: 'crepe', label: 'Crepe Silk', labelTa: 'க்ரேப் சில்க்' },
];

interface Saree {
  id: string;
  sareeCode: string;
  barcode: string;
  name: string;
  nameTamil: string;
  category: string;
  brand: string;
  material: string;
  zariType: string;
  borderType: string;
  color: string;
  designType: string;
  length: string;
  weight: string;
  blouseIncluded: boolean;
  blousePiece: string;
  purchasePrice: number;
  sellingPrice: number;
  mrp: number;
  gstPercent: number;
  stockType: 'unique' | 'bulk';
  stockQty: number;
  rackLocation: string;
  supplier: string;
  images: string[];
  description: string;
  status: 'available' | 'sold' | 'reserved' | 'damaged';
  addedDate: string;
}

const sampleSarees: Saree[] = [
  {
    id: '1',
    sareeCode: 'KS-2024-001',
    barcode: '8901234567890',
    name: 'Kanchipuram Pure Silk - Temple Border',
    nameTamil: 'காஞ்சிபுரம் தூய பட்டு - கோவில் பார்டர்',
    category: 'kanchipuram',
    brand: 'Sri Kumaran',
    material: 'pure_silk',
    zariType: 'pure_gold',
    borderType: 'temple',
    color: 'maroon',
    designType: 'bridal',
    length: '6.3 meters',
    weight: '850 grams',
    blouseIncluded: true,
    blousePiece: '0.8 meters',
    purchasePrice: 18000,
    sellingPrice: 22500,
    mrp: 25000,
    gstPercent: 5,
    stockType: 'unique',
    stockQty: 1,
    rackLocation: 'A1-01',
    supplier: 'Kanchipuram Weavers Co-op',
    images: [],
    description: 'Premium Kanchipuram silk with pure gold zari temple border, ideal for weddings',
    status: 'available',
    addedDate: '2024-01-15',
  },
  {
    id: '2',
    sareeCode: 'KS-2024-002',
    barcode: '8901234567891',
    name: 'Banarasi Silk - Peacock Design',
    nameTamil: 'பனாரஸ் பட்டு - மயில் டிசைன்',
    category: 'banarasi',
    brand: 'Varanasi Silks',
    material: 'pure_silk',
    zariType: 'tested_zari',
    borderType: 'peacock',
    color: 'green',
    designType: 'traditional',
    length: '6.3 meters',
    weight: '720 grams',
    blouseIncluded: true,
    blousePiece: '0.8 meters',
    purchasePrice: 12000,
    sellingPrice: 15500,
    mrp: 18000,
    gstPercent: 5,
    stockType: 'unique',
    stockQty: 1,
    rackLocation: 'B2-05',
    supplier: 'Varanasi Handloom',
    images: [],
    description: 'Elegant Banarasi silk with intricate peacock motifs',
    status: 'available',
    addedDate: '2024-01-18',
  },
  {
    id: '3',
    sareeCode: 'MS-2024-001',
    barcode: '8901234567892',
    name: 'Mysore Silk - Plain Border',
    nameTamil: 'மைசூர் பட்டு - ப்ளெயின் பார்டர்',
    category: 'mysore',
    brand: 'Karnataka Silks',
    material: 'pure_silk',
    zariType: 'half_fine',
    borderType: 'plain',
    color: 'gold',
    designType: 'casual',
    length: '6.3 meters',
    weight: '550 grams',
    blouseIncluded: true,
    blousePiece: '0.8 meters',
    purchasePrice: 5500,
    sellingPrice: 7500,
    mrp: 8500,
    gstPercent: 5,
    stockType: 'bulk',
    stockQty: 5,
    rackLocation: 'C3-02',
    supplier: 'Mysore Silk Factory',
    images: [],
    description: 'Classic Mysore silk with subtle elegance',
    status: 'available',
    addedDate: '2024-01-20',
  },
];

export const SareeMaster: React.FC = () => {
  const { t, language } = useLanguage();
  const [sarees, setSarees] = useState<Saree[]>(sampleSarees);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedSaree, setSelectedSaree] = useState<Saree | null>(null);
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);
  const [selectedForPrint, setSelectedForPrint] = useState<string[]>([]);

  // Form state for new/edit saree
  const [formData, setFormData] = useState<Partial<Saree>>({
    sareeCode: '',
    barcode: '',
    name: '',
    nameTamil: '',
    category: 'kanchipuram',
    brand: '',
    material: 'pure_silk',
    zariType: 'pure_gold',
    borderType: 'temple',
    color: 'maroon',
    designType: 'traditional',
    length: '6.3 meters',
    weight: '',
    blouseIncluded: true,
    blousePiece: '0.8 meters',
    purchasePrice: 0,
    sellingPrice: 0,
    mrp: 0,
    gstPercent: 5,
    stockType: 'unique',
    stockQty: 1,
    rackLocation: '',
    supplier: '',
    description: '',
  });

  const generateBarcode = () => {
    const barcode = '890' + Math.floor(Math.random() * 10000000000).toString().padStart(10, '0');
    setFormData({ ...formData, barcode });
  };

  const generateSareeCode = () => {
    const prefix = formData.category?.substring(0, 2).toUpperCase() || 'XX';
    const year = new Date().getFullYear();
    const num = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    setFormData({ ...formData, sareeCode: `${prefix}-${year}-${num}` });
  };

  const handleSave = () => {
    if (!formData.name || !formData.barcode || !formData.sareeCode) {
      toast.error('Please fill required fields');
      return;
    }

    const newSaree: Saree = {
      id: Date.now().toString(),
      sareeCode: formData.sareeCode || '',
      barcode: formData.barcode || '',
      name: formData.name || '',
      nameTamil: formData.nameTamil || '',
      category: formData.category || 'kanchipuram',
      brand: formData.brand || '',
      material: formData.material || 'pure_silk',
      zariType: formData.zariType || 'pure_gold',
      borderType: formData.borderType || 'temple',
      color: formData.color || 'maroon',
      designType: formData.designType || 'traditional',
      length: formData.length || '6.3 meters',
      weight: formData.weight || '',
      blouseIncluded: formData.blouseIncluded ?? true,
      blousePiece: formData.blousePiece || '',
      purchasePrice: formData.purchasePrice || 0,
      sellingPrice: formData.sellingPrice || 0,
      mrp: formData.mrp || 0,
      gstPercent: formData.gstPercent || 5,
      stockType: formData.stockType || 'unique',
      stockQty: formData.stockQty || 1,
      rackLocation: formData.rackLocation || '',
      supplier: formData.supplier || '',
      images: [],
      description: formData.description || '',
      status: 'available',
      addedDate: new Date().toISOString().split('T')[0],
    };

    setSarees([...sarees, newSaree]);
    setIsAddDialogOpen(false);
    toast.success('Saree added successfully!');
    resetForm();
  };

  const handleSaveAndPrint = () => {
    handleSave();
    toast.success('Barcode tag sent to printer!');
  };

  const resetForm = () => {
    setFormData({
      sareeCode: '',
      barcode: '',
      name: '',
      nameTamil: '',
      category: 'kanchipuram',
      brand: '',
      material: 'pure_silk',
      zariType: 'pure_gold',
      borderType: 'temple',
      color: 'maroon',
      designType: 'traditional',
      length: '6.3 meters',
      weight: '',
      blouseIncluded: true,
      blousePiece: '0.8 meters',
      purchasePrice: 0,
      sellingPrice: 0,
      mrp: 0,
      gstPercent: 5,
      stockType: 'unique',
      stockQty: 1,
      rackLocation: '',
      supplier: '',
      description: '',
    });
  };

  const filteredSarees = sarees.filter((saree) => {
    const matchesSearch =
      saree.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      saree.sareeCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      saree.barcode.includes(searchQuery);
    const matchesCategory = selectedCategory === 'all' || saree.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || saree.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const togglePrintSelection = (id: string) => {
    setSelectedForPrint((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-success/10 text-success border-success/20">Available</Badge>;
      case 'sold':
        return <Badge className="bg-muted text-muted-foreground">Sold</Badge>;
      case 'reserved':
        return <Badge className="bg-warning/10 text-warning border-warning/20">Reserved</Badge>;
      case 'damaged':
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Damaged</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getCategoryLabel = (value: string) => {
    const cat = categories.find((c) => c.value === value);
    return language === 'ta' ? cat?.labelTa : cat?.label;
  };

  const getColorHex = (value: string) => {
    return colors.find((c) => c.value === value)?.hex || '#000';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            {t('nav.products')}
          </h1>
          <p className="mt-1 text-muted-foreground">
            Manage your saree inventory and product details
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="gold">
                <Plus className="mr-2 h-4 w-4" />
                Add Saree
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-background">
              <DialogHeader>
                <DialogTitle className="font-display text-xl">Add New Saree</DialogTitle>
                <DialogDescription>
                  Enter complete details of the saree product
                </DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="attributes">Attributes</TabsTrigger>
                  <TabsTrigger value="pricing">Pricing</TabsTrigger>
                  <TabsTrigger value="images">Images</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4 mt-4">
                  {/* Barcode & Code */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Saree Code *</Label>
                      <div className="flex gap-2">
                        <Input
                          value={formData.sareeCode}
                          onChange={(e) => setFormData({ ...formData, sareeCode: e.target.value })}
                          placeholder="KS-2024-001"
                        />
                        <Button variant="outline" size="icon" onClick={generateSareeCode}>
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Barcode *</Label>
                      <div className="flex gap-2">
                        <Input
                          value={formData.barcode}
                          onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                          placeholder="8901234567890"
                        />
                        <Button variant="outline" size="icon" onClick={generateBarcode}>
                          <Barcode className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Names */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Saree Name (English) *</Label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Kanchipuram Pure Silk - Temple Border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-tamil">சேலை பெயர் (தமிழ்)</Label>
                      <Input
                        value={formData.nameTamil}
                        onChange={(e) => setFormData({ ...formData, nameTamil: e.target.value })}
                        placeholder="காஞ்சிபுரம் தூய பட்டு"
                        className="font-tamil"
                      />
                    </div>
                  </div>

                  {/* Category & Brand */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Category *</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(v) => setFormData({ ...formData, category: v })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-popover">
                          {categories.map((cat) => (
                            <SelectItem key={cat.value} value={cat.value}>
                              {cat.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Brand / Weaver</Label>
                      <Input
                        value={formData.brand}
                        onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                        placeholder="Sri Kumaran Silks"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Detailed description of the saree..."
                      rows={3}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="attributes" className="space-y-4 mt-4">
                  {/* Material & Zari */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Material</Label>
                      <Select
                        value={formData.material}
                        onValueChange={(v) => setFormData({ ...formData, material: v })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-popover">
                          {materials.map((mat) => (
                            <SelectItem key={mat.value} value={mat.value}>
                              {mat.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Zari Type</Label>
                      <Select
                        value={formData.zariType}
                        onValueChange={(v) => setFormData({ ...formData, zariType: v })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-popover">
                          {zariTypes.map((zari) => (
                            <SelectItem key={zari.value} value={zari.value}>
                              {zari.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Border & Design */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Border Type</Label>
                      <Select
                        value={formData.borderType}
                        onValueChange={(v) => setFormData({ ...formData, borderType: v })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-popover">
                          {borderTypes.map((border) => (
                            <SelectItem key={border.value} value={border.value}>
                              {border.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Design Type</Label>
                      <Select
                        value={formData.designType}
                        onValueChange={(v) => setFormData({ ...formData, designType: v })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-popover">
                          {designTypes.map((design) => (
                            <SelectItem key={design.value} value={design.value}>
                              {design.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Color */}
                  <div className="space-y-2">
                    <Label>Color</Label>
                    <div className="flex flex-wrap gap-2">
                      {colors.map((color) => (
                        <button
                          key={color.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, color: color.value })}
                          className={`flex items-center gap-2 rounded-lg border px-3 py-2 transition-all ${
                            formData.color === color.value
                              ? 'border-primary bg-primary/10'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <div
                            className="h-4 w-4 rounded-full border"
                            style={{ backgroundColor: color.hex }}
                          />
                          <span className="text-sm">{color.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Length & Weight */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Length</Label>
                      <Select
                        value={formData.length}
                        onValueChange={(v) => setFormData({ ...formData, length: v })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-popover">
                          <SelectItem value="5.5 meters">5.5 meters</SelectItem>
                          <SelectItem value="6.0 meters">6.0 meters</SelectItem>
                          <SelectItem value="6.3 meters">6.3 meters (Standard)</SelectItem>
                          <SelectItem value="6.5 meters">6.5 meters</SelectItem>
                          <SelectItem value="9 meters">9 meters (Madisar)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Weight (grams)</Label>
                      <Input
                        type="number"
                        value={formData.weight}
                        onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                        placeholder="850"
                      />
                    </div>
                  </div>

                  {/* Blouse */}
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Blouse Piece Included</p>
                        <p className="text-sm text-muted-foreground">
                          Does this saree come with blouse material?
                        </p>
                      </div>
                      <Switch
                        checked={formData.blouseIncluded}
                        onCheckedChange={(v) => setFormData({ ...formData, blouseIncluded: v })}
                      />
                    </div>
                    {formData.blouseIncluded && (
                      <div className="mt-3">
                        <Label>Blouse Piece Length</Label>
                        <Select
                          value={formData.blousePiece}
                          onValueChange={(v) => setFormData({ ...formData, blousePiece: v })}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-popover">
                            <SelectItem value="0.8 meters">0.8 meters (Running)</SelectItem>
                            <SelectItem value="1.0 meters">1.0 meter</SelectItem>
                            <SelectItem value="attached">Attached Blouse</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="pricing" className="space-y-4 mt-4">
                  {/* Pricing */}
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-2">
                      <Label>Purchase Price (₹) *</Label>
                      <Input
                        type="number"
                        value={formData.purchasePrice}
                        onChange={(e) =>
                          setFormData({ ...formData, purchasePrice: Number(e.target.value) })
                        }
                        placeholder="18000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Selling Price (₹) *</Label>
                      <Input
                        type="number"
                        value={formData.sellingPrice}
                        onChange={(e) =>
                          setFormData({ ...formData, sellingPrice: Number(e.target.value) })
                        }
                        placeholder="22500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>MRP (₹) *</Label>
                      <Input
                        type="number"
                        value={formData.mrp}
                        onChange={(e) => setFormData({ ...formData, mrp: Number(e.target.value) })}
                        placeholder="25000"
                      />
                    </div>
                  </div>

                  {/* Profit Calculation */}
                  {formData.purchasePrice && formData.sellingPrice && (
                    <div className="rounded-lg bg-success/10 p-4">
                      <p className="text-sm text-muted-foreground">Estimated Profit</p>
                      <p className="text-2xl font-bold text-success">
                        ₹{((formData.sellingPrice || 0) - (formData.purchasePrice || 0)).toLocaleString()}
                        <span className="ml-2 text-sm font-normal">
                          ({(
                            (((formData.sellingPrice || 0) - (formData.purchasePrice || 0)) /
                              (formData.purchasePrice || 1)) *
                            100
                          ).toFixed(1)}
                          % margin)
                        </span>
                      </p>
                    </div>
                  )}

                  {/* GST */}
                  <div className="space-y-2">
                    <Label>GST %</Label>
                    <Select
                      value={formData.gstPercent?.toString()}
                      onValueChange={(v) => setFormData({ ...formData, gstPercent: Number(v) })}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        <SelectItem value="0">0%</SelectItem>
                        <SelectItem value="5">5%</SelectItem>
                        <SelectItem value="12">12%</SelectItem>
                        <SelectItem value="18">18%</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  {/* Stock */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Stock Type</Label>
                      <Select
                        value={formData.stockType}
                        onValueChange={(v: 'unique' | 'bulk') =>
                          setFormData({ ...formData, stockType: v })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-popover">
                          <SelectItem value="unique">Unique (1 Piece)</SelectItem>
                          <SelectItem value="bulk">Bulk Quantity</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {formData.stockType === 'bulk' && (
                      <div className="space-y-2">
                        <Label>Quantity</Label>
                        <Input
                          type="number"
                          value={formData.stockQty}
                          onChange={(e) =>
                            setFormData({ ...formData, stockQty: Number(e.target.value) })
                          }
                          placeholder="10"
                        />
                      </div>
                    )}
                  </div>

                  {/* Location & Supplier */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Rack Location</Label>
                      <Input
                        value={formData.rackLocation}
                        onChange={(e) => setFormData({ ...formData, rackLocation: e.target.value })}
                        placeholder="A1-01"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Supplier</Label>
                      <Input
                        value={formData.supplier}
                        onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                        placeholder="Kanchipuram Weavers Co-op"
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="images" className="space-y-4 mt-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-lg border-2 border-dashed border-muted-foreground/30 p-8 text-center">
                      <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                      <p className="mt-2 font-medium">Front View</p>
                      <p className="text-sm text-muted-foreground">
                        Drag & drop or click to upload
                      </p>
                      <Button variant="outline" className="mt-4">
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Image
                      </Button>
                    </div>
                    <div className="rounded-lg border-2 border-dashed border-muted-foreground/30 p-8 text-center">
                      <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                      <p className="mt-2 font-medium">Close-up / Pallu</p>
                      <p className="text-sm text-muted-foreground">
                        Drag & drop or click to upload
                      </p>
                      <Button variant="outline" className="mt-4">
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Image
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <DialogFooter className="mt-6 gap-2">
                <Button variant="outline" onClick={resetForm}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
                <Button variant="outline" onClick={() => {
                  const current = { ...formData };
                  resetForm();
                  setFormData({ ...current, sareeCode: '', barcode: '', id: '' });
                  toast.info('Form duplicated - modify and save as new');
                }}>
                  <Copy className="mr-2 h-4 w-4" />
                  Duplicate
                </Button>
                <Button variant="default" onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </Button>
                <Button variant="gold" onClick={handleSaveAndPrint}>
                  <Printer className="mr-2 h-4 w-4" />
                  Save & Print Tag
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="py-4">
          <div className="flex flex-wrap gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, code, or barcode..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="sold">Sold</SelectItem>
                <SelectItem value="reserved">Reserved</SelectItem>
                <SelectItem value="damaged">Damaged</SelectItem>
              </SelectContent>
            </Select>
            {selectedForPrint.length > 0 && (
              <Button variant="gold" onClick={() => setIsPrintDialogOpen(true)}>
                <Printer className="mr-2 h-4 w-4" />
                Print Tags ({selectedForPrint.length})
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{sarees.length}</p>
                <p className="text-sm text-muted-foreground">Total Products</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-success/10 p-2">
                <Check className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {sarees.filter((s) => s.status === 'available').length}
                </p>
                <p className="text-sm text-muted-foreground">Available</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-secondary/20 p-2">
                <Tag className="h-5 w-5 text-secondary-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  ₹{sarees.reduce((sum, s) => sum + s.sellingPrice * s.stockQty, 0).toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">Stock Value</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-warning/10 p-2">
                <Barcode className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {sarees.filter((s) => s.stockType === 'unique').length}
                </p>
                <p className="text-sm text-muted-foreground">Unique Pieces</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Products Table */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-12">
                  <input
                    type="checkbox"
                    className="rounded"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedForPrint(filteredSarees.map((s) => s.id));
                      } else {
                        setSelectedForPrint([]);
                      }
                    }}
                  />
                </TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Attributes</TableHead>
                <TableHead className="text-right">MRP</TableHead>
                <TableHead className="text-right">Selling Price</TableHead>
                <TableHead className="text-center">Stock</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSarees.map((saree) => (
                <TableRow key={saree.id} className="hover:bg-muted/30">
                  <TableCell>
                    <input
                      type="checkbox"
                      className="rounded"
                      checked={selectedForPrint.includes(saree.id)}
                      onChange={() => togglePrintSelection(saree.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                        <Package className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">{saree.name}</p>
                        <p className="text-xs text-muted-foreground font-mono">
                          {saree.sareeCode} | {saree.barcode}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{getCategoryLabel(saree.category)}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div
                        className="h-4 w-4 rounded-full border"
                        style={{ backgroundColor: getColorHex(saree.color) }}
                        title={saree.color}
                      />
                      <span className="text-xs text-muted-foreground">
                        {zariTypes.find((z) => z.value === saree.zariType)?.label}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground line-through">
                    ₹{saree.mrp.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    ₹{saree.sellingPrice.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-center">
                    {saree.stockType === 'unique' ? (
                      <Badge variant="outline">1 pc</Badge>
                    ) : (
                      <Badge variant="outline">{saree.stockQty} pcs</Badge>
                    )}
                  </TableCell>
                  <TableCell className="font-mono text-sm">{saree.rackLocation}</TableCell>
                  <TableCell>{getStatusBadge(saree.status)}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => {
                          setSelectedSaree(saree);
                          setIsViewDialogOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => {
                          setSelectedForPrint([saree.id]);
                          setIsPrintDialogOpen(true);
                        }}
                      >
                        <Printer className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl bg-background">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Saree Details</DialogTitle>
          </DialogHeader>
          {selectedSaree && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Saree Code</p>
                  <p className="font-mono font-semibold">{selectedSaree.sareeCode}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Barcode</p>
                  <p className="font-mono font-semibold">{selectedSaree.barcode}</p>
                </div>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-semibold">{selectedSaree.name}</p>
                <p className="text-sm font-tamil text-muted-foreground">{selectedSaree.nameTamil}</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="font-medium">{getCategoryLabel(selectedSaree.category)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Zari Type</p>
                  <p className="font-medium">
                    {zariTypes.find((z) => z.value === selectedSaree.zariType)?.label}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Border</p>
                  <p className="font-medium">
                    {borderTypes.find((b) => b.value === selectedSaree.borderType)?.label}
                  </p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <p className="text-sm text-muted-foreground">Purchase Price</p>
                  <p className="font-medium">₹{selectedSaree.purchasePrice.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Selling Price</p>
                  <p className="font-semibold text-primary">
                    ₹{selectedSaree.sellingPrice.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">MRP</p>
                  <p className="font-medium line-through">₹{selectedSaree.mrp.toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Print Tags Dialog */}
      <Dialog open={isPrintDialogOpen} onOpenChange={setIsPrintDialogOpen}>
        <DialogContent className="max-w-lg bg-background">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Print Barcode Tags</DialogTitle>
            <DialogDescription>
              Preview and print barcode tags for selected sarees
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="rounded-lg border bg-white p-4">
              <p className="text-sm text-muted-foreground mb-2">Tag Preview (Thermal 50x25mm)</p>
              {selectedForPrint.length > 0 && (
                <div className="border-2 border-dashed border-muted-foreground/30 p-3 text-center">
                  <p className="font-bold text-sm">
                    {sarees.find((s) => s.id === selectedForPrint[0])?.name}
                  </p>
                  <div className="my-2 flex justify-center">
                    <div className="h-8 w-32 bg-[repeating-linear-gradient(90deg,#000,#000_2px,transparent_2px,transparent_4px)]" />
                  </div>
                  <p className="font-mono text-xs">
                    {sarees.find((s) => s.id === selectedForPrint[0])?.barcode}
                  </p>
                  <p className="mt-1 font-bold">
                    ₹{sarees.find((s) => s.id === selectedForPrint[0])?.sellingPrice.toLocaleString()}
                  </p>
                </div>
              )}
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {selectedForPrint.length} tag(s) selected
              </p>
              <Select defaultValue="1">
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Copies" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="1">1 copy</SelectItem>
                  <SelectItem value="2">2 copies</SelectItem>
                  <SelectItem value="3">3 copies</SelectItem>
                  <SelectItem value="5">5 copies</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPrintDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="gold"
              onClick={() => {
                toast.success(`${selectedForPrint.length} barcode tag(s) sent to printer!`);
                setIsPrintDialogOpen(false);
                setSelectedForPrint([]);
              }}
            >
              <Printer className="mr-2 h-4 w-4" />
              Print Tags
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SareeMaster;
