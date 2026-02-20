import React, { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from 'sonner';
import { Saree, Supplier, AdjustmentItem, Purchase, AlterationJob, Order, Staff, Bill } from '@/types';
import { API_URL } from '@/lib/config';

interface DataContextType {
    sarees: Saree[];
    suppliers: Supplier[];
    adjustments: AdjustmentItem[];
    purchases: Purchase[];
    addSaree: (saree: Saree) => void;
    updateSaree: (id: string, updates: Partial<Saree>) => void;
    deleteSaree: (id: string) => void;
    addSupplier: (supplier: Supplier) => void;
    updateSupplier: (id: string, updates: Partial<Supplier>) => void;
    deleteSupplier: (id: string) => void;
    addAdjustment: (adjustment: AdjustmentItem) => void;
    addPurchase: (purchase: Purchase) => void;
    alterations: AlterationJob[];
    addAlteration: (job: AlterationJob) => void;
    updateAlteration: (id: string, updates: Partial<AlterationJob>) => void;
    orders: Order[];
    addOrder: (order: Order) => void;
    staffList: Staff[];
    addStaff: (staff: Staff) => void;
    bills: Bill[];
    addBill: (bill: Bill) => void;
    settings: any;
    updateSettings: (updates: any) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [sarees, setSarees] = useState<Saree[]>([]);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [adjustments, setAdjustments] = useState<AdjustmentItem[]>([]);
    const [purchases, setPurchases] = useState<Purchase[]>([]);
    const [alterations, setAlterations] = useState<AlterationJob[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [staffList, setStaffList] = useState<Staff[]>([]);
    const [bills, setBills] = useState<Bill[]>([]);
    const [settings, setSettings] = useState<any>(null);


    const fetchData = async () => {
        try {
            const [sareesRes, suppliersRes, adjustmentsRes, purchasesRes, alterationsRes, ordersRes, staffRes, billsRes] = await Promise.all([
                fetch(`${API_URL}/sarees`),
                fetch(`${API_URL}/suppliers`),
                fetch(`${API_URL}/adjustments`),
                fetch(`${API_URL}/purchases`),
                fetch(`${API_URL}/alterations`),
                fetch(`${API_URL}/orders`),
                fetch(`${API_URL}/staff`),
                fetch(`${API_URL}/bills`)
            ]);

            if (sareesRes.ok) setSarees(await sareesRes.json());
            if (suppliersRes.ok) setSuppliers(await suppliersRes.json());
            if (adjustmentsRes.ok) setAdjustments(await adjustmentsRes.json());
            if (purchasesRes.ok) setPurchases(await purchasesRes.json());
            if (alterationsRes.ok) setAlterations(await alterationsRes.json());
            if (ordersRes.ok) setOrders(await ordersRes.json());
            if (staffRes.ok) setStaffList(await staffRes.json());
            if (billsRes.ok) setBills(await billsRes.json());
            const settingsRes = await fetch(`${API_URL}/settings`);
            if (settingsRes.ok) setSettings(await settingsRes.json());
        } catch (error) {
            console.error("Failed to fetch data:", error);
        }
    };

    React.useEffect(() => {
        fetchData();
    }, []);

    const addSaree = async (saree: Saree) => {
        try {
            const res = await fetch(`${API_URL}/sarees`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(saree),
            });
            if (res.ok) {
                const newSaree = await res.json();
                setSarees((prev) => [...prev, newSaree]);
                return newSaree;
            } else {
                const errorData = await res.json();
                console.error("Error adding saree:", errorData.message);
                toast.error(`Error: ${errorData.message || 'Failed to add saree'}`);
                return null;
            }
        } catch (error) {
            console.error("Error adding saree:", error);
            toast.error("Network error while adding saree");
            return null;
        }
    };

    const updateSaree = async (id: string, updates: Partial<Saree>) => {
        try {
            const res = await fetch(`${API_URL}/sarees/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates),
            });
            if (res.ok) {
                const updated = await res.json();
                setSarees((prev) => prev.map((s) => (s.id === id ? updated : s)));
                return updated;
            } else {
                const errorData = await res.json();
                console.error("Error updating saree:", errorData.message);
                toast.error(`Error: ${errorData.message || 'Failed to update saree'}`);
                return null;
            }
        } catch (error) {
            console.error("Error updating saree:", error);
            toast.error("Network error while updating saree");
            return null;
        }
    };

    const deleteSaree = async (id: string) => {
        try {
            const res = await fetch(`${API_URL}/sarees/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setSarees((prev) => prev.filter((saree) => saree.id !== id));
            }
        } catch (error) {
            console.error("Error deleting saree:", error);
        }
    };

    const addSupplier = async (supplier: Supplier) => {
        try {
            const res = await fetch(`${API_URL}/suppliers`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(supplier),
            });
            if (res.ok) {
                const newSupplier = await res.json();
                setSuppliers(prev => [...prev, newSupplier]);
            }
        } catch (error) {
            console.error("Error adding supplier:", error);
        }
    };

    const updateSupplier = async (id: string, updates: Partial<Supplier>) => {
        try {
            const res = await fetch(`${API_URL}/suppliers/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates),
            });
            if (res.ok) {
                const updated = await res.json();
                setSuppliers(prev => prev.map(s => s.id === id ? updated : s));
            }
        } catch (error) {
            console.error("Error updating supplier:", error);
        }
    };

    const deleteSupplier = async (id: string) => {
        try {
            const res = await fetch(`${API_URL}/suppliers/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setSuppliers(prev => prev.filter(s => s.id !== id));
            }
        } catch (error) {
            console.error("Error deleting supplier:", error);
        }
    };

    const addAdjustment = async (adjustment: AdjustmentItem) => {
        try {
            const res = await fetch(`${API_URL}/adjustments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(adjustment),
            });
            if (res.ok) {
                const newAdj = await res.json();
                setAdjustments(prev => [...prev, newAdj]);
                const sareesRes = await fetch(`${API_URL}/sarees`);
                if (sareesRes.ok) setSarees(await sareesRes.json());
            }
        } catch (error) {
            console.error("Error adding adjustment:", error);
        }
    };

    const addPurchase = async (purchase: Purchase) => {
        try {
            const res = await fetch(`${API_URL}/purchases`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(purchase),
            });
            if (res.ok) {
                const newPurchase = await res.json();
                setPurchases(prev => [...prev, newPurchase]);
                const sareesRes = await fetch(`${API_URL}/sarees`);
                if (sareesRes.ok) setSarees(await sareesRes.json());
            }
        } catch (error) {
            console.error("Error adding purchase:", error);
        }
    };

    const addAlteration = async (job: AlterationJob) => {
        try {
            const res = await fetch(`${API_URL}/alterations`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(job),
            });
            if (res.ok) {
                const newJob = await res.json();
                setAlterations(prev => [...prev, newJob]);
            }
        } catch (error) {
            console.error("Error adding alteration:", error);
        }
    };

    const updateAlteration = async (id: string, updates: Partial<AlterationJob>) => {
        try {
            const res = await fetch(`${API_URL}/alterations/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates),
            });
            if (res.ok) {
                const updated = await res.json();
                setAlterations(prev => prev.map(a => a.id === id ? updated : a));
            }
        } catch (error) {
            console.error("Error updating alteration:", error);
        }
    };

    const addOrder = async (order: Order) => {
        try {
            const res = await fetch(`${API_URL}/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(order),
            });
            if (res.ok) {
                const newOrder = await res.json();
                setOrders(prev => [...prev, newOrder]);
            }
        } catch (error) {
            console.error("Error adding order:", error);
        }
    };

    const addStaff = async (staff: Staff) => {
        try {
            const res = await fetch(`${API_URL}/staff`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(staff),
            });
            if (res.ok) {
                const newStaff = await res.json();
                setStaffList(prev => [...prev, newStaff]);
            }
        } catch (error) {
            console.error("Error adding staff:", error);
        }
    };

    const addBill = async (bill: Bill) => {
        try {
            const res = await fetch(`${API_URL}/bills`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bill),
            });
            if (res.ok) {
                const newBill = await res.json();
                setBills(prev => [...prev, newBill]);
                const sareesRes = await fetch(`${API_URL}/sarees`);
                if (sareesRes.ok) setSarees(await sareesRes.json());
            }
        } catch (error) {
            console.error("Error adding bill:", error);
        }
    };

    const updateSettings = async (updates: any) => {
        try {
            const res = await fetch(`${API_URL}/settings`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates),
            });
            if (res.ok) {
                const updated = await res.json();
                setSettings(updated);
                toast.success('Settings updated successfully');
            }
        } catch (error) {
            console.error("Error updating settings:", error);
            toast.error('Failed to update settings');
        }
    };

    return (
        <DataContext.Provider
            value={{
                sarees,
                suppliers,
                adjustments,
                purchases,
                alterations,
                orders,
                staffList,
                bills,
                addSaree,
                updateSaree,
                deleteSaree,
                addSupplier,
                updateSupplier,
                deleteSupplier,
                addAdjustment,
                addPurchase,
                addAlteration,
                updateAlteration,
                addOrder,
                addStaff,
                addBill,
                settings,
                updateSettings
            }}
        >
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};
