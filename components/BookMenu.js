import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCodeBranch,
  faPenToSquare,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

const BookMenu = ({
  onHandleDelete,
  onHandleEdit,
  onHandleSetDeleteModalOpen,
}) => {
  return (
    <div className="flex flex-col space-y-[6px]  items-start my-6 w-36 h-20 rounded-md shadow-lg bg-white">
      <div className="flex pl-1 py-[1.5px] pr-8 justify-center items-center space-x-[3px] ml-[5px] mt-2 hover:bg-slate-200 rounded-md cursor-pointer">
        {/* <img src="/images/merge.png" alt="Merge Books" className="h-3 w-3" />{" "} */}
        {/* <FontAwesomeIcon
          icon={faCodeBranch}
          // size="sm"
          className="h-3 w-3"
        /> */}
        {/* <p className="text-sm">Merge Books</p> */}
      </div>
      <div
        className="flex pl-1 py-[1.5px] pr-2 justify-center items-center space-x-[3px] ml-[5px] mt-2 hover:bg-slate-200 rounded-md cursor-pointer"
        onClick={onHandleEdit}
      >
        <FontAwesomeIcon icon={faPenToSquare} className="h-3 w-3" />
        <p className="text-sm">Edit Book Details</p>
      </div>
      <div
        className="flex justify-center items-center py-[1.5px] pl-1 space-x-[3px] ml-[5px] mt-2 pr-[43px] hover:bg-slate-200 rounded-md cursor-pointer"
        onClick={onHandleDelete}
      >
        <FontAwesomeIcon icon={faTrash} className="h-3 w-2" />
        <p
          className="text-sm"
          onClick={() => {
            // onHandleSetMenuModalClose();
            onHandleSetDeleteModalOpen();
          }}
        >
          Delete Book
        </p>
      </div>
    </div>
  );
};

export default BookMenu