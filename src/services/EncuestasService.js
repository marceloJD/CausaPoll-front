import api from './api';

export const crearEncuesta = async (datos) => {
  
  try {
    const response = await api.post('/api/encuestas', datos);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.mensaje || 'No se pudo crear la encuesta'
    );
  }
};

