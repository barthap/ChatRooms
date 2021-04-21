import React, { useEffect, useState } from 'react';

const API_URL = `${process.env.REACT_APP_SERVER_URL}/api` || '/api';

export default function ApiComponent() {
  const [status, setStatus] = useState('loading...');

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
