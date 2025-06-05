import { useLocation, useNavigate } from "react-router-dom";
import { useCachedBatches } from "../../../../../hooks/useCachedBatches";
import { useEffect, useState } from "react";
import HeadingUtil from "../../../utility/HeadingUtil";
import { useCachedUser } from "../../../../../hooks/useCachedUser";
import { updateBatch } from "../../../../../utils/services/batchService";
import { useQueryClient } from "@tanstack/react-query";
import { useUser } from "../../../../../contexts/currentUserContext";
import BackButton from "../../../../constants/BackButton";

const EditBatchPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { batchId } = location.state || {};
    const { batchMap } = useCachedBatches();
    const batch = batchMap[batchId];
    const { user } = useUser();
    const { users } = useCachedUser(); // All users
    const [selectedFaculty, setSelectedFaculty] = useState([]);
    const [hasChanges, setHasChanges] = useState(false);
    const [initialFormData, setInitialFormData] = useState(null);
    const [initialFaculty, setInitialFaculty] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        year: "",
        subjects: []
    });
    const queryClient = useQueryClient();
    const [facultiesToAdd, setFacultiesToAdd] = useState([]);
    const [facultiesToRemove, setFacultiesToRemove] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);


    useEffect(() => {
        if (users && batch) {
            setIsLoading(false);
        }
    }, [users, batch]);

    useEffect(() => {
        if (users && batchId) {
            const facultyIds = users
                .filter(user => Array.isArray(user.batch) && user.batch.includes(batchId))
                .map(user => user._id); // only IDs

            setSelectedFaculty(facultyIds);
            setInitialFaculty(facultyIds);
        }
    }, [users, batchId]);


    useEffect(() => {
        if (batch) {
            const batchSubjects = batch.subjects || [];
            const batchName = batch.name || "";
            const batchYear = batch.year || "";

            setFormData({
                name: batchName,
                year: batchYear,
                subjects: batchSubjects
            });

            setInitialFormData({
                name: batchName,
                year: batchYear,
                subjects: batchSubjects
            });
        }
    }, [batch]);


    useEffect(() => {
        if (!initialFormData) return;

        const isFormDataChanged =
            formData.name !== initialFormData.name ||
            formData.year !== initialFormData.year ||
            JSON.stringify(formData.subjects) !== JSON.stringify(initialFormData.subjects);

        const isFacultyChanged =
            JSON.stringify(selectedFaculty.slice().sort()) !== JSON.stringify(initialFaculty.slice().sort());
        if (isFacultyChanged) {
            const add = selectedFaculty.filter(id => !initialFaculty.includes(id));
            const remove = initialFaculty.filter(id => !selectedFaculty.includes(id));


            setFacultiesToAdd(add);
            setFacultiesToRemove(remove);
        }

        setHasChanges(isFormDataChanged || isFacultyChanged);
    }, [formData, selectedFaculty, initialFormData, initialFaculty]);


    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const {inputValue,...formValues}=formData;
        const updatedBatch = {
            ...formValues,
            facultiesToAdd,
            facultiesToRemove // add this line
        };

        try {
            const response = await updateBatch(batchId, updatedBatch);
            if (response.status === 200) {
                console.log("Batch updated successfully:", response.data);
                alert("Batch updated successfully!");
                await queryClient.invalidateQueries(['batches', user._id]);
                await queryClient.invalidateQueries(['Users', user._id])// Invalidate batches cache
                navigate(`/institute/batch-details`, 
                   {state: { batchId } } );
                
            }

        } catch (err) {
            console.error("Error updating batch:", err);
            alert("Failed to update batch. Please try again.");
            // Handle error (e.g., show notification)
            return;
        }
        finally {
            setIsSubmitting(false);
        }
        // TODO: call mutation / API to save `updatedBatch`

    };


    if (isLoading) return <div className="p-6 text-center text-gray-600">Loading batch information...</div>;


    return (
        <>
            <div className="flex justify-between items-center mb-5">
                <BackButton />
            </div>
            <div className="p-6">
                <HeadingUtil heading="Edit Batch" description={`Update details for batch: ${batch.name}`} />
                <form onSubmit={handleSubmit} className="space-y-4 bg-gray-100 p-6 rounded-md shadow-md">

                    <label className="block font-medium mb-1">Batch Name</label>
                    <input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-md"
                        required
                    />
                    <label className="block font-medium mb-1">Year</label>
                    <input
                        name="year"
                        value={formData.year}
                        onChange={handleChange}
                        type="number"
                        className="w-full px-4 py-2 border rounded-md"
                        required
                    />

                    {/* Example: Subject input (basic comma separated) */}

                    <div>
                        <label className="block font-medium mb-1">Subjects</label>

                        {/* Subject Chips */}
                        <div className="flex flex-wrap gap-2 mb-2">
                            {formData.subjects.map((subject, index) => (
                                <span
                                    key={index}
                                    className="flex items-center bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                                >
                                    {subject}
                                    <button
                                        type="button"
                                        className="ml-2 text-red-600 hover:text-red-800"
                                        onClick={() =>
                                            setFormData(prev => ({
                                                ...prev,
                                                subjects: prev.subjects.filter((_, i) => i !== index)
                                            }))
                                        }
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>

                        {/* Add Subject Input */}
                        <input
                            type="text"
                            placeholder="Type a subject and press Enter"
                            value={formData.inputValue || ""}
                            onChange={(e) =>
                                setFormData(prev => ({
                                    ...prev,
                                    inputValue: e.target.value
                                }))
                            }
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    const newSubject = formData.inputValue?.trim();
                                    if (
                                        newSubject &&
                                        !formData.subjects.includes(newSubject)
                                    ) {
                                        setFormData(prev => ({
                                            ...prev,
                                            subjects: [...prev.subjects, newSubject]
                                        }));
                                    }
                                }
                            }}
                            className="w-full px-4 py-2 border rounded-md"
                        />
                    </div>

                    <div>

                        <label className="block font-medium mb-1">Assigned Faculty</label>

                        <div className="flex flex-wrap gap-2 mt-4">
                            {selectedFaculty.map((facultyId) => {
                                const faculty = users.find(user => user._id === facultyId);
                                return (
                                    <span
                                        key={facultyId}
                                        className="flex items-center bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                                    >
                                        {faculty?.name || "Unknown"}
                                        <button
                                            type="button"
                                            className="ml-2 text-red-500 hover:text-red-700"
                                            onClick={() =>
                                                setSelectedFaculty(prev => prev.filter(id => id !== facultyId))
                                            }
                                            title="Remove"
                                        >
                                            ×
                                        </button>
                                    </span>
                                );
                            })}
                        </div>
                    </div>

                    <select
                        onChange={(e) => {
                            const facultyId = e.target.value;
                            if (facultyId && !selectedFaculty.includes(facultyId)) {
                                setSelectedFaculty([...selectedFaculty, facultyId]);
                            }
                        }}
                        className="w-full mt-2 border px-4 py-2 rounded-md"
                    >
                        <option value="">-- Select Faculty --</option>
                        {users
                            .filter(user => !selectedFaculty.includes(user._id))
                            .map(user => (
                                <option key={user._id} value={user._id}>
                                    {user.name}
                                </option>
                            ))}
                    </select>

                    <button type="submit" disabled={!hasChanges}
                        className={`px-4 py-2 rounded-md text-white ${hasChanges ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
                            }`}>
                        {isSubmitting ? "Saving..." : "Save Changes"}
                    </button>
                </form>
            </div>
        </>
    );
};

export default EditBatchPage;
