import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login and redirect to home
    navigate("/home");
  };

  return (
    <div className="flex-1 h-full w-full flex items-center justify-center bg-brand-gray-light overflow-hidden relative">
      {/* Massive soft background gradients */}
      <div className="absolute top-0 left-0 w-[80vw] h-[80vw] max-w-200 max-h-200 bg-brand-orange-light rounded-full mix-blend-multiply filter blur-[100px] opacity-70 -translate-x-1/4 -translate-y-1/4"></div>
      <div className="absolute bottom-0 right-0 w-[80vw] h-[80vw] max-w-200 max-h-200 bg-brand-blue-light rounded-full mix-blend-multiply filter blur-[100px] opacity-70 translate-x-1/4 translate-y-1/4"></div>
      <div className="absolute top-1/2 left-1/2 w-[60vw] h-[60vw] max-w-150 max-h-150 bg-brand-white rounded-full filter blur-[120px] opacity-50 -translate-x-1/2 -translate-y-1/2"></div>

      <div className="relative w-full max-w-md p-8 sm:p-10 mx-4 bg-white/90 backdrop-blur-2xl border border-white/60 rounded-3xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] z-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-semibold text-brand-text-dark mb-3">
            Welcome Back
          </h1>
          <p className="text-brand-text-medium text-sm">
            Please enter your details to sign in.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-brand-text-dark mb-2 text-center">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-3 rounded-xl bg-white border border-gray-200 focus:ring-2 focus:ring-brand-blue transition-all outline-none text-brand-text-dark placeholder:text-gray-400 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-brand-text-dark mb-2 text-center">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-3 rounded-xl bg-white border border-gray-200 focus:ring-2 focus:ring-brand-orange transition-all outline-none text-brand-text-dark placeholder:text-gray-400 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]"
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="h-4 w-4 text-brand-blue focus:ring-brand-orange border-gray-300 rounded cursor-pointer"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-brand-text-medium cursor-pointer select-none"
              >
                Remember me
              </label>
            </div>
            <a
              href="#"
              className="text-sm font-semibold text-brand-blue hover:text-brand-blue-dark transition-colors"
            >
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-3.5 px-4 mt-6 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-linear-to-r from-[#D7A37E] to-[#7B8FE1] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
