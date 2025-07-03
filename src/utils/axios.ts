// src/utils/axios.ts
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000/api', // your backend root
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;
