import * as React from 'react';

import { NavbarComponent } from './Navbar.component';
import { useRealtimeClock } from './Navbar.hook';
import type { NavbarProps } from './Navbar.type';

/**
 * Render Navbar Container
 * @param {NavbarProps} props - container props
 * @returns {React.ReactElement} - Navbar Container
 */
const NavbarContainer = (props: NavbarProps): React.ReactElement => {
  const currentTime = useRealtimeClock();

  return <NavbarComponent {...props} currentTime={currentTime} />;
};

export default NavbarContainer;
