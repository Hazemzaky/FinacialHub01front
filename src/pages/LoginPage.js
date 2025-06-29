import React, { useState } from 'react';
import axios from 'axios';

// This function will get the API URL from our .env file
const getApiUrl = () => {
  return process.env.NODE_ENV === 'production' 
    ? process.env.REACT_APP_API_URL
    : 'http://localhost:8000'; // Default for local development
};

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const API_URL = getApiUrl();

    try {
      const response = await axios.post(`${API_URL}/api/login/`, {
        username: username,
        password: password
      });
      const { token } = response.data;
      localStorage.setItem('authToken', token);
      axios.defaults.headers.common['Authorization'] = `Token ${token}`;

      // Redirect to dashboard on success
      window.location.href = '/dashboard';

    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.error || 'Failed to login.');
      } else {
        setError('An unexpected error occurred. Please try again later.');
      }
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
