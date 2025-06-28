// components/Modal.js
import React from "react";

const Modal = ({
  onHandleDeleteBook,
  onHandleSetDeleteModalClose,
}) => {
  //   if (!isOpen) return null; // Don't render if modal is closed

  return (
    <div className=" lg:ml-64 fixed z-50 inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="w-96 lg:mt-12 bg-amber-200  rounded-md shadow-lg mx-2">
        <div className="flex justify-between items-center h-8 bg-amber-300  rounded-t-md">
          <p />
          <p className="mr-3">Delete eBook</p>
          <img
            src="/images/close-btn.png"
            alt="close"
            className="w-5 h-5 m-2 border-2 rounded-full border-amber-300  hover:border-red-200 cursor-pointer"
            onClick={onHandleSetDeleteModalClose}
          />
        </div>
        <div className="flex flex-col items-center mb-4 ">
          <img src="/images/delete-modal.png" alt="review modal" />
          <p className="text-center mt-2 w-72">
            Are you sure you want to permanently remove this book?
          </p>
          <div className="sm:mt-6  flex justify-between w-72">
            <button
              href="/author/sign_in"
              className="ml-2 h-8 border border-[#EF5353] text-[#EF5353] hover:bg-[#EF5353] hover:text-white rounded-md py-1 px-4"
              onClick={onHandleSetDeleteModalClose}
            >
              No
            </button>
            <button
              className="mr-2 h-8 bg-[#EF5353] text-white rounded-md py-1 px-4"
              onClick={() => {
                onHandleSetDeleteModalClose();
                onHandleDeleteBook();
              }}
            >
              Yes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
