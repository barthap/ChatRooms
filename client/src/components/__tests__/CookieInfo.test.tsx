import { render } from '@testing-library/react';
import React from 'react';

import CookieInfo from '../CookieInfo';

describe('<CookieInfo />', () => {
  it('renders correctly', () => {
    const cookieInfo = render(<CookieInfo />);
    expect(cookieInfo).toMatchSnapshot();
  });
});
