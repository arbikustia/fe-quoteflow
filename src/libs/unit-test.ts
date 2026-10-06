import { render } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";

export type SnapshotConfig<T> = {
  readonly desc?: string;
  readonly props: T;
};

/**
 * Utility to run snapshot tests against an array of configs.
 * @param {React.ComponentType<T>} Component - The React component to test
 * @param {SnapshotConfig<T>[]} configs - Array of test configurations
 * @returns {void}
 */
const assertSnapshots = <T extends object>(
  Component: React.ComponentType<T>, 
  configs: SnapshotConfig<T>[]
): void => {
  describe(`${Component.displayName || Component.name || "Component"} Snapshots`, () => {
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
