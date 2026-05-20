import React, { useState } from "react";
import ColorManager from "./colorManagement";

const AttributeDashboard = () => {
  const [attributes, setAttributes] = useState([
    { _id: "1", name: "Color", values: ["Red", "Blue", "Green"] },
    { _id: "2", name: "Size", values: ["S", "M", "L"] },
    { _id: "3", name: "Material", values: ["Cotton", "Wool", "Silk"] },
  ]);

  const [activeView, setActiveView] = useState("LIST");

  // 3. Render Color Management View
  if (activeView === "COLOR") {
    return (
      <div className="p-8">
        <button
          onClick={() => setActiveView("LIST")}
          className="mb-4 text-blue-600 hover:underline flex items-center gap-2 font-medium"
        >
          ← Back to Attributes
        </button>
        <ColorManager />
      </div>
    );
  }

  // 4. Render Main Attribute List View
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-800">
            Product Attributes
          </h1>

          {/* ADD ATTRIBUTE FORM */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {attributes.map((attr) => (
            <div
              key={attr._id}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition cursor-pointer group relative"
              onClick={() => {
                if (attr.name.toLowerCase() === "color") {
                  setActiveView("COLOR");
                } else {
                  alert(`Managing ${attr.name} is coming soon!`);
                }
              }}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="bg-indigo-100 text-indigo-700 p-3 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                    />
                  </svg>
                </div>
              </div>

              <h2 className="text-xl font-bold text-gray-800 mb-2">
                {attr.name}
              </h2>
              <p className="text-gray-500 text-sm mb-4">
                Click to manage the specific types and values for this
                attribute.
              </p>

              <div className="flex flex-wrap gap-2">
                {attr.values?.length > 0 ? (
                  <>
                    {attr.values.slice(0, 3).map((val) => (
                      <span
                        key={val}
                        className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-600 font-medium"
                      >
                        {val}
                      </span>
                    ))}
                    {attr.values.length > 3 && (
                      <span className="text-xs text-gray-400 pt-1">
                        +{attr.values.length - 3} more
                      </span>
                    )}
                  </>
                ) : (
                  <span className="text-xs text-gray-400 italic font-light">
                    No values added yet
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {attributes.length === 0 && (
          <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed border-gray-200">
            <p className="text-gray-400">
              No attributes found. Add your first one above!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttributeDashboard;
