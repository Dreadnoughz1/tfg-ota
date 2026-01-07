import { useEffect, useState } from 'react';
import { type Gateway, getGateways, deleteGateway } from '../api/gateways.api';
import { GatewayCard } from '../components/GatewayCard';

export function GatewaysPage() {
  const [gateways, setGateways] = useState<Gateway[]>([]);

  const loadGateways = async () => {
    const data = await getGateways();
    setGateways(data);
  };

  useEffect(() => {
    loadGateways();
  }, []);

  const handleDelete = async (id: number) => {
    await deleteGateway(id);
    loadGateways();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Gateways</h2>

      <button>➕ Registrar nueva Gateway</button>

      <div style={{ marginTop: 20 }}>
        {gateways.map((g) => (
          <GatewayCard key={g.id} gateway={g} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
}
