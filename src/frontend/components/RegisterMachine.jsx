import { useState } from "react";
import { api } from "../services/api";

export default function RegisterMachine() {
  const [connectorId, setConnectorId] = useState("");
  const [serial, setSerial] = useState("");
  const [model, setModel] = useState("");

  const submit = async () => {
    await api.post("/machines", { connectorId, serial, model });
    alert("Máquina creada");
  };

  return (
    <div>
      <h3>Registrar Máquina</h3>
      <input
        placeholder="Connector ID"
        onChange={(e) => setConnectorId(e.target.value)}
      />
      <input placeholder="Serial" onChange={(e) => setSerial(e.target.value)} />
      <input placeholder="Modelo" onChange={(e) => setModel(e.target.value)} />
      <button onClick={submit}>Guardar</button>
    </div>
  );
}
