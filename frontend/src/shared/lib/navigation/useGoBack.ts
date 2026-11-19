import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router';

export function useGoBack(fallback: string) {
  const navigate = useNavigate();
  const location = useLocation();

  return useCallback(() => {
    if (location.key !== 'default') navigate(-1);
    else navigate(fallback, { replace: true });
  }, [location.key, navigate, fallback]);
}
