export default function ProductsPage() {
  const products = [
    {
      id: 1,
      name: "Aviator Classic",
      price: "₹1,499",
      stock: 25,
      category: "Eyeglasses",
    },
    {
      id: 2,
      name: "Wayfarer Sport",
      price: "₹999",
      stock: 12,
      category: "Sports Glasses",
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">Product Inventory</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
          + Add New Frame
        </button>
      </div>
      <table className="w-full text-left">
        <thead>
          <tr className="bg-slate-50 text-slate-500 text-sm italic">
            <th className="p-4">Product Name</th>
            <th className="p-4">Category</th>
            <th className="p-4">Price</th>
            <th className="p-4">Stock</th>
            <th className="p-4">Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr
              key={p.id}
              className="border-t border-gray-100 hover:bg-slate-50"
            >
              <td className="p-4 font-medium">{p.name}</td>
              <td className="p-4 text-gray-600 text-sm">{p.category}</td>
              <td className="p-4">{p.price}</td>
              <td className="p-4">{p.stock} units</td>
              <td className="p-4 text-blue-600 cursor-pointer hover:underline text-sm">
                Edit
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
