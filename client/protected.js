import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProtectedRoute = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProtectedData = async () => {
      try {
        const response = await axios.get('http://localhost:8081/protected');
        setMessage(response.data);
      } catch (error) {
        if (error.response && error.response.status === 403) {
          setMessage('Access forbidden. Please log in.');
        } else {
          setMessage('Error accessing protected route.');
        }
      }
    };

    fetchProtectedData();
  }, []);

  return (
    <div>
      <h2>Protected Route</h2>
      <p>{message}</p>
    </div>
  );
};

export default ProtectedRoute;
