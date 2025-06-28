import React from "react";

const LogoutModal = ({ isOpen, onClose, onLogout, type }) => {
    if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-[300px] text-center">
        {type === "admin" ? (
          <p>
            Great job today Admin! Time to log out and take a well-deserved
            break. See you back here soon!
          </p>
        ) : (
            <p className="mb-4 text-gray-800">
              Great job on your reading session! Time to log out and take a
              well-deserved break. See you back here soon!
            </p>
        )}

        <div className="flex justify-between mt-4">
          <button
            className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
            onClick={onLogout}
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
