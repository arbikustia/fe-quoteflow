import { render } from '@testing-library/react';

import { LoginPageComponent } from './LoginPage.component';

it('LoginPageComponent matches snapshot', () => {
  const { asFragment } = render(
    <LoginPageComponent
      identifier="user@sonicline.co.id"
      password="password"
      isPasswordVisible={false}
      isRemembered
      onIdentifierChange={jest.fn()}
      onPasswordChange={jest.fn()}
      onTogglePasswordVisibility={jest.fn()}
      onRememberedChange={jest.fn()}
      onSubmit={jest.fn()}
    />,
  );

  expect(asFragment()).toMatchSnapshot();
});
