import '@testing-library/jest-dom';

jest.mock('./store/theme.hook', () => ({
  useTheme: () => ({
    theme: 'light',
    toggleTheme: jest.fn(),
    setTheme: jest.fn(),
  }),
}));
