import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import UmkmDetail from './pages/UmkmDetail';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import BuyerOrders from './pages/BuyerOrders';
import OwnerOrders from './pages/OwnerOrders';
import Login from './pages/Login';
import Register from './pages/Register';
import RegisterUmkm from './pages/RegisterUmkm';
import DashboardUmkm from './pages/DashboardUmkm';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/umkm/:id" element={<UmkmDetail />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            
            {/* Protected Routes for Buyers */}
            <Route path="/cart" element={
              <ProtectedRoute allowedRoles={['buyer', 'owner', 'admin']}>
                <Cart />
              </ProtectedRoute>
            } />
            <Route path="/buyer/orders" element={
              <ProtectedRoute allowedRoles={['buyer', 'owner', 'admin']}>
                <BuyerOrders />
              </ProtectedRoute>
            } />

            {/* Protected Routes for Owners */}
            <Route path="/owner/dashboard" element={
              <ProtectedRoute allowedRoles={['owner']}>
                <DashboardUmkm />
              </ProtectedRoute>
            } />
            <Route path="/owner/orders" element={
              <ProtectedRoute allowedRoles={['owner']}>
                <OwnerOrders />
              </ProtectedRoute>
            } />

            {/* General Protected Routes */}
            <Route path="/register-umkm" element={
              <ProtectedRoute allowedRoles={['buyer']}>
                <RegisterUmkm />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
