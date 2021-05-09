import { render, screen } from '@testing-library/react';
import React from 'react';

import LoginForm from '../LoginForm';

describe('<LoginForm />', () => {
  it('renders form snapshot without error message', () => {
    const loginForm = render(<LoginForm />);
    expect(loginForm).toMatchSnapshot();
  });
  it('displays error message', () => {
    const msg = 'Test error';
    render(<LoginForm errorMessage={msg} />);
    const msgElement = screen.getByText(msg);
    expect(msgElement).toBeInTheDocument();
  });
});
