import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import type { Petition, PetitionRosterEntry } from '@/data/petition';
import { getPetition, getPetitionRoster } from '@/lib/petitionClient';

export default function PetitionRosterPage() {
  const { petitionId } = useParams<{ petitionId: string }>();
  const [petition, setPetition] = useState<Petition | null | 'not_found'>(null);
  const [roster, setRoster] = useState<PetitionRosterEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Keep this transparency roster out of search engines even though it's a public link.
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  useEffect(() => {
    if (!petitionId) {
      setPetition('not_found');
      setLoading(false);
      return;
    }
    Promise.all([getPetition(petitionId), getPetitionRoster(petitionId)])
      .then(([petitionResult, rosterResult]) => {
        setPetition(petitionResult ?? 'not_found');
        setRoster(rosterResult);
      })
      .catch(() => setPetition('not_found'))
      .finally(() => setLoading(false));
  }, [petitionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f7ff] flex items-center justify-center text-[#2D1B69]">
        Cargando…
      </div>
    );
  }

  if (petition === 'not_found' || !petition) {
    return (
      <div className="min-h-screen bg-[#f8f7ff] flex items-center justify-center p-6">
        <Card className="max-w-md w-full p-8 text-center">
          <h1 className="text-xl font-bold text-gray-900 mb-2">Link no encontrado</h1>
          <p className="text-gray-600 text-sm">Esta solicitud no existe o ya no está disponible.</p>
        </Card>
      </div>
    );
  }

  const totalCoefficientPct = roster.reduce((sum, r) => sum + (r.coefficientPct ?? 0), 0);

  return (
    <div className="min-h-screen bg-[#f8f7ff] py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">{petition.title}</h1>
          <p className="text-gray-600 text-sm mt-1">Listado público de firmantes</p>
        </div>

        {!petition.rosterPublic ? (
          <Card className="p-8 text-center space-y-2">
            <p className="text-gray-700 font-medium">Este listado no está disponible públicamente.</p>
            <p className="text-sm text-gray-500">
              Puedes{' '}
              <Link to={`/peticion/${petition.id}`} className="text-[#2D1B69] underline">
                volver a la solicitud
              </Link>
              .
            </p>
          </Card>
        ) : (
          <>
            <Card className="p-4 text-center">
              <p className="text-lg font-bold text-gray-900">
                {roster.length} propietario{roster.length === 1 ? '' : 's'} ha
                {roster.length === 1 ? '' : 'n'} firmado
              </p>
              <p className="text-xs text-gray-500">{totalCoefficientPct.toFixed(3)}% de coeficiente acumulado</p>
            </Card>

            <Card className="p-4 overflow-x-auto">
              {roster.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-6">Nadie ha firmado todavía.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 border-b border-gray-200">
                      <th className="py-2 pr-3">Unidad</th>
                      <th className="py-2 pr-3">Propietario</th>
                      <th className="py-2 pr-3">Coef. %</th>
                      <th className="py-2">Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roster.map((entry) => (
                      <tr key={entry.unitNumber} className="border-b border-gray-100">
                        <td className="py-2 pr-3 font-medium">{entry.unitNumber}</td>
                        <td className="py-2 pr-3">{entry.signerName}</td>
                        <td className="py-2 pr-3">{entry.coefficientPct === null ? '—' : entry.coefficientPct.toFixed(3)}</td>
                        <td className="py-2">{entry.signedAt.toLocaleDateString('es-CO')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </Card>

            <p className="text-center text-xs text-gray-400">
              Por privacidad, este listado no muestra cédulas ni imágenes de firma — solo unidad, nombre y fecha.
            </p>

            <div className="text-center">
              <Link to={`/peticion/${petition.id}`} className="text-sm text-[#2D1B69] underline">
                {petition.status === 'open' ? '¿Aún no has firmado? Firma aquí' : 'Ver el documento de la solicitud'}
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
