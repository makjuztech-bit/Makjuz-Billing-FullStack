import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Store,
  Building2,
  FileText,
  Printer,
  Languages,
  Settings,
  ArrowRight,
  ArrowLeft,
  Check,
  Upload,
  Plus,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
}

const steps = [
  { id: 1, title: 'Company Info', icon: Store },
  { id: 2, title: 'GST Settings', icon: FileText },
  { id: 3, title: 'Billing Settings', icon: Settings },
  { id: 4, title: 'Print & Language', icon: Printer },
  { id: 5, title: 'Branch Setup', icon: Building2 },
  { id: 6, title: 'Finish', icon: Check },
];

export const SetupWizard: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);

  // Company Info
  const [companyName, setCompanyName] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [companyPhone, setCompanyPhone] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');
  const [companyLogo, setCompanyLogo] = useState<File | null>(null);

  // GST Settings
  const [gstEnabled, setGstEnabled] = useState(true);
  const [gstNumber, setGstNumber] = useState('');
  const [gstType, setGstType] = useState('regular');

  // Billing Settings
  const [billingType, setBillingType] = useState('both');
  const [invoicePrefix, setInvoicePrefix] = useState('INV');
  const [billSeries, setBillSeries] = useState('2024');
  const [stockType, setStockType] = useState('unique');
  const [returnDays, setReturnDays] = useState('7');
  const [maxDiscount, setMaxDiscount] = useState('20');

  // Print & Language
  const [printType, setPrintType] = useState('thermal');
  const [language, setLanguage] = useState('both');

  // Branch Setup
  const [branchMode, setBranchMode] = useState('single');
  const [branches, setBranches] = useState<Branch[]>([
    { id: '1', name: 'Main Branch', address: '', phone: '' },
  ]);

  const addBranch = () => {
    setBranches([
      ...branches,
      { id: Date.now().toString(), name: '', address: '', phone: '' },
    ]);
  };

  const removeBranch = (id: string) => {
    if (branches.length > 1) {
      setBranches(branches.filter((b) => b.id !== id));
    }
  };

  const updateBranch = (id: string, field: keyof Branch, value: string) => {
    setBranches(branches.map((b) => (b.id === id ? { ...b, [field]: value } : b)));
  };

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    toast.success('Setup completed successfully!');
    navigate('/login');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="companyName">Shop / Company Name *</Label>
              <Input
                id="companyName"
                placeholder="Enter your shop name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyAddress">Address *</Label>
              <Input
                id="companyAddress"
                placeholder="Full address"
                value={companyAddress}
                onChange={(e) => setCompanyAddress(e.target.value)}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="companyPhone">Phone Number *</Label>
                <Input
                  id="companyPhone"
                  placeholder="Contact number"
                  value={companyPhone}
                  onChange={(e) => setCompanyPhone(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyEmail">Email (Optional)</Label>
                <Input
                  id="companyEmail"
                  type="email"
                  placeholder="Email address"
                  value={companyEmail}
                  onChange={(e) => setCompanyEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Shop Logo (Optional)</Label>
              <div className="flex items-center gap-4">
                <div className="flex h-24 w-24 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/50">
                  {companyLogo ? (
                    <img
                      src={URL.createObjectURL(companyLogo)}
                      alt="Logo"
                      className="h-full w-full rounded-lg object-contain"
                    />
                  ) : (
                    <Upload className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <Input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="logo-upload"
                    onChange={(e) => setCompanyLogo(e.target.files?.[0] || null)}
                  />
                  <Label htmlFor="logo-upload" className="cursor-pointer">
                    <Button variant="outline" asChild>
                      <span>Upload Logo</span>
                    </Button>
                  </Label>
                  <p className="mt-1 text-xs text-muted-foreground">
                    PNG or JPG, max 2MB
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="font-medium">Enable GST</p>
                <p className="text-sm text-muted-foreground">
                  Turn on if you have GST registration
                </p>
              </div>
              <Switch checked={gstEnabled} onCheckedChange={setGstEnabled} />
            </div>

            {gstEnabled && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="gstNumber">GST Number *</Label>
                  <Input
                    id="gstNumber"
                    placeholder="Enter 15-digit GSTIN"
                    value={gstNumber}
                    onChange={(e) => setGstNumber(e.target.value.toUpperCase())}
                    maxLength={15}
                  />
                </div>

                <div className="space-y-3">
                  <Label>GST Type</Label>
                  <RadioGroup value={gstType} onValueChange={setGstType}>
                    <div className="flex items-center space-x-2 rounded-lg border p-3">
                      <RadioGroupItem value="regular" id="regular" />
                      <Label htmlFor="regular" className="flex-1 cursor-pointer">
                        <span className="font-medium">Regular</span>
                        <span className="ml-2 text-sm text-muted-foreground">
                          GST invoice with tax breakup
                        </span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 rounded-lg border p-3">
                      <RadioGroupItem value="composition" id="composition" />
                      <Label htmlFor="composition" className="flex-1 cursor-pointer">
                        <span className="font-medium">Composition</span>
                        <span className="ml-2 text-sm text-muted-foreground">
                          No tax breakup, limited turnover
                        </span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <Label>Billing Type</Label>
              <RadioGroup value={billingType} onValueChange={setBillingType}>
                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    { value: 'retail', label: 'Retail Only' },
                    { value: 'wholesale', label: 'Wholesale Only' },
                    { value: 'both', label: 'Both' },
                  ].map((option) => (
                    <div
                      key={option.value}
                      className={cn(
                        'flex items-center space-x-2 rounded-lg border p-4 cursor-pointer transition-colors',
                        billingType === option.value && 'border-primary bg-primary/5'
                      )}
                      onClick={() => setBillingType(option.value)}
                    >
                      <RadioGroupItem value={option.value} id={option.value} />
                      <Label htmlFor={option.value} className="cursor-pointer font-medium">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="invoicePrefix">Invoice Prefix</Label>
                <Input
                  id="invoicePrefix"
                  placeholder="INV"
                  value={invoicePrefix}
                  onChange={(e) => setInvoicePrefix(e.target.value.toUpperCase())}
                  maxLength={5}
                />
                <p className="text-xs text-muted-foreground">
                  Example: {invoicePrefix}-{billSeries}-0001
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="billSeries">Bill Series / Year</Label>
                <Input
                  id="billSeries"
                  placeholder="2024"
                  value={billSeries}
                  onChange={(e) => setBillSeries(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label>Saree Stock Type</Label>
              <RadioGroup value={stockType} onValueChange={setStockType}>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div
                    className={cn(
                      'rounded-lg border p-4 cursor-pointer transition-colors',
                      stockType === 'unique' && 'border-primary bg-primary/5'
                    )}
                    onClick={() => setStockType('unique')}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="unique" id="unique" />
                      <Label htmlFor="unique" className="cursor-pointer font-medium">
                        Unique (1 Piece)
                      </Label>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Each saree has unique barcode
                    </p>
                  </div>
                  <div
                    className={cn(
                      'rounded-lg border p-4 cursor-pointer transition-colors',
                      stockType === 'bulk' && 'border-primary bg-primary/5'
                    )}
                    onClick={() => setStockType('bulk')}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="bulk" id="bulk" />
                      <Label htmlFor="bulk" className="cursor-pointer font-medium">
                        Bulk Quantity
                      </Label>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Same barcode, track quantity
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="returnDays">Default Return Days</Label>
                <Select value={returnDays} onValueChange={setReturnDays}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="3">3 Days</SelectItem>
                    <SelectItem value="7">7 Days</SelectItem>
                    <SelectItem value="15">15 Days</SelectItem>
                    <SelectItem value="30">30 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxDiscount">Max Discount (%)</Label>
                <Input
                  id="maxDiscount"
                  type="number"
                  placeholder="20"
                  value={maxDiscount}
                  onChange={(e) => setMaxDiscount(e.target.value)}
                  max={50}
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <Label>Print Type</Label>
              <RadioGroup value={printType} onValueChange={setPrintType}>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div
                    className={cn(
                      'rounded-lg border p-4 cursor-pointer transition-colors',
                      printType === 'thermal' && 'border-primary bg-primary/5'
                    )}
                    onClick={() => setPrintType('thermal')}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="thermal" id="thermal" />
                      <Label htmlFor="thermal" className="cursor-pointer font-medium">
                        Thermal (80mm)
                      </Label>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Receipt printer, compact bills
                    </p>
                  </div>
                  <div
                    className={cn(
                      'rounded-lg border p-4 cursor-pointer transition-colors',
                      printType === 'a4' && 'border-primary bg-primary/5'
                    )}
                    onClick={() => setPrintType('a4')}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="a4" id="a4" />
                      <Label htmlFor="a4" className="cursor-pointer font-medium">
                        A4 Paper
                      </Label>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Full page invoice
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </div>

            <Separator />

            <div className="space-y-3">
              <Label>Invoice Language</Label>
              <RadioGroup value={language} onValueChange={setLanguage}>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div
                    className={cn(
                      'rounded-lg border p-4 cursor-pointer transition-colors',
                      language === 'english' && 'border-primary bg-primary/5'
                    )}
                    onClick={() => setLanguage('english')}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="english" id="english" />
                      <Label htmlFor="english" className="cursor-pointer font-medium">
                        English Only
                      </Label>
                    </div>
                  </div>
                  <div
                    className={cn(
                      'rounded-lg border p-4 cursor-pointer transition-colors',
                      language === 'tamil' && 'border-primary bg-primary/5'
                    )}
                    onClick={() => setLanguage('tamil')}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="tamil" id="tamil" />
                      <Label htmlFor="tamil" className="cursor-pointer font-medium font-tamil">
                        தமிழ் மட்டும்
                      </Label>
                    </div>
                  </div>
                  <div
                    className={cn(
                      'rounded-lg border p-4 cursor-pointer transition-colors',
                      language === 'both' && 'border-primary bg-primary/5'
                    )}
                    onClick={() => setLanguage('both')}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="both" id="both" />
                      <Label htmlFor="both" className="cursor-pointer font-medium">
                        Tamil + English
                      </Label>
                    </div>
                  </div>
                </div>
              </RadioGroup>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <Label>Branch Mode</Label>
              <RadioGroup value={branchMode} onValueChange={setBranchMode}>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div
                    className={cn(
                      'rounded-lg border p-4 cursor-pointer transition-colors',
                      branchMode === 'single' && 'border-primary bg-primary/5'
                    )}
                    onClick={() => setBranchMode('single')}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="single" id="single" />
                      <Label htmlFor="single" className="cursor-pointer font-medium">
                        Single Branch
                      </Label>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      One shop location
                    </p>
                  </div>
                  <div
                    className={cn(
                      'rounded-lg border p-4 cursor-pointer transition-colors',
                      branchMode === 'multi' && 'border-primary bg-primary/5'
                    )}
                    onClick={() => setBranchMode('multi')}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="multi" id="multi" />
                      <Label htmlFor="multi" className="cursor-pointer font-medium">
                        Multi Branch
                      </Label>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Multiple shop locations
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base">Branch Details</Label>
                {branchMode === 'multi' && (
                  <Button variant="outline" size="sm" onClick={addBranch}>
                    <Plus className="mr-1 h-4 w-4" />
                    Add Branch
                  </Button>
                )}
              </div>

              {branches.map((branch, index) => (
                <Card key={branch.id} className="border-dashed">
                  <CardContent className="p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="font-medium">Branch {index + 1}</span>
                      {branchMode === 'multi' && branches.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => removeBranch(branch.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div className="space-y-3">
                      <Input
                        placeholder="Branch Name"
                        value={branch.name}
                        onChange={(e) => updateBranch(branch.id, 'name', e.target.value)}
                      />
                      <Input
                        placeholder="Branch Address"
                        value={branch.address}
                        onChange={(e) => updateBranch(branch.id, 'address', e.target.value)}
                      />
                      <Input
                        placeholder="Branch Phone"
                        value={branch.phone}
                        onChange={(e) => updateBranch(branch.id, 'phone', e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-success/20">
              <Check className="h-10 w-10 text-success" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">Setup Complete!</h3>
              <p className="mt-2 text-muted-foreground">
                Your Silk Saree POS system is ready to use
              </p>
            </div>
            <Card className="text-left">
              <CardContent className="p-4">
                <h4 className="font-semibold mb-3">Configuration Summary:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shop Name</span>
                    <span className="font-medium">{companyName || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">GST</span>
                    <span className="font-medium">{gstEnabled ? 'Enabled' : 'Disabled'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Billing Type</span>
                    <span className="font-medium capitalize">{billingType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Print Type</span>
                    <span className="font-medium capitalize">{printType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Language</span>
                    <span className="font-medium capitalize">{language}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Branches</span>
                    <span className="font-medium">{branches.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-cream silk-pattern flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4 py-8">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-maroon shadow-maroon mb-4">
              <Store className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="font-display text-3xl font-bold text-foreground">
              Setup Wizard
            </h1>
            <p className="mt-2 text-muted-foreground">
              Configure your Silk Saree POS system
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors',
                        currentStep > step.id
                          ? 'border-primary bg-primary text-primary-foreground'
                          : currentStep === step.id
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-muted-foreground/30 text-muted-foreground'
                      )}
                    >
                      {currentStep > step.id ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <step.icon className="h-5 w-5" />
                      )}
                    </div>
                    <span className="mt-1 hidden text-xs sm:block">{step.title}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={cn(
                        'h-0.5 flex-1 mx-2',
                        currentStep > step.id ? 'bg-primary' : 'bg-muted-foreground/30'
                      )}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="font-display text-xl">
                {steps[currentStep - 1].title}
              </CardTitle>
              <CardDescription>
                Step {currentStep} of {steps.length}
              </CardDescription>
            </CardHeader>
            <CardContent>{renderStepContent()}</CardContent>
          </Card>

          {/* Navigation */}
          <div className="mt-6 flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrev}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>

            {currentStep < 6 ? (
              <Button variant="gold" onClick={handleNext}>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button variant="gold" onClick={handleComplete}>
                Complete Setup
                <Check className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetupWizard;
