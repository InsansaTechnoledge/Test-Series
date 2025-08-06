import { useState } from 'react';
import { deleteRoleGroup } from '../../utils/services/RoleGroupService';
import { useQueryClient } from '@tanstack/react-query';
import { useUser } from '../../contexts/currentUserContext';
import { useToast, ToastContainer } from "../../utils/Toaster"; // Fixed import

const DeleteRoleGroupModal = ({ setShowDeleteRoleGroupModal, role }) => {
    const [showConfirmation, setShowConfirmation] = useState(false);
    const queryClient = useQueryClient();
    const { user } = useUser();
    const { toasts, showToast, removeToast } = useToast(); // Get all needed functions

    const handleCancle = async () => {
        setShowDeleteRoleGroupModal(false);
        setShowConfirmation(false);
    }

    const handleDelete = async (withUsers) => {
        try {
            const response = await deleteRoleGroup(role._id, withUsers);
            if (response.status === 200) {
                showToast("Role deleted successfully!", "delete");
                await queryClient.invalidateQueries(['roleGroups', user._id]);
                await queryClient.invalidateQueries(['Users', user._id]);
                setShowConfirmation(false);
                setShowDeleteRoleGroupModal(false);
               
            }
        } catch (err) {
            console.error(err);
            showToast("Something went wrong while deleting the role!", "error");
        } finally {
            setShowDeleteRoleGroupModal(false);
            setShowConfirmation(false);
        }
    }

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-600/50">
                {!showConfirmation
                    ? (
                        <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6 text-center">
                            <h2 className="text-lg font-semibold mb-4 text-gray-800">Confirm Delete</h2>
                            <p className="text-gray-600 mb-6">Are you sure you want to Delete the role {role.name}?</p>
                            <div className="flex justify-center space-x-4">
                                <button
                                    onClick={() => setShowDeleteRoleGroupModal(false)}
                                    className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => setShowConfirmation(true)}
                                    className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    )
                    : (
                        <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6 text-center">
                            <h2 className="text-lg font-semibold mb-4 text-gray-800">Delete Role and Users?</h2>
                            <p className="text-gray-600 mb-6">
                                The role <strong>{role.name}</strong> has users assigned. What do you want to do?
                            </p>
                            <div className="flex flex-col space-y-3">
                                <button
                                    onClick={() => handleDelete(true)}
                                    className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded"
                                >
                                    Delete Role and Assigned Users to it
                                </button>
                                <button
                                    onClick={() => handleDelete(false)}
                                    className="px-4 py-2 bg-yellow-500 text-white hover:bg-yellow-600 rounded"
                                >
                                    Delete Role Only
                                </button>
                                <button
                                    onClick={handleCancle}
                                    className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
            </div>
    
            <ToastContainer toasts={toasts} onRemove={removeToast} />
        </>
    );
}

export default DeleteRoleGroupModal;