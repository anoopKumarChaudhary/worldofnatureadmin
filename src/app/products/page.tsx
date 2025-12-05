"use client";

import { useState } from "react";
import { useAppSelector } from "../redux/hooks";
import AdminLayout from "../components/AdminLayout";
import { Plus, Search, Edit, Trash2 } from "lucide-react";

export default function ProductsPage() {
  const { products } = useAppSelector((state) => state.products);
  const dispatch = useAppDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    imageUrl: "",
  });

  const filteredProducts = products.filter(
    (product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProduct = () => {
    setEditingProduct(null);
    setFormData({
      title: "",
      description: "",
      price: "",
      category: "",
      imageUrl: "",
    });
    setIsModalOpen(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      imageUrl: product.imageUrl,
    });
    setIsModalOpen(true);
  };

  const handleSaveProduct = () => {
    if (editingProduct) {
      // Update existing product
      dispatch({
        type: "products/updateProduct",
        payload: {
          ...editingProduct,
          ...formData,
          price: parseFloat(formData.price),
        },
      });
    } else {
      // Add new product
      const newProduct = {
        id: Date.now(),
        ...formData,
        price: parseFloat(formData.price),
        rating: 0,
        reviewCount: 0,
        createdAt: new Date().toISOString(),
      };
      dispatch({ type: "products/addProduct", payload: newProduct });
    }
    setIsModalOpen(false);
  };

  const handleDeleteProduct = (productId) => {
    if (confirm("Are you sure you want to delete this product?")) {
      dispatch({ type: "products/deleteProduct", payload: productId });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-600">Manage your product inventory</p>
          </div>
          <button
            onClick={handleAddProduct}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Products Table */}
        <div className="rounded-lg bg-white shadow">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center">
                        <img
                          src={product.imageUrl}
                          alt={product.title}
                          className="h-10 w-10 rounded-lg object-cover"
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {product.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {product.description.slice(0, 50)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      {product.category}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      {product.price}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      {product.rating} ({product.reviewCount})
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-4">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No products found.</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
