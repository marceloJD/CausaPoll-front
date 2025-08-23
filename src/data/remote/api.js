import axios from 'axios';

const api = axios.create({
  baseURL: 'https://causapoll-api-production.up.railway.app/api', // ← tu base URL real
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;

