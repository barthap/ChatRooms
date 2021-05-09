import React, { useEffect, useState } from 'react';

import { API_URL } from '../common/constants';

async function fetchServer() {
  try {
    const result = await fetch(API_URL + '/health');
    return result.text();
  } catch (e) {
    console.error(e);
    return 'Down :(';
  }
}

export default function ApiComponent() {
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
