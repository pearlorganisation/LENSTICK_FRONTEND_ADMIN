"use client";
import React, { useState, useEffect } from "react";
import {
  useCreateProductMutation,
  useUpdateProductMutation,
} from "../../services/productApi";
import { useGetAllCategoriesQuery } from "../../services/categoryApi";
import {
  X,
  PlusCircle,
  Trash2,
  Info,
  Layout,
  Settings,
  Layers,
} from "lucide-react";
import { toast } from "react-hot-toast";

export const ProductForm = ({ onClose, initialData }) => {
  const { data: catResponse } = useGetAllCategoriesQuery();
  const categories = catResponse?.data || [];
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const organizedCategories = [];
  const parents = categories.filter((cat) => !cat.parentCategory);
  const children = categories.filter((cat) => cat.parentCategory);
  // const organizedCategories = [];

  const parentCategories = categories.filter((cat) => cat.level === 0);

  parentCategories.forEach((parent) => {
    // Add the parent to the list
    organizedCategories.push({
      _id: parent._id,
      name: parent.name,
      level: 0,
      parentId: null,
    });

    // 2. Find all sub-categories that belong to this parent
    const subCategories = categories.filter((cat) => {
      // Check if parentCategory exists and its ID matches
      const pid = cat.parentCategory?._id || cat.parentCategory;
      return cat.level === 1 && pid === parent._id;
    });

    subCategories.forEach((sub) => {
      organizedCategories.push({
        _id: sub._id,
        name: sub.name,
        level: 1,
        parentId: parent._id, // We keep track of the parent ID
      });
    });
  });

  parents.forEach((parent) => {
    // Add parent
    organizedCategories.push({ ...parent, isChild: false });

    // Find and add its children immediately after
    const subCats = children.filter(
      (child) =>
        (child.parentCategory?._id || child.parentCategory) === parent._id
    );

    subCats.forEach((sub) => {
      organizedCategories.push({ ...sub, isChild: true });
    });
  });

  // Update the change handler to detect if a sub-category was picked
  const handleCategoryChange = (e) => {
    const selectedId = e.target.value;
    const selectedObj = categories.find((c) => c._id === selectedId);

    if (selectedObj?.parentCategory) {
      // If user selected a sub-category
      setFormData((prev) => ({
        ...prev,
        category: selectedObj.parentCategory._id || selectedObj.parentCategory,
        subCategory: selectedObj._id,
      }));
    } else {
      // If user selected a main category
      setFormData((prev) => ({
        ...prev,
        category: selectedId,
        subCategory: null,
      }));
    }
  };

  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const defaultForm = {
    name: "",
    slug: "",
    shortDescription: "",
    description: "",
    returnPolicy: "",
    category: "",
    subCategory: null,
    brand: "",
    productCollection: "",
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
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: false,
    isActive: true,
    variants: [
      {
        sku: "",
        frameColor: "",
        size: "MEDIUM",
        ageGroup: "Adult",
        price: 0,
        salePrice: 0,
        discountPercentage: 0,
        stock: 0,
        isTryOnAvailable: false,
        isBuyOneGetOne: false,
        images: [],
      },
    ],
  };

  const [formData, setFormData] = useState(defaultForm);

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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;

    if (name === "name") {
      setFormData((prev) => ({
        ...prev,
        name: value,
        slug: generateSlug(value),
      }));
      return;
    }

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: val },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: val }));
    }
  };

  const handleGenderChange = (val) => {
    const updatedGender = formData.gender?.includes(val)
      ? formData.gender.filter((g) => g !== val)
      : [...(formData.gender || []), val];
    setFormData((prev) => ({ ...prev, gender: updatedGender }));
  };

  const updateVariant = (index, field, value) => {
    const newVariants = [...formData.variants];
    newVariants[index][field] = value;
    setFormData((prev) => ({ ...prev, variants: newVariants }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (initialData) {
        await updateProduct({ id: initialData._id, data: formData }).unwrap();
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
    <div className="bg-white rounded-lg shadow-xl border-t-4 border-[#072369] max-h-[95vh] overflow-hidden flex flex-col w-full max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b">
        <h2 className="text-2xl font-bold text-[#072369]">
          {initialData ? "Edit Product" : "Add New Product"}
        </h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <X />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-10 overflow-y-auto">
        {/* SECTION 1: BASIC INFO */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-[#072369] border-b pb-1 mb-4">
            <Info size={20} />{" "}
            <h3 className="font-semibold uppercase text-sm tracking-wider">
              Basic Information
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Product Name"
              className="border p-3 rounded-lg w-full"
              required
            />
            <input
              name="slug"
              value={formData.slug}
              onChange={handleInputChange}
              placeholder="Slug"
              className="border p-3 rounded-lg w-full bg-gray-50"
              readOnly
            />
            <input
              name="brand"
              value={formData.brand}
              onChange={handleInputChange}
              placeholder="Brand Name"
              className="border p-3 rounded-lg w-full"
            />
            <input
              name="productCollection"
              value={formData.productCollection}
              onChange={handleInputChange}
              placeholder="Collection (e.g. Summer 2024)"
              className="border p-3 rounded-lg w-full"
            />
          </div>
          <textarea
            name="shortDescription"
            value={formData.shortDescription}
            onChange={handleInputChange}
            placeholder="Short Description (appears on list cards)"
            className="border p-3 rounded-lg w-full"
            rows="2"
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Full Product Description"
            className="border p-3 rounded-lg w-full"
            rows="4"
          />
          <textarea
            name="returnPolicy"
            value={formData.returnPolicy}
            onChange={handleInputChange}
            placeholder="Return Policy Specific to this product"
            className="border p-3 rounded-lg w-full"
            rows="2"
          />
        </div>

        {/* SECTION 2: CATEGORY & ATTRIBUTES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[#072369] border-b pb-1">
              <Layout size={20} />{" "}
              {/* <h3 className="font-semibold uppercase text-sm tracking-wider">
                Categorization
              </h3>
            </div>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="border p-3 rounded-lg w-full"
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select> */}
              <h3 className="font-semibold uppercase text-sm tracking-wider">
                Categorization
              </h3>
            </div>

            <select
              name="category"
              // Value logic: if subCategory exists, show that, otherwise show main category
              value={formData.subCategory || formData.category}
              onChange={handleCategoryChange}
              className="border p-3 rounded-lg w-full"
              required
            >
              <option value="">Select Category</option>
              {organizedCategories.map((cat) => (
                <option
                  key={cat._id}
                  value={cat._id}
                  className={cat.isChild ? "bg-gray-50" : "font-bold"}
                >
                  {cat.isChild ? `— ${cat.name}` : cat.name.toUpperCase()}
                </option>
              ))}
            </select>
            <div className="flex gap-6 py-2">
              {["Men", "Women", "Kids"].map((g) => (
                <label
                  key={g}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formData.gender?.includes(g)}
                    onChange={() => handleGenderChange(g)}
                    className="w-4 h-4"
                  />
                  {g}
                </label>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                name="frameShape"
                value={formData.frameShape}
                onChange={handleInputChange}
                placeholder="Frame Shape"
                className="border p-3 rounded-lg"
              />
              <input
                name="frameMaterial"
                value={formData.frameMaterial}
                onChange={handleInputChange}
                placeholder="Material"
                className="border p-3 rounded-lg"
              />
              <input
                name="frameType"
                value={formData.frameType}
                onChange={handleInputChange}
                placeholder="Frame Type"
                className="border p-3 rounded-lg"
              />
              <input
                name="productType"
                value={formData.productType}
                onChange={handleInputChange}
                placeholder="Product Type"
                className="border p-3 rounded-lg"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[#072369] border-b pb-1">
              <Settings size={20} />{" "}
              <h3 className="font-semibold uppercase text-sm tracking-wider">
                Dimensions & Flags
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {["lensWidth", "bridgeWidth", "templeLength", "lensHeight"].map(
                (dim) => (
                  <input
                    key={dim}
                    type="number"
                    name={`frameDimensions.${dim}`}
                    value={formData.frameDimensions?.[dim] || ""}
                    onChange={handleInputChange}
                    placeholder={dim.replace(/([A-Z])/g, " $1")}
                    className="border p-3 rounded-lg"
                  />
                )
              )}
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <label className="flex items-center gap-2 font-medium">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleInputChange}
                />{" "}
                Featured
              </label>
              <label className="flex items-center gap-2 font-medium">
                <input
                  type="checkbox"
                  name="isBestSeller"
                  checked={formData.isBestSeller}
                  onChange={handleInputChange}
                />{" "}
                Best Seller
              </label>
              <label className="flex items-center gap-2 font-medium">
                <input
                  type="checkbox"
                  name="isNewArrival"
                  checked={formData.isNewArrival}
                  onChange={handleInputChange}
                />{" "}
                New Arrival
              </label>
              <label className="flex items-center gap-2 font-medium">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                />{" "}
                Active
              </label>
            </div>
          </div>
        </div>

        {/* SECTION 3: VARIANTS */}
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b pb-1 text-[#072369]">
            <div className="flex items-center gap-2">
              <Layers size={20} />{" "}
              <h3 className="font-semibold uppercase text-sm tracking-wider">
                Product Variants (Colors/Sizes)
              </h3>
            </div>
            <button
              type="button"
              onClick={() =>
                setFormData((p) => ({
                  ...p,
                  variants: [...p.variants, defaultForm.variants[0]],
                }))
              }
              className="flex items-center gap-1 text-sm bg-blue-50 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors"
            >
              <PlusCircle size={16} /> Add Variant
            </button>
          </div>

          {formData.variants.map((v, i) => (
            <div
              key={i}
              className="relative p-6 border rounded-2xl bg-gray-50 grid grid-cols-1 md:grid-cols-6 gap-4"
            >
              <div className="md:col-span-1">
                <label className="text-[10px] uppercase font-bold text-gray-400">
                  Color
                </label>
                <input
                  value={v.frameColor}
                  onChange={(e) =>
                    updateVariant(i, "frameColor", e.target.value)
                  }
                  placeholder="e.g. Matte Black"
                  className="w-full border p-2 rounded"
                />
              </div>
              <div className="md:col-span-1">
                <label className="text-[10px] uppercase font-bold text-gray-400">
                  Size
                </label>
                <select
                  value={v.size}
                  onChange={(e) => updateVariant(i, "size", e.target.value)}
                  className="w-full border p-2 rounded"
                >
                  {[
                    "EXTRA SMALL",
                    "SMALL",
                    "MEDIUM",
                    "LARGE",
                    "EXTRA LARGE",
                  ].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-1">
                <label className="text-[10px] uppercase font-bold text-gray-400">
                  Price
                </label>
                <input
                  type="number"
                  value={v.price}
                  onChange={(e) =>
                    updateVariant(i, "price", Number(e.target.value))
                  }
                  className="w-full border p-2 rounded"
                />
              </div>
              <div className="md:col-span-1">
                <label className="text-[10px] uppercase font-bold text-gray-400">
                  Sale Price
                </label>
                <input
                  type="number"
                  value={v.salePrice}
                  onChange={(e) =>
                    updateVariant(i, "salePrice", Number(e.target.value))
                  }
                  className="w-full border p-2 rounded"
                />
              </div>
              <div className="md:col-span-1">
                <label className="text-[10px] uppercase font-bold text-gray-400">
                  Stock
                </label>
                <input
                  type="number"
                  value={v.stock}
                  onChange={(e) =>
                    updateVariant(i, "stock", Number(e.target.value))
                  }
                  className="w-full border p-2 rounded"
                />
              </div>
              <div className="flex flex-col gap-2 justify-center">
                <label className="flex items-center gap-1 text-xs">
                  <input
                    type="checkbox"
                    checked={v.isTryOnAvailable}
                    onChange={(e) =>
                      updateVariant(i, "isTryOnAvailable", e.target.checked)
                    }
                  />{" "}
                  Try-On
                </label>
                <label className="flex items-center gap-1 text-xs">
                  <input
                    type="checkbox"
                    checked={v.isBuyOneGetOne}
                    onChange={(e) =>
                      updateVariant(i, "isBuyOneGetOne", e.target.checked)
                    }
                  />{" "}
                  BOGO
                </label>
              </div>

              {formData.variants.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    setFormData((p) => ({
                      ...p,
                      variants: p.variants.filter((_, idx) => idx !== i),
                    }))
                  }
                  className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-lg"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-4 border-t pt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 rounded-xl border font-semibold hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isCreating || isUpdating}
            className="px-10 py-3 rounded-xl bg-[#072369] text-white font-bold shadow-lg shadow-blue-900/20 hover:bg-[#0a2e8a] transition-all disabled:opacity-50"
          >
            {isCreating || isUpdating
              ? "Saving Product..."
              : initialData
              ? "Update Product"
              : "Publish Product"}
          </button>
        </div>
      </form>
    </div>
  );
};
