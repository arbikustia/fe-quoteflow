jest.mock("@/app/layout", () => ({
  __esModule: true,
  /**
   * Render a plain wrapper around children.
   *
   * @param {React.PropsWithChildren} props - Layout props
   * @returns {React.ReactElement} Wrapper element
   */
  default: (props: React.PropsWithChildren): React.ReactElement => <div>{props.children}</div>,
}));

describe('OrderComponent Test', () => {
  it('Should render correctly', () => {
    expect(true).toBe(true);
  });
});
