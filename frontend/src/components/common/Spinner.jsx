import React from 'react';

const Spinner = () => {
  return (
    <div className="fixed inset-0 bg-white/60 dark:bg-gray-900/60 z-50 flex justify-center items-center sm:relative sm:inset-auto sm:bg-transparent sm:dark:bg-transparent sm:z-auto sm:w-full sm:py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  );
};
export default Spinner;

