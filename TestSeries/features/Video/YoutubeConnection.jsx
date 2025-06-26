import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { callBack, register } from "../../utils/services/videoService";
import Banner from "../../assests/Institute/upload videos.svg"
import { usePageAccess } from "../../contexts/PageAccessContext";
import { useTheme } from "../../hooks/useTheme";

const Connection = () => {

    const navigate = useNavigate();
    const { theme } = useTheme();

    const callbackUrl = async (code) => {
        try {
          const callbackResponse = await callBack(code);

          // Navigate to video upload, absolute path
          navigate('/video/upload');
        } catch (error) {
          console.error('Error during  callback:', error);
        }
      };
      
    const canAccessPage = usePageAccess();

      

    useEffect(() => {
        if (!window.location.search) return;

        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");

        if (code) {
            callbackUrl(code);
            const newUrl = window.location.origin + window.location.pathname;
            window.history.replaceState({}, document.title, newUrl);
        }
    }, []);

    const handleClick = async () => {
        try {
            const response = await register();
            const authUrl = response.data;

            window.location.href = authUrl;
        } catch (error) {
            console.error('Error during registration or redirect:', error);
        }
    };

    return (
<>
<div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : ''}`}>

<div className="relative overflow-hidden rounded-xl h-80">
    {/* Background Image */}
    <img 
        src={Banner} 
        alt="Upload Banner"
        className="absolute w-full h-full object-cover"
    />
    
    {/* Overlay */}
    <div className={`absolute inset-0 ${
      theme === 'dark' 
        ? 'bg-gray-900/60' 
        : 'bg-black/20'
    }`}></div>
    
    {/* Content */}
    <div className="relative z-10 flex items-center justify-center h-full px-6 text-center">
        <div>
            <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight mb-4 drop-shadow-lg">
                Upload Video
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto drop-shadow-md">
                Upload and share educational videos with your institute community.
            </p>
        </div>
    </div>
</div>

{/* Connection Card */}
<div className="relative -mt-10 z-30 px-6 pb-12">
    <div className="max-w-4xl mx-auto">
        <div className={`rounded-3xl shadow-2xl border overflow-hidden transition-all duration-500 ${
          theme === 'dark'
            ? 'bg-gray-800 border-gray-700 hover:shadow-gray-900/50'
            : 'bg-white border-gray-200 hover:shadow-xl'
        }`}>
            {/* Header */}
            <div className={`px-8 py-8 ${
              theme === 'dark' ? 'bg-indigo-600' : 'bg-indigo-600'
            }`}>
                <div>
                    <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">Connect to Platform</h1>
                    <p className="text-indigo-100 text-lg font-medium">Seamlessly integrate your account with our modern platform</p>
                </div>
            </div>
            
            {/* Content */}
            <div className={`px-8 py-10 space-y-8 ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}>
                <div className="space-y-6">
                    <p className={`text-xl font-medium leading-relaxed ${
                      theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                    }`}>
                        To connect your account, please follow the instructions below:
                    </p>
                    
                    <div className={`rounded-2xl p-8 border shadow-inner ${
                      theme === 'dark'
                        ? 'bg-gray-700 border-gray-600'
                        : 'bg-gray-50 border-gray-200'
                    }`}>
                        <ol className={`space-y-6 ${
                          theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                        }`}>
                            <li className="flex items-start group hover:transform hover:translate-x-2 transition-transform duration-300">
                                <span className={` ${theme === 'light' ? 'bg-indigo-600' : 'bg-indigo-400'} text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 mt-0.5 shadow-lg group-hover:shadow-indigo-600/50 transition-shadow duration-300`}>1</span>
                                <span className="text-lg font-medium">Go to your account settings.</span>
                            </li>
                            <li className="flex items-start group hover:transform hover:translate-x-2 transition-transform duration-300">
                            <span className={` ${theme === 'light' ? 'bg-indigo-600' : 'bg-indigo-400'} text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 mt-0.5 shadow-lg group-hover:shadow-indigo-600/50 transition-shadow duration-300`}>2</span>
                            <span className="text-lg font-medium">Navigate to the "Connected Apps" section.</span>
                            </li>
                            <li className="flex items-start group hover:transform hover:translate-x-2 transition-transform duration-300">
                            <span className={` ${theme === 'light' ? 'bg-indigo-600' : 'bg-indigo-400'} text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 mt-0.5 shadow-lg group-hover:shadow-indigo-600/50 transition-shadow duration-300`}>3</span>
                            <span className="text-lg font-medium">Click on "Add New Connection" and select "Path: TestSeries".</span>
                            </li>
                            <li className="flex items-start group hover:transform hover:translate-x-2 transition-transform duration-300">
                            <span className={` ${theme === 'light' ? 'bg-indigo-600' : 'bg-indigo-400'} text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 mt-0.5 shadow-lg group-hover:shadow-indigo-600/50 transition-shadow duration-300`}>4</span>
                            <span className="text-lg font-medium">Follow the prompts to authorize the connection.</span>
                            </li>
                        </ol>
                    </div>
                </div>
                
                <div className={`p-8 rounded-2xl border shadow-inner ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600'
                    : 'bg-indigo-50 border-indigo-200'
                }`}>
                    <p className={`leading-relaxed text-lg ${
                      theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                    }`}>
                        <strong className={`font-semibold ${
                          theme === 'dark' ? 'text-indigo-400' : 'text-indigo-700'
                        }`}>Once connected,</strong> you will be able to manage your videos directly from our platform with enhanced features and analytics.
                    </p>
                </div>
                
                {/* Action Button */}
                <div className="text-center pt-4">
                    <button
                        disabled={canAccessPage === false}
                        onClick={handleClick}
                        className={`group relative px-10 py-5 rounded-2xl font-bold shadow-2xl transform transition-all duration-500 overflow-hidden focus:outline-none 
                        ${canAccessPage === false
                            ? theme === 'dark'
                              ? 'bg-gray-700 cursor-not-allowed text-red-400'
                              : 'bg-gray-300 cursor-not-allowed text-red-600'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white hover:scale-105 hover:-translate-y-1 focus:ring-4 focus:ring-indigo-600/50'}
                        `}
                    >
                        {/* Shiny animated effect on hover */}
                        <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

                        {/* Button content */}
                        <div className="relative z-10 flex items-center justify-center">
                        <svg
                            className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform duration-300"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                        </svg>
                        <span>{canAccessPage === false ? 'Access Denied' : 'Connect to Platform'}</span>
                        </div>
                    </button>

                    {/* Info below the button */}
                    <div className="mt-4 flex items-center justify-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <p className={`text-sm font-medium ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                        Secure OAuth 2.0 authentication
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</div> 
</>
    );
};

export default Connection