
import React, { useState } from "react";
import { FaLock, FaSignInAlt, FaUser, FaShieldAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface LoginFormValues {
  username: string;
  password: string;
  twoFactorCode: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'credentials' | '2fa'>('credentials');
  const [formData, setFormData] = useState<LoginFormValues>({
    username: '',
    password: '',
    twoFactorCode: '',
  });
  const [rememberDevice, setRememberDevice] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate credential validation
    if (formData.username && formData.password) {
      setStep('2fa');
    }
  };

  const handle2FASubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate 2FA validation
    if (formData.twoFactorCode.length === 6) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaShieldAlt className="text-white text-3xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">
            {step === 'credentials' ? 'Enter your credentials to continue' : 'Enter your 2FA code to complete login'}
          </p>
        </div>

        {/* Step Indicators */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step === 'credentials' ? 'bg-indigo-600 text-white' : 'bg-green-600 text-white'
              }`}>
              <FaUser />
            </div>
            <div className={`w-20 h-1 ${step === '2fa' ? 'bg-indigo-600' : 'bg-gray-300'
              }`} />
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step === '2fa' ? 'bg-indigo-600 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
              <FaShieldAlt />
            </div>
          </div>
        </div>

        {/* Credentials Step */}
        {step === 'credentials' && (
          <form onSubmit={handleCredentialsSubmit}>
            <div className="mb-4">
              <label htmlFor="username" className="block text-gray-700 mb-2 font-medium">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-gray-400" />
                </div>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-700 mb-2 font-medium">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg flex items-center justify-center transition duration-200 font-medium"
            >
              <FaSignInAlt className="mr-2" />
              Continue
            </button>
          </form>
        )}

        {/* 2FA Step */}
        {step === '2fa' && (
          <form onSubmit={handle2FASubmit}>
            <div className="mb-6">
              <label htmlFor="twoFactorCode" className="block text-gray-700 mb-2 font-medium">
                Two-Factor Authentication Code
              </label>
              <p className="text-sm text-gray-600 mb-3">
                Enter the 6-digit code from your authenticator app
              </p>
              <input
                type="text"
                id="twoFactorCode"
                name="twoFactorCode"
                value={formData.twoFactorCode}
                onChange={handleChange}
                maxLength={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-center text-2xl tracking-widest font-mono"
                placeholder="000000"
                required
              />
            </div>

            <div className="mb-6">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberDevice}
                  onChange={(e) => setRememberDevice(e.target.checked)}
                  className="mr-2 w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700">Remember this device for 30 days</span>
              </label>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep('credentials')}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 px-4 rounded-lg transition duration-200 font-medium"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg flex items-center justify-center transition duration-200 font-medium"
              >
                <FaSignInAlt className="mr-2" />
                Log In
              </button>
            </div>
          </form>
        )}

        <div className="mt-6 text-center">
          <a href="#" className="text-sm text-indigo-600 hover:text-indigo-700">
            Need help signing in?
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
