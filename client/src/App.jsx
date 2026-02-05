import React from 'react'
import { Route, Routes } from 'react-router'
import Home from './pages/Home'
import DonorRegister from './pages/DonorRegister'
import UserRegister from './pages/UserRegister'
import Login from './pages/Login'
import VerifyOtp from './pages/Verify-otp'
import Dashboard from './pages/Dashboard'
const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/donor-register' element={<DonorRegister />} />
      <Route path='/register' element={<UserRegister />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path='/login' element={<Login />} />
      <Route path='/dashboard' element={<Dashboard />} />

    </Routes>

  )
}

export default App
