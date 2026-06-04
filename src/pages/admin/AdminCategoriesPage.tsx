import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Search as SearchIcon } from "lucide-react";
import AdminLayout from "@/layout/AdminLayout";
import { Modal, ConfirmModal } from "@/components/ui/Modal";
import { categoryApi } from "@/features/menu/api/categoryApi";
import { formatDate } from "@/lib/formatDate";
import type { Category } from "@/types/category.types";

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    // Modal states
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [formName, setFormName] = useState("");
    const [formError, setFormError] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    // Delete modal
    const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchCategories = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const params: Record<string, unknown> = {};
            if (searchQuery) params.name = searchQuery;
            const res = await categoryApi.getCategories(params as any);
            setCategories(res.data);
        } catch {
            setError("Failed to load categories.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const timeout = setTimeout(fetchCategories, 300);
        return () => clearTimeout(timeout);
    }, [searchQuery]);

    const openCreateForm = () => {
        setEditingCategory(null);
        setFormName("");
        setFormError("");
        setIsFormOpen(true);
    };

    const openEditForm = (cat: Category) => {
        setEditingCategory(cat);
        setFormName(cat.name);
        setFormError("");
        setIsFormOpen(true);
    };

    const handleSave = async () => {
        // Validation
        if (formName.trim().length < 3) {
            setFormError("Name must be at least 3 characters.");
            return;
        }
        if (formName.trim().length > 50) {
            setFormError("Name must be at most 50 characters.");
            return;
        }

        setIsSaving(true);
        setFormError("");

        try {
            if (editingCategory) {
                await categoryApi.updateCategory(editingCategory.id, {
                    name: formName.trim(),
                });
            } else {
                await categoryApi.createCategory({
                    name: formName.trim(),
                });
            }
            setIsFormOpen(false);
            fetchCategories();
        } catch (err: any) {
            setFormError(
                err?.message || "Failed to save category. Please try again."
            );
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setIsDeleting(true);
        try {
            await categoryApi.deleteCategory(deleteTarget.id);
            setDeleteTarget(null);
            fetchCategories();
        } catch {
            alert("Failed to delete category.");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <AdminLayout title="Categories" subtitle="Manage menu categories">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
                {/* Search */}
                <div className="relative flex-1">
                    <SearchIcon
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                        size={18}
                    />
                    <input
                        type="text"
                        placeholder="Search categories..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-10 w-full rounded-xl border border-input bg-transparent pl-11 pr-4 outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/50 text-sm"
                    />
                </div>

                {/* Add button */}
                <button
                    onClick={openCreateForm}
                    className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors shrink-0"
                >
                    <Plus size={18} />
                    Add Category
                </button>
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
                        onClick={fetchCategories}
                        className="text-primary underline text-sm"
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* Categories grid */}
            {!isLoading && !error && (
                <>
                    {categories.length === 0 ? (
                        <div className="text-center py-16 text-muted-foreground">
                            <p className="text-lg font-medium mb-1">
                                No categories found
                            </p>
                            <p className="text-sm">
                                Create your first category to get started
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {categories.map((cat) => (
                                <div
                                    key={cat.id}
                                    className="bg-card rounded-xl ring-1 ring-foreground/10 p-5 hover:ring-primary/30 hover:shadow-md transition-all duration-200 group"
                                >
                                    <div className="flex items-start justify-between gap-2 mb-3">
                                        <div>
                                            <h3 className="text-sm font-semibold text-foreground">
                                                {cat.name}
                                            </h3>
                                            {cat.slug && (
                                                <p className="text-xs text-muted-foreground mt-0.5">
                                                    /{cat.slug}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() =>
                                                    openEditForm(cat)
                                                }
                                                className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                                                title="Edit"
                                            >
                                                <Pencil size={14} />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    setDeleteTarget(cat)
                                                }
                                                className="p-2 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-red-600 transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                    {cat.created_at && (
                                        <p className="text-xs text-muted-foreground">
                                            Created {formatDate(cat.created_at)}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* Create/Edit Modal */}
            <Modal
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                title={editingCategory ? "Edit Category" : "New Category"}
                maxWidth="max-w-md"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1.5">
                            Category Name
                        </label>
                        <input
                            type="text"
                            value={formName}
                            onChange={(e) => setFormName(e.target.value)}
                            placeholder="e.g. Beverages"
                            className="h-10 w-full rounded-lg border border-input bg-transparent px-3 outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/50 text-sm"
                            minLength={3}
                            maxLength={50}
                            autoFocus
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                            {formName.length}/50 characters (min 3)
                        </p>
                    </div>

                    {formError && (
                        <p className="text-sm text-red-600">{formError}</p>
                    )}

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
                                : editingCategory
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
                title="Delete Category"
                message={`Are you sure you want to delete "${deleteTarget?.name}"? This action uses soft delete.`}
                isLoading={isDeleting}
            />
        </AdminLayout>
    );
}
