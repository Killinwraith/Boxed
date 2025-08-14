// api.js - API utility functions
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export const api = {
  // GET request
  async getUsers() {
    const response = await fetch(`${API_BASE_URL}/api/users`);
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
  },

  // GET single user
  async getUser(id) {
    const response = await fetch(`${API_BASE_URL}/api/users/${id}`);
    if (!response.ok) throw new Error('Failed to fetch user');
    return response.json();
  },

  // POST request
  async createUser(userData) {
    const response = await fetch(`${API_BASE_URL}/api/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error('Failed to create user');
    return response.json();
  },

  // PUT request
  async updateUser(id, userData) {
    const response = await fetch(`${API_BASE_URL}/api/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error('Failed to update user');
    return response.json();
  },

  // DELETE request
  async deleteUser(id) {
    const response = await fetch(`${API_BASE_URL}/api/users/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete user');
    return response.json();
  }
};
