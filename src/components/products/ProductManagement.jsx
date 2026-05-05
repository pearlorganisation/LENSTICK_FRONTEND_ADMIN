"use client";

import React, { useState } from "react";
import {
  useGetProductsQuery,
  useDeleteProductMutation,
} from "../../services/productApi";
import { ProductForm } from "./ProductForm";
import {
  Plus,
  Edit,
  Trash2,
  Package,
  ChevronLeft,
  RefreshCcw,
  Eye, // Added Eye icon
  X, // Added X icon for modal close
} from "lucide-react";
import { toast } from "react-hot-toast";

const ProductManagement = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null); // State for View Modal

  const {
    data: apiResponse,
    isLoading,
    isError,
    refetch,
  } = useGetProductsQuery();

  const [deleteProduct] = useDeleteProductMutation();

  const products = apiResponse?.data?.products || [];

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
                    <td colSpan="5" className="p-20 text-center text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : (
                  products.map((product) => {
                    const prices = product.variants?.map((v) => v.price) || [0];
                    const totalStock =
                      product.variants?.reduce(
                        (acc, curr) => acc + curr.stock,
                        0
                      ) || 0;
                    const minPrice = Math.min(...prices);
                    const maxPrice = Math.max(...prices);

                    return (
                      <tr
                        key={product._id}
                        className="hover:bg-blue-50/40 transition-colors group"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-4">
                            <div>
                              <div className="font-bold text-gray-800">
                                {product?.name}
                              </div>
                              <div className="text-[11px] text-gray-500 uppercase">
                                {product?.brand}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 uppercase text-xs font-semibold">
                          {product?.category || "N/A"}
                        </td>
                        <td className="p-4 text-center text-sm font-bold text-gray-600">
                          {totalStock}
                        </td>
                        <td className="p-4 font-bold text-gray-700">
                          ₹{minPrice} - ₹{maxPrice}
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex justify-center gap-2">
                            {/* VIEW BUTTON */}
                            <button
                              onClick={() => setSelectedProduct(product)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg border border-transparent hover:border-green-200"
                              title="View Details"
                            >
                              <Eye size={18} />
                            </button>
                            <button
                              onClick={() => handleEdit(product)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg border border-transparent hover:border-blue-200"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(product._id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-200"
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

      {/* PRODUCT DETAIL MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b flex justify-between items-center bg-[#072369] text-white">
              <div>
                <h2 className="text-xl font-bold">{selectedProduct.name}</h2>
                <p className="text-blue-100 text-sm">
                  Product Full Information
                </p>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto">
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                    Brand
                  </label>
                  <p className="font-semibold text-gray-800">
                    {selectedProduct.brand}
                  </p>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                    Frame Shape
                  </label>
                  <p className="font-semibold text-gray-800">
                    {selectedProduct.frameShape || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                    Frame Type
                  </label>
                  <p className="font-semibold text-gray-800">
                    {selectedProduct.frameType || "Standard"}
                  </p>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                    Frame Type
                  </label>
                  <p className="font-semibold text-gray-800">
                    {selectedProduct?.subCategory || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                    Created At
                  </label>
                  <p className="font-semibold text-gray-800">
                    {new Date(selectedProduct.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Variants Section */}
              <h3 className="font-bold text-[#072369] mb-4 flex items-center gap-2">
                <Package size={18} /> Available Variants (
                {selectedProduct.variants?.length})
              </h3>

              <div className="space-y-3">
                {selectedProduct.variants?.map((variant) => (
                  <div
                    key={variant.sku}
                    className="p-4 border rounded-xl bg-gray-50 flex flex-col gap-4"
                  >
                    {/* TOP SECTION */}
                    <div className="flex flex-wrap justify-between items-center gap-4">
                      {/* Left */}
                      <div>
                        <div className="text-xs font-bold text-blue-600">
                          {variant.sku}
                        </div>
                        <div className="text-lg font-bold text-gray-800">
                          {variant.frameColor}
                        </div>

                        {/* Flags */}
                        <div className="flex gap-2 mt-1 text-xs">
                          {variant.isActive ? (
                            <span className="text-green-600 font-bold">
                              Active
                            </span>
                          ) : (
                            <span className="text-red-500 font-bold">
                              Inactive
                            </span>
                          )}

                          {variant.isTryOnAvailable && (
                            <span className="text-purple-600 font-bold">
                              Try On
                            </span>
                          )}

                          {variant.isBuyOneGetOne && (
                            <span className="text-orange-500 font-bold">
                              BOGO
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Images */}
                      <div className="flex gap-2">
                        {variant.images?.map((img) => (
                          <img
                            key={img._id}
                            src={img.url}
                            alt="variant"
                            className="w-16 h-16 object-cover rounded-lg border"
                          />
                        ))}
                      </div>
                    </div>

                    {/* DETAILS GRID */}
                    <div className="flex gap-6 flex-wrap">
                      {/* Size */}
                      <div className="text-center">
                        <div className="text-[10px] text-gray-400 uppercase font-bold">
                          Size
                        </div>
                        <div className="font-bold">{variant.size}</div>
                      </div>

                      {/* Stock */}
                      <div className="text-center">
                        <div className="text-[10px] text-gray-400 uppercase font-bold">
                          Stock
                        </div>
                        <div
                          className={`font-bold ${
                            variant.stock < 5
                              ? "text-red-500"
                              : "text-green-600"
                          }`}
                        >
                          {variant.stock}
                        </div>
                      </div>

                      {/* Sold */}
                      <div className="text-center">
                        <div className="text-[10px] text-gray-400 uppercase font-bold">
                          Sold
                        </div>
                        <div className="font-bold text-gray-800">
                          {variant.sold}
                        </div>
                      </div>

                      {/* Price */}
                      <div className="text-center">
                        <div className="text-[10px] text-gray-400 uppercase font-bold">
                          Price
                        </div>
                        <div className="font-bold">₹{variant.price}</div>
                      </div>

                      {/* Sale Price */}
                      <div className="text-center">
                        <div className="text-[10px] text-gray-400 uppercase font-bold">
                          Sale Price
                        </div>
                        <div className="font-bold text-blue-600">
                          ₹{variant.salePrice}
                        </div>
                      </div>

                      {/* Discount */}
                      <div className="text-center">
                        <div className="text-[10px] text-gray-400 uppercase font-bold">
                          Discount
                        </div>
                        <div className="font-bold">
                          {variant.discountPercentage}%
                        </div>
                      </div>

                      {/* Final Price */}
                      <div className="text-center">
                        <div className="text-[10px] text-gray-400 uppercase font-bold">
                          Final Price
                        </div>
                        <div className="font-bold text-green-700">
                          ₹
                          {Math.round(
                            variant.price -
                              (variant.price * variant.discountPercentage) / 100
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t bg-gray-50 text-right">
              <button
                onClick={() => setSelectedProduct(null)}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
