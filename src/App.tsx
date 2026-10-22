import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ShowcaseGrid } from './components/ShowcaseGrid';
import { PricingSection } from './components/PricingSection';
import { WorkflowSection } from './components/WorkflowSection';
import { Footer } from './components/Footer';
import { ServicesPage } from './pages/ServicesPage';
import { NewsPage } from './pages/NewsPage';
import { ContactPage } from './pages/ContactPage';
import { AccountPage } from './pages/AccountPage';
import { DesignerPortal } from './pages/DesignerPortal';
import { AdminDashboard } from './pages/AdminDashboard';
import { OrderModal } from './components/modals/OrderModal';
import { WalletModal } from './components/modals/WalletModal';
import { TemplateDetailModal } from './components/modals/TemplateDetailModal';
import { OrderDetailsModal } from './components/modals/OrderDetailsModal';
import { CpanelExportModal } from './components/modals/CpanelExportModal';
import { PolicyModal } from './components/modals/PolicyModal';

const MainLayout: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();
  const [heroCategory, setHeroCategory] = useState<string>('Tất cả');

  const handleSelectCategoryFromHero = (category: string) => {
    setHeroCategory(category);
    setActiveTab('templates');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#070d18] text-slate-800 dark:text-slate-100 transition-colors duration-200">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <>
            <Hero onCategorySelect={handleSelectCategoryFromHero} />
            <ShowcaseGrid initialCategory={heroCategory} />
            <PricingSection />
            <WorkflowSection />
          </>
        )}

        {activeTab === 'services' && <ServicesPage />}

        {activeTab === 'templates' && (
          <div className="py-6">
            <ShowcaseGrid initialCategory={heroCategory} showAll={true} />
          </div>
        )}

        {activeTab === 'pricing' && (
          <div className="py-6 space-y-12">
            <PricingSection />
            <WorkflowSection />
          </div>
        )}

        {activeTab === 'news' && <NewsPage />}

        {activeTab === 'contact' && <ContactPage />}

        {activeTab === 'account' && <AccountPage />}

        {activeTab === 'designer' && <DesignerPortal />}

        {activeTab === 'admin' && <AdminDashboard />}
      </main>

      {/* Footer */}
      <Footer />

      {/* Interactive Global Modals */}
      <OrderModal />
      <WalletModal />
      <TemplateDetailModal />
      <OrderDetailsModal />
      <CpanelExportModal />
      <PolicyModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
