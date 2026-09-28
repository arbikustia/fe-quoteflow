import * as React from 'react';

import { NavbarComponent } from './Navbar.component';


/**
 * Render Navbar Container
 * @param {NavbarProps} props - container props
 * @returns {React.ReactElement} - Navbar Container
 */
const NavbarContainer = (): React.ReactElement => {
  return (
    <NavbarComponent />
  );
};

export default NavbarContainer;
