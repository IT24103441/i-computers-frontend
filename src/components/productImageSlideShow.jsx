import { useState } from "react";

export default function ProductImageSlideShow({ images = [] }) {
    const [selectedIndex, setSelectedIndex] = useState(0);

    if (!images || images.length === 0) {
        return (
            <div className="w-full h-80 bg-gray-100 rounded-xl flex items-center justify-center border border-gray-200">
                <span className="text-gray-400 font-medium">No Images Available</span>
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col items-center gap-4">
            {/* Main Image */}
            <div className="w-full h-96 bg-gray-100 rounded-2xl overflow-hidden border border-gray-200 shadow-sm flex items-center justify-center">
                <img
                    src={images[selectedIndex]}
                    alt={`Product view ${selectedIndex + 1}`}
                    className="w-full h-full object-cover transition-all duration-300"
                />
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto p-2 max-w-full">
                    {images.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => setSelectedIndex(idx)}
                            className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 cursor-pointer ${
                                selectedIndex === idx
                                    ? "border-amber-600 shadow-md scale-105"
                                    : "border-gray-200 opacity-70 hover:opacity-100"
                            }`}
                        >
                            <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
