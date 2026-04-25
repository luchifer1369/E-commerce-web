import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import UmkmDetail from './pages/UmkmDetail';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import BuyerOrders from './pages/BuyerOrders';
import OwnerOrders from './pages/OwnerOrders';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/umkm/:id" element={<UmkmDetail />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/buyer/orders" element={<BuyerOrders />} />
            <Route path="/owner/orders" element={<OwnerOrders />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
