"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useCreateCategoryMutation, useGetAllCategoriesQuery } from "../../services/categoryApi";
import { Folder, FolderOpen, ChevronRight, Image as ImageIcon, Plus } from "lucide-react"; // Optional: Install lucide-react

const CategoryManagement = () => {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    parentCategory: "",
    isActive: true,
  });
  const [selectedFile, setSelectedFile] = useState(null);

  const { data: categoriesData, isLoading: isFetching } = useGetAllCategoriesQuery();
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();

  // 1. Logic to transform Flat Data to Tree Structure
  const categoryTree = useMemo(() => {
    if (!categoriesData?.data) return [];

    const buildTree = (items, parentId = null) => {
      return items
        .filter((item) => {
            // Check if parent matches (handling both object and ID strings)
            const itemParentId = item.parentCategory?._id || item.parentCategory;
            return itemParentId === parentId;
        })
        .map((item) => ({
          ...item,
          children: buildTree(items, item._id),
        }));
    };

    return buildTree(categoriesData.data, null);
  }, [categoriesData]);

  // Handle Slug generation
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
      // Use FormData for File Uploads
      const data = new FormData();
      data.append("name", formData.name);
      data.append("slug", formData.slug);
      data.append("isActive", formData.isActive);
      if (formData.parentCategory) {
        data.append("parentCategory", formData.parentCategory);
      }
      if (selectedFile) {
        data.append("image", selectedFile);
      }

      await createCategory(data).unwrap();
      alert("Category created successfully!");
      setFormData({ name: "", slug: "", parentCategory: "", isActive: true });
      setSelectedFile(null);
    } catch (err) {
      alert(err?.data?.message || "Something went wrong");
    }
  };

  // 2. Recursive Component for the Category Tree Table
  const CategoryRow = ({ category, depth = 0 }) => {
    const [isOpen, setIsOpen] = useState(true);
    const hasChildren = category.children && category.children.length > 0;

    return (
      <>
        <tr className="hover:bg-gray-50 transition border-b group">
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex items-center" style={{ marginLeft: `${depth * 24}px` }}>
              {hasChildren ? (
                <button onClick={() => setIsOpen(!isOpen)} className="mr-2 text-gray-400 hover:text-blue-600">
                  {isOpen ? <FolderOpen size={18} /> : <Folder size={18} />}
                </button>
              ) : (
                <div className="mr-2 text-gray-300"><ChevronRight size={18} /></div>
              )}
              
              {category.image ? (
                <img src={category.image} alt="" className="w-8 h-8 rounded object-cover border mr-3" />
              ) : (
                <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center mr-3"><ImageIcon size={14} className="text-gray-400" /></div>
              )}
              
              <div>
                <div className="font-medium text-gray-900">{category.name}</div>
                <div className="text-[10px] text-gray-400 uppercase tracking-tighter">{category.slug}</div>
              </div>
            </div>
          </td>
          <td className="px-6 py-4 text-sm text-gray-500">
            Level {category.level}
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
              category.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}>
              {category.isActive ? "Active" : "Inactive"}
            </span>
          </td>
        </tr>
        {isOpen && hasChildren && (
          category.children.map(child => (
            <CategoryRow key={child._id} category={child} depth={depth + 1} />
          ))
        )}
      </>
    );
  };

  return (
    <div className="p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Product Categories</h1>
        <p className="text-gray-500">Organize your store hierarchy and sub-categories.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* FORM SECTION */}
        <div className="lg:col-span-4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 sticky top-8">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Plus size={20} className="text-blue-600"/> Add New Category
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Mens Fashion"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Parent Category</label>
                <select
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition"
                  value={formData.parentCategory}
                  onChange={(e) => setFormData({ ...formData, parentCategory: e.target.value })}
                >
                  <option value="">None (Top Level)</option>
                  {categoriesData?.data?.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {"— ".repeat(cat.level)} {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Category Image</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-400 transition cursor-pointer relative">
                  <div className="space-y-1 text-center">
                    <ImageIcon className="mx-auto h-10 w-10 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                        <span>Upload a file</span>
                        <input 
                            type="file" 
                            className="sr-only" 
                            accept="image/*"
                            onChange={(e) => setSelectedFile(e.target.files[0])} 
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 2MB</p>
                    {selectedFile && <p className="text-xs text-green-600 font-bold">{selectedFile.name}</p>}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 py-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Display on store</label>
              </div>

              <button
                type="submit"
                disabled={isCreating}
                className="w-full py-3 px-4 bg-gray-900 hover:bg-black text-white rounded-lg font-bold shadow-lg transition-all transform active:scale-[0.98] disabled:bg-gray-400"
              >
                {isCreating ? "Saving..." : "Create Category"}
              </button>
            </form>
          </div>
        </div>

        {/* TREE LIST SECTION */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Hierarchy & Name</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Depth</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody>
                {isFetching ? (
                  <tr><td colSpan="3" className="p-10 text-center text-gray-400">Loading hierarchy...</td></tr>
                ) : (
                  categoryTree.map((category) => (
                    <CategoryRow key={category._id} category={category} />
                  ))
                )}
                {!isFetching && categoryTree.length === 0 && (
                  <tr><td colSpan="3" className="p-10 text-center text-gray-400">No categories created yet.</td></tr>
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