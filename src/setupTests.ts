import '@testing-library/jest-dom';

// jsdom has no layout engine; Ant Design subscribes to browser APIs.
Object.defineProperty(globalThis, 'MessageChannel', {
  value: class {
    port1 = { onmessage: (): void => {} };
    port2 = { postMessage: (): void => { setTimeout(this.port1.onmessage, 0); } };
  },
});

Object.defineProperty(globalThis, 'ResizeObserver', {
  writable: true,
  value: jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  })),
});

jest.mock('./store/theme.hook', () => ({
  useTheme: () => ({
    theme: 'light',
    toggleTheme: jest.fn(),
    setTheme: jest.fn(),
  }),
}));
