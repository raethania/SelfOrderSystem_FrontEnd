import { useEffect, useState } from "react"
import { MenuGrid } from "@/features/menu/components/MenuGrid"
import { CartBar } from "@/features/menu/components/CartBar"
import CustomerLayout from "@/layout/CustomerLayout"
import { productApi } from "@/features/menu/api/productApi"
import { categoryApi } from "@/features/menu/api/categoryApi"
import type { Product } from "@/types/product.types"
import type { Category } from "@/types/category.types"

export default function Homepage() {
    const [products, setProducts] = useState<Product[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchData() {
            setIsLoading(true)
            setError(null)
            try {
                const [productsRes, categoriesRes] = await Promise.all([
                    productApi.getProducts({ status: "available" }),
                    categoryApi.getCategories(),
                ])
                setProducts(productsRes.data)
                setCategories(categoriesRes.data)
            } catch {
                setError("Failed to load menu. Please try again.")
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [])

    const filteredProducts = selectedCategory
        ? products.filter((p) => p.category_id === selectedCategory)
        : products

    return (
        <CustomerLayout title="Table 03" subtitle="Find your favorite meal">
            {/* Category filters */}
            {categories.length > 0 && (
                <div className="flex gap-2 mb-5 overflow-x-auto pb-2 scrollbar-hide">
                    <button
                        onClick={() => setSelectedCategory(null)}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors shrink-0 ${
                            selectedCategory === null
                                ? "bg-primary text-primary-foreground"
                                : "bg-card border border-border text-foreground hover:bg-accent"
                        }`}
                    >
                        All
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors shrink-0 ${
                                selectedCategory === cat.id
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-card border border-border text-foreground hover:bg-accent"
                            }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            )}

            {/* Loading state */}
            {isLoading && (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin w-8 h-8 border-3 border-primary border-t-transparent rounded-full" />
                </div>
            )}

            {/* Error state */}
            {error && (
                <div className="text-center py-12">
                    <p className="text-destructive font-medium mb-2">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="text-primary underline text-sm"
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* Products grid */}
            {!isLoading && !error && <MenuGrid items={filteredProducts} />}

            <CartBar />
        </CustomerLayout>
    )
}