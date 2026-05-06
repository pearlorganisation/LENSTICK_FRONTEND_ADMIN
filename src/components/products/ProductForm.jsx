"use client";
import React, { useState, useEffect } from "react";
import {
  useCreateProductMutation,
  useUpdateProductMutation,
} from "../../services/productApi";
import { useGetAllCategoriesQuery } from "../../services/categoryApi";
import { X, PlusCircle, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";

export const ProductForm = ({ onClose, initialData }) => {
  const { data: catResponse } = useGetAllCategoriesQuery();
  const categories = catResponse?.data || [];
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  // ✅ DEFAULT SAFE STRUCTURE
  const defaultForm = {
    name: "",
    slug: "",
    description: "",
    category: "",
    brand: "",
    gender: [],
    productType: "",
    frameShape: "",
    frameMaterial: "",
    frameType: "",
    frameDimensions: {
      lensWidth: "",
      bridgeWidth: "",
      templeLength: "",
      lensHeight: "",
    },
    variants: [
      {
        sku: "",
        frameColor: "",
        size: "MEDIUM",
        price: 0,
        stock: 0,
        images: [],
      },
    ],
  };

  const [formData, setFormData] = useState(defaultForm);

  // ✅ NORMALIZE EDIT DATA
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...defaultForm,
        ...initialData,
        category: initialData.category?._id || initialData.category || "",
        gender: initialData.gender || [],
        variants: initialData.variants || defaultForm.variants,
        frameDimensions:
          initialData.frameDimensions || defaultForm.frameDimensions,
      });
    }
  }, [initialData]);

  // ✅ HANDLE INPUT

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    //  AUTO SLUG FROM NAME
    if (name === "name") {
      const slug = generateSlug(value);

      console.log("generated slug ", slug);

      setFormData((prev) => ({
        ...prev,
        name: value,
        slug, // auto update slug
      }));
      return;
    }

    // nested fields
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // ✅ GENDER
  const handleGenderChange = (val) => {
    const updatedGender = formData.gender?.includes(val)
      ? formData.gender.filter((g) => g !== val)
      : [...(formData.gender || []), val];

    setFormData((prev) => ({
      ...prev,
      gender: updatedGender,
    }));
  };

  // ✅ SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (initialData) {
        await updateProduct({
          id: initialData._id,
          data: formData,
        }).unwrap();
        toast.success("Product updated!");
      } else {
        await createProduct(formData).unwrap();
        toast.success("Product created!");
      }
      onClose();
    } catch (err) {
      toast.error(err?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-8 border-t-4 border-[#072369] max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-6 border-b pb-2">
        <h2 className="text-xl font-bold text-[#072369]">
          {initialData ? "Edit Product" : "Add New Product"}
        </h2>
        <button onClick={onClose}>
          <X />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* BASIC */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <input
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Product Name"
            className="border p-2 rounded"
            required
          />

          <input
            name="slug"
            value={formData.slug}
            onChange={handleInputChange}
            placeholder="Slug"
            className="border p-2 rounded"
            readOnly
          />
        </div>

        {/* CATEGORY */}
        <select
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          className="border p-2 rounded w-full"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* GENDER */}
        <div className="flex gap-4">
          {["Men", "Women", "Kids"].map((g) => (
            <label key={g}>
              <input
                type="checkbox"
                checked={formData.gender?.includes(g)}
                onChange={() => handleGenderChange(g)}
              />
              {g}
            </label>
          ))}
        </div>

        {/* DIMENSIONS */}
        <div className="grid grid-cols-4 gap-2">
          {["lensWidth", "bridgeWidth", "templeLength", "lensHeight"].map(
            (dim) => (
              <input
                key={dim}
                type="number"
                name={`frameDimensions.${dim}`}
                value={formData.frameDimensions?.[dim] || ""}
                onChange={handleInputChange}
                placeholder={dim}
                className="border p-1 rounded"
              />
            )
          )}
        </div>

        {/* VARIANTS */}
        <div>
          <div className="flex justify-between mb-2">
            <h3>Variants</h3>
            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  variants: [
                    ...(prev.variants || []),
                    {
                      sku: "",
                      frameColor: "",
                      size: "MEDIUM",
                      price: 0,
                      stock: 0,
                      images: [],
                    },
                  ],
                }))
              }
            >
              <PlusCircle />
            </button>
          </div>

          {(formData.variants || []).map((v, i) => (
            <div key={i} className="grid grid-cols-5 gap-2 mb-2">
              <input
                value={v.sku}
                placeholder="SKU"
                onChange={(e) => {
                  const newV = [...formData.variants];
                  newV[i].sku = e.target.value;
                  setFormData((prev) => ({ ...prev, variants: newV }));
                }}
              />

              <input
                value={v.frameColor}
                placeholder="Color"
                onChange={(e) => {
                  const newV = [...formData.variants];
                  newV[i].frameColor = e.target.value;
                  setFormData((prev) => ({ ...prev, variants: newV }));
                }}
              />

              <input
                type="number"
                value={v.price}
                placeholder="Price"
                onChange={(e) => {
                  const newV = [...formData.variants];
                  newV[i].price = Number(e.target.value);
                  setFormData((prev) => ({ ...prev, variants: newV }));
                }}
              />

              <input
                type="number"
                value={v.stock}
                placeholder="Stock"
                onChange={(e) => {
                  const newV = [...formData.variants];
                  newV[i].stock = Number(e.target.value);
                  setFormData((prev) => ({ ...prev, variants: newV }));
                }}
              />

              {formData.variants.length > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    const newV = formData.variants.filter(
                      (_, idx) => idx !== i
                    );
                    setFormData((prev) => ({
                      ...prev,
                      variants: newV,
                    }));
                  }}
                >
                  <Trash2 />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={isCreating || isUpdating}
          className="bg-[#072369] text-white px-4 py-2 rounded"
        >
          {isCreating || isUpdating
            ? "Processing..."
            : initialData
            ? "Update"
            : "Create"}
        </button>
      </form>
    </div>
  );
};
