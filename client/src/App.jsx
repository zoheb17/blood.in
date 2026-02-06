import React from 'react'
import { Route, Routes } from 'react-router'
import Home from './pages/Home'
import DonorRegister from './pages/DonorRegister'
import UserRegister from './pages/UserRegister'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import VerifyEmail from './pages/VerifyEmail.jsx'

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/register' element={<UserRegister />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path='/login' element={<Login />} />
      <Route
        path='/dashboard'
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path='/donor-register'
        element={
          <ProtectedRoute>
            <DonorRegister />
          </ProtectedRoute>
        }
      />

    </Routes>

  )
}

export default App
