"use client";
import React, { useState, useEffect } from "react";
import { useGetAllCategoriesQuery } from "../../services/categoryApi";
 // Adjust path as needed

const CategoryManagement = () => {
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    parentCategory: "",
    image: "",
    isActive: true,
  });

  // RTK Query Hooks
  const { data: categoriesData, isLoading: isFetching, error: fetchError } = useGetAllCategoriesQuery();
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();

  // Handle Slug generation automatically from name
  useEffect(() => {
    const generatedSlug = formData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setFormData((prev) => ({ ...prev, slug: generatedSlug }));
  }, [formData.name]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Clean up parentCategory if empty string
      const payload = {
        ...formData,
        parentCategory: formData.parentCategory === "" ? null : formData.parentCategory,
      };

      await createCategory(payload).unwrap();
      alert("Category created successfully!");
      setFormData({ name: "", slug: "", parentCategory: "", image: "", isActive: true });
    } catch (err) {
      alert(err?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Category Management</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- CREATE CATEGORY FORM --- */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-fit">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Add New Category</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Category Name</label>
              <input
                type="text"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Electronics"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Slug (Auto-generated)</label>
              <input
                type="text"
                required
                className="mt-1 block w-full border border-gray-300 bg-gray-50 rounded-md p-2 outline-none"
                value={formData.slug}
                readOnly
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Parent Category</label>
              <select
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                value={formData.parentCategory}
                onChange={(e) => setFormData({ ...formData, parentCategory: e.target.value })}
              >
                <option value="">None (Top Level)</option>
                {categoriesData?.data?.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name} (Level {cat.level})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Image URL</label>
              <input
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="h-4 w-4 text-blue-600 rounded"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                Active
              </label>
            </div>

            <button
              type="submit"
              disabled={isCreating}
              className={`w-full py-2 px-4 rounded-md text-white font-semibold transition ${
                isCreating ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 shadow-md"
              }`}
            >
              {isCreating ? "Saving..." : "Create Category"}
            </button>
          </form>
        </div>

        {/* --- CATEGORY LIST TABLE --- */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-700">Existing Categories</h2>
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              Total: {categoriesData?.data?.length || 0}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider border-b">Image</th>
                  <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider border-b">Name</th>
                  <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider border-b">Parent</th>
                  <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider border-b">Level</th>
                  <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider border-b">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {isFetching ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-10 text-center text-gray-500">Loading categories...</td>
                  </tr>
                ) : categoriesData?.data?.map((category) => (
                  <tr key={category._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {category.image ? (
                        <img src={category.image} alt={category.name} className="w-10 h-10 rounded-md object-cover border" />
                      ) : (
                        <div className="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-400">N/A</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{category.name}</div>
                      <div className="text-xs text-gray-500">{category.slug}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">
                        {category.parentCategory?.name || <span className="text-gray-400 italic">None</span>}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {category.level}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        category.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}>
                        {category.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                  </tr>
                ))}
                {!isFetching && categoriesData?.data?.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-10 text-center text-gray-500">No categories found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryManagement;