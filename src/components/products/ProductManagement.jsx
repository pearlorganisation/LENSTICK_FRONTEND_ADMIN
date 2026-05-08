"use client";

import React, { useState, useEffect } from "react";
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
  Eye,
  X,
  Search,
  Filter,
  ChevronRight,
  ArrowUpDown,
} from "lucide-react";
import { toast } from "react-hot-toast";

const ProductManagement = () => {
  // --- UI State ---
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showFilters, setShowFilters] = useState(true);

  // --- Query Params State (Matches your backend Service) ---
  const [params, setParams] = useState({
    page: 1,
    limit: 10,
    search: "",
    sort: "latest",
    brand: "",
    frameShape: "",
    size: "",
    minPrice: "",
    maxPrice: "",
  });

  // --- API Calls ---
  const {
    data: apiResponse,
    isLoading,
    isFetching,
    refetch,
  } = useGetProductsQuery(params); // Pass params to the query

  const [deleteProduct] = useDeleteProductMutation();

  // Data extraction from your backend structure
  const products = apiResponse?.data?.products || [];
  const filtersData = apiResponse?.data?.filters || {};
  const pagination = {
    currentPage: apiResponse?.data?.currentPage || 1,
    totalPages: apiResponse?.data?.totalPages || 1,
    totalProducts: apiResponse?.data?.totalProducts || 0,
  };

  // --- Handlers ---
  const handleParamChange = (key, value) => {
    setParams((prev) => ({ ...prev, [key]: value, page: 1 })); // Reset to page 1 on filter
  };

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
      {/* HEADER */}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 bg-white p-6 rounded-xl shadow-sm border-l-8 border-[#072369]">
        <div>
          <h1 className="text-2xl font-bold text-[#072369]">Product Catalog</h1>
          <p className="text-gray-500 text-sm">
            Manage {pagination.totalProducts} products in inventory
          </p>
        </div>

        <div className="flex gap-3 mt-4 md:mt-0">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2.5 rounded-lg border transition-all ${
              showFilters
                ? "bg-blue-50 border-blue-200 text-blue-600"
                : "bg-white text-gray-600"
            }`}
          >
            <Filter size={20} />
          </button>
          {!isFormOpen && (
            <button
              onClick={() => setIsFormOpen(true)}
              className="flex items-center gap-2 bg-[#072369] text-white px-5 py-2.5 rounded-lg hover:bg-opacity-90 transition-all font-semibold shadow-md"
            >
              <Plus size={20} /> Add Product
            </button>
          )}
        </div>
      </div>

      {isFormOpen ? (
        <div className="max-w-5xl mx-auto">
          <button
            onClick={closeForm}
            className="mb-4 flex items-center gap-2 text-gray-600 hover:text-black"
          >
            <ChevronLeft size={20} /> Back to List
          </button>
          <ProductForm onClose={closeForm} initialData={editingProduct} />
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* SIDEBAR FILTERS (Only visible if showFilters is true) */}
          {showFilters && (
            <div className="w-full lg:w-64 space-y-6">
              {/* Search */}
              <div className="bg-white p-4 rounded-xl shadow-sm border">
                <label className="text-[10px] font-bold uppercase text-gray-400 block mb-2 tracking-widest">
                  Search
                </label>
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={16}
                  />
                  <input
                    type="text"
                    placeholder="Search name..."
                    className="w-full pl-9 pr-3 py-2 bg-gray-50 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    value={params.search}
                    onChange={(e) =>
                      handleParamChange("search", e.target.value)
                    }
                  />
                </div>
              </div>

              {/* Brands Filter */}
              <div className="bg-white p-4 rounded-xl shadow-sm border">
                <label className="text-[10px] font-bold uppercase text-gray-400 block mb-2 tracking-widest">
                  Brand
                </label>
                <select
                  className="w-full p-2 bg-gray-50 border rounded-lg text-sm"
                  value={params.brand}
                  onChange={(e) => handleParamChange("brand", e.target.value)}
                >
                  <option value="">All Brands</option>
                  {filtersData.brands?.map((b) => (
                    <option key={b._id} value={b._id}>
                      {b._id} ({b.count})
                    </option>
                  ))}
                </select>
              </div>

              {/* Shape Filter */}
              <div className="bg-white p-4 rounded-xl shadow-sm border">
                <label className="text-[10px] font-bold uppercase text-gray-400 block mb-2 tracking-widest">
                  Frame Shape
                </label>
                <div className="space-y-1">
                  <button
                    onClick={() => handleParamChange("frameShape", "")}
                    className={`w-full text-left px-3 py-1.5 rounded-md text-sm ${
                      params.frameShape === ""
                        ? "bg-blue-600 text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    All Shapes
                  </button>
                  {filtersData.frameShapes?.map((s) => (
                    <button
                      key={s._id}
                      onClick={() => handleParamChange("frameShape", s._id)}
                      className={`w-full text-left px-3 py-1.5 rounded-md text-sm flex justify-between ${
                        params.frameShape === s._id
                          ? "bg-blue-600 text-white"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {s._id}{" "}
                      <span className="opacity-50 text-xs">{s.count}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Reset Button */}
              <button
                onClick={() =>
                  setParams({
                    page: 1,
                    limit: 10,
                    search: "",
                    sort: "latest",
                    brand: "",
                    frameShape: "",
                    size: "",
                  })
                }
                className="w-full py-2 text-xs font-bold text-red-500 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          )}

          {/* DATA TABLE SECTION */}
          <div className="flex-1 space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Table Controls */}
              <div className="p-4 border-b flex justify-between items-center bg-gray-50/50">
                <div className="text-sm text-gray-500 font-medium">
                  Showing{" "}
                  <span className="text-black font-bold">
                    {products.length}
                  </span>{" "}
                  products
                </div>
                <div className="flex items-center gap-2">
                  <ArrowUpDown size={16} className="text-gray-400" />
                  <select
                    className="text-sm bg-transparent font-bold outline-none cursor-pointer"
                    value={params.sort}
                    onChange={(e) => handleParamChange("sort", e.target.value)}
                  >
                    <option value="latest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="priceLowToHigh">Price: Low to High</option>
                    <option value="priceHighToLow">Price: High to Low</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-[#072369] text-white">
                    <tr>
                      <th className="p-4 text-[11px] uppercase tracking-widest">
                        Product
                      </th>
                      <th className="p-4 text-[11px] uppercase tracking-widest text-center">
                        Stock
                      </th>
                      <th className="p-4 text-[11px] uppercase tracking-widest">
                        Price Info
                      </th>
                      <th className="p-4 text-[11px] uppercase tracking-widest text-center">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {isFetching ? (
                      <tr>
                        <td
                          colSpan="5"
                          className="p-20 text-center animate-pulse text-blue-600 font-bold"
                        >
                          Fetching Data...
                        </td>
                      </tr>
                    ) : products.length === 0 ? (
                      <tr>
                        <td
                          colSpan="5"
                          className="p-20 text-center text-gray-400"
                        >
                          No products found matching your filters.
                        </td>
                      </tr>
                    ) : (
                      products.map((product) => {
                        const prices = product.variants?.map(
                          (v) => v.price
                        ) || [0];
                        const totalStock =
                          product.variants?.reduce(
                            (acc, curr) => acc + curr.stock,
                            0
                          ) || 0;
                        return (
                          <tr
                            key={product._id}
                            className="hover:bg-blue-50/30 transition-colors"
                          >
                            <td className="p-4">
                              <div className="font-bold text-gray-800">
                                {product?.name}
                              </div>
                              <div className="text-[10px] text-blue-600 font-bold uppercase">
                                {product?.brand} • {product?.frameShape}
                              </div>
                            </td>
                            <td className="p-4 text-center font-mono text-sm">
                              {totalStock}
                            </td>
                            <td className="p-4">
                              <div className="text-xs text-gray-400 font-bold uppercase">
                                Starting from
                              </div>
                              <div className="font-black text-[#072369]">
                                ₹{Math.min(...prices)}
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex justify-center gap-1">
                                <button
                                  onClick={() => setSelectedProduct(product)}
                                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                                >
                                  <Eye size={18} />
                                </button>
                                <button
                                  onClick={() => handleEdit(product)}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                >
                                  <Edit size={18} />
                                </button>
                                <button
                                  onClick={() => handleDelete(product._id)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
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

              {/* PAGINATION FOOTER */}
              <div className="p-4 border-t flex items-center justify-between bg-gray-50">
                <button
                  disabled={params.page === 1}
                  onClick={() => handleParamChange("page", params.page - 1)}
                  className="p-2 rounded-lg border bg-white disabled:opacity-50 hover:bg-gray-50 transition-colors"
                >
                  <ChevronLeft size={18} />
                </button>

                <div className="flex gap-2">
                  {[...Array(pagination.totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => handleParamChange("page", i + 1)}
                      className={`w-8 h-8 rounded-lg text-sm font-bold transition-all ${
                        params.page === i + 1
                          ? "bg-[#072369] text-white"
                          : "bg-white border hover:border-blue-300"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  disabled={params.page === pagination.totalPages}
                  onClick={() => handleParamChange("page", params.page + 1)}
                  className="p-2 rounded-lg border bg-white disabled:opacity-50 hover:bg-gray-50 transition-colors"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODAL (Keep your existing one, it works well) */}
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

                      {/* Try On */}
                      <div className="text-center">
                        <div className="text-[10px] text-gray-400 uppercase font-bold">
                          Try On Available
                        </div>
                        <div className="font-bold">
                          {variant.isTryOnAvailable ? "Yes" : "No"}
                        </div>
                      </div>

                      {/* BOGO */}
                      <div className="text-center">
                        <div className="text-[10px] text-gray-400 uppercase font-bold">
                          Buy One Get One
                        </div>
                        <div className="font-bold">
                          {variant.isBuyOneGetOne ? "Yes" : "No"}
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
