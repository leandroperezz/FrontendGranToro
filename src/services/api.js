const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

const getToken = () => {
  return localStorage.getItem('token');
};

export const registerUser = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/usuarios`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  return handleResponse(response);
};

export const loginUser = async (credentials) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  return handleResponse(response);
};

export const getAllRazas = async () => {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}/razas`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};

export const getAllUsers = async () => {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}/usuarios`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};

export const getAllBovinos = async (filters = {}) => {
  const queryParams = new URLSearchParams(filters).toString();
  const url = `${API_BASE_URL}/bovinos${queryParams ? `?${queryParams}` : ''}`;
  const response = await fetch(url);
  return handleResponse(response);
};

export const createBovino = async (bovinoData) => {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}/bovinos`, {
    method: 'POST',
    headers: {
      //'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: bovinoData,
  });
  return handleResponse(response);
};

export const getBovinoById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/bovinos/${id}`);
  return handleResponse(response);
};

export const updateBovino = async (id, bovinoData) => {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}/bovinos/${id}`, {
    method: 'PUT',
    headers: {
      //'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: bovinoData,
  });
  return handleResponse(response);
};

export const deleteBovino = async (id) => {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}/bovinos/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (response.status === 204) return null;
  return handleResponse(response);
};