"use client";
import React, { useState, useEffect, useMemo } from "react";
import { 
  useCreateCategoryMutation, 
  useGetAllCategoriesQuery, 
  useGetUpdateCategoryMutation, 
  useDeleteCategoryMutation 
} from "../../services/categoryApi";
import { 
  Folder, FolderOpen, ImageIcon, Plus, Search, 
  Trash2, Edit3, ChevronLeft, ChevronRight as ChevronRightIcon, X 
} from "lucide-react";

const CategoryManagement = () => {
  const [formData, setFormData] = useState({ name: "", slug: "", parentCategory: "", isActive: true });
  const [selectedFile, setSelectedFile] = useState(null);
  const [editId, setEditId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data: categoriesData, isLoading: isFetching } = useGetAllCategoriesQuery();
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useGetUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  // --- Slug Auto-gen ---
  useEffect(() => {
    if (!editId) { // Only auto-gen slug for new categories
        const generatedSlug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
        setFormData((prev) => ({ ...prev, slug: generatedSlug }));
    }
  }, [formData.name, editId]);

  // --- Tree Logic ---
  const categoryTree = useMemo(() => {
    if (!categoriesData?.data) return [];
    const buildTree = (items, parentId = null) => {
      return items
        .filter((item) => (item.parentCategory?._id || item.parentCategory) === (parentId || null))
        .map((item) => ({ ...item, children: buildTree(items, item._id) }));
    };
    return buildTree(categoriesData.data, null);
  }, [categoriesData]);

  const paginatedTree = categoryTree.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // --- Handlers ---
  const handleEditClick = (cat) => {
    setEditId(cat._id);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      parentCategory: cat.parentCategory?._id || "",
      isActive: cat.isActive
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm("Are you sure? This will also delete the image from S3.")) {
      try {
        await deleteCategory(id).unwrap();
      } catch (err) {
        alert(err?.data?.message || "Delete failed");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (selectedFile) data.append("image", selectedFile);

    try {
      if (editId) {
        await updateCategory({ id: editId, data }).unwrap();
      } else {
        await createCategory(data).unwrap();
      }
      setEditId(null);
      setFormData({ name: "", slug: "", parentCategory: "", isActive: true });
      setSelectedFile(null);
    } catch (err) {
      alert(err?.data?.message || "Operation failed");
    }
  };

  // --- Table Row ---
  const CategoryRow = ({ category, depth = 0 }) => {
    const [isOpen, setIsOpen] = useState(true);
    const hasChildren = category.children?.length > 0;

    return (
      <>
        <tr className="hover:bg-slate-50 transition-colors border-b border-slate-100">
          <td className="px-6 py-4">
            <div className="flex items-center" style={{ marginLeft: `${depth * 20}px` }}>
              <button onClick={() => setIsOpen(!isOpen)} className={`mr-2 ${hasChildren ? 'visible' : 'invisible'}`}>
                {isOpen ? <FolderOpen size={16} className="text-blue-500" /> : <Folder size={16} className="text-slate-400" />}
              </button>
              <div className="flex items-center gap-3">
                {category.image?.url ? (
                  <img src={category.image.url} className="w-8 h-8 rounded object-cover shadow-sm" />
                ) : (
                  <div className="w-8 h-8 bg-slate-100 rounded flex items-center justify-center"><ImageIcon size={14} className="text-slate-400" /></div>
                )}
                <div>
                  <p className="text-sm font-semibold text-slate-800">{category.name}</p>
                  <p className="text-[10px] font-mono text-slate-400">{category.slug}</p>
                </div>
              </div>
            </div>
          </td>
          <td className="px-6 py-4 text-xs font-medium text-slate-500">Level {category.level}</td>
          <td className="px-6 py-4">
            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${category.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
              {category.isActive ? "Active" : "Hidden"}
            </span>
          </td>
          <td className="px-6 py-4 text-right">
            <div className="flex justify-end gap-2">
              <button onClick={() => handleEditClick(category)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Edit3 size={16}/></button>
              <button onClick={() => handleDeleteClick(category._id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16}/></button>
            </div>
          </td>
        </tr>
        {isOpen && hasChildren && category.children.map(child => (
          <CategoryRow key={child._id} category={child} depth={depth + 1} />
        ))}
      </>
    );
  };

  return (
    <div className="p-6 max-w-[1400px] mx-auto min-h-screen bg-slate-50">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Category Management</h1>
          <p className="text-slate-500 text-sm">Organize your store hierarchy</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* FORM */}
        <div className="lg:col-span-4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 sticky top-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-slate-800">{editId ? "Edit Category" : "New Category"}</h2>
                {editId && <button onClick={() => setEditId(null)} className="text-slate-400 hover:text-slate-600"><X size={18}/></button>}
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text" required placeholder="Name"
                className="w-full border border-slate-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              
              <select
                className="w-full border border-slate-200 rounded-xl p-3 text-sm bg-white"
                value={formData.parentCategory}
                onChange={(e) => setFormData({ ...formData, parentCategory: e.target.value })}
              >
                <option value="">Top Level Category</option>
                {categoriesData?.data?.filter(c => c._id !== editId).map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>

              <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center">
                <input type="file" className="hidden" id="file" onChange={(e) => setSelectedFile(e.target.files[0])} />
                <label htmlFor="file" className="cursor-pointer text-xs text-slate-500">
                  <ImageIcon className="mx-auto mb-2 text-slate-400" size={24}/>
                  {selectedFile ? selectedFile.name : "Upload Thumbnail"}
                </label>
              </div>

              <button
                type="submit" disabled={isCreating || isUpdating}
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50"
              >
                {isCreating || isUpdating ? "Saving..." : editId ? "Update Category" : "Create Category"}
              </button>
            </form>
          </div>
        </div>

        {/* LIST */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
             <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-widest font-bold">
                    <tr>
                        <th className="px-6 py-4">Name</th>
                        <th className="px-6 py-4">Depth</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4"></th>
                    </tr>
                </thead>
                <tbody>
                    {isFetching ? (
                        <tr><td colSpan="4" className="text-center py-10 animate-pulse text-slate-400">Loading...</td></tr>
                    ) : (
                        paginatedTree.map(cat => <CategoryRow key={cat._id} category={cat} />)
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