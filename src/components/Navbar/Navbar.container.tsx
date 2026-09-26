import * as React from 'react';

import { NavbarComponent } from './Navbar.component';
import type { NavbarProps } from './Navbar.type';

/**
 * Render Navbar Container
 * @param {NavbarProps} props - container props
 * @returns {React.ReactElement} - Navbar Container
 */
const NavbarContainer = (props: NavbarProps): React.ReactElement => {
  return (
    <NavbarComponent
      pageTitle={props.pageTitle}
    />
  );
};

export default NavbarContainer;
