import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './components/NavBar';
import SideMenu from './components/SideMenu';
import StoreManagement from './pages/Store';
import SKUPage from './pages/SKU';
import Planning from './pages/Planning';
import './App.css';

const App = () => (
  <Router>
    <NavBar />
    <div className="flex min-w-[1080px]">
      <SideMenu />
      <main className="flex-1">
        <Routes>
        <Route path="/" element={<Navigate to="/store" replace />} />
        <Route path="/store" element={<StoreManagement />} />
        <Route path="/sku" element={<SKUPage />} />
        <Route path="/planning" element={<Planning />} />
        </Routes>
      </main>
    </div>
  </Router>
);

export default App;
