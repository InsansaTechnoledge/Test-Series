import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { callBack, register } from "../../utils/services/videoService";
import Banner from "../../assests/Institute/upload videos.svg"
import { usePageAccess } from "../../contexts/PageAccessContext";
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
      
    const canAccessPage = usePageAccess();

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
     
   
<>

<div className="min-h-screen">

<div className="relative overflow-hidden rounded-xl h-80">
    {/* // Background Image */}
    <img 
        src={Banner} 
        alt="Upload Banner"
        className="absolute  w-full h-full object-cover"
    />
    
  
    <div className="absolute "></div>
    
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


{/* Connection Card  */}
<div className="relative -mt-10 z-30 px-6 pb-12">
    <div className="max-w-4xl mx-auto">
        <div className="backdrop-blur-xl bg-white/90 rounded-3xl shadow-2xl border border-white/20 overflow-hidden hover:shadow-3xl transition-all duration-500">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-slate-700 px-8 py-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/90 to-slate-700/90 backdrop-blur-sm"></div>
                <div className="relative z-10">
                    <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">Connect to Platform</h1>
                    <p className="text-indigo-100/90 text-lg font-medium">Seamlessly integrate your account with our modern platform</p>
                </div>
             
            </div>
            
            {/* Content */}
            <div className="px-8 py-10 space-y-8 bg-white">
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
                        disabled={canAccessPage === false}
                        onClick={handleClick}
                        className={`group relative px-10 py-5 rounded-2xl font-bold shadow-2xl transform transition-all duration-500 backdrop-blur-sm overflow-hidden focus:outline-none 
                        ${canAccessPage === false
                            ? 'bg-gray-300 cursor-not-allowed text-red-600 focus:ring-0'
                            : 'bg-gradient-to-r from-indigo-600 via-indigo-700 to-slate-700 hover:from-indigo-700 hover:via-slate-700 hover:to-indigo-800 text-white hover:scale-105 hover:-translate-y-1 focus:ring-4 focus:ring-indigo-300/50'}
                        `}
                    >
                        {/* Shiny animated gradient on hover */}
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

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
                        <p className="text-sm text-slate-500 font-medium">
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

export default Connection;


