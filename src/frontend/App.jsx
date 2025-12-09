import RegisterGateway from "./components/RegisterGateway";
import RegisterConnector from "./components/RegisterConnector";
import RegisterMachine from "./components/RegisterMachine";

function App() {
  return (
    <>
      <h1>Registro de Infraestructura</h1>

      <RegisterGateway />
      <RegisterConnector />
      <RegisterMachine />
    </>
  );
}

export default App;
