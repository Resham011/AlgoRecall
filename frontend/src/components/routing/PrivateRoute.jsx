// import React from 'react';
// import { Navigate, useLocation } from 'react-router-dom';
// import { useSelector } from 'react-redux';

// const PrivateRoute = ({ children }) => {
//   const { userInfo } = useSelector((state) => state.auth);
//   const location = useLocation();

//   if (!userInfo) {
//     // Redirect them to the /login page, but save the current location they were
//     // trying to go to. This allows us to send them along to that page after they login.
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   return children;
// };

// export default PrivateRoute;

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ children }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const location = useLocation();
  if (!userInfo) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
};
export default PrivateRoute;