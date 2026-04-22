export default function ProductCard(){
    return (
        <div className="border w-56 h-80 p-4 rounded-lg shadow-md">
            <img src="https://via.placeholder.com/150" alt="Product Image" className="w-40 h-40"/>
            <h3>Product Name</h3>
            <p>RS. 250000</p>
            <button className="border bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">Add to Cart</button>
        </div>
    );

}