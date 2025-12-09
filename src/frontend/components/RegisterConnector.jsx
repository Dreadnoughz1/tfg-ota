import { useState } from "react";
import { api } from "../services/api";

export default function RegisterConnector() {
  const [gatewayId, setGatewayId] = useState("");
  const [portName, setPortName] = useState("");

  const submit = async () => {
    await api.post("/connectors", { gatewayId, portName });
    alert("Conector creado");
  };

  return (
    <div>
      <h3>Registrar Conector</h3>
      <input
        placeholder="Gateway ID"
        onChange={(e) => setGatewayId(e.target.value)}
      />
      <input
        placeholder="Nombre del puerto"
        onChange={(e) => setPortName(e.target.value)}
      />
      <button onClick={submit}>Guardar</button>
    </div>
  );
}
