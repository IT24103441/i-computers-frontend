import { Route, Routes } from 'react-router-dom'
import './App.css'
import HomePage from './pages/homePage'
import LoginPage from './pages/loginPage'
import RegisterPage from './pages/registerPage'
import AdminPage from './pages/adminPage'
import { Toaster } from 'react-hot-toast'

function App() {
  return (
    <div className="w-full h-screen bg-amber-600">
      <Toaster />
      <Routes>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/admin/*' element={<AdminPage />} />
        <Route path='/*' element={<HomePage />} />
      </Routes>
    </div>
  )
}

export default App
