import { useUser } from "../../../contexts/currentUserContext";
import {
  controlData,
  categoryData,
  studentControlData,
  studentCategoryData
} from "./SiddeBarData";

const SideBarDataHook = () => {
  const { user, hasRoleAccess } = useUser();

  // Determine base path based on user role
  const rolePrefix = user.role === 'organization' ? '/institute' : '/student';

  // For organization users (filtered by access)
  if (user.role === 'organization') {
    const filteredControls = controlData
      .filter(control =>
        hasRoleAccess({
          keyFromPageOrAction: null,
          location: `${rolePrefix}/${control.path}`
        })
      )
      .map(control => ({
        ...control,
        fullPath: `${rolePrefix}/${control.path}`
      }));

    const filteredCategories = categoryData
      .map(category => {
        const categoryControls = filteredControls.filter(control =>
          category.features.includes(control.name)
        );
        if (categoryControls.length === 0) return null;

        return {
          ...category,
          features: categoryControls.map(c => c.name)
        };
      })
      .filter(Boolean);

    return {
      controls: filteredControls,
      categories: filteredCategories
    };
  }

  // For student users
  if (user.role === 'student') {
    const processedControls = studentControlData.map(control => ({
      ...control,
      fullPath: `${rolePrefix}/${control.path}`
    }));

    return {
      controls: processedControls,
      categories: studentCategoryData
    };
  }

  // Default fallback
  return {
    controls: [],
    categories: []
  };
};

export default SideBarDataHook;
