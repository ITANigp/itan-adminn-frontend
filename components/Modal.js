// components/Modal.js
import React from "react";

const Modal = ({ isOpen, onClose}) => {
  if (!isOpen) return null; // Don't render if modal is closed

  return (
    <div className=" lg:ml-64 fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className='w-96 bg-slate-200 rounded-md shadow-lg'>
        <div className='flex justify-between items-center h-8 bg-slate-300  rounded-t-md'>
            <p/>
            <p className='mr-3'>Your eBook has been submitted</p> 
        <img  
          src="/images/close-btn.png" 
          alt="close" 
          className='w-5 h-5 m-2 border-2 rounded-full border-slate-300  hover:border-red-100 cursor-pointer' 
          onClick={onClose}/></div>   
          <div className='flex flex-col items-center my-10'>
                          <img src="/images/review-modal.png" alt="review modal" className='h-64 w-auto' />
                      <p className='text-center mt-2'>Your eBook is under review</p>
                  </div>
    </div>
    </div>
  );
};

export default Modal;
