"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import {
  fetchProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  Product,
} from "../redux/features/products/productsSlice";
import { uploadApi } from "../api/upload";
import AdminLayout from "../components/AdminLayout";
import Modal from "../components/Modal";
import { useToast } from "../context/ToastContext";
import { Plus, Search, Edit, Trash2, Loader2, Package } from "lucide-react";

function ProductsContent() {
  const { products, loading } = useAppSelector((state) => state.products);
  const dispatch = useAppDispatch();
  const { addToast } = useToast();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    originalPrice: "",
    category: "",
    imageUrl: "",
    images: [] as string[],
    videoUrl: "",
    ingredients: "",
    sourcing: "",
    tasteProfile: "",
    sizes: "", // Comma separated string
    inStock: true,
  });

  useEffect(() => {
    dispatch(fetchProducts({}));
  }, [dispatch]);

  useEffect(() => {
    if (searchParams.get("action") === "add") {
      handleAddProduct();
    }
  }, [searchParams]);

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
      originalPrice: "",
      category: "",
      imageUrl: "",
      images: [],
      videoUrl: "",
      ingredients: "",
      sourcing: "",
      tasteProfile: "",
      sizes: "",
      inStock: true,
    });
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      description: product.description,
      price: product.price.toString(),
      originalPrice: product.originalPrice ? product.originalPrice.toString() : "",
      category: product.category,
      imageUrl: product.imageUrl,
      images: product.images || [],
      videoUrl: product.videoUrl || "",
      ingredients: product.ingredients || "",
      sourcing: product.sourcing || "",
      tasteProfile: product.tasteProfile || "",
      sizes: product.sizes ? product.sizes.map((s) => s.value).join(", ") : "",
      inStock: product.inStock !== undefined ? product.inStock : true,
    });
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setUploading(true);
    try {
      const file = e.target.files[0];
      const imageUrl = await uploadApi.uploadFile(file);
      setFormData((prev) => ({ 
        ...prev, 
        imageUrl: imageUrl.data.url,
        // If it's the first image and images array is empty, also add to images
        images: prev.images.length === 0 ? [imageUrl.data.url] : prev.images
      }));
      addToast("Image uploaded successfully", "success");
    } catch (error) {
      console.error("Failed to upload image:", error);
      addToast("Failed to upload image", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleMultipleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setUploading(true);
    try {
      const files = Array.from(e.target.files);
      const uploadPromises = files.map(file => uploadApi.uploadFile(file));
      const responses = await Promise.all(uploadPromises);
      const newImageUrls = responses.map(res => res.data.url);
      
      setFormData((prev) => {
        const updatedImages = [...prev.images, ...newImageUrls];
        return {
          ...prev,
          images: updatedImages,
          // If imageUrl is empty, set it to the first uploaded image
          imageUrl: !prev.imageUrl && updatedImages.length > 0 ? updatedImages[0] : prev.imageUrl
        };
      });
      addToast(`${newImageUrls.length} images uploaded successfully`, "success");
    } catch (error) {
      console.error("Failed to upload images:", error);
      addToast("Failed to upload images", "error");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setFormData((prev) => {
      const newImages = prev.images.filter((_, index) => index !== indexToRemove);
      return {
        ...prev,
        images: newImages,
        // If we removed the main image (imageUrl), update it to the first of remaining images or empty
        imageUrl: prev.imageUrl === prev.images[indexToRemove] 
          ? (newImages.length > 0 ? newImages[0] : "") 
          : prev.imageUrl
      };
    });
  };

  const setMainImage = (url: string) => {
    setFormData(prev => ({ ...prev, imageUrl: url }));
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setUploading(true);
    try {
      const file = e.target.files[0];
      const result = await uploadApi.uploadFile(file);
      setFormData((prev) => ({ ...prev, videoUrl: result.data.url }));
      addToast("Video uploaded successfully", "success");
    } catch (error) {
      console.error("Failed to upload video:", error);
      addToast("Failed to upload video", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProduct = async () => {
    const priceValue = parseFloat(formData.price) || 0;
    const originalPriceValue = parseFloat(formData.originalPrice) || 0;
    
    // Parse sizes
    const sizesArray = formData.sizes
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s !== "")
      .map((s) => ({ value: s, label: s }));

    const productData = {
      ...formData,
      price: priceValue,
      originalPrice: originalPriceValue > 0 ? originalPriceValue : undefined,
      isOnSale: originalPriceValue > priceValue,
      sizes: sizesArray,
    };

    try {
      if (editingProduct) {
        await dispatch(
          updateProduct({
            id: editingProduct._id,
            data: productData,
          })
        ).unwrap();
        addToast("Product updated successfully", "success");
      } else {
        await dispatch(addProduct(productData)).unwrap();
        addToast("Product created successfully", "success");
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to save product:", error);
      addToast("Failed to save product. Please try again.", "error");
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await dispatch(deleteProduct(productId)).unwrap();
        addToast("Product deleted successfully", "success");
      } catch (error) {
        console.error("Failed to delete product:", error);
        addToast("Failed to delete product", "error");
      }
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif font-medium text-[#1A2118]">Products</h1>
            <p className="text-[#596157] mt-1">Manage your product inventory</p>
          </div>
          <button
            onClick={handleAddProduct}
            className="flex items-center gap-2 rounded-xl bg-[#1A2118] px-5 py-2.5 text-white hover:bg-[#BC5633] transition-all shadow-lg shadow-[#1A2118]/20 font-bold text-sm"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </button>
        </div>

        {/* Search */}
        <div className="relative max-w-md group">
          <div className="absolute inset-0 bg-white/40 backdrop-blur-xl rounded-xl shadow-sm border border-white/50 transition-all group-focus-within:border-[#BC5633]/30 group-focus-within:shadow-md" />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#1A2118]/40 w-4 h-4 group-focus-within:text-[#BC5633] transition-colors z-10" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="relative z-10 w-full bg-transparent border-none rounded-xl py-3 pl-10 pr-4 text-sm font-medium text-[#1A2118] placeholder-[#1A2118]/40 focus:ring-0 transition-all outline-none"
          />
        </div>

        {/* Products Table */}
        <div className="rounded-[2rem] bg-white/60 backdrop-blur-md border border-white/50 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-[#596157] flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-[#BC5633]" />
              <p>Loading products...</p>
            </div>
          ) : (
            <>
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-[#1A2118]/5 bg-white/30">
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-[#1A2118]/40">
                        Product
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-[#1A2118]/40">
                        Category
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-[#1A2118]/40">
                        Price
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-[#1A2118]/40">
                        Rating
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-[#1A2118]/40">
                        Status
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-widest text-[#1A2118]/40">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1A2118]/5">
                    {filteredProducts.map((product, index) => (
                      <tr key={`${product._id}-${index}`} className="group hover:bg-white/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="h-12 w-12 rounded-lg overflow-hidden bg-[#F2F0EA] border border-[#1A2118]/5 shrink-0">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={product.imageUrl}
                                alt={product.title}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-bold text-[#1A2118]">
                                {product.title}
                              </div>
                              <div className="text-xs text-[#596157] line-clamp-1 max-w-[200px]">
                                {product.description}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-[#596157]">
                          <span className="px-2 py-1 bg-[#F2F0EA] rounded-md text-xs font-medium text-[#1A2118]">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-[#1A2118]">
                          ₹{product.price}
                        </td>
                        <td className="px-6 py-4 text-sm text-[#596157]">
                          <div className="flex items-center gap-1">
                            <span className="font-medium text-[#1A2118]">{product.rating}</span>
                            <span className="text-xs text-[#1A2118]/40">({product.reviewCount})</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${
                              product.inStock !== false
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {product.inStock !== false ? "In Stock" : "Out of Stock"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleEditProduct(product)}
                              className="p-2 text-[#1A2118]/60 hover:text-[#BC5633] hover:bg-[#BC5633]/10 rounded-full transition-colors"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product._id)}
                              className="p-2 text-[#1A2118]/60 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards View */}
              <div className="md:hidden space-y-4 p-4">
                {filteredProducts.map((product, index) => (
                  <div
                    key={`${product._id}-${index}`}
                    className="rounded-xl bg-white/50 border border-[#1A2118]/5 p-4 shadow-sm"
                  >
                    <div className="flex items-start gap-4 mb-3">
                       <div className="h-16 w-16 rounded-lg overflow-hidden bg-[#F2F0EA] shrink-0">
                           {/* eslint-disable-next-line @next/next/no-img-element */}
                           <img src={product.imageUrl} alt={product.title} className="h-full w-full object-cover" />
                       </div>
                       <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-bold text-[#1A2118] truncate">{product.title}</h3>
                          <p className="text-xs text-[#596157] mb-1">{product.category}</p>
                          <span className="font-bold text-[#1A2118]">₹{product.price}</span>
                       </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-[#1A2118]/5">
                       <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                          product.inStock !== false
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {product.inStock !== false ? "In Stock" : "Out of Stock"}
                      </span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="p-2 text-[#1A2118]/60 hover:text-[#BC5633]"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product._id)}
                          className="p-2 text-[#1A2118]/60 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {filteredProducts.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#F2F0EA] mb-4">
               <Package className="w-8 h-8 text-[#1A2118]/20" />
            </div>
            <p className="text-[#596157] font-medium">No products found.</p>
            <p className="text-sm text-[#1A2118]/40 mt-1">Try adjusting your search or add a new product.</p>
          </div>
        )}

        {/* Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingProduct ? "Edit Product" : "Add Product"}
          footer={
            <>
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-3 rounded-xl text-sm font-bold text-[#1A2118] hover:bg-[#1A2118]/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProduct}
                disabled={uploading}
                className="px-8 py-3 bg-[#1A2118] rounded-xl text-sm font-bold text-white hover:bg-[#BC5633] transition-all shadow-lg shadow-[#1A2118]/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editingProduct ? "Update Product" : "Create Product"}
              </button>
            </>
          }
        >
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Left Column: Image & Key Info */}
              <div className="space-y-6">
                {/* Image Upload Card */}
                <div className="bg-white p-3 rounded-xl border border-[#1A2118]/5 shadow-sm space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#1A2118]/60 mb-3">
                      Product Images
                    </label>
                    
                    {/* Main Image Preview */}
                    <div 
                      className={`relative aspect-video rounded-xl border-2 border-dashed border-[#1A2118]/10 hover:border-[#BC5633]/50 transition-all overflow-hidden group mb-4 ${
                        !formData.imageUrl ? "bg-[#F2F0EA]" : "bg-white"
                      }`}
                    >
                      {formData.imageUrl ? (
                        <>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img 
                            src={formData.imageUrl} 
                            alt="Main Preview" 
                            className="w-full h-full object-contain" 
                          />
                          <div className="absolute top-2 left-2 bg-[#BC5633] text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider shadow-sm">
                            Main Image
                          </div>
                        </>
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-[#1A2118]/40">
                          <div className="w-10 h-10 rounded-full bg-[#1A2118]/5 flex items-center justify-center mb-2">
                             <Package className="w-5 h-5" />
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-widest">No Main Image</span>
                        </div>
                      )}
                    </div>

                    {/* Image Gallery Grid */}
                    {formData.images.length > 0 && (
                      <div className="grid grid-cols-3 gap-2 mb-4">
                        {formData.images.map((img, idx) => (
                          <div key={idx} className={`relative aspect-square rounded-lg overflow-hidden border ${formData.imageUrl === img ? 'border-[#BC5633] ring-2 ring-[#BC5633]/20' : 'border-[#1A2118]/10'} group`}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                            
                            {/* Hover Actions */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                              {formData.imageUrl !== img && (
                                <button
                                  onClick={() => setMainImage(img)}
                                  className="px-2 py-1 bg-white/90 text-[#1A2118] text-[10px] font-bold rounded uppercase tracking-wider hover:bg-white"
                                >
                                  Set Main
                                </button>
                              )}
                              <button
                                onClick={() => removeImage(idx)}
                                className="p-1.5 bg-red-500/90 text-white rounded-full hover:bg-red-600"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Upload Button */}
                    <div className="relative">
                      <div className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-[#1A2118]/10 rounded-xl hover:border-[#BC5633]/50 hover:bg-[#BC5633]/5 transition-all cursor-pointer group">
                        <div className="flex items-center gap-2 text-[#1A2118]/60 group-hover:text-[#BC5633]">
                          {uploading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Plus className="w-4 h-4" />
                          )}
                          <span className="text-xs font-bold uppercase tracking-widest">
                            {uploading ? "Uploading..." : "Add Images"}
                          </span>
                        </div>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleMultipleFileUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={uploading}
                      />
                    </div>
                  </div>
                </div>

                {/* Pricing & Inventory Card */}
                <div className="bg-white p-4 rounded-xl border border-[#1A2118]/5 shadow-sm space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#1A2118]/40 border-b border-[#1A2118]/5 pb-3">
                    Pricing & Inventory
                  </h3>
                  
                  <div className="space-y-5">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-[#1A2118]/50 mb-2">
                        Selling Price (₹)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) =>
                          setFormData({ ...formData, price: e.target.value })
                        }
                        className="block w-full rounded-xl border-[#1A2118]/10 bg-white shadow-sm focus:border-[#BC5633] focus:ring-[#BC5633] hover:border-[#BC5633]/30 transition-all font-bold text-[#1A2118] py-1.5 px-3 text-lg placeholder:text-[#1A2118]/20"
                        placeholder="0.00"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-[#1A2118]/50 mb-2">
                        Original Price (MRP)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.originalPrice}
                        onChange={(e) =>
                          setFormData({ ...formData, originalPrice: e.target.value })
                        }
                        placeholder="Optional"
                        className="block w-full rounded-xl border-[#1A2118]/10 bg-white shadow-sm focus:border-[#BC5633] focus:ring-[#BC5633] hover:border-[#BC5633]/30 transition-all py-1.5 px-3 text-[#1A2118] placeholder:text-[#1A2118]/20"
                      />
                    </div>
                  </div>
                  
                  {/* Discount Badge */}
                  {formData.price && formData.originalPrice && parseFloat(formData.originalPrice) > parseFloat(formData.price) && (
                     <div className="pt-4 border-t border-[#1A2118]/5 flex items-center justify-between">
                        <span className="text-xs font-bold text-[#1A2118]/40">Discount Applied</span>
                        <span className="px-3 py-1 bg-[#BC5633]/10 text-[#BC5633] rounded-lg text-xs font-bold border border-[#BC5633]/20">
                           {Math.round(((parseFloat(formData.originalPrice) - parseFloat(formData.price)) / parseFloat(formData.originalPrice)) * 100)}% OFF
                        </span>
                     </div>
                  )}

                  {/* Stock Toggle */}
                  <div className="pt-2">
                    <div className="flex items-center p-4 bg-[#F2F0EA]/30 rounded-xl border border-[#1A2118]/5 cursor-pointer hover:border-[#BC5633]/30 transition-all group" onClick={() => setFormData({ ...formData, inStock: !formData.inStock })}>
                      <input
                        type="checkbox"
                        checked={formData.inStock}
                        onChange={(e) =>
                          setFormData({ ...formData, inStock: e.target.checked })
                        }
                        className="h-5 w-5 text-[#BC5633] focus:ring-[#BC5633] border-gray-300 rounded cursor-pointer transition-all group-hover:scale-110"
                      />
                      <label className="ml-3 block text-xs font-bold uppercase tracking-widest text-[#1A2118] cursor-pointer select-none">
                        In Stock
                      </label>
                    </div>
                  </div>
                </div>

                  {/* Video Upload Card */}
                  <div className="bg-white p-3 rounded-xl border border-[#1A2118]/5 shadow-sm">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#1A2118]/60 mb-3">
                      Product Video (Optional)
                    </label>
                    <div 
                      className={`relative aspect-video rounded-xl border-2 border-dashed border-[#1A2118]/10 hover:border-[#BC5633]/50 transition-all overflow-hidden group ${
                        !formData.videoUrl ? "bg-[#F2F0EA]" : "bg-white"
                      }`}
                    >
                      {formData.videoUrl ? (
                        <>
                          <video 
                            src={formData.videoUrl} 
                            controls
                            className="w-full h-full object-contain" 
                          />
                          <div className="absolute top-2 right-2">
                             <button
                                onClick={() => setFormData(prev => ({ ...prev, videoUrl: "" }))}
                                className="p-1.5 bg-red-500/90 text-white rounded-full hover:bg-red-600 shadow-sm"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                          </div>
                        </>
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-[#1A2118]/40">
                          {uploading ? (
                            <Loader2 className="w-8 h-8 animate-spin text-[#BC5633]" />
                          ) : (
                            <>
                              <div className="w-10 h-10 rounded-full bg-[#1A2118]/5 flex items-center justify-center mb-2 group-hover:bg-[#BC5633]/10 group-hover:text-[#BC5633] transition-colors">
                                 <Plus className="w-5 h-5" />
                              </div>
                              <span className="text-[10px] font-bold uppercase tracking-widest">Upload Video</span>
                            </>
                          )}
                        </div>
                      )}
                      <input
                        type="file"
                        accept="video/*"
                        onChange={handleVideoUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={!!formData.videoUrl || uploading}
                      />
                    </div>
                  </div>
                </div>

              {/* Right Column: Product Details */}
              <div className="lg:col-span-2 space-y-6">
                {/* Basic Info Card */}
                <div className="bg-white p-4 rounded-xl border border-[#1A2118]/5 shadow-sm space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#1A2118]/40 border-b border-[#1A2118]/5 pb-3">
                    Basic Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-[#1A2118]/50 mb-2">
                        Product Title
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        className="block w-full rounded-xl border-[#1A2118]/10 bg-white shadow-sm focus:border-[#BC5633] focus:ring-[#BC5633] hover:border-[#BC5633]/30 transition-all text-xl font-bold text-[#1A2118] placeholder:font-normal placeholder:text-[#1A2118]/20 py-1.5 px-3"
                        placeholder="e.g. A2 Cow Ghee"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-[#1A2118]/50 mb-2">
                        Category
                      </label>
                      <input
                        type="text"
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value })
                        }
                        className="block w-full rounded-xl border-[#1A2118]/10 bg-white shadow-sm focus:border-[#BC5633] focus:ring-[#BC5633] hover:border-[#BC5633]/30 transition-all py-1.5 px-3 text-[#1A2118] placeholder:text-[#1A2118]/20"
                        placeholder="Select or type category"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-[#1A2118]/50 mb-2">
                        Sizes <span className="text-[#1A2118]/30 normal-case font-normal">(comma separated)</span>
                      </label>
                      <input
                        type="text"
                        value={formData.sizes}
                        onChange={(e) =>
                          setFormData({ ...formData, sizes: e.target.value })
                        }
                        className="block w-full rounded-xl border-[#1A2118]/10 bg-white shadow-sm focus:border-[#BC5633] focus:ring-[#BC5633] hover:border-[#BC5633]/30 transition-all py-1.5 px-3 text-[#1A2118] placeholder:text-[#1A2118]/20"
                        placeholder="250g, 500g, 1kg"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-[#1A2118]/50 mb-2">
                        Description
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({ ...formData, description: e.target.value })
                        }
                        rows={3}
                        className="block w-full rounded-xl border-[#1A2118]/10 bg-white shadow-sm focus:border-[#BC5633] focus:ring-[#BC5633] hover:border-[#BC5633]/30 transition-all resize-none py-1.5 px-3 text-[#1A2118] placeholder:text-[#1A2118]/20 leading-relaxed"
                        placeholder="Describe your product..."
                      />
                    </div>
                  </div>
                </div>

                {/* Detailed Info Card */}
                <div className="bg-white p-4 rounded-xl border border-[#1A2118]/5 shadow-sm space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#1A2118]/40 border-b border-[#1A2118]/5 pb-3">
                    Product Details
                  </h3>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-[#1A2118]/50 mb-2">
                        Ingredients
                      </label>
                      <textarea
                        value={formData.ingredients}
                        onChange={(e) =>
                          setFormData({ ...formData, ingredients: e.target.value })
                        }
                        rows={2}
                        className="block w-full rounded-xl border-[#1A2118]/10 bg-white shadow-sm focus:border-[#BC5633] focus:ring-[#BC5633] hover:border-[#BC5633]/30 transition-all py-1.5 px-3 text-[#1A2118] placeholder:text-[#1A2118]/20"
                        placeholder="List ingredients..."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-[#1A2118]/50 mb-2">
                          Sourcing
                        </label>
                        <textarea
                          value={formData.sourcing}
                          onChange={(e) =>
                            setFormData({ ...formData, sourcing: e.target.value })
                          }
                          rows={3}
                          className="block w-full rounded-xl border-[#1A2118]/10 bg-white shadow-sm focus:border-[#BC5633] focus:ring-[#BC5633] hover:border-[#BC5633]/30 transition-all py-1.5 px-3 text-[#1A2118] placeholder:text-[#1A2118]/20"
                          placeholder="Where is it from?"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-[#1A2118]/50 mb-2">
                          Taste Profile
                        </label>
                        <textarea
                          value={formData.tasteProfile}
                          onChange={(e) =>
                            setFormData({ ...formData, tasteProfile: e.target.value })
                          }
                          rows={3}
                          className="block w-full rounded-xl border-[#1A2118]/10 bg-white shadow-sm focus:border-[#BC5633] focus:ring-[#BC5633] hover:border-[#BC5633]/30 transition-all py-1.5 px-3 text-[#1A2118] placeholder:text-[#1A2118]/20"
                          placeholder="How does it taste?"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </AdminLayout>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="p-8 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#BC5633]" /></div>}>
      <ProductsContent />
    </Suspense>
  );
}
