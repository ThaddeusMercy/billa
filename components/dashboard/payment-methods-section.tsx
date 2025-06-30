"use client"

import { Button } from "@/components/ui/button"

export default function PaymentMethodsSection({ paymentMethods, onAddMethod, onRemoveMethod }: { paymentMethods: any[]; onAddMethod: () => void; onRemoveMethod: (index: number) => void }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">Manage your payment methods</p>
        <Button onClick={onAddMethod} className="bg-black hover:bg-gray-800 text-white rounded-xl">
          + Add Payment Method
        </Button>
      </div>

      <div className="space-y-3">
        {paymentMethods.map((method, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 p-4 rounded-xl flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className={`h-10 w-10 rounded-full ${method.color} flex items-center justify-center`}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"></path>
                  <path d="M20 12v4H6a2 2 0 0 0-2 2c0 1.1.9 2 2 2h12v-4"></path>
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-black">{method.label}</h4>
                <p className="text-xs text-gray-600 truncate max-w-[200px]">{method.value}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-400 hover:text-black rounded-lg hover:bg-gray-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 20h9"></path>
                  <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                </svg>
              </button>
              <button
                onClick={() => onRemoveMethod(index)}
                className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-100"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 6h18"></path>
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

