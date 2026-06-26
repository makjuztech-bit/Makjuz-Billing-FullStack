export interface Saree {
    id: string;
    sareeCode: string;
    barcode: string;
    name: string;
    nameTamil: string;
    category: string;
    department?: 'Jewelry' | 'Mens' | 'Kids' | 'Womens' | 'Other';
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

export interface Supplier {
    id: string;
    name: string;
    contactPerson: string;
    mobile: string;
    gstin: string;
    location: string;
    pendingDue: number;
}

export interface AdjustmentItem {
    id: string;
    barcode: string;
    name: string;
    currentStock: number;
    adjustQty: number;
    reason: string;
    date: string;
    status: 'pending' | 'approved' | 'rejected';
}

export interface PurchaseItem {
    id: string;
    barcode: string;
    name: string;
    category: string;
    qty: number;
    costPrice: number;
    mrp: number;
    sellingPrice: number;
    totalCost: number;
}

export interface Purchase {
    id: string;
    billNo: string;
    date: string;
    supplierId: string;
    supplierName: string;
    items: PurchaseItem[];
    totalAmount: number;
    paidAmount: number;
    dueAmount?: number;
    paymentStatus: 'Paid' | 'Partial' | 'Credit';
    status: 'completed' | 'pending';
    purchaseType: 'gst' | 'nongst';
}

export interface AlterationJob {
    id: string;
    customer: string;
    mobile: string;
    items: string; // concise description
    services: string[]; // e.g. Fall, Pico, Blouse
    status: 'Pending' | 'In Progress' | 'Ready' | 'Delivered';
    deliveryDate: string;
    amount: number;
}

export interface Order {
    id: string;
    customerName: string;
    customerMobile: string;
    description: string;
    deliveryDate: string;
    totalEstimated: number;
    advancePaid: number;
    status: 'Booked' | 'Ready' | 'Delivered' | 'Cancelled';
    orderDate: string;
}

export interface Staff {
    id: string;
    name: string;
    role: string;
    commissionType: 'Percentage' | 'Fixed';
    commissionValue: number;
    active: boolean;
    salesThisMonth: number;
}

export * from './bill';
