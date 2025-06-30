'use client';

export default function Sidebar() {
  return (
    <div className="w-64 bg-white shadow-md h-screen">
      <div className="p-4">
        <h1 className="text-xl font-bold mb-6">Billa</h1>
        <nav className="space-y-2">
          <a href="/dashboard" className="block p-2 rounded hover:bg-gray-100">
            Dashboard
          </a>
          <a href="/profile" className="block p-2 rounded hover:bg-gray-100">
            Profile
          </a>
          <a href="/add-payment" className="block p-2 rounded hover:bg-gray-100">
            Add Payment
          </a>
          <a href="/account" className="block p-2 rounded hover:bg-gray-100">
            Account
          </a>
        </nav>
      </div>
    </div>
  );
}