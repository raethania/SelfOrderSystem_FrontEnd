import { useEffect, useState, useRef } from "react";
import {
    Plus,
    Pencil,
    Trash2,
    Search as SearchIcon,
    Upload,
    X,
} from "lucide-react";
import AdminLayout from "@/layout/AdminLayout";
import { Modal, ConfirmModal } from "@/components/ui/Modal";
import { PaginationControl } from "@/components/ui/PaginationControl";
import { productApi } from "@/features/menu/api/productApi";
import { categoryApi } from "@/features/menu/api/categoryApi";
import { formatRupiah } from "@/lib/formatCurrency";
import type {
    Product,
    ProductStatus,
    CreateProductPayload,
} from "@/types/product.types";
import type { Category } from "@/types/category.types";

const STATUS_OPTIONS: { label: string; value: ProductStatus | "" }[] = [
    { label: "All", value: "" },
    { label: "Available", value: "available" },
    { label: "Unavailable", value: "unavailable" },
];

const INITIAL_FORM: CreateProductPayload = {
    category_id: 0,
    name: "",
    description: "",
    price: 0,
    stock: 0,
    image: null,
    status: "available",
};

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filters
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState<number | "">("");
    const [statusFilter, setStatusFilter] = useState<ProductStatus | "">("");
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);

    // Form modal
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [form, setForm] = useState<CreateProductPayload>({ ...INITIAL_FORM });
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [isSaving, setIsSaving] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Delete modal
    const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchProducts = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const params: Record<string, unknown> = {
                page: currentPage,
                limit: 12,
            };
            if (searchQuery) params.search = searchQuery;
            if (categoryFilter) params.category_id = categoryFilter;
            if (statusFilter) params.status = statusFilter;

            const res = await productApi.getProducts(params as any);
            setProducts(res.data);
            if ("meta" in res && (res as any).meta) {
                setLastPage((res as any).meta.last_page);
            }
        } catch {
            setError("Failed to load products.");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await categoryApi.getCategories({ limit: 100 });
            setCategories(res.data);
        } catch {
            // Silent - categories are supplementary
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        const timeout = setTimeout(fetchProducts, 300);
        return () => clearTimeout(timeout);
    }, [searchQuery, categoryFilter, statusFilter, currentPage]);

    const openCreateForm = () => {
        setEditingProduct(null);
        setForm({ ...INITIAL_FORM, category_id: categories[0]?.id || 0 });
        setImagePreview(null);
        setFormErrors({});
        setIsFormOpen(true);
    };

    const openEditForm = (product: Product) => {
        setEditingProduct(product);
        setForm({
            category_id: product.category_id,
            name: product.name,
            description: product.description || "",
            price: product.price,
            stock: product.stock,
            image: null,
            status: product.status,
        });
        setImagePreview(product.image || null);
        setFormErrors({});
        setIsFormOpen(true);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            setFormErrors((prev) => ({
                ...prev,
                image: "Image must be less than 2MB",
            }));
            return;
        }

        setForm((prev) => ({ ...prev, image: file }));
        setImagePreview(URL.createObjectURL(file));
        setFormErrors((prev) => {
            const next = { ...prev };
            delete next.image;
            return next;
        });
    };

    const validateForm = (): boolean => {
        const errors: Record<string, string> = {};
        if (!form.name.trim()) errors.name = "Name is required";
        if (form.name.length > 100)
            errors.name = "Name must be 100 characters or less";
        if (!form.category_id) errors.category_id = "Category is required";
        if (form.price < 0) errors.price = "Price cannot be negative";
        if (form.stock < 0) errors.stock = "Stock cannot be negative";
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSave = async () => {
        if (!validateForm()) return;
        setIsSaving(true);
        try {
            if (editingProduct) {
                await productApi.updateProduct(editingProduct.id, form);
            } else {
                await productApi.createProduct(form);
            }
            setIsFormOpen(false);
            fetchProducts();
        } catch (err: any) {
            setFormErrors({
                _general:
                    err?.message || "Failed to save product. Please try again.",
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setIsDeleting(true);
        try {
            await productApi.deleteProduct(deleteTarget.id);
            setDeleteTarget(null);
            fetchProducts();
        } catch {
            alert("Failed to delete product.");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <AdminLayout title="Products" subtitle="Manage your menu items">
            {/* Toolbar */}
            <div className="space-y-3 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    {/* Search */}
                    <div className="relative flex-1">
                        <SearchIcon
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                            size={18}
                        />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="h-10 w-full rounded-xl border border-input bg-transparent pl-11 pr-4 outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/50 text-sm"
                        />
                    </div>

                    {/* Add button */}
                    <button
                        onClick={openCreateForm}
                        className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors shrink-0"
                    >
                        <Plus size={18} />
                        Add Product
                    </button>
                </div>

                {/* Filter chips */}
                <div className="flex flex-wrap gap-2">
                    {/* Category chips */}
                    <button
                        onClick={() => {
                            setCategoryFilter("");
                            setCurrentPage(1);
                        }}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                            categoryFilter === ""
                                ? "bg-primary text-primary-foreground"
                                : "bg-card border border-border text-foreground hover:bg-accent"
                        }`}
                    >
                        All Categories
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => {
                                setCategoryFilter(cat.id);
                                setCurrentPage(1);
                            }}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                                categoryFilter === cat.id
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-card border border-border text-foreground hover:bg-accent"
                            }`}
                        >
                            {cat.name}
                        </button>
                    ))}

                    <span className="w-px bg-border self-stretch mx-1" />

                    {/* Status chips */}
                    {STATUS_OPTIONS.map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => {
                                setStatusFilter(opt.value);
                                setCurrentPage(1);
                            }}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                                statusFilter === opt.value
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-card border border-border text-foreground hover:bg-accent"
                            }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Loading */}
            {isLoading && (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin w-8 h-8 border-3 border-primary border-t-transparent rounded-full" />
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="text-center py-12">
                    <p className="text-destructive font-medium mb-2">{error}</p>
                    <button
                        onClick={fetchProducts}
                        className="text-primary underline text-sm"
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* Products grid */}
            {!isLoading && !error && (
                <>
                    {products.length === 0 ? (
                        <div className="text-center py-16 text-muted-foreground">
                            <p className="text-lg font-medium mb-1">
                                No products found
                            </p>
                            <p className="text-sm">
                                Try adjusting filters or add a new product
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {products.map((product) => (
                                <div
                                    key={product.id}
                                    className="bg-card rounded-xl ring-1 ring-foreground/10 overflow-hidden group hover:ring-primary/30 hover:shadow-md transition-all duration-200"
                                >
                                    {/* Image */}
                                    <div className="relative aspect-video overflow-hidden">
                                        <img
                                            src={
                                                product.image ||
                                                "https://avatar.vercel.sh/product"
                                            }
                                            alt={product.name}
                                            className="w-full h-full object-cover brightness-90 group-hover:brightness-100 group-hover:scale-105 transition-all duration-300"
                                        />
                                        {/* Status badge */}
                                        <span
                                            className={`absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider ${
                                                product.status === "available"
                                                    ? "bg-green-500/90 text-white"
                                                    : "bg-red-500/90 text-white"
                                            }`}
                                        >
                                            {product.status}
                                        </span>
                                        {/* Action buttons overlay */}
                                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() =>
                                                    openEditForm(product)
                                                }
                                                className="p-1.5 rounded-lg bg-white/90 text-foreground hover:bg-white shadow-sm transition-colors"
                                                title="Edit"
                                            >
                                                <Pencil size={14} />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    setDeleteTarget(product)
                                                }
                                                className="p-1.5 rounded-lg bg-white/90 text-red-600 hover:bg-white shadow-sm transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <div className="p-4">
                                        <p className="text-xs text-muted-foreground mb-0.5">
                                            {product.category?.name || "—"}
                                        </p>
                                        <h3 className="text-sm font-semibold text-foreground truncate">
                                            {product.name}
                                        </h3>
                                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1 min-h-[2rem]">
                                            {product.description ||
                                                "No description"}
                                        </p>
                                        <div className="flex items-center justify-between mt-3">
                                            <span className="text-sm font-bold text-primary">
                                                {formatRupiah(product.price)}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                Stock: {product.stock}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <PaginationControl
                        currentPage={currentPage}
                        lastPage={lastPage}
                        onPageChange={setCurrentPage}
                    />
                </>
            )}

            {/* Create/Edit Product Modal */}
            <Modal
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                title={editingProduct ? "Edit Product" : "New Product"}
                maxWidth="max-w-xl"
            >
                <div className="space-y-4">
                    {formErrors._general && (
                        <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                            {formErrors._general}
                        </p>
                    )}

                    {/* Image upload */}
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1.5">
                            Image
                        </label>
                        {imagePreview ? (
                            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-accent">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    onClick={() => {
                                        setImagePreview(null);
                                        setForm((prev) => ({
                                            ...prev,
                                            image: null,
                                        }));
                                        if (fileInputRef.current)
                                            fileInputRef.current.value = "";
                                    }}
                                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/50 text-white hover:bg-black/70 transition-colors"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full aspect-video rounded-xl border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <Upload size={24} />
                                <span className="text-sm">
                                    Click to upload (max 2MB)
                                </span>
                            </button>
                        )}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpg,image/jpeg,image/png,image/webp"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                        {formErrors.image && (
                            <p className="text-xs text-red-600 mt-1">
                                {formErrors.image}
                            </p>
                        )}
                    </div>

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1.5">
                            Name *
                        </label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    name: e.target.value,
                                }))
                            }
                            placeholder="Product name"
                            className="h-10 w-full rounded-lg border border-input bg-transparent px-3 outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/50 text-sm"
                            maxLength={100}
                        />
                        {formErrors.name && (
                            <p className="text-xs text-red-600 mt-1">
                                {formErrors.name}
                            </p>
                        )}
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1.5">
                            Category *
                        </label>
                        <select
                            value={form.category_id}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    category_id: Number(e.target.value),
                                }))
                            }
                            className="h-10 w-full rounded-lg border border-input bg-transparent px-3 outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/50 text-sm"
                        >
                            <option value={0} disabled>
                                Select category
                            </option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                        {formErrors.category_id && (
                            <p className="text-xs text-red-600 mt-1">
                                {formErrors.category_id}
                            </p>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1.5">
                            Description
                        </label>
                        <textarea
                            value={form.description || ""}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    description: e.target.value,
                                }))
                            }
                            placeholder="Product description..."
                            rows={3}
                            className="w-full rounded-lg border border-input bg-transparent px-3 py-2 outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/50 text-sm resize-none"
                        />
                    </div>

                    {/* Price & Stock */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1.5">
                                Price (Rp) *
                            </label>
                            <input
                                type="number"
                                value={form.price}
                                onChange={(e) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        price: Number(e.target.value),
                                    }))
                                }
                                min={0}
                                className="h-10 w-full rounded-lg border border-input bg-transparent px-3 outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/50 text-sm"
                            />
                            {formErrors.price && (
                                <p className="text-xs text-red-600 mt-1">
                                    {formErrors.price}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1.5">
                                Stock *
                            </label>
                            <input
                                type="number"
                                value={form.stock}
                                onChange={(e) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        stock: Number(e.target.value),
                                    }))
                                }
                                min={0}
                                className="h-10 w-full rounded-lg border border-input bg-transparent px-3 outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/50 text-sm"
                            />
                            {formErrors.stock && (
                                <p className="text-xs text-red-600 mt-1">
                                    {formErrors.stock}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Status toggle */}
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1.5">
                            Status
                        </label>
                        <div className="flex gap-2">
                            {(
                                [
                                    { label: "Available", value: "available" },
                                    {
                                        label: "Unavailable",
                                        value: "unavailable",
                                    },
                                ] as const
                            ).map((opt) => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() =>
                                        setForm((prev) => ({
                                            ...prev,
                                            status: opt.value,
                                        }))
                                    }
                                    className={`flex-1 h-10 rounded-lg text-sm font-medium transition-colors ${
                                        form.status === opt.value
                                            ? opt.value === "available"
                                                ? "bg-green-100 text-green-700 ring-1 ring-green-300"
                                                : "bg-red-100 text-red-700 ring-1 ring-red-300"
                                            : "border border-border hover:bg-accent"
                                    }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="flex gap-3 pt-2">
                        <button
                            onClick={() => setIsFormOpen(false)}
                            disabled={isSaving}
                            className="flex-1 h-10 rounded-lg border border-border text-sm font-medium hover:bg-accent transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="flex-1 h-10 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                        >
                            {isSaving
                                ? "Saving..."
                                : editingProduct
                                  ? "Update"
                                  : "Create"}
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Delete Confirm Modal */}
            <ConfirmModal
                isOpen={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
                title="Delete Product"
                message={`Are you sure you want to delete "${deleteTarget?.name}"? This action uses soft delete.`}
                isLoading={isDeleting}
            />
        </AdminLayout>
    );
}
