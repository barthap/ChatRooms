import { render, screen } from '@testing-library/react';
import React from 'react';

import NewRoomForm from '../NewRoomForm';

describe('<NewRoomForm />', () => {
  it('renders form snapshot without error message', () => {
    const loginForm = render(<NewRoomForm />);
    expect(loginForm).toMatchSnapshot();
  });
  it('displays error message', () => {
    const msg = 'Test error';
    render(<NewRoomForm errorMessage={msg} />);
    const msgElement = screen.getByText(msg);
    expect(msgElement).toBeInTheDocument();
  });
});
