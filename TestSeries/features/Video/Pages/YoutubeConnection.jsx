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

            // const authResponse = await checkAuth();
            // if (authResponse.status === 200) {
            //     setUser(authResponse.data.user);
            // }

            // Optional: navigate manually after setting user
            navigate('/video/upload');
        } catch (error) {
            console.error('Error during YouTube callback:', error);
        }
    };

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
        <div>
            <h1>Connect to YouTube</h1>
            <p>To connect your YouTube account, please follow the instructions below:</p>
            <ol>
                <li>Go to your YouTube account settings.</li>
                <li>Navigate to the "Connected Apps" section.</li>
                <li>Click on "Add New Connection" and select "Path: TestSeries".</li>
                <li>Follow the prompts to authorize the connection.</li>
            </ol>
            <p>Once connected, you will be able to manage your YouTube videos directly from our platform.</p>
            <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleClick}
            >
                Connect to YouTube
            </button>
        </div>
    );
};

export default YoutubeConnection;
