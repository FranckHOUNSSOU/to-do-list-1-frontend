import axios from 'axios';

// API_URL résout automatiquement pour la production et pour le développement:
// - Si REACT_APP_API_URL est défini (ex: https://my-backend.onrender.com),
//   on ajoute "/api" pour obtenir https://my-backend.onrender.com/api
// - Sinon on utilise la route relative "/api" pour fonctionner avec le proxy
export const API_URL = process.env.REACT_APP_API_URL
  ? `${process.env.REACT_APP_API_URL.replace(/\/+$/,'')}/api`
  : '/api';

const api = axios.create({
  baseURL: API_URL,
});

export default api;
