import { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import { PartnerAuthProvider, PartnerAuthContext } from '@/contexts/PartnerAuthContext';
import { Login } from '@/components/PartnerHub/Login';
import { PartnerHubLayout } from '@/components/PartnerHub/Layout';
import { AdminDashboard } from '@/components/PartnerHub/AdminDashboard';
import { AdminRequirementForm } from '@/components/PartnerHub/AdminRequirementForm';
import { AdminRequirementsList } from '@/components/PartnerHub/AdminRequirementsList';
import { OwnerDashboard } from '@/components/PartnerHub/OwnerDashboard';
import { OwnerRequirementBrowser } from '@/components/PartnerHub/OwnerRequirementBrowser';

function PartnerHubContent() {
  const auth = useContext(PartnerAuthContext);

  if (auth?.loading) {
    return (
      <div className="min-h-screen bg-[#f8f7ff] flex items-center justify-center text-[#2D1B69]">
        Loading…
      </div>
    );
  }

  if (!auth?.isLoggedIn) {
    return <Login />;
  }

  return (
    <PartnerHubLayout>
      <Routes>
        {/* Admin routes */}
        {auth.userRole === 'admin' ? (
          <>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/requirements/new" element={<AdminRequirementForm />} />
            <Route path="/requirements" element={<AdminRequirementsList />} />
          </>
        ) : (
          <>
            {/* Owner routes */}
            <Route path="/" element={<OwnerDashboard />} />
            <Route path="/browse" element={<OwnerRequirementBrowser />} />
          </>
        )}
      </Routes>
    </PartnerHubLayout>
  );
}

function PartnerHub() {
  console.log('PartnerHub component rendering');
  return (
    <PartnerAuthProvider>
      <PartnerHubContent />
    </PartnerAuthProvider>
  );
}

export default PartnerHub;
