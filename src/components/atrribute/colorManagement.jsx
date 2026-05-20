import React, { useState } from "react";
import {
  useGetColorsQuery,
  useCreateColorMutation,
  useUpdateColorMutation,
  useDeleteColorMutation,
} from "../../services/attribute";

const ColorManager = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [formData, setFormData] = useState({ name: "" });

  const { data: response, isLoading, isError } = useGetColorsQuery();
  const [createColor, { isLoading: isCreating }] = useCreateColorMutation();
  const [updateColor, { isLoading: isUpdating }] = useUpdateColorMutation();
  const [deleteColor] = useDeleteColorMutation();

  // Access the data array from your successResponse structure
  const colors = response?.data || [];

  const handleOpenModal = (color = null) => {
    if (color) {
      setEditData(color);
      setFormData({ name: color.name });
    } else {
      setEditData(null);
      setFormData({ name: "" });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editData) {
        console.log("edit data ", editData);
        await updateColor({
          id: editData._id,
          data: formData,
        }).unwrap();
      } else {
        // Matches ColorController.createColor
        await createColor(formData).unwrap();
      }
      setIsModalOpen(false);
      setFormData({ name: "" });
    } catch (err) {
      alert(err?.data?.message || "Operation failed. Check if name is unique.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this color?")) {
      try {
        await deleteColor(id).unwrap();
      } catch (err) {
        alert("Failed to delete color");
      }
    }
  };

  if (isLoading) return <div className="p-10 text-center">Loading...</div>;
  if (isError)
    return (
      <div className="p-10 text-center text-red-500">Error loading colors.</div>
    );

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 m-6 overflow-hidden">
      <div className="p-6 border-b flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Product Colors</h2>
          <p className="text-sm text-gray-500">
            Add or remove available product colors
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          + Add Color
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
            <tr>
              <th className="px-6 py-4">Color Name</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {colors.map((color) => (
              <tr key={color._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-semibold text-indigo-600 uppercase">
                  {color.name}
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs">
                    {color.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-3">
                  <button
                    onClick={() => handleOpenModal(color)}
                    className="text-gray-600 hover:text-indigo-600 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(color._id)}
                    className="text-red-400 hover:text-red-600 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {colors.length === 0 && (
              <tr>
                <td colSpan="3" className="text-center py-10 text-gray-400">
                  No colors found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="text-lg font-bold mb-4">
              {editData ? "Edit Color" : "New Color"}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Color Name
                </label>
                <input
                  type="text"
                  required
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="e.g. RED, ROYAL BLUE"
                  value={formData.name}
                  onChange={(e) => setFormData({ name: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50"
                >
                  {isCreating || isUpdating ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorManager;
