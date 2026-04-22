
import { Route, Routes } from 'react-router-dom'
import './App.css'
import ProductCard from './components/productCard'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import AdminPage from './pages/adminPage'
function App() {


  return (
    <div className="w-full h-screen bg-amber-600">
      <Routes>
        <Route path='/' element={<HomePage/>} />
        <Route path='/login' element={<LoginPage/>} />
        <Route path='/register' element={<RegisterPage/>} />
        <Route path='/admin/*' element={<AdminPage/>} />
      </Routes>
    </div>
  )
}

export default App
