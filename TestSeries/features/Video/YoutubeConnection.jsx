import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { callBack, register } from "../../utils/services/videoService";

const Connection = () => {
    // const { user, setUser } = useUser();
    const navigate = useNavigate();

    // useEffect(() => {
    //     console.log("User in Connection:", user);
    //     if (user?.Info) {
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
          console.error('Error during  callback:', error);
        }
      };
      

    useEffect(() => {
        console.log("Connection mounted");
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
     
        <div className="min-h-screen ">
              <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gray-600"></div>
                <div className="absolute inset-0 bg-black opacity-20"></div>
                
                <div className="relative z-10 px-6 py-16 text-center">
                    <h1 className="text-6xl md:text-7xl font-black text-white tracking-tight mb-4">
                        Add User
                    </h1>
                    <p className="text-xl text-white opacity-90 max-w-2xl mx-auto">
                        Create new users and assign them specific roles in your institute
                    </p>
                </div>
            </div>
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse "></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-slate-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-indigo-300 rounded-full mix-blend-multiply filter blur-2xl opacity-10 animate-pulse delay-500"></div>
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10">
            <div className="backdrop-blur-xl bg-white/70 rounded-3xl shadow-2xl border border-white/20 overflow-hidden hover:shadow-3xl transition-all duration-500 max-w-6xl mx-auto px-6 -mt-8 relative z-20 pb-12">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-slate-700 px-8 py-8 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/90 to-slate-700/90 backdrop-blur-sm"></div>
                    <div className="relative z-10">
                        <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">Connect to Platform</h1>
                        <p className="text-indigo-100/90 text-lg font-medium">Seamlessly integrate your account with our modern platform</p>
                    </div>
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12 blur-xl"></div>
                </div>
                
                {/* Content */}
                <div className="px-8 py-10 space-y-8">
                    <div className="space-y-6">
                        <p className="text-slate-700 text-xl font-medium leading-relaxed">
                            To connect your account, please follow the instructions below:
                        </p>
                        
                        <div className="backdrop-blur-sm bg-gradient-to-br from-indigo-50/80 to-slate-50/80 rounded-2xl p-8 border border-indigo-100/50 shadow-inner">
                            <ol className="space-y-6 text-slate-700">
                                <li className="flex items-start group hover:transform hover:translate-x-2 transition-transform duration-300">
                                    <span className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 mt-0.5 shadow-lg group-hover:shadow-indigo-300/50 transition-shadow duration-300">1</span>
                                    <span className="text-lg font-medium">Go to your account settings.</span>
                                </li>
                                <li className="flex items-start group hover:transform hover:translate-x-2 transition-transform duration-300">
                                    <span className="bg-gradient-to-r from-indigo-500 to-slate-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 mt-0.5 shadow-lg group-hover:shadow-slate-300/50 transition-shadow duration-300">2</span>
                                    <span className="text-lg font-medium">Navigate to the "Connected Apps" section.</span>
                                </li>
                                <li className="flex items-start group hover:transform hover:translate-x-2 transition-transform duration-300">
                                    <span className="bg-gradient-to-r from-slate-500 to-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 mt-0.5 shadow-lg group-hover:shadow-indigo-300/50 transition-shadow duration-300">3</span>
                                    <span className="text-lg font-medium">Click on "Add New Connection" and select "Path: TestSeries".</span>
                                </li>
                                <li className="flex items-start group hover:transform hover:translate-x-2 transition-transform duration-300">
                                    <span className="bg-gradient-to-r from-indigo-600 to-slate-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 mt-0.5 shadow-lg group-hover:shadow-slate-300/50 transition-shadow duration-300">4</span>
                                    <span className="text-lg font-medium">Follow the prompts to authorize the connection.</span>
                                </li>
                            </ol>
                        </div>
                    </div>
                    
                    <div className="backdrop-blur-sm bg-gradient-to-r from-indigo-50/60 via-white/60 to-slate-50/60 p-8 rounded-2xl border border-indigo-100/30 shadow-inner">
                        <p className="text-slate-700 leading-relaxed text-lg">
                            <strong className="text-indigo-700 font-semibold">Once connected,</strong> you will be able to manage your videos directly from our platform with enhanced features and analytics.
                        </p>
                    </div>
                    
                    {/* Action Button */}
                    <div className="text-center pt-4">
                        <button
                            className="group relative bg-gradient-to-r from-indigo-600 via-indigo-700 to-slate-700 hover:from-indigo-700 hover:via-slate-700 hover:to-indigo-800 text-white font-bold px-10 py-5 rounded-2xl shadow-2xl hover:shadow-indigo-500/25 transform hover:-translate-y-1 hover:scale-105 transition-all duration-500 focus:outline-none focus:ring-4 focus:ring-indigo-300/50 backdrop-blur-sm overflow-hidden cursor-pointer"
                            onClick={handleClick}
                        >
                            {/* Button background overlay */}
                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                            
                            <div className="relative z-10 flex items-center justify-center">
                                <svg className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                                </svg>
                                <span className="text-lg">Connect to Platform</span>
                            </div>
                        </button>
                        
                        <div className="mt-4 flex items-center justify-center space-x-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <p className="text-sm text-slate-500 font-medium">Secure OAuth 2.0 authentication</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
};

export default Connection;


