import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  let { user } = useContext(AuthContext);
  if (user) {
    if (localStorage.getItem('current_project')) {
      return children;
    }
    return <Navigate to="/createProject" />;
  }
  else {
    return <Navigate to="/login" />;
  }
};

export default ProtectedRoute;
