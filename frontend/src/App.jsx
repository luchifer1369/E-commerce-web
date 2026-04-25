import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import UmkmDetail from './pages/UmkmDetail';
import Navbar from './components/Navbar'; // Dibuat di langkah 4

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/umkm/:id" element={<UmkmDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
