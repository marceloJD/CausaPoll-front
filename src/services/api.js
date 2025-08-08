import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000', // ← tu base URL real
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;