import Heading from "../../Heading";
import {PlusSquare,Search} from "lucide-react";
import  React ,{  useState } from "react";
import HeadingUtil from "../../../../utility/HeadingUtil";
import { useCachedBatches } from "../../../../../../hooks/useCachedBatches";
import RefreshButton from "../../../../utility/RefreshButton";
import { useQueryClient } from "@tanstack/react-query";
import { useUser } from "../../../../../../contexts/currentUserContext";
import DeleteBatchModal from "../../../../utility/DeleteBatchModal";
import { useCachedUser } from "../../../../../../hooks/useCachedUser";
import { useCachedStudents } from "../../../../../../hooks/useCachedStudents";
import BatchBanner from "../../../../../../assests/Institute/Banner 1 1.svg";
import { useNavigate } from "react-router-dom";
import { usePageAccess } from "../../../../../../contexts/PageAccessContext";
import { useTheme } from "../../../../../../hooks/useTheme";
import { useToast, ToastContainer } from "../../../../../../utils/Toaster";
import EvalvoPulseBatchLook from "./EvalvoPulseBatchLook";
import EvalvoGridBatchLook from "./EvalvoGridBatchLook";
import { useEvalvoTheme } from "../../../../../../hooks/EvalvoThemeContext";

const BatchList = () => {
  const canAccessPage = usePageAccess();

  if (!canAccessPage) {
    return (
      <div className="flex items-center justify-center ">
        <div className="text-center bg-red-100 px-4 py-3 my-auto">
          <h1 className="text-3xl font-bold text-red-600 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600">
            You do not have permission to view this page.
          </p>
        </div>
      </div>
    );
  }

  const navigate = useNavigate();
  const { user, hasRoleAccess } = useUser();
  const { batches, isloading, isError } = useCachedBatches();
  const { users } = useCachedUser();
  const { students } = useCachedStudents();
  const { toasts, showToast, removeToast } = useToast();

  const { evalvoTheme } = useEvalvoTheme();


  const [selectedYear, setSelectedYear] = useState("");
  const queryClient = useQueryClient();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [batchId, setBatchId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [currentpage, setCurrentPage] = useState(1);
  const [batchesPerpage] = useState(6);

  const canEditBatch = hasRoleAccess({
    keyFromPageOrAction: "actions.editBatch",
    location: null,
  });
  const canDeleteBatch = hasRoleAccess({
    keyFromPageOrAction: "actions.deleteBatch",
    location: null,
  });
  const canViewBatch = hasRoleAccess({
    keyFromPageOrAction: "actions.viewBatch",
    location: null,
  });
  const canCreateBatch = hasRoleAccess({
    keyFromPageOrAction: "actions.createBatch",
    location: null,
  });


  const refreshFunction = async () => {
    await queryClient.invalidateQueries(["batches", user._id]);
  };

  const uniqueYears = [...new Set(batches.map((batch) => batch.year))];

  // Handle View Button Click
  const handleViewBatch = (batchId) => {
    if (!canViewBatch) {
      navigate(`/institute/institute-landing`, { state: { batchId: batchId } });
    } else
      navigate(`/institute/batch-details`, { state: { batchId: batchId } });
  };

  // Handle Edit Button Click
  const handleEditBatch = (batchId) => {
    if (!canEditBatch) {
      navigate(`/institute/edit-batch`, { state: { batchId: batchId } });
    } else navigate(`/institute/edit-batch`, { state: { batchId: batchId } });
  };

  // Handle Delete Button Click
  const handleDeleteBatch = (batchId) => {
    if (!canDeleteBatch) {
      showToast("You do not have permission to delete batches.", "error");
    } else {
      setShowDeleteModal(true);
      setBatchId(batchId);
    }
  };

  // Handle Delete Confirmation
  const confirmDeleteBatch = async () => {
    try {
     
      // Refresh data after deletion
      await refreshFunction();

      // Close modal
      setShowDeleteModal(false);
      setBatchId(null);

      queryClient.invalidateQueries(["batches", user._id]);
    } catch (error) {
      console.error("Error deleting batch:", error);
    }
  };

  const HeadingStyle = {
    h1: {
      WebkitTextStroke: "3px white",
      WebkitTextFillColor: "transparent",
      backgroundColor: "transparent",
    },
  };

  const filteredBatches = batches.filter((batch) => {
    const yearMatch = selectedYear
      ? batch.year === parseInt(selectedYear)
      : true;
    const searchMatch = batch.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return yearMatch && searchMatch;
  });

  const totalPages = Math.ceil(filteredBatches.length / batchesPerpage);
  const indexOfLastBatch = currentpage * batchesPerpage; 
  const indexOfFirstBatch = indexOfLastBatch - batchesPerpage; 

// Slice the batches array to get the current page's batches
const currentBatch = filteredBatches.slice(indexOfFirstBatch, indexOfLastBatch);

// Paginate function to handle page changes
const paginate = (pageNumber) => setCurrentPage(pageNumber);

// Generate page numbers for pagination
const getPageNumbers = () => {
  const pageNumbers = [];
  const maxVisiblePages = 5;

  if (totalPages <= maxVisiblePages) {
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    const startPage = Math.max(1, currentpage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (startPage > 1) {
      pageNumbers.push(1);
      if (startPage > 2) pageNumbers.push('...');
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pageNumbers.push('...');
      pageNumbers.push(totalPages);
    }
  }

  return pageNumbers;
};


  const { theme } = useTheme();

  return (
    <div className={`min-h-screen `}>
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 "></div>
        <div className="absolute inset-0  opacity-20"></div>

        <div
          className="relative z-10 px-6 py-24 text-center bg-cover bg-center bg-no-repeat rounded-xl"
          style={{ backgroundImage: `url(${BatchBanner})` }}
        >
          <div
            className={`absolute inset-0 ${
              theme === "dark" ? "bg-gray-900/60" : "bg-black/20"
            }`}
          ></div>

          <div className="inline-flex items-center space-x-3 mb-4">
            <h1 className="text-6xl z-10 md:text-7xl font-black text-white tracking-tight">
              All Batches
            </h1>
          </div>
          <p className="text-xl z-30 text-white/80 max-w-2xl mx-auto font-medium">
            View details of all batches
          </p>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div
            className={`${
              theme === "light" ? "bg-white" : "bg-gray-800"
            }  rounded-3xl p-6 shadow-xl border-l-4 border-indigo-600 transform hover:scale-105 transition-all duration-300`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={`text-sm font-semibold   ${
                    theme === "light" ? "text-gray-600" : "text-gray-200"
                  } uppercase tracking-wide`}
                >
                  Total Batches
                </p>
                <p
                  className={`text-4xl font-black ${
                    theme === "light" ? "text-indigo-600" : "text-indigo-200"
                  } capitalize`}
                >
                  {filteredBatches?.length}
                </p>
              </div>
              <div
                className={` ${
                  theme === "light" ? "bg-indigo-100" : "bg-indigo-400"
                } p-3 rounded-2xl`}
              >
                {/* <Target className="w-8 h-8 text-indigo-600" /> */}
              </div>
            </div>
          </div>

          <div
            className={`${
              theme === "light" ? "bg-white" : "bg-gray-800"
            }  rounded-3xl p-6 shadow-xl border-l-4 border-indigo-600 transform hover:scale-105 transition-all duration-300`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={`text-sm font-semibold   ${
                    theme === "light" ? "text-gray-600" : "text-gray-200"
                  } uppercase tracking-wide`}
                >
                  Active Years
                </p>
                <p
                  className={`text-4xl font-black ${
                    theme === "light" ? "text-indigo-600" : "text-indigo-200"
                  } capitalize`}
                >
                  {uniqueYears.length}
                </p>
              </div>
              <div
                className={` ${
                  theme === "light" ? "bg-indigo-100" : "bg-indigo-400"
                } p-3 rounded-2xl`}
              >
                {/* <Calendar className="w-8 h-8 text-gray-600" /> */}
              </div>
            </div>
          </div>

          <div
            className={`${
              theme === "light" ? "bg-white" : "bg-gray-800"
            }  rounded-3xl p-6 shadow-xl border-l-4 border-indigo-600 transform hover:scale-105 transition-all duration-300`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={`text-sm font-semibold   ${
                    theme === "light" ? "text-gray-600" : "text-gray-200"
                  } uppercase tracking-wide`}
                >
                  Search Results
                </p>
                <p
                  className={`text-4xl font-black ${
                    theme === "light" ? "text-indigo-600" : "text-indigo-200"
                  } capitalize`}
                >
                  {filteredBatches.length}
                </p>
              </div>
              <div
                className={` ${
                  theme === "light" ? "bg-indigo-100" : "bg-indigo-400"
                } p-3 rounded-2xl`}
              >
                {/* <Search className="w-8 h-8 text-indigo-600" /> */}
              </div>
            </div>
          </div>
        </div>

        {
          evalvoTheme === 'EvalvoPulse' ? (
            <>
            
            <EvalvoPulseBatchLook
            theme={theme}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            uniqueYears={uniqueYears}
            canCreateBatch={canCreateBatch}
            navigate={navigate}
            totalPages={totalPages}
            currentpage={currentpage}
            paginate={paginate}
            getPageNumbers={getPageNumbers}
            filteredBatches={filteredBatches}
            indexOfFirstBatch={indexOfFirstBatch}
            indexOfLastBatch={indexOfLastBatch}
            currentBatch={currentBatch}
            canViewBatch={canViewBatch}
            handleViewBatch={handleViewBatch}
            canEditBatch={canEditBatch}
            handleEditBatch={handleEditBatch}
            canDeleteBatch={canDeleteBatch}
            handleDeleteBatch={handleDeleteBatch}
          />

          {/* Empty State */}
          {filteredBatches?.length === 0 && (
            <div className="text-center py-20">
              <div
                className={`w-32 h-32 mx-auto ${
                  theme === "light"
                    ? "bg-gradient-to-r from-indigo-100 to-gray-100"
                    : "bg-gradient-to-r from-indigo-800 to-gray-700"
                } rounded-full flex items-center justify-center mb-8 animate-bounce`}
              >
                <Search
                  className={`w-12 h-12 ${
                    theme === "light" ? "text-indigo-400" : "text-indigo-300"
                  }`}
                />
              </div>
              <h3
                className={`text-3xl font-black ${
                  theme === "light" ? "text-gray-800" : "text-gray-100"
                } mb-4`}
              >
                No batches found
              </h3>
              <p
                className={`text-xl ${
                  theme === "light" ? "text-gray-600" : "text-gray-400"
                } mb-8 max-w-md mx-auto`}
              >
                {selectedYear
                  ? `No batches found for year ${selectedYear}`
                  : searchTerm
                  ? `No batches match "${searchTerm}"`
                  : "Get started by creating your first batch"}
              </p>
              <button
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-4 rounded-2xl font-bold transition-all duration-300 hover:shadow-2xl hover:scale-105 inline-flex items-center space-x-3"
                onClick={() => navigate("/institute/create-batch")}
              >
                <PlusSquare className="w-5 h-5" />
                <span>Create First Batch</span>
              </button>
            </div>
          )}
          </>

          ) : (
            <EvalvoGridBatchLook
            theme={theme}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            uniqueYears={uniqueYears}
            canCreateBatch={canCreateBatch}
            navigate={navigate}
            totalPages={totalPages}
            currentpage={currentpage}
            paginate={paginate}
            getPageNumbers={getPageNumbers}
            filteredBatches={filteredBatches}
            indexOfFirstBatch={indexOfFirstBatch}
            indexOfLastBatch={indexOfLastBatch}
            currentBatch={currentBatch}
            canViewBatch={canViewBatch}
            handleViewBatch={handleViewBatch}
            canEditBatch={canEditBatch}
            handleEditBatch={handleEditBatch}
            canDeleteBatch={canDeleteBatch}
            handleDeleteBatch={handleDeleteBatch}
            />
          )
        }

       


        
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <DeleteBatchModal
          batchId={batchId}
          faculties={
            users
              ?.filter((user) => user.batch?.includes(batchId))
              .map((f) => f._id) || []
          }
          students={
            students
              ?.filter((student) => student.batch?.currentBatch === batchId)
              .map((s) => s._id) || []
          }
          setShowDeleteModal={setShowDeleteModal}
          onDeleteConfirm={confirmDeleteBatch}
        />
      )}

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
};

export default BatchList;
