import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../../../../../contexts/currentUserContext";
import { useCachedBatches } from "../../../../../hooks/useCachedBatches";
import { useCachedUser } from "../../../../../hooks/useCachedUser";
import { updateBatch } from "../../../../../utils/services/batchService";
import BackButton from "../../../../constants/BackButton";
import HeadingUtil from "../../../utility/HeadingUtil";
import {
  X,
  Upload,
  CheckCircle,
  PlusCircle,
  FileSpreadsheet,
  Users,
  Calendar,
  BookOpen,
  Zap,
  Target,
  Sparkles,
} from "lucide-react";
import { useTheme } from "../../../../../hooks/useTheme";
import { useToast, ToastContainer } from "../../../../../utils/Toaster";
const BatchPage = () => {
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
  const { toasts, showToast, removeToast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    year: "",
    subjects: [],
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
        .filter(
          (user) => Array.isArray(user.batch) && user.batch.includes(batchId)
        )
        .map((user) => user._id); // only IDs

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
        subjects: batchSubjects,
      });

      setInitialFormData({
        name: batchName,
        year: batchYear,
        subjects: batchSubjects,
      });
    }
  }, [batch]);

  useEffect(() => {
    if (!initialFormData) return;

    const { inputValue, ...currentFormData } = formData;

    const isFormDataChanged =
      currentFormData.name !== initialFormData.name ||
      currentFormData.year.toString() !== initialFormData.year.toString() ||
      JSON.stringify(currentFormData.subjects) !==
        JSON.stringify(initialFormData.subjects);

    const sortedCurrent = [...selectedFaculty].sort();
    const sortedInitial = [...initialFaculty].sort();
    const isFacultyChanged =
      JSON.stringify(sortedCurrent) !== JSON.stringify(sortedInitial);

    if (isFacultyChanged) {
      const add = selectedFaculty.filter((id) => !initialFaculty.includes(id));
      const remove = initialFaculty.filter(
        (id) => !selectedFaculty.includes(id)
      );
      setFacultiesToAdd(add);
      setFacultiesToRemove(remove);
    }

    setHasChanges(isFormDataChanged || isFacultyChanged);
  }, [formData, selectedFaculty, initialFormData, initialFaculty]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const { inputValue, ...formValues } = formData;
    const updatedBatch = {
      ...formValues,
      facultiesToAdd,
      facultiesToRemove, // add this line
    };

    try {
      const response = await updateBatch(batchId, updatedBatch);
      if (response.status === 200) {
        showToast("Batch updated successfully!");
        await queryClient.invalidateQueries(["batches", user._id]);
        await queryClient.invalidateQueries(["Users", user._id]); // Invalidate batches cache
        navigate(`/institute/batch-details`, { state: { batchId } });
      }
    } catch (err) {
      console.error("Error updating batch:", err);
      showToast("Failed to update batch. Please try again.", "error");
      // Handle error (e.g., show notification)
      return;
    } finally {
      setIsSubmitting(false);
    }
    // TODO: call mutation / API to save `updatedBatch`
  };

  const { theme } = useTheme();
  if (isLoading)
    return (
      <div className="p-6 text-center text-gray-600">
        Loading batch information...
      </div>
    );

  return (
    <>
      <div className=" p-4 md:p-8">
        <BackButton />
      </div>
      <div className="max-w-4xl mx-auto py-2">
        <div
          className={`p-8 ${
            theme === "light" ? "bg-indigo-600" : "bg-indigo-400"
          } mb-8 text-white relative overflow-hidden rounded-t-2xl`}
        >
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="relative z-10">
            <h2 className=" text-3xl font-black mb-1 flex items-center space-x-3">
              Edit Batch
            </h2>
            <p className="text-indigo-100 text-xl">
              Update details for batch: "
              <span className="font-semibold">{`${batch.name}`}</span>"
            </p>
          </div>
        </div>
        <div className=" mx-auto">
          <form
            onSubmit={handleSubmit}
            className={` ${
              theme === "light" ? "bg-white" : "bg-gray-600"
            }  p-8 rounded-2xl shadow-2xl space-y-6`}
          >
            {/* Form Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Batch Name */}
                <div>
                  <label
                    htmlFor="name"
                    className={`flex items-center gap-2 ${
                      theme === "light" ? " text-gray-700" : " text-indigo-100"
                    } font-bold text-lg mb-2`}
                  >
                    Batch Name
                  </label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={`w-full p-4 rounded-2xl text-lg font-medium
            ${
              theme === "light"
                ? "bg-gray-50 border-2 border-gray-200 focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400"
                : "bg-gray-700 text-white placeholder:text-gray-400 border border-gray-600 focus:ring-2 focus:ring-indigo-400"
            }
          `}
                  />
                </div>

                {/* Year */}
                <div>
                  <label
                    className={`flex items-center gap-2 ${
                      theme === "light" ? " text-gray-700" : " text-indigo-100"
                    } font-bold text-lg mb-2`}
                  >
                    Year
                  </label>
                  <input
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    type="number"
                    required
                    className={`w-full p-4 rounded-2xl text-lg font-medium
            ${
              theme === "light"
                ? "bg-gray-50 border-2 border-gray-200 focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400"
                : "bg-gray-700 text-white placeholder:text-gray-400 border border-gray-600 focus:ring-2 focus:ring-indigo-400"
            }
          `}
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Subjects */}
                <div>
                  <label
                    className={`flex items-center gap-2 ${
                      theme === "light" ? " text-gray-700" : " text-indigo-100"
                    } font-bold text-lg mb-2`}
                  >
                    Subjects
                  </label>
                  <input
                    type="text"
                    placeholder="Type subject & press Enter"
                    value={formData.inputValue || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        inputValue: e.target.value,
                      }))
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        const newSubject = formData.inputValue?.trim();
                        if (
                          newSubject &&
                          !formData.subjects.includes(newSubject)
                        ) {
                          setFormData((prev) => ({
                            ...prev,
                            subjects: [...prev.subjects, newSubject],
                            inputValue: "",
                          }));
                        }
                      }
                    }}
                    className={`w-full p-4 rounded-2xl text-lg font-medium
            ${
              theme === "light"
                ? "bg-gray-50 border-2 border-gray-200 focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400"
                : "bg-gray-700 text-white placeholder:text-gray-400 border border-gray-600 focus:ring-2 focus:ring-indigo-400"
            }
          `}
                  />

                  {/* Chips */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.subjects.map((subject, index) => (
                      <span
                        key={index}
                        className={`group flex items-center justify-between ${
                          theme === "light"
                            ? "bg-indigo-500 text-gray-100 text-lg"
                            : "bg-indigo-400 text-gray-100 text-lg"
                        }  rounded-2xl p-4 transition-all duration-300 hover:scale-102 shadow-md`}
                      >
                        {subject}
                        <button
                          type="button"
                          className=" ml-4 text-indigo-700 hover:text-indigo-900 transition-all duration-300 hover:rotate-90 bg-white/50 rounded-full p-1"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              subjects: prev.subjects.filter(
                                (_, i) => i !== index
                              ),
                            }))
                          }
                        >
                          <X size={16} />
                        </button>
                      </span>
                    ))}
                  </div>

                  {/* Input */}
                </div>

                {/* Faculties */}
                <div>
                  <label
                    htmlFor="faculties"
                    className={`flex items-center gap-2 ${
                      theme === "light" ? " text-gray-700" : " text-indigo-100"
                    } font-bold text-lg mb-2`}
                  >
                    Assigned Faculty
                  </label>
                  <select
                    onChange={(e) => {
                      const facultyId = e.target.value;
                      if (facultyId && !selectedFaculty.includes(facultyId)) {
                        setSelectedFaculty([...selectedFaculty, facultyId]);
                      }
                    }}
                    className={`w-full p-4 rounded-2xl text-lg font-medium
            ${
              theme === "light"
                ? "bg-gray-50 border-2 border-gray-200 focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400"
                : "bg-gray-700 text-white placeholder:text-gray-400 border border-gray-600 focus:ring-2 focus:ring-indigo-400"
            }
          `}
                  >
                    <option value="">-- Select Faculty --</option>
                    {users
                      .filter((user) => !selectedFaculty.includes(user._id))
                      .map((user) => (
                        <option key={user._id} value={user._id}>
                          {user.name}
                        </option>
                      ))}
                  </select>
                  {/* Faculty Tags */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {selectedFaculty.map((facultyId) => {
                      const faculty = users.find(
                        (user) => user._id === facultyId
                      );
                      return (
                        <span
                          key={facultyId}
                          className={`group flex items-center justify-between ${
                            theme === "light"
                              ? "bg-indigo-500 text-gray-100 text-lg"
                              : "bg-indigo-400 text-gray-100 text-lg"
                          }  rounded-2xl p-4 transition-all duration-300 hover:scale-102 shadow-md`}
                        >
                          {faculty?.name || "Unknown"}
                          <button
                            type="button"
                            className="text-purple-700 hover:text-purple-900 transition-all duration-300 hover:rotate-90 bg-white/50 rounded-full p-2 ml-3"
                            onClick={() =>
                              setSelectedFaculty((prev) =>
                                prev.filter((id) => id !== facultyId)
                              )
                            }
                            title="Remove"
                          >
                            <X size={16} />
                          </button>
                        </span>
                      );
                    })}
                  </div>

                  {/* Faculty Select */}
                </div>
              </div>
            </div>

            {/* Submit Button (outside grid) */}
            <div className="p-8  border-t border-gray-100 flex justify-center">
              <button
                type="submit"
                disabled={!hasChanges}
                className={`group bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-12 py-4 rounded-3xl flex items-center gap-3 font-black text-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl transform ${
                  hasChanges
                    ? "bg-indigo-600 hover:bg-indigo-700"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                <CheckCircle size={24} className="group-hover:animate-pulse" />
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
};

export default BatchPage;
