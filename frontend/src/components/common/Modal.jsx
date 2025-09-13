// import React from 'react';
// import Button from './Button';

// const Modal = ({ isOpen, onClose, onConfirm, title, children }) => {
//   if (!isOpen) return null;

//   return (
//     // Backdrop
//     <div 
//         onClick={onClose}
//         className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4"
//     >
//       {/* Modal Panel */}
//       <div
//         onClick={e => e.stopPropagation()} // Prevent closing when clicking inside the modal
//         className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md mx-4 transform transition-all"
//       >
//         <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">
//             {title}
//         </h3>
//         <div className="text-sm text-gray-600 dark:text-gray-300 mb-6">
//           {children}
//         </div>
//         <div className="flex justify-end space-x-4">
//           <Button variant="secondary" onClick={onClose}>
//             Cancel
//           </Button>
//           <Button variant="danger" onClick={onConfirm}>
//             Confirm
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Modal;


import React from 'react';
import Button from './Button.jsx';

const Modal = ({ isOpen, onClose, onConfirm, title, children }) => {
  if (!isOpen) return null;
  return (
    <div onClick={onClose} className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div onClick={e => e.stopPropagation()} className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
        <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">{title}</h3>
        <div className="text-sm text-gray-600 dark:text-gray-300 mb-6">{children}</div>
        <div className="flex justify-end space-x-4">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="danger" onClick={onConfirm}>Confirm</Button>
        </div>
      </div>
    </div>
  );
};
export default Modal;