import { useContext } from 'react';
import { PartnerAuthProvider, PartnerAuthContext } from '@/contexts/PartnerAuthContext';
import { Login } from '@/components/PartnerHub/Login';
import { PartnerHubLayout } from '@/components/PartnerHub/Layout';

function PartnerHubContent() {
  const auth = useContext(PartnerAuthContext);

  if (!auth?.isLoggedIn) {
    return <Login />;
  }

  return (
    <PartnerHubLayout>
      <div className="space-y-6">
        {auth.userRole === 'admin' ? (
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
            <p className="text-gray-600">Coming soon...</p>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Owner Dashboard</h2>
            <p className="text-gray-600">Coming soon...</p>
          </div>
        )}
      </div>
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
