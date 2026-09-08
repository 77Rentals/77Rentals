import { useAllOwnerProperties } from '@/hooks/useAllOwnerProperties';
import { Card } from '@/components/ui/card';
import { Home } from 'lucide-react';

function formatCOP(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function AdminPropertyListings() {
  const { properties, isLoading } = useAllOwnerProperties();

  if (isLoading || properties.length === 0) return null;

  return (
    <Card className="p-6 border-0 shadow-md">
      <div className="flex items-center gap-2 mb-4">
        <Home className="w-5 h-5 text-[#D4A843]" />
        <h2 className="text-xl font-bold text-gray-900">
          Listed Properties ({properties.length})
        </h2>
      </div>
      <div className="divide-y">
        {properties.map((prop) => (
          <div key={prop.id} className="py-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900">{prop.propertyName}</h4>
                <p className="text-sm text-gray-600">
                  {prop.apartmentType}
                  {prop.city && <> • {prop.city}</>} • {prop.maxGuests} guests • {prop.bedrooms} bed •{' '}
                  {prop.bathrooms} bath
                  {prop.nightlyRate !== undefined && <> • {formatCOP(prop.nightlyRate)}/night</>}
                </p>
                {prop.description && (
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{prop.description}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Owner: {prop.ownerName || prop.ownerEmail} • {prop.ownerPhone}
                </p>
              </div>
              <a
                href={prop.googleDriveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-[#D4A843] hover:underline flex-shrink-0"
              >
                Photos
              </a>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
