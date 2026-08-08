import { Route, Routes } from 'react-router-dom'
import './App.css'
import HomePage from './pages/homePage'
import LoginPage from './pages/loginPage'
import RegisterPage from './pages/registerPage'
import AdminPage from './pages/adminPage'
import { Toaster } from 'react-hot-toast'
import { GoogleOAuthProvider } from "@react-oauth/google";
import ForgetPasswordPage from './pages/forgetPassword'

function App() {
  return (
    <GoogleOAuthProvider clientId="158666051135-t96tksit8oft5ggovv1po4euujh6jpg4.apps.googleusercontent.com">
      <div className="w-full h-screen bg-amber-600">
        <Toaster position='top-right' />
        <Routes>
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/admin/*' element={<AdminPage />} />
          <Route path='/*' element={<HomePage />} />
          <Route path='/forget-password' element={<ForgetPasswordPage />} />
        </Routes>
      </div>
    </GoogleOAuthProvider>
  )
}

export default App
