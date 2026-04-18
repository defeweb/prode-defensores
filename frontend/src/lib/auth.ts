import Cookies from 'js-cookie';

export interface User {
  id: number;
  nombre: string;
  email: string;
  rol: string;
}

export const getToken = () => Cookies.get('token');
export const getUser  = (): User | null => {
  if (typeof window === 'undefined') return null;
  const u = localStorage.getItem('user');
  return u ? JSON.parse(u) : null;
};

export const saveAuth = (token: string, user: User) => {
  Cookies.set('token', token, { expires: 7 });
  localStorage.setItem('user', JSON.stringify(user));
};

export const clearAuth = () => {
  Cookies.remove('token');
  localStorage.removeItem('user');
};

export const isAdmin = () => getUser()?.rol === 'admin';
