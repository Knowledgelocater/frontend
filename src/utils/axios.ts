// src/utils/axios.ts
import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://asskibou-production.up.railway.app/api', // your backend root
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;
