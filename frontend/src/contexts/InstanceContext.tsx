import { createContext, useContext } from 'react';

export interface InstanceContextType {
  instanceId: string | null;
  loading: boolean;
}

export const InstanceContext = createContext<InstanceContextType>({
  instanceId: null,
  loading: true,
});

export function useInstance() {
  return useContext(InstanceContext);
}
