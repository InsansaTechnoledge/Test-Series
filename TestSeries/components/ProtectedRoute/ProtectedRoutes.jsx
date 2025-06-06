import { Navigate } from 'react-router-dom';
import { useUser } from '../../contexts/currentUserContext';
import { useCachedRoleGroup } from '../../hooks/useCachedRoleGroup';

const ProtectedRoute = ({ featureId, children }) => {
  const { user } = useUser();
  const { hasActiveFeatureInRole } = useCachedRoleGroup();

  
  if (!user) {
    return <Navigate to="/session-expired" replace />;
  }

 
  if (user.role === "organization") {
    return children;
  }

  // For users (role === "user")
  const canAccess = hasActiveFeatureInRole({
    roleId: user.roleId,  
    featureId              
  });

  if (!canAccess) {
    return <Navigate to="/session-expired" replace />;
  }

  
  return children;
};

export default ProtectedRoute;
