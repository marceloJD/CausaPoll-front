import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

import Home from '../pages/Home';
import Monitoreo from '../pages/Monitoreo';
import Voto from '../pages/Voto';
import Header from '../components/layout/Header';
import VotoMejorado from '../presentation/pages/VotoMejorado'

function AppRouter() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

function AppLayout() {
  const location = useLocation();
  const isVotarPage = location.pathname.startsWith('/votar');
  const isVotarMejoradoPage = location.pathname.startsWith('/votarMejorado');
  return (
    <>
      {(!isVotarPage || !isVotarMejoradoPage)&& <Header />}
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/monitoreo/:id" element={<Monitoreo />} />
          <Route path="/votar/:id" element={<Voto />} />
          <Route path="/votoMejorado/:id" element={<VotoMejorado />} />
        </Routes>
      </div>
    </>
  );
}

export default AppRouter;