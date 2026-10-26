import { fireEvent, render, screen } from '@testing-library/react';

import { LoginPageComponent } from './LoginPage.component';

const renderLoginPage = (): void => {
  render(
    <LoginPageComponent
      identifier=""
      password=""
      isPasswordVisible={false}
      isRemembered={false}
      isSubmitting={false}
      errorMessage={null}
      onIdentifierChange={jest.fn()}
      onPasswordChange={jest.fn()}
      onTogglePasswordVisibility={jest.fn()}
      onRememberedChange={jest.fn()}
      onSubmit={jest.fn()}
    />,
  );
};

describe('LoginPageComponent', () => {
  it('should render Indonesian login form content', () => {
    renderLoginPage();

    expect(screen.getByRole('heading', { name: 'Selamat datang kembali' })).toBeInTheDocument();
    expect(screen.getByLabelText('Nama pengguna')).toBeInTheDocument();
    expect(screen.getByLabelText('Kata sandi')).toBeInTheDocument();
    expect(screen.getByText('Ingat saya')).toBeInTheDocument();
    expect(screen.getByText('Lupa kata sandi?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Masuk' })).toBeInTheDocument();
  });

  it('should call password visibility handler', () => {
    const handleTogglePasswordVisibility = jest.fn();

    render(
      <LoginPageComponent
        identifier=""
        password="secret"
        isPasswordVisible={false}
        isRemembered={false}
        isSubmitting={false}
        errorMessage={null}
        onIdentifierChange={jest.fn()}
        onPasswordChange={jest.fn()}
        onTogglePasswordVisibility={handleTogglePasswordVisibility}
        onRememberedChange={jest.fn()}
        onSubmit={jest.fn()}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Tampilkan kata sandi' }));

    expect(handleTogglePasswordVisibility).toHaveBeenCalledTimes(1);
  });
});
