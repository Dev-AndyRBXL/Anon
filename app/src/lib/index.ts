import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL as string;

export const client = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

export const setupInterceptors = (
  accessToken: string,
  setAccessToken: (token: string) => void
) => {
  client.interceptors.request.use((config) => {
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  });

  client.interceptors.response.use(
    (res) => res,
    async (err) => {
      if (err.response?.status === 401) {
        try {
          const { data } = await client.post('/auth/refresh');
          setAccessToken(data.accessToken); // Update React state/context
          err.config.headers['Authorization'] = `Bearer ${data.accessToken}`;
          return client(err.config); // Retry original request
        } catch {
          return Promise.reject(err);
        }
      }
      return Promise.reject(err);
    }
  );
};
