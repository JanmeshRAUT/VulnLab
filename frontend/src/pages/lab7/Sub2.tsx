import React, { Suspense } from 'react';
import { useLocation } from 'react-router-dom';

const NorthstarOffice = React.lazy(() => import('./auth2/NorthstarOffice'));
const AegisWorkforce = React.lazy(() => import('./auth2/AegisWorkforce'));
const HelixAdmin = React.lazy(() => import('./auth2/HelixAdmin'));

export default function Sub2({ variantIdProp }: { variantIdProp?: string }) {
  const variant = variantIdProp ? `2${variantIdProp}` : '2a';

  const renderVariant = () => {
    switch (variant) {
      case '2a':
        return <NorthstarOffice />;
      case '2b':
        return <AegisWorkforce />;
      case '2c':
        return <HelixAdmin />;
      default:
        return <div>Variant not found</div>;
    }
  };

  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen bg-gray-50 text-gray-500">Loading variant...</div>}>
      {renderVariant()}
    </Suspense>
  );
}
