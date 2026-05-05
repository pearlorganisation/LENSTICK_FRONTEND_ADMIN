"use client";

import React, { useState } from "react";
import {
  useGetProductsQuery,
  useDeleteProductMutation,
} from "../../services/productApi";
import { ProductForm } from "./ProductForm"; // Ensure path is correct
import {
  Plus,
  Edit,
  Trash2,
  Package,
  ChevronLeft,
  Search,
  RefreshCcw,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";

const ProductManagement = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  console.log(
    "use state  ",
    useSelector((state) => state)
  );

  // API Hooks
  const {
    data: apiResponse,
    isLoading,
    isError,
    refetch,
  } = useGetProductsQuery();

  const [deleteProduct] = useDeleteProductMutation();

  console.log("product res ", apiResponse);
  const products = apiResponse?.data?.products || [];

  console.log("products ", products);

  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id).unwrap();
        toast.success("Product deleted successfully");
      } catch (err) {
        toast.error("Failed to delete product");
      }
    }
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 bg-white p-6 rounded-xl shadow-sm border-l-8 border-[#072369]">
        <div>
          <h1 className="text-2xl font-bold text-[#072369]">
            Product Management
          </h1>
          <p className="text-gray-500 text-sm">
            {isFormOpen
              ? "Fill in the details below"
              : "View and manage your inventory"}
          </p>
        </div>

        <div className="flex gap-3 mt-4 md:mt-0">
          {!isFormOpen ? (
            <>
              <button
                onClick={() => refetch()}
                className="p-2.5 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all"
                title="Refresh Data"
              >
                <RefreshCcw
                  size={20}
                  className={isLoading ? "animate-spin" : ""}
                />
              </button>
              <button
                onClick={() => setIsFormOpen(true)}
                className="flex items-center gap-2 bg-[#072369] text-white px-5 py-2.5 rounded-lg hover:bg-opacity-90 transition-all font-semibold shadow-md"
              >
                <Plus size={20} /> Add Product
              </button>
            </>
          ) : (
            <button
              onClick={closeForm}
              className="flex items-center gap-2 text-gray-600 bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 transition-all"
            >
              <ChevronLeft size={20} /> Back to Catalog
            </button>
          )}
        </div>
      </div>

      {/* MAIN CONTENT */}
      {isFormOpen ? (
        <div className="max-w-5xl mx-auto">
          <ProductForm onClose={closeForm} initialData={editingProduct} />
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#072369] text-white">
                <tr>
                  <th className="p-4 font-semibold text-sm uppercase tracking-wider">
                    Product Detail
                  </th>
                  <th className="p-4 font-semibold text-sm uppercase tracking-wider">
                    Category
                  </th>
                  <th className="p-4 font-semibold text-sm uppercase tracking-wider text-center">
                    Stock
                  </th>
                  <th className="p-4 font-semibold text-sm uppercase tracking-wider">
                    Price Range
                  </th>
                  <th className="p-4 font-semibold text-sm uppercase tracking-wider text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr>
                    <td colSpan="5" className="p-20 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-8 h-8 border-4 border-[#072369] border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-gray-500 font-medium">
                          Loading Products...
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-20 text-center text-gray-400">
                      <Package size={48} className="mx-auto mb-2 opacity-20" />
                      <p>No products found in the database.</p>
                    </td>
                  </tr>
                ) : (
                  products.map((product) => {
                    // Logic to find min/max price from variants
                    const prices = product.variants?.map((v) => v.price) || [0];
                    const minPrice = Math.min(...prices);
                    const maxPrice = Math.max(...prices);

                    return (
                      <tr
                        key={product._id}
                        className="hover:bg-blue-50/40 transition-colors group"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border group-hover:border-[#072369]/30 transition-colors">
                              {product.category?.images?.url ? (
                                <img
                                  src={product.category?.images?.url}
                                  alt={product.name}
                                  className="object-cover w-full h-full"
                                />
                              ) : (
                                <Package className="text-gray-300" size={24} />
                              )}
                            </div>
                            <div>
                              <div className="font-bold text-gray-800">
                                {product.name}
                              </div>
                              <div className="text-[11px] text-gray-500 font-medium uppercase tracking-tighter">
                                {product.brand || "Generic"} •{" "}
                                {product.frameShape || "N/A"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="px-3 py-1 bg-[#072369]/10 text-[#072369] text-[10px] font-bold rounded-full uppercase">
                            {product.category?.name || "Uncategorized"}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <div
                            className={`inline-block px-3 py-1 rounded-md text-xs font-bold ${
                              product.totalStock <= 5
                                ? "bg-red-100 text-red-600"
                                : "bg-green-100 text-green-600"
                            }`}
                          >
                            {product.totalStock} units
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="font-bold text-gray-700">
                            ₹{minPrice.toLocaleString()} - ₹
                            {maxPrice.toLocaleString()}
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleEdit(product)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-200"
                              title="Edit Product"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(product._id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200"
                              title="Delete Product"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
