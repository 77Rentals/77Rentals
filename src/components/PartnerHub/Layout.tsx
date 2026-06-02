import { useContext, ReactNode } from 'react';
import { PartnerAuthContext } from '@/contexts/PartnerAuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/translations';
import { LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { LanguageSwitcher } from './LanguageSwitcher';

interface PartnerHubLayoutProps {
  children: ReactNode;
}

export function PartnerHubLayout({ children }: PartnerHubLayoutProps) {
  const auth = useContext(PartnerAuthContext);
  const { language } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!auth) {
    return null;
  }

  const handleLogout = () => {
    auth.logout();
  };

  return (
    <div className="min-h-screen bg-[#f8f7ff]">
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-40 md:hidden p-2 rounded-lg bg-[#2D1B69] text-white"
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-gradient-to-b from-[#2D1B69] to-[#1a0f3f] text-white transform transition-transform duration-200 ease-in-out z-30 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-white/10">
            <h2 className="text-xl font-serif font-bold mb-4">Partner Hub</h2>
            <div className="space-y-4 mb-4">
              <div className="space-y-1">
                <p className="text-white/80 text-sm font-medium truncate">{auth.userEmail}</p>
                <p className="text-white/60 text-xs">
                  {t(auth.userRole === 'admin' ? 'layout.administrator' : 'layout.propertyOwner', language)}
                </p>
              </div>
              <LanguageSwitcher />
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {auth.userRole === 'admin' ? (
                <>
                  <a
                    href="/partner-hub"
                    onClick={() => setSidebarOpen(false)}
                    className="block px-4 py-2 rounded-lg hover:bg-white/10 transition-colors text-sm"
                  >
                    {t('layout.dashboard', language)}
                  </a>
                  <a
                    href="/partner-hub/requirements/new"
                    onClick={() => setSidebarOpen(false)}
                    className="block px-4 py-2 rounded-lg hover:bg-white/10 transition-colors text-sm"
                  >
                    {t('layout.postRequirement', language)}
                  </a>
                  <a
                    href="/partner-hub/requirements"
                    onClick={() => setSidebarOpen(false)}
                    className="block px-4 py-2 rounded-lg hover:bg-white/10 transition-colors text-sm"
                  >
                    {t('layout.allRequirements', language)}
                  </a>
                </>
              ) : (
                <>
                  <a
                    href="/partner-hub"
                    onClick={() => setSidebarOpen(false)}
                    className="block px-4 py-2 rounded-lg hover:bg-white/10 transition-colors text-sm"
                  >
                    {t('layout.myDashboard', language)}
                  </a>
                  <a
                    href="/partner-hub/browse"
                    onClick={() => setSidebarOpen(false)}
                    className="block px-4 py-2 rounded-lg hover:bg-white/10 transition-colors text-sm"
                  >
                    {t('layout.browseRequirements', language)}
                  </a>
                  <a
                    href="/partner-hub/responses"
                    onClick={() => setSidebarOpen(false)}
                    className="block px-4 py-2 rounded-lg hover:bg-white/10 transition-colors text-sm"
                  >
                    {t('layout.myResponses', language)}
                  </a>
                </>
              )}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-white/10">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium"
            >
              <LogOut size={16} />
              {t('layout.logout', language)}
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="md:ml-64 min-h-screen p-4 md:p-8">
        {sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-20 md:hidden"
          />
        )}
        {children}
      </main>
    </div>
  );
}
