import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './utils/ProtectedRoute';
import Login from './views/Login';
import Register from './views/Register';
import Dashboard from './views/Dashboard';
import { Toaster } from 'react-hot-toast';
import NavBar from './components/Navbar/NavBar';
import CreateProject from './views/createProject';
import Pods from './views/Pods';
import PodDetail from './views/podDetail';
import Deployments from './views/Deployments';

function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
              element={
                <div>
                  <ProtectedRoute>
                    {' '}
                    <NavBar />
                    <Dashboard />{' '}
                  </ProtectedRoute>
                </div>
              }
            />
            <Route
              path="/createProject"
              element={
                <div>
                  < NavBar />
                  <CreateProject />
                </div>
              }
            ></Route>
            <Route
              path="/pods"
              element={
                <div>
                  <ProtectedRoute>
                    {' '}
                    <NavBar />
                    <Pods />{' '}
                  </ProtectedRoute>
                </div>
              }
            />
            <Route
              path="/pods/podDetails"
              element={
                <ProtectedRoute>
                  {' '}
                  <NavBar />
                  <PodDetail />{' '}
                </ProtectedRoute>
              }
            ></Route>
            <Route
              path="/deployments/"
              element={
                <ProtectedRoute>
                  {' '}
                  <NavBar />
                  <Deployments />{' '}
                </ProtectedRoute>
              }
            ></Route>
          </Routes>
          <Toaster />
        </AuthProvider>
      </Router>
    </div >
  );
}

export default App;
