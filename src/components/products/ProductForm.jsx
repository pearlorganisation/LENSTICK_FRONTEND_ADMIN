"use client";
import React, { useState, useEffect, useRef } from "react";
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
  HelpCircle,
  Upload,
} from "lucide-react";
import { toast } from "react-hot-toast";

export const ProductForm = ({ onClose, initialData }) => {
  const { data: catResponse } = useGetAllCategoriesQuery();
  const categories = catResponse?.data || [];
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const fileInputRefs = useRef([]);
  const [categoryPath, setCategoryPath] = useState([]);

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
    totalStock: 0,
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
    questionsAndAnswers: [],
    variants: [
      {
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

  // --- CATEGORY LOGIC ---

  // Rebuild the path (breadcrumbs) if we are editing an existing product
  useEffect(() => {
    if (initialData && categories.length > 0) {
      const buildPath = (currentId, path = []) => {
        const cat = categories.find((c) => c._id === currentId);
        if (!cat) return path;
        const parentId = cat.parentCategory?._id || cat.parentCategory;
        if (parentId) {
          return buildPath(parentId, [currentId, ...path]);
        }
        return [currentId, ...path];
      };

      const targetId =
        initialData.subCategory?._id ||
        initialData.subCategory ||
        initialData.category?._id ||
        initialData.category;
      if (targetId) setCategoryPath(buildPath(targetId));
    }
  }, [initialData, categories]);

  const handleCategoryLevelChange = (index, selectedId) => {
    // 1. Cut the path at the level being changed
    let newPath = categoryPath.slice(0, index);

    // 2. Add the new selection if it exists
    if (selectedId) {
      newPath.push(selectedId);
    }

    setCategoryPath(newPath);

    // 3. Update Form State
    setFormData((prev) => ({
      ...prev,
      category: newPath[0] || "", // Root category
      subCategory: newPath.length > 1 ? newPath[newPath.length - 1] : null, // Deepest selected level
    }));
  };

  // --- GENERAL HANDLERS ---

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...defaultForm,
        ...initialData,
        category: initialData.category?._id || initialData.category || "",
        subCategory:
          initialData.subCategory?._id || initialData.subCategory || null,
        gender: initialData.gender || [],
        questionsAndAnswers: initialData.questionsAndAnswers || [],
      });
    }
  }, [initialData]);

  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

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

  const handleFileChange = (vIndex, e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    const updatedVariants = [...formData.variants];
    updatedVariants[vIndex].images = [
      ...updatedVariants[vIndex].images,
      ...newImages,
    ];
    setFormData((prev) => ({ ...prev, variants: updatedVariants }));
  };

  const removeImage = (vIndex, imgIndex) => {
    const updatedVariants = [...formData.variants];
    updatedVariants[vIndex].images = updatedVariants[vIndex].images.filter(
      (_, i) => i !== imgIndex
    );
    setFormData((prev) => ({ ...prev, variants: updatedVariants }));
  };

  const addQA = () =>
    setFormData((p) => ({
      ...p,
      questionsAndAnswers: [
        ...p.questionsAndAnswers,
        { question: "", answer: "" },
      ],
    }));
  const updateQA = (index, field, value) => {
    const updated = [...formData.questionsAndAnswers];
    updated[index][field] = value;
    setFormData((p) => ({ ...p, questionsAndAnswers: updated }));
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
    <div className="bg-white rounded-lg shadow-xl border-t-4 border-[#072369] max-h-[95vh] overflow-hidden flex flex-col w-full max-w-6xl mx-auto">
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
              name="brand"
              value={formData.brand}
              onChange={handleInputChange}
              placeholder="Brand Name"
              className="border p-3 rounded-lg w-full"
            />

            {/* CATEGORY SELECTORS */}
            <div className="md:col-span-2 space-y-3 bg-gray-50 p-4 rounded-xl border">
              <label className="text-sm font-bold text-[#072369] uppercase flex items-center gap-2">
                <Layers size={16} /> Category
              </label>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Level 0: Main Category */}
                <div className="space-y-1">
                  <span className="text-[10px] text-gray-500 font-bold ml-1">
                    MAIN CATEGORY
                  </span>
                  <select
                    value={categoryPath[0] || ""}
                    onChange={(e) =>
                      handleCategoryLevelChange(0, e.target.value)
                    }
                    className="border p-3 rounded-lg w-full bg-white shadow-sm"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories
                      .filter((c) => !c.parentCategory || c.level === 0)
                      .map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Level 1+: Dynamic Subcategories */}
                {categoryPath.map((selectedId, index) => {
                  const children = categories.filter(
                    (c) =>
                      (c.parentCategory?._id || c.parentCategory) === selectedId
                  );
                  if (children.length === 0) return null;

                  return (
                    <div
                      key={selectedId}
                      className="space-y-1 animate-in fade-in slide-in-from-left-2"
                    >
                      <span className="text-[10px] text-gray-500 font-bold ml-1">
                        SUB-CATEGORY LEVEL {index + 1}
                      </span>
                      <select
                        value={categoryPath[index + 1] || ""}
                        onChange={(e) =>
                          handleCategoryLevelChange(index + 1, e.target.value)
                        }
                        className="border p-3 rounded-lg w-full bg-white shadow-sm"
                      >
                        <option value="">Select Sub-category</option>
                        {children.map((sub) => (
                          <option key={sub._id} value={sub._id}>
                            {sub.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="md:col-span-2">
              <input
                name="slug"
                value={formData.slug}
                readOnly
                className="border p-3 rounded-lg w-full bg-gray-50 text-gray-500 text-sm"
                placeholder="Slug (Auto-generated)"
              />
            </div>
          </div>

          <textarea
            name="shortDescription"
            value={formData.shortDescription}
            onChange={handleInputChange}
            placeholder="Short Description"
            className="border p-3 rounded-lg w-full"
            rows="2"
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Full Description"
            className="border p-3 rounded-lg w-full"
            rows="3"
          />
        </div>

        {/* ... Rest of your sections (Specs, Variants, FAQ) remain the same ... */}
        {/* I am omitting them here for brevity, but keep your existing code for those sections */}

        {/* SECTION 2: SPECS & INVENTORY */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[#072369] border-b pb-1">
              <Layout size={20} />{" "}
              <h3 className="font-semibold uppercase text-sm tracking-wider">
                Specifications
              </h3>
            </div>
            <div className="flex gap-6 py-2">
              {["Men", "Women", "Kids"].map((g) => (
                <label
                  key={g}
                  className="flex items-center gap-2 cursor-pointer font-medium"
                >
                  <input
                    type="checkbox"
                    checked={formData.gender?.includes(g)}
                    onChange={() => handleGenderChange(g)}
                    className="w-4 h-4"
                  />{" "}
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
                Inventory & Dimensions
              </h3>
            </div>

            <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100">
              <label className="text-[10px] font-bold text-gray-500 uppercase px-1">
                Total Product Inventory
              </label>
              <input
                type="number"
                name="totalStock"
                value={formData.totalStock}
                onChange={handleInputChange}
                placeholder="e.g. 100"
                className="w-full border p-2 rounded-md font-bold text-[#072369] mt-1"
              />
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
                    className="border p-3 rounded-lg text-sm"
                  />
                )
              )}
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              {["isFeatured", "isBestSeller", "isNewArrival", "isActive"].map(
                (flag) => (
                  <label
                    key={flag}
                    className="flex items-center gap-2 font-medium text-sm"
                  >
                    <input
                      type="checkbox"
                      name={flag}
                      checked={formData[flag]}
                      onChange={handleInputChange}
                    />{" "}
                    {flag.replace("is", "")}
                  </label>
                )
              )}
            </div>
          </div>
        </div>

        {/* SECTION 3: VARIANTS */}
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b pb-1 text-[#072369]">
            <div className="flex items-center gap-2">
              <Layers size={20} />{" "}
              <h3 className="font-semibold uppercase text-sm tracking-wider">
                Variants
              </h3>
            </div>
            <button
              type="button"
              onClick={() =>
                setFormData((p) => ({
                  ...p,
                  // variants: [...p.variants, defaultForm.variants[0]],
                  variants: [
                    ...p.variants,
                    {
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
              className="relative p-6 border rounded-2xl bg-gray-50 space-y-4"
            >
              <button
                type="button"
                onClick={() =>
                  setFormData((p) => ({
                    ...p,
                    variants: p.variants.filter((_, idx) => idx !== i),
                  }))
                }
                className="absolute top-4 right-4 text-red-500 hover:bg-red-50 p-1 rounded-full"
              >
                <Trash2 size={20} />
              </button>

              {/* <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4"> */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                <input
                  placeholder="Color"
                  value={v.frameColor}
                  onChange={(e) =>
                    updateVariant(i, "frameColor", e.target.value)
                  }
                  className="border p-2 rounded text-sm"
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={v.price}
                  onChange={(e) =>
                    updateVariant(i, "price", Number(e.target.value))
                  }
                  className="border p-2 rounded text-sm"
                />
                <input
                  type="number"
                  placeholder="Sale Price"
                  value={v.salePrice}
                  onChange={(e) =>
                    updateVariant(i, "salePrice", Number(e.target.value))
                  }
                  className="border p-2 rounded text-sm bg-green-50"
                />
                <input
                  type="number"
                  placeholder="Stock"
                  value={v.stock}
                  onChange={(e) =>
                    updateVariant(i, "stock", Number(e.target.value))
                  }
                  className="border p-2 rounded text-sm"
                />
                <input
                  type="number"
                  placeholder="Disc %"
                  value={v.discountPercentage}
                  onChange={(e) =>
                    updateVariant(
                      i,
                      "discountPercentage",
                      Number(e.target.value)
                    )
                  }
                  className="border p-2 rounded text-sm"
                />
                <select
                  value={v.size}
                  onChange={(e) => updateVariant(i, "size", e.target.value)}
                  className="border p-2 rounded text-sm"
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
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] flex items-center gap-1 font-bold">
                    <input
                      type="checkbox"
                      checked={v.isTryOnAvailable}
                      onChange={(e) =>
                        updateVariant(i, "isTryOnAvailable", e.target.checked)
                      }
                    />{" "}
                    TryOn
                  </label>
                  <label className="text-[9px] flex items-center gap-1 font-bold">
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
              </div>

              <div className="flex flex-wrap gap-3">
                {v.images.map((img, imgIdx) => (
                  <div
                    key={imgIdx}
                    className="relative w-20 h-20 group border rounded-lg overflow-hidden"
                  >
                    <img
                      src={img.url}
                      className="w-full h-full object-cover"
                      alt=""
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(i, imgIdx)}
                      className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 text-white"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  ref={(el) => (fileInputRefs.current[i] = el)}
                  onChange={(e) => handleFileChange(i, e)}
                />
                <button
                  type="button"
                  onClick={() => fileInputRefs.current[i].click()}
                  className="w-20 h-20 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-gray-400 hover:text-[#072369]"
                >
                  <Upload size={20} />
                  <span className="text-[10px] font-bold">Upload</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* SECTION 4: FAQ */}
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b pb-1 text-[#072369]">
            <div className="flex items-center gap-2">
              <HelpCircle size={20} />{" "}
              <h3 className="font-semibold uppercase text-sm tracking-wider">
                FAQ
              </h3>
            </div>
            <button
              type="button"
              onClick={addQA}
              className="text-xs bg-gray-100 px-3 py-1 rounded-full"
            >
              + Add FAQ
            </button>
          </div>
          {formData.questionsAndAnswers.map((qa, index) => (
            <div
              key={index}
              className="flex gap-2 bg-gray-50 p-4 rounded-xl border"
            >
              <div className="flex-1 space-y-2">
                <input
                  placeholder="Question"
                  value={qa.question}
                  onChange={(e) => updateQA(index, "question", e.target.value)}
                  className="w-full border p-2 rounded text-sm font-bold"
                />
                <textarea
                  placeholder="Answer"
                  value={qa.answer}
                  onChange={(e) => updateQA(index, "answer", e.target.value)}
                  className="w-full border p-2 rounded text-sm"
                  rows="2"
                />
              </div>
              <button
                type="button"
                onClick={() =>
                  setFormData((p) => ({
                    ...p,
                    questionsAndAnswers: p.questionsAndAnswers.filter(
                      (_, i) => i !== index
                    ),
                  }))
                }
                className="text-red-500"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
          <div />
        </div>
        <div className="flex justify-end gap-4 border-t pt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 border rounded-xl"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isCreating || isUpdating}
            className="px-10 py-3 bg-[#072369] text-white rounded-xl font-bold"
          >
            {isCreating || isUpdating
              ? "Saving..."
              : initialData
              ? "Update Product"
              : "Publish Product"}
          </button>
        </div>
      </form>
    </div>
  );
};
