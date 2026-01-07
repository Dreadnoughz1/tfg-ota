import { api } from './axios';

export interface Gateway {
  id: number;
  name: string;
}

export const getGateways = async (): Promise<Gateway[]> => {
  const res = await api.get('/gateways');
  return res.data;
};

export const deleteGateway = async (id: number) => {
  await api.delete(`/gateways/${id}`);
};
