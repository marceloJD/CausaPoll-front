import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Monitoreo from '../pages/Monitoreo';
import Voto from '../pages/Voto';
import Header from '../components/layout/Header';

function AppRouter() {
  return (
    <BrowserRouter>
      <Header />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/monitoreo/:id" element={<Monitoreo />} />
          <Route path="/votar/:id" element={<Voto />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default AppRouter;
