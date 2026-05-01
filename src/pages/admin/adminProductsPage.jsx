import { Link } from "react-router-dom";

export default function AdminProductsPage() {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500" >
            Admin Products Page

            <Link to="/admin/products/add" className="flex items-center gap-2 p-4 rounded-xl transition-all duration-200 bg-amber-600 text-white shadow-lg shadow-amber-200 fixed bottom-4 right-4">Add Product</Link>
        </div>
    );
}