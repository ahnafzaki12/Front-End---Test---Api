import { createBrowserRouter, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import ProtectedRoute from './components/ProtectedRoute'
import { useAuthContext } from './context/AuthContext'
import CrudPage from './pages/CrudPage'
import Profile from './pages/Profile'

function LoginWrapper() {
  const { isAuthenticated } = useAuthContext()
  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }
  return <Login />
}

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginWrapper />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
  },
  {
    path: '/crud',
    element: (
      <ProtectedRoute>
        <CrudPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/profile',
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
  },
])
