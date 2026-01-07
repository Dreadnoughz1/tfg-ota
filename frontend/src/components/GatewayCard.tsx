import type { Gateway } from '../api/gateways.api';
import { useNavigate } from 'react-router-dom';

interface Props {
  gateway: Gateway;
  onDelete: (id: number) => void;
}

export function GatewayCard({ gateway, onDelete }: Props) {
  const navigate = useNavigate();

  return (
    <div
      style={{
        border: '1px solid #ccc',
        padding: 12,
        marginBottom: 10,
        cursor: 'pointer',
      }}
      onClick={() => navigate(`/gateways/${gateway.id}/connectors`)}
    >
      <h4>{gateway.name}</h4>

      <button
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/gateways/${gateway.id}/attributes`);
        }}
      >
        Ver atributos
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(gateway.id);
        }}
      >
        Eliminar
      </button>
    </div>
  );
}
