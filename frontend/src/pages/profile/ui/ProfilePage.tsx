import { useDocumentTitle } from '@mantine/hooks';
import { Navigate } from 'react-router';

import { useViewer } from '../../../entities/session';
import { ROUTES } from '../../../shared/config/routes';
import { AdminProfileView } from './AdminProfileView';
import { BuyerProfileView } from './BuyerProfileView';
import { SellerProfileView } from './SellerProfileView';

export function ProfilePage() {
  useDocumentTitle('Профиль');
  const { role } = useViewer();

  switch (role) {
    case 'guest':
      return <Navigate to={ROUTES.LOGIN} replace />;
    case 'buyer':
      return <BuyerProfileView />;
    case 'seller':
      return <SellerProfileView />;
    case 'admin':
      return <AdminProfileView />;
  }
}
