import React from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import { TopHeader } from './TopHeader';

export const MainLayout: React.FC = () => {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <TopHeader />
          <main className="flex-1 overflow-auto bg-gradient-cream p-6 silk-pattern">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
