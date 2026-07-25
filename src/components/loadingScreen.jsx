export default function LoadingScreen() {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg">
                <h2 className="text-lg font-bold">Loading...</h2>
            </div>
        </div>
    );
}