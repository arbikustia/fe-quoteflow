import { render } from "@testing-library/react";

import { ProfileComponent } from "./Profile.component";

jest.mock("../../components/ConfirmModal", () => ({
  __esModule: true,
  default: () => null,
}));

describe("ProfileComponent snapshots", () => {
  it("should match profile settings snapshot", (): void => {
    const { asFragment } = render(
      <ProfileComponent username="alice" theme="light" isLogoutConfirmOpen={false} onToggleTheme={jest.fn()} onOpenLogoutConfirm={jest.fn()} onCloseLogoutConfirm={jest.fn()} onConfirmLogout={jest.fn()} />,
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
