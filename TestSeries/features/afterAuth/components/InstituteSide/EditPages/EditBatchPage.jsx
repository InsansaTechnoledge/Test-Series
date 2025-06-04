import { useLocation, useNavigate } from "react-router-dom";
import { useCachedBatches } from "../../../../../hooks/useCachedBatches";
import { useEffect, useState } from "react";
import HeadingUtil from "../../../utility/HeadingUtil";
import { useCachedUser } from "../../../../../hooks/useCachedUser";

const EditBatchPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { batchId } = location.state || {};
    const { batchMap } = useCachedBatches();
    const batch = batchMap[batchId];
    const { users } = useCachedUser(); // All users
    const [selectedFaculty, setSelectedFaculty] = useState(batch?.faculty || []);


    const [formData, setFormData] = useState({
        name: "",
        year: "",
        subjects: []
    });

    useEffect(() => {
        if (batch) {
            setFormData({
                name: batch.name || "",
                year: batch.year || "",
                subjects: batch.subjects || []
            });
        }
    }, [batch]);

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // TODO: call API or mutation to update batch
        console.log("Updated Batch:", formData);
        navigate(-1); // go back after saving
    };

    if (!batch) return <div>Loading batch info...</div>;

    return (
        <div className="p-6">
            <HeadingUtil heading="Edit Batch" description={`Update details for batch: ${batch.name}`} />
            <form onSubmit={handleSubmit} className="space-y-4 bg-gray-100 p-6 rounded-md shadow-md">
                <div>
                    <label className="block font-medium mb-1">Batch Name</label>
                    <input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-md"
                        required
                    />
                </div>
                <div>
                    <label className="block font-medium mb-1">Year</label>
                    <input
                        name="year"
                        value={formData.year}
                        onChange={handleChange}
                        type="number"
                        className="w-full px-4 py-2 border rounded-md"
                        required
                    />
                </div>
                {/* Example: Subject input (basic comma separated) */}
                <div>
                    <label className="block font-medium mb-1">Subjects (comma-separated)</label>
                    <input
                        name="subjects"
                        value={formData.subjects.join(", ")}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                subjects: e.target.value.split(",").map(s => s.trim())
                            }))
                        }
                        className="w-full px-4 py-2 border rounded-md"
                    />
                </div>
                <label className="block font-medium mb-1">Assigned Faculty</label>
        

                <select
                    onChange={(e) => {
                        const facultyId = e.target.value;
                        const alreadyAdded = selectedFaculty.includes(facultyId);
                        if (!alreadyAdded) {
                            setSelectedFaculty([...selectedFaculty, facultyId]);
                        }
                    }}
                >
                    <option value="">-- Select Faculty --</option>
                    {users.map(user => (
                        <option key={user._id} value={user._id}>
                            {user.name}
                        </option>
                    ))}
                </select>


                <ul className="mt-4">
                    {selectedFaculty.map(facultyId => {
                        const faculty = users.find(user => user._id === facultyId);
                        return (
                            <li key={facultyId} className="flex justify-between items-center mb-2">
                                <span>{faculty?.name || "Unknown"}</span>
                                <button
                                    className="text-red-500 hover:underline"
                                    onClick={() => {
                                        setSelectedFaculty(prev => prev.filter(id => id !== facultyId));
                                    }}
                                >
                                    Remove
                                </button>
                            </li>
                        );
                    })}
                </ul>

                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                    Save Changes
                </button>
            </form>
        </div>
    );
};

export default EditBatchPage;
