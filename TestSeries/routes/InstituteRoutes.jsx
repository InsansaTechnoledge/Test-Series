import { Outlet, useNavigate } from "react-router-dom";
import { useUser } from "../contexts/currentUserContext";
import { useEffect, useState } from "react";
import { usePageAccess } from "../contexts/PageAccessContext";



const InstituteRoutes = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const [isAccessDenied, setIsAccessDenied] = useState(false);
    const canAccessPage=usePageAccess();

    useEffect(() => {
        if (!user || user.role === 'student') {
            navigate('/');
        }
    }, [user, navigate]);

    useEffect(() => {
        if (!canAccessPage) {
           
            if (location.pathname === '/institute/institute-landing') {
                setIsAccessDenied(false); // Allow access to 'institute-landing' even if they don't have access
            } else {
                setIsAccessDenied(true);
            }
        } else {
            setIsAccessDenied(false);
        }
    }, [location.pathname]); 
    
    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            {isAccessDenied && (
                <div className="bg-red-600 py-4 text-center text-gray-100">
                    You are not included in this plan. Please contact support for more details.
                </div>
            )}

            <Outlet />
        </div>
    );
};

export default InstituteRoutes