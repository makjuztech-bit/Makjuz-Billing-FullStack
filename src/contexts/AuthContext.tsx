import React, { createContext, useContext, useState, ReactNode } from 'react';
import { API_URL } from '@/lib/config';

export type UserRole = 'admin' | 'manager' | 'cashier' | 'salesman' | 'stock_manager';

export interface User {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  branch?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string, branch?: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  updateUserData: (data: Partial<User>) => void;
}

const rolePermissions: Record<UserRole, string[]> = {
  admin: ['*'], // All permissions
  manager: [
    'view_dashboard', 'create_bill', 'edit_bill', 'delete_bill', 'view_reports',
    'manage_customers', 'manage_inventory', 'manage_staff', 'view_profit',
    'apply_discount', 'process_return', 'approve_credit'
  ],
  cashier: [
    'view_dashboard', 'create_bill', 'view_bills', 'manage_customers',
    'apply_discount', 'process_payment'
  ],
  salesman: [
    'view_dashboard', 'create_bill', 'view_bills', 'add_customer'
  ],
  stock_manager: [
    'view_dashboard', 'manage_inventory', 'view_stock', 'stock_adjustment',
    'purchase_entry', 'manage_suppliers'
  ],
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (username: string, password: string, branch?: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, branch })
      });

      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    const permissions = rolePermissions[user.role];
    return permissions.includes('*') || permissions.includes(permission);
  };

  const updateUserData = (data: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...data });
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, hasPermission, updateUserData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
