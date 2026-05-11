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

function PartnerHub() {
  console.log('PartnerHub component rendering');
  return (
    <PartnerAuthProvider>
      <PartnerHubContent />
    </PartnerAuthProvider>
  );
}

export default PartnerHub;
