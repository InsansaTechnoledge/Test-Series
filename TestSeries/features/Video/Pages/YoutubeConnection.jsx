import { useEffect } from "react";
import { useUser } from "../../../contexts/currentUserContext";
import { useNavigate } from "react-router-dom";
import { callBack, register } from "../../../utils/services/videoService";
import { checkAuth } from "../../../utils/services/authService";

const YoutubeConnection = () => {
    // const { user, setUser } = useUser();
    const navigate = useNavigate();

    // useEffect(() => {
    //     console.log("User in YoutubeConnection:", user);
    //     if (user?.youtubeInfo) {
    //         navigate('/institute/video/upload'); // Make sure this path is correct
    //     }
    // }, [user]);

    const callbackUrl = async (code) => {
        try {
          const callbackResponse = await callBack(code);
          console.log("Callback Response:", callbackResponse);
          console.log("Efsxc")
          // Navigate to video upload, absolute path
          navigate('/video/upload');
        } catch (error) {
          console.error('Error during YouTube callback:', error);
        }
      };
      

    useEffect(() => {
        console.log("YoutubeConnection mounted");
      }, []);
      

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
            console.log('Redirecting to:', authUrl);
            window.location.href = authUrl;
        } catch (error) {
            console.error('Error during registration or redirect:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
                        <h1 className="text-3xl font-bold text-white mb-2">Connect to YouTube</h1>
                        <p className="text-blue-100">Seamlessly integrate your YouTube account with our platform</p>
                    </div>
                    
                    {/* Content */}
                    <div className="px-8 py-8">
                        <div className="mb-8">
                            <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                                To connect your YouTube account, please follow the instructions below:
                            </p>
                            
                            <div className="bg-blue-50 rounded-xl p-6 border-l-4 border-blue-500">
                                <ol className="space-y-4 text-gray-700">
                                    <li className="flex items-start">
                                        <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">1</span>
                                        <span>Go to your YouTube account settings.</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">2</span>
                                        <span>Navigate to the "Connected Apps" section.</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">3</span>
                                        <span>Click on "Add New Connection" and select "Path: TestSeries".</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">4</span>
                                        <span>Follow the prompts to authorize the connection.</span>
                                    </li>
                                </ol>
                            </div>
                        </div>
                        
                        <div className="bg-gradient-to-r from-blue-50 to-white p-6 rounded-xl border border-blue-200 mb-8">
                            <p className="text-gray-700 leading-relaxed">
                                <strong className="text-blue-700">Once connected,</strong> you will be able to manage your YouTube videos directly from our platform with enhanced features and analytics.
                            </p>
                        </div>
                        
                        {/* Action Button */}
                        <div className="text-center">
                            <button
                                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300"
                                onClick={handleClick}
                            >
                                <svg className="w-5 h-5 inline-block mr-2" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                                </svg>
                                Connect to YouTube
                            </button>
                            <p className="text-sm text-gray-500 mt-3">Secure OAuth 2.0 authentication</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default YoutubeConnection;