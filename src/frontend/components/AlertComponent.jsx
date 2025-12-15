import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000'); // Asegúrate de que la URL coincida con la de tu servidor

const AlertComponent = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    // Conectar al WebSocket
    socket.on('connect', () => {
      console.log('🟢 Conectado al WebSocket');
    });

    // Escuchar las alertas que el servidor emite
    socket.on('alert', (alert) => {
      console.log('🚨 ALERTA RECIBIDA:', alert);
      // Actualiza el estado con la nueva alerta
      setAlerts((prevAlerts) => [...prevAlerts, alert]);
    });

    // Limpiar el socket al desmontar el componente
    return () => {
      socket.off('alert');
    };
  }, []);

  return (
    <div>
      <h2>Alertas en tiempo real</h2>
      <ul>
        {alerts.map((alert, index) => (
          <li key={index}>
            <strong>{alert.attributeName}:</strong> {alert.value} (Severity:{' '}
            {alert.severity})
            <br />
            <small>{new Date(alert.timestamp).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AlertComponent;
