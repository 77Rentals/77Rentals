import { useContext } from 'react';
import { PartnerAuthProvider, PartnerAuthContext } from '@/contexts/PartnerAuthContext';
import { Login } from '@/components/PartnerHub/Login';
import { PartnerHubLayout } from '@/components/PartnerHub/Layout';
import { AdminDashboard } from '@/components/PartnerHub/AdminDashboard';
import { OwnerDashboard } from '@/components/PartnerHub/OwnerDashboard';

function PartnerHubContent() {
  const auth = useContext(PartnerAuthContext);

  if (!auth?.isLoggedIn) {
    return <Login />;
  }

  return (
    <PartnerHubLayout>
      {auth.userRole === 'admin' ? <AdminDashboard /> : <OwnerDashboard />}
    </PartnerHubLayout>
  );
}

export function PartnerHub() {
  return (
    <PartnerAuthProvider>
      <PartnerHubContent />
    </PartnerAuthProvider>
  );
}
