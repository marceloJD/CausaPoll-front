import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

import Home from '../pages/Home';
import Monitoreo from '../pages/Monitoreo';
import Voto from '../pages/Voto';
import Header from '../components/layout/Header';
import VotoMejorado from '../presentation/pages/VotoMejorado'

function AppRouter({casosDeUso}) {
  return (
    <BrowserRouter >
      <AppLayout casosDeUso={casosDeUso}/>
    </BrowserRouter>
  );
}

function AppLayout({casosDeUso}) {
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
          <Route path="/votoMejorado/:id" element={<VotoMejorado casosDeUso={casosDeUso} />} />
        </Routes>
      </div>
    </>
  );
}

export default AppRouter;