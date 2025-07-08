import React from 'react';
import { AlertCircle, RefreshCw, Home, Mail } from 'lucide-react';
import { useTheme } from '../../../../hooks/useTheme';
import logolight from '../../../../assests/Logo/Frame 8.svg'
import logodark from '../../../../assests/Logo/Frame 15.svg'

const EvalvoErrorPage = ({ error, resetError }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 transition-colors duration-300 ${
      isDark ? 'bg-gray-950 text-white' : 'bg-white text-gray-900'
    }`}>
      <div className="max-w-md w-full text-center">
       
        <img src={theme === 'light' ? logolight : logodark} alt="" />

        {/* Error Icon with Animation */}
        <div className="mb-6 flex justify-center">
          <div className={`relative p-4 rounded-full ${
            isDark ? 'bg-red-500/20' : 'bg-red-50'
          }`}>
            <AlertCircle className={`w-12 h-12 ${
              isDark ? 'text-red-400' : 'text-red-500'
            } animate-pulse`} />
            <div className={`absolute inset-0 rounded-full ${
              isDark ? 'bg-red-500/10' : 'bg-red-100'
            } animate-ping opacity-75`}></div>
          </div>
        </div>

        {/* Error Message */}
        <h1 className={`text-3xl font-bold mb-4 ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          Oops! Something went wrong
        </h1>
        
        <p className={`text-lg mb-2 ${
          isDark ? 'text-gray-300' : 'text-gray-600'
        }`}>
          We're sorry for the inconvenience
        </p>
        
        {error?.message && (
          <div className={`mb-6 p-4 rounded-lg border-l-4 text-left ${
            isDark 
              ? 'bg-gray-800 border-red-400 text-gray-300' 
              : 'bg-red-50 border-red-500 text-gray-700'
          }`}>
            <p className="text-sm font-mono">{error.message}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3 mb-8">
          <button
            onClick={resetError || (() => window.location.reload())}
            className={`w-full flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] ${
              isDark
                ? 'bg-indigo-400 hover:bg-indigo-300 text-gray-900 shadow-lg shadow-indigo-400/25'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/25'
            }`}
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Try Again
          </button>
          
          <button
            onClick={() => window.location.href = '/'}
            className={`w-full flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all duration-200 border hover:scale-[1.02] active:scale-[0.98] ${
              isDark
                ? 'border-gray-700 hover:bg-gray-800 text-gray-300 hover:text-white'
                : 'border-gray-300 hover:bg-gray-50 text-gray-700 hover:text-gray-900'
            }`}
          >
            <Home className="w-5 h-5 mr-2" />
            Go Home
          </button>
        </div>

        {/* Support Section */}
        <div className={`text-sm ${
          isDark ? 'text-gray-400' : 'text-gray-500'
        }`}>
          <p className="mb-2">Need help? Contact our support team</p>
          <button
            onClick={() => window.location.href = 'mailto:support@evalvotech.com'}
            className={`inline-flex items-center px-4 py-2 rounded-md transition-colors duration-200 ${
              isDark
                ? 'hover:bg-gray-800 hover:text-gray-300'
                : 'hover:bg-gray-100 hover:text-gray-700'
            }`}
          >
            <Mail className="w-4 h-4 mr-2" />
            quries@insansa.com
          </button>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className={`absolute top-20 left-10 w-2 h-2 rounded-full animate-bounce ${
            isDark ? 'bg-indigo-400/30' : 'bg-indigo-600/20'
          }`} style={{ animationDelay: '0s' }}></div>
          <div className={`absolute top-32 right-20 w-1 h-1 rounded-full animate-bounce ${
            isDark ? 'bg-indigo-400/40' : 'bg-indigo-600/30'
          }`} style={{ animationDelay: '0.5s' }}></div>
          <div className={`absolute bottom-40 left-20 w-1.5 h-1.5 rounded-full animate-bounce ${
            isDark ? 'bg-indigo-400/20' : 'bg-indigo-600/15'
          }`} style={{ animationDelay: '1s' }}></div>
        </div>
      </div>
    </div>
  );
};

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught in ErrorBoundary:", error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <EvalvoErrorPage 
          error={this.state.error} 
          resetError={this.resetError}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;