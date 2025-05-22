import { useContext } from 'react';
import { AuthContext } from '@/context/auth';

export function useAuth() {
  return useContext(AuthContext);
}
