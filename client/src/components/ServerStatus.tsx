import React, { useEffect, useState } from 'react';

import { API_URL } from '../common/constants';

async function fetchServer() {
  try {
    const result = await fetch(API_URL + '/health');
    const text = await result.text();
    return text === 'OK' ? 'Up ✅' : text;
  } catch (e) {
    console.error(e);
    return '❌ Down :(';
  }
}

export default function ServerStatus() {
  const [status, setStatus] = useState('loading...');

  useEffect(() => {
    fetchServer().then(body => setStatus(body));
  }, []);

  return (
    <p>
      Server status is: <b>{status}</b>
    </p>
  );
}
