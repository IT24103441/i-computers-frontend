import { StrictMode,link } from 'react'
import { Link, Route, Routes } from 'react-router-dom';
export default function AdminPage() {
    return (
        <div className="w-full h-full flex"> 
        <div className="w-[300px] h-full bg-amber-100">
           <Link to='/admin' className='block p-4 border-b border-gray-300'>Orders</Link>
           <Link to='/admin/products' className='block p-4 border-b border-gray-300'>Products</Link>
           <Link to='/admin/users' className='block p-4 border-b border-gray-300'>Users</Link>
        </div>
            <div className="w-[calc(100%-300px)] h-full bg-red-500">
                  <Routes>
                    <Route path='/' element={<h1>order page</h1>} />
                    <Route path='/products' element={<h1>Products page</h1>} />
                    <Route path='/users' element={<h1>Users page</h1>} />
                  </Routes>
            </div>
        </div>
    );
}