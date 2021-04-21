import React, { useEffect, useState } from 'react';

const API_URL = process.env.REACT_APP_API_URL || '/api';

export default function ApiComponent() {
  const [status, setStatus] = useState('loading...');

  console.warn('api', API_URL);
  console.warn('ws', process.env.REACT_APP_WS_URL);

  const fetchServer = async () => {
    try {
      const result = await fetch(API_URL + '/health');
      return result.text();
    } catch (e) {
      console.error(e);
      return 'Down :(';
    }
  };

  useEffect(() => {
    fetchServer().then(body => setStatus(body));
  }, []);

  return <p>Server status is: {status}</p>;
}
