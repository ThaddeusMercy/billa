import React from 'react';

const AddPaymentMethod = () => {
  return (
    <div className="w-5/12 bg-white p-8 rounded-xl shadow-md space-y-8">
      <div className="mb-4">
        <h1 className="text-xl font-bold">Enter URL or Browse Apps</h1>
        <div className="flex items-center mt-2">
          <input
            type="text"
            placeholder="URL or App"
            className="flex-1 p-2 border rounded-l-lg"
          />
          <button className="bg-gray-300 text-gray-500 px-4 py-2 rounded-r-lg ml-3" disabled>
            Add
          </button>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="font-semibold mb-2">Based on your location</h2>
        <div className="flex space-x-4 overflow-x-auto">
          {["Opay", "GTB", "Chowdeck", "Moniepoint", "Solana", "Kuda"].map((app) => (
            <div key={app} className="flex flex-col items-center">
              <div className="bg-gray-100 p-4 rounded-lg shadow">
                <img
                  src={`/${app.toLowerCase()}logo.png`}
                  alt={`${app} logo`}
                  className="h-12 w-12"
                />
              </div>
              {/* <span className="mt-2">{app}</span> */}
            </div>
          ))}
        </div>
      </div>

      <div className="text-left">
        <a href="#" className="text-blue-500">Suggest a payment method →</a>
      </div>
    </div>
  );
};

export default AddPaymentMethod; 