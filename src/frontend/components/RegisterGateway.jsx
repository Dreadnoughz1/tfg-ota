import { useState } from "react";
import { api } from "../services/api";

export default function RegisterGateway() {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");

  const submit = async () => {
    await api.post("/gateways", { name, location });
    alert("Gateway creado");
  };

  return (
    <div>
      <h3>Registrar Gateway</h3>
      <input placeholder="Nombre" onChange={(e) => setName(e.target.value)} />
      <input
        placeholder="Ubicación"
        onChange={(e) => setLocation(e.target.value)}
      />
      <button onClick={submit}>Guardar</button>
    </div>
  );
}
