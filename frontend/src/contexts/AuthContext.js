import { createContext, useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../config';

const baseURL = API_BASE_URL;

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem('authTokens')
      ? JSON.parse(localStorage.getItem('authTokens'))
      : null
  );
  const [user, setUser] = useState(() =>
    localStorage.getItem('authTokens')
      ? jwt_decode(localStorage.getItem('authTokens'))
      : null
  );
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState({});
  const [allProjects, setAllProjects] = useState([]);

  const navigate = useNavigate();

  const loginUser = async (username, password) => {
    const response = await fetch(baseURL + '/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });
    const data = await response.json();

    if (response.status === 200) {
      setAuthTokens(data);
      setUser(jwt_decode(data.access));
      localStorage.setItem('authTokens', JSON.stringify(data));
      navigate('/');
      toast.success('Login Successful!');
    } else {
      toast.error(data.detail);
    }
  };

  const registerUser = async (username, password, password2) => {
    const response = await fetch(baseURL + '/register/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
        password2,
      }),
    });
    const data = await response.json();

    if (response.status === 201) {
      navigate('/login');
      toast.success('Registration Successful');
    } else {
      toast.error(data[Object.keys(data)[0]]);
    }
  };

  const logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem('authTokens');
    localStorage.removeItem('current_project');
    navigate('/');
  };

  const fetchAllProjects = async () => {
    const response = await fetch(baseURL + '/projects/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authTokens.access}`,
      },
    });
    const data = await response.json();
    if (response.status === 200) {
      setAllProjects(data);
      handleSettingCurrentProject(data);
    } else {
      toast.error(data.detail);
    }
  };

  const handleSettingCurrentProject = (data) => {
    const current_project_in_local_storage = localStorage.getItem('current_project');
    if (current_project_in_local_storage === null) {
      if (data.length) {
        localStorage.setItem('current_project', JSON.stringify(data[0]));
        setProject(data[0]);
      }
      else {
        navigate('/createProject');
      }
    }
    else {
      if (data.length === 0) {
        toast.error('No projects found');
        if (user) {
          navigate('/createProject');
        }
        else {
          navigate('/login');
        }
      }
      else {
        data.forEach((project_) => {
          if (project_.project_nickname === current_project_in_local_storage.project_nickname) {
            setProject(project_);
          }
        });
      }
    }
  }


  const contextData = {
    user,
    setUser,
    authTokens,
    setAuthTokens,
    registerUser,
    loginUser,
    logoutUser,
    project,
    setProject,
    allProjects,
  };

  useEffect(() => {
    if (authTokens) {
      setUser(jwt_decode(authTokens.access));
    }
    setLoading(false);
    fetchAllProjects();
  }, [authTokens, loading]);

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
