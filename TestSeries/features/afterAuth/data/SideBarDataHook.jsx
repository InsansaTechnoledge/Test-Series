import { useUser } from "../../../contexts/currentUserContext";
import { controlData } from "./SiddeBarData";
import { categoryData } from "./SiddeBarData";

const SideBarDataHook = () => {
    const { user,hasRoleAccess } = useUser()
    if(user.role !== 'organization') {
    const filteredControls = controlData.filter(control =>
        hasRoleAccess({
            keyFromPageOrAction: null,
            location: `/institute/${control.path}`
        })
    )
    console.log("Filtered Controls:", filteredControls);

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

console.log("Filtered Categories:", filteredCategories);
    return {
        controls: filteredControls,
        categories: filteredCategories
    }
}
else{
    return{
        controls: controlData,
        categories: categoryData
    }
}


};

export default SideBarDataHook;
