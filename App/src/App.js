import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/login";
import OrderView from "./components/orderView";
import CreateProduct from "./components/createProduct";  // Asegúrate de que la ruta sea correcta
import Pago from "./components/pago";  // Asegúrate de que la ruta sea correcta

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/productServices" element={<OrderView />} />
        <Route path="/createproduct" element={<CreateProduct />} />
        <Route path="/pago" element={<Pago />} />
      </Routes>
    </Router>
  );
}

export default App;
