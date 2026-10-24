import { render } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";

export { act, fireEvent, render, renderHook, screen, waitFor } from "@testing-library/react";

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
  configs: SnapshotConfig<T>[],
): void => {
  const snapshot = (config: SnapshotConfig<T>): void => {
    const { asFragment } = render(
      React.createElement(
        MemoryRouter,
        null,
        React.createElement(Component, config.props),
      ),
    );

    expect(asFragment()).toMatchSnapshot();
  };

  if (expect.getState().currentTestName) {
    configs.forEach(snapshot);

    return;
  }

  describe(`${Component.displayName || Component.name || "Component"} Snapshots`, () => {
    configs.forEach((config, index) => {
      it(config.desc || `renders snapshot ${index}`, () => {
        snapshot(config);
      });
    });
  });
};

export default {
  assertSnapshots,
};
