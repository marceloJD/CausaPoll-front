import React from 'react';
import AppRouter from './router/AppRouter';
import { makeUseCases } from "./compositionRoot.js";

const casosDeUso = makeUseCases();


function App() {
  return <AppRouter casosDeUso={casosDeUso} />;
}

export default App;
