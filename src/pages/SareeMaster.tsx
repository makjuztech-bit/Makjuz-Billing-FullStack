import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import ReactBarcode from 'react-barcode';
import { useLanguage } from '@/contexts/LanguageContext';
import { useData } from '@/contexts/DataContext';
import { Saree } from '@/types';
import { API_URL } from '@/lib/config';
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

// Jewelry attribute options
const categories = [
  { value: 'bridal', label: 'Bridal', labelTa: 'மணப்பெண்' },
  { value: 'daily', label: 'Daily Wear', labelTa: 'தினசரி' },
  { value: 'party', label: 'Party Wear', labelTa: 'பார்ட்டி' },
  { value: 'traditional', label: 'Traditional', labelTa: 'பாரம்பரிய' },
  { value: 'modern', label: 'Modern', labelTa: 'நவீன' },
  { value: 'wedding', label: 'Wedding', labelTa: 'திருமணம்' },
];

const zariTypes = [
  { value: 'pure_gold', label: 'Pure Gold', labelTa: 'தூய தங்கம்' },
  { value: 'gold_plated', label: 'Gold Plated', labelTa: 'தங்க பூசப்பட்ட' },
  { value: 'silver', label: 'Silver', labelTa: 'வெள்ளி' },
  { value: 'diamond', label: 'Diamond', labelTa: 'வைர' },
  { value: 'stone', label: 'Stone Set', labelTa: 'கல் அமைப்பு' },
  { value: 'pearl', label: 'Pearl', labelTa: 'முத்து' },
];

const borderTypes = [
  { value: 'classic', label: 'Classic', labelTa: 'கிளாசிக்' },
  { value: 'filigree', label: 'Filigree', labelTa: 'ஃபிலிகிரி' },
  { value: 'minimal', label: 'Minimal', labelTa: 'குறைந்தபட்ச' },
  { value: 'stone', label: 'Stone Work', labelTa: 'கல் வேலை' },
  { value: 'textured', label: 'Textured', labelTa: 'உருவமைப்பு' },
  { value: 'custom', label: 'Custom', labelTa: 'தனிப்பயன்' },
];

const designTypes = [
  { value: 'traditional', label: 'Traditional', labelTa: 'பாரம்பரியம்' },
  { value: 'contemporary', label: 'Contemporary', labelTa: 'நவீன' },
  { value: 'bridal', label: 'Bridal', labelTa: 'மணப்பெண்' },
  { value: 'party', label: 'Party Wear', labelTa: 'பார்ட்டி வேர்' },
  { value: 'daily', label: 'Daily Wear', labelTa: 'தினசரி' },
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
  { value: 'gold', label: 'Gold', labelTa: 'தங்கம்' },
  { value: 'silver', label: 'Silver', labelTa: 'வெள்ளி' },
  { value: 'diamond', label: 'Diamond', labelTa: 'வைர' },
  { value: 'pearl', label: 'Pearl', labelTa: 'முத்து' },
  { value: 'stone', label: 'Stone Set', labelTa: 'கல் அமைப்பு' },
  { value: 'mixed', label: 'Mixed Metal', labelTa: 'கலப்பு உலோகம்' },
];

const departments = [
  { value: 'Jewelry', label: 'Jewelry' },
  { value: 'Mens', label: 'Mens Wear' },
  { value: 'Kids', label: 'Kids Wear' },
  { value: 'Womens', label: 'Womens Wear' },
  { value: 'Other', label: 'Other' },
];

// Interface Imported from types

// Sample data removed


export const SareeMaster: React.FC = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { sarees, addSaree, updateSaree } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedSaree, setSelectedSaree] = useState<Saree | null>(null);
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);
  const [selectedForPrint, setSelectedForPrint] = useState<string[]>([]);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [printQty, setPrintQty] = useState<number>(1);

  const handleDownloadTemplate = () => {
    const headers = [
      'sareeCode',
      'barcode',
      'name',
      'nameTamil',
      'category',
      'brand',
      'material',
      'zariType',
      'borderType',
      'color',
      'designType',
      'length',
      'weight',
      'blouseIncluded',
      'blousePiece',
      'purchasePrice',
      'sellingPrice',
      'mrp',
      'gstPercent',
      'stockType',
      'stockQty',
      'rackLocation',
      'supplier',
      'description',
    ];

    // Create a sample row to help users
    const sampleRow = [
      'KS-2024-001', '8901234567890', 'Kanchipuram Silk', 'காஞ்சிபுரம் பட்டு', 'kanchipuram', 'Sri Kumaran', 'pure_silk', 'pure_gold', 'temple', 'maroon', 'bridal', '6.3 meters', '850 grams', 'true', '0.8 meters', '18000', '22500', '25000', '5', 'unique', '1', 'A1-01', 'Kanchipuram Weavers', 'Premium silk saree'
    ];

    const csvContent = [
      headers.join(','),
      sampleRow.join(',')
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'saree_import_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (!text) return;

      try {
        const lines = text.split('\n');
        // Simple CSV parser handling quotes
        const parseCSVLine = (line: string) => {
          const result = [];
          let current = '';
          let inQuotes = false;

          for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
              inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
              result.push(current.trim());
              current = '';
            } else {
              current += char;
            }
          }
          result.push(current.trim());
          return result;
        };

        const headers = parseCSVLine(lines[0]).map(h => h.trim());

        const newSarees: Saree[] = [];

        // Starting from 1 to skip header
        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue;

          const values = parseCSVLine(lines[i]);
          if (values.length < 5) continue;

          const sareeData: Record<string, string | number | boolean> = {};
          headers.forEach((header, index) => {
            let value: string | number | boolean = values[index];
            // Remove quotes if present
            if (typeof value === 'string' && value.startsWith('"') && value.endsWith('"')) {
              value = value.substring(1, value.length - 1);
            }

            if (['purchasePrice', 'sellingPrice', 'mrp', 'gstPercent', 'stockQty'].includes(header)) {
              value = Number(value) || 0;
            } else if (header === 'blouseIncluded') {
              value = String(value).toLowerCase() === 'true';
            }
            sareeData[header] = value;
          });

          // Add default/missing required fields
          const newSaree: Saree = {
            id: Date.now().toString() + i,
            images: [],
            status: 'available',
            addedDate: new Date().toISOString().split('T')[0],
            // Fill defaults for required fields if missing
            sareeCode: (sareeData.sareeCode as string) || `IMP-${Date.now()}-${i}`,
            barcode: (sareeData.barcode as string) || `890${Date.now()}${i}`,
            name: (sareeData.name as string) || 'Imported Saree',
            nameTamil: (sareeData.nameTamil as string) || '',
            category: (sareeData.category as string) || 'kanchipuram',
            brand: (sareeData.brand as string) || '',
            material: (sareeData.material as string) || 'pure_silk',
            zariType: (sareeData.zariType as string) || 'pure_gold',
            borderType: (sareeData.borderType as string) || 'temple',
            color: (sareeData.color as string) || 'maroon',
            designType: (sareeData.designType as string) || 'traditional',
            length: (sareeData.length as string) || '6.3 meters',
            weight: (sareeData.weight as string) || '',
            blouseIncluded: (sareeData.blouseIncluded as boolean) ?? true,
            blousePiece: (sareeData.blousePiece as string) || '0.8 meters',
            purchasePrice: (sareeData.purchasePrice as number) || 0,
            sellingPrice: (sareeData.sellingPrice as number) || 0,
            mrp: (sareeData.mrp as number) || 0,
            gstPercent: (sareeData.gstPercent as number) || 5,
            stockType: (sareeData.stockType as any) || 'unique',
            stockQty: (sareeData.stockQty as number) || 1,
            rackLocation: (sareeData.rackLocation as string) || '',
            supplier: (sareeData.supplier as string) || '',
            description: (sareeData.description as string) || '',
            ...(sareeData as unknown as Partial<Saree>)
          };

          newSarees.push(newSaree);
        }

        if (newSarees.length > 0) {
          // Bulk add
          newSarees.forEach(s => addSaree(s));
          toast.success(`Imported ${newSarees.length} sarees successfully`);
          setIsImportDialogOpen(false);
        } else {
          toast.error('No valid data found in file');
        }
      } catch (error) {
        toast.error('Error parsing CSV file');
        console.error(error);
      }
    };
    reader.readAsText(file);
    // Reset input
    event.target.value = '';
  };

  const handleEdit = (saree: Saree) => {
    setFormData({ ...saree });
    setIsEditing(true);
    setIsAddDialogOpen(true);
  };

  // Form state for new/edit saree
  // Form state for new/edit saree
  const [formData, setFormData] = useState<Partial<Saree>>({
    sareeCode: '',
    barcode: '',
    department: 'Jewelry',
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
    const deptPrefix = formData.department ? formData.department.substring(0, 1).toUpperCase() : 'S';
    const catPrefix = formData.category?.substring(0, 2).toUpperCase() || 'XX';
    const year = new Date().getFullYear();
    const num = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    setFormData({ ...formData, sareeCode: `${deptPrefix}${catPrefix}-${year}-${num}` });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('image', file);

    try {
      const res = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: uploadData,
      });
      const data = await res.json();
      if (res.ok) {
        setFormData(prev => ({ ...prev, images: [...(prev.images || []), data.url] }));
        toast.success("Image uploaded successfully");
      } else {
        toast.error("Upload failed: " + data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Upload failed");
    }
  };

  const handleSave = async () => {
    // If barcode is empty, use sareeCode as barcode
    const finalBarcode = formData.barcode || formData.sareeCode;

    if (!formData.name || !formData.sareeCode) {
      toast.error('Please fill required fields (Name and Product Code)');
      return;
    }

    const newSaree: Saree = {
      id: isEditing ? (formData.id || '') : Date.now().toString(),
      sareeCode: formData.sareeCode || '',
      barcode: finalBarcode || '',
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
      description: formData.description || '',
      status: formData.status || 'available',
      addedDate: formData.addedDate || new Date().toISOString().split('T')[0],
      images: formData.images || [], // Ensure images are preserved
    };

    let result = null;
    if (isEditing && formData.id) {
      result = await updateSaree(formData.id, newSaree);
      if (result) setIsEditing(false);
    } else {
      result = await addSaree(newSaree);
    }

    if (result) {
      setIsAddDialogOpen(false);
      resetForm();
    }
  };

  const handleSaveAndPrint = async () => {
    const finalBarcode = formData.barcode || formData.sareeCode;

    if (!formData.name || !formData.sareeCode) {
      toast.error('Please fill required fields (Name and Product Code)');
      return;
    }

    const newId = isEditing ? (formData.id || '') : Date.now().toString();
    const newSaree: Saree = {
      id: newId,
      sareeCode: formData.sareeCode || '',
      barcode: finalBarcode || '',
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
      description: formData.description || '',
      status: formData.status || 'available',
      addedDate: formData.addedDate || new Date().toISOString().split('T')[0],
      images: formData.images || [],
    };

    let result = null;
    if (isEditing && formData.id) {
      result = await updateSaree(formData.id, newSaree);
      setIsEditing(false);
    } else {
      result = await addSaree(newSaree);
    }

    if (!result) return; // Don't proceed if it failed

    const finalSaree = result;
    const finalId = finalSaree.id || finalSaree._id;

    setIsAddDialogOpen(false);

    // Setup print dialog
    setSelectedForPrint([finalId]);
    setPrintQty(finalSaree.stockQty || 1);
    setIsPrintDialogOpen(true);

    resetForm();
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
    setIsEditing(false);
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
            Manage your inventory and product details
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={() => navigate('/billing')}>
            <Plus className="mr-2 h-4 w-4" />
            New Bill
          </Button>
          <Button variant="outline" onClick={() => setIsImportDialogOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button variant="outline" onClick={() => toast.info('Export functionality coming soon')}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Import Sarees</DialogTitle>
                <DialogDescription>
                  Upload a CSV file to import saree data. Please use the template format.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="flex flex-col gap-4">
                  <Button variant="outline" onClick={handleDownloadTemplate} className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Download Template
                  </Button>
                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="csvFile">Upload CSV</Label>
                    <Input id="csvFile" type="file" accept=".csv" onChange={handleFileUpload} />
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <Button variant="gold" onClick={() => { resetForm(); setIsEditing(false); setIsAddDialogOpen(true); }}>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-background">
              <DialogHeader>
                <DialogTitle className="font-display text-xl">{isEditing ? 'Edit Saree' : 'Add New Saree'}</DialogTitle>
                <DialogDescription>
                  Enter complete details of the saree product
                </DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  {(formData.department === 'Saree' || !formData.department) && <TabsTrigger value="attributes">Saree Attributes</TabsTrigger>}
                  <TabsTrigger value="pricing">Pricing</TabsTrigger>
                  <TabsTrigger value="images">Images</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4 mt-4">

                  {/* Department & Stock Type */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Department</Label>
                      <Select
                        value={formData.department}
                        onValueChange={(val: any) => setFormData({ ...formData, department: val })}
                      >
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {departments.map(d => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Stock Type</Label>
                      <Select
                        value={formData.stockType}
                        onValueChange={(val: any) => setFormData({ ...formData, stockType: val, stockQty: val === 'unique' ? 1 : formData.stockQty })}
                      >
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unique">Unique (Single Piece)</SelectItem>
                          <SelectItem value="bulk">Bulk (Quantity Based)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-1">
                    <div className="space-y-2">
                      <Label>Product Code *</Label>
                      <div className="flex gap-2">
                        <Input
                          value={formData.sareeCode}
                          onChange={(e) => setFormData({ ...formData, sareeCode: e.target.value })}
                          placeholder="Enter or generate code"
                        />
                        <Button variant="outline" size="icon" onClick={generateSareeCode}>
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-[10px] text-muted-foreground italic">
                        The Product Code will be used as the Barcode for scanning and label printing.
                      </p>
                    </div>
                  </div>

                  {/* Names */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Jewelry Name (English) *</Label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Diamond Pendant - Bridal Set"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-tamil">நகை பெயர் (தமிழ்)</Label>
                      <Input
                        value={formData.nameTamil}
                        onChange={(e) => setFormData({ ...formData, nameTamil: e.target.value })}
                        placeholder="வைர மாலை - மணப்பெண் செட்"
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
                        placeholder="Royal Jewels"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Detailed description of the jewelry piece..."
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
                          className={`flex items-center gap-2 rounded-lg border px-3 py-2 transition-all ${formData.color === color.value
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
                        <p className="font-medium">Certificate Included</p>
                        <p className="text-sm text-muted-foreground">
                          Does this jewelry item include a certificate?
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
                    <div className="space-y-2">
                      <Label>Quantity</Label>
                      <Input
                        type="number"
                        value={formData.stockQty}
                        disabled={formData.stockType === 'unique'}
                        onChange={(e) =>
                          setFormData({ ...formData, stockQty: Number(e.target.value) })
                        }
                        placeholder="10"
                      />
                    </div>
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
                  <div className="grid gap-4">
                    <div className="rounded-lg border-2 border-dashed border-muted-foreground/30 p-8 text-center relative hover:bg-muted/50 transition-colors">
                      <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                      <p className="mt-2 font-medium">Add Image</p>
                      <p className="text-sm text-muted-foreground">
                        Click to upload
                      </p>
                      <Input
                        type="file"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={handleImageUpload}
                        accept="image/*"
                      />
                    </div>
                    {/* Uploaded Images Preview */}
                    {formData.images && formData.images.length > 0 && (
                      <div className="grid grid-cols-4 gap-4 mt-4">
                        {formData.images.map((img, i) => (
                          <div key={i} className="relative group">
                            <img
                              src={img}
                              alt={`Uploaded ${i + 1}`}
                              className="h-24 w-full object-cover rounded-lg border"
                            />
                            <button
                              className="absolute top-1 right-1 bg-destructive text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => {
                                const newImages = [...(formData.images || [])];
                                newImages.splice(i, 1);
                                setFormData({ ...formData, images: newImages });
                              }}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
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
                <p className="text-2xl font-bold">{sarees.reduce((sum, s) => sum + (s.stockQty || 0), 0)}</p>
                <p className="text-sm text-muted-foreground">Total Items</p>
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
                  {sarees.filter((s) => s.status === 'available').reduce((sum, s) => sum + (s.stockQty || 0), 0)}
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
                  ₹{sarees.reduce((sum, s) => sum + (s.purchasePrice || 0) * (s.stockQty || 0), 0).toLocaleString()}
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
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(saree)}>
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
              Preview and print barcode tags for selected items
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="rounded-xl border bg-white p-6 shadow-inner flex justify-center">
              {selectedForPrint.length > 0 && (
                (() => {
                  const s = sarees.find((s) => s.id === selectedForPrint[0]);
                  if (!s) return null;
                  return (
                    <div className="w-[50mm] min-h-[25mm] border border-gray-400 p-2 text-center flex flex-col items-center justify-center bg-white text-black">
                      <p className="font-bold text-[10px] uppercase tracking-tight truncate w-full">MY SILK STORE</p>
                      <p className="text-[9px] truncate w-full">{s.name}</p>
                      <div className="my-1">
                        <ReactBarcode
                          value={s.barcode}
                          width={1.2}
                          height={30}
                          fontSize={10}
                          margin={0}
                        />
                      </div>
                      <div className="flex justify-between w-full px-2 mt-1">
                        <span className="text-[10px] font-bold">₹{s.sellingPrice.toLocaleString()}</span>
                        <span className="text-[10px] font-mono">{s.sareeCode}</span>
                      </div>
                    </div>
                  );
                })()
              )}
            </div>

            <div className="grid gap-4 p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Print Quantity</Label>
                  <p className="text-xs text-muted-foreground">Total labels to generate</p>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    className="w-20 text-center font-bold"
                    value={printQty}
                    onChange={e => setPrintQty(Math.max(1, Number(e.target.value)))}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Selected Item</Label>
                  <p className="text-xs text-muted-foreground">
                    {selectedForPrint.length > 0
                      ? sarees.find(s => s.id === selectedForPrint[0])?.name.substring(0, 30) + '...'
                      : 'None'}
                  </p>
                </div>
                <Badge variant="secondary">Item 1 of {selectedForPrint.length}</Badge>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPrintDialogOpen(false)}>
              Close
            </Button>
            <Button
              variant="gold"
              onClick={() => {
                toast.success(`Sent ${printQty} label(s) to barcode printer!`);
                setIsPrintDialogOpen(false);
                setSelectedForPrint([]);
              }}
            >
              <Printer className="mr-2 h-4 w-4" />
              Start Printing
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SareeMaster;
