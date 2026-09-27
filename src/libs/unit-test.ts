import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

/**
 * Utility to run snapshot tests against an array of configs.
 * Note: This is a boilerplate helper based on the FE Code Convention.
 */
const assertSnapshots = (Component: React.ComponentType<any>, configs: any[]) => {
  describe(`${Component.displayName || Component.name} Snapshots`, () => {
    configs.forEach((config, index) => {
      it(config.desc || `renders snapshot ${index}`, () => {
        const { asFragment } = render(React.createElement(Component, config.props));
        expect(asFragment()).toMatchSnapshot();
      });
    });
  });
};

export default {
  assertSnapshots,
};
