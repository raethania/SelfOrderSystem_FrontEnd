import PaginationButton from "@/components/ui/PaginationButton"
import { Search } from "@/components/ui/search"
import { useEffect, useRef, useState } from "react"

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
    const [searchQuery, setSearchQuery] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("")
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    const [currentPage, setCurrentPage] = useState(1)
    const [lastPage, setLastPage] = useState(1)

    useEffect(() => {
        async function fetchCategories() {
            try {
                const res = await categoryApi.getCategories()
                setCategories(res.data)
            } catch (e) {
                console.error("Failed to load categories", e)
            }
        }
        fetchCategories()
    }, [])

    // Debounce search input — tunggu 400ms setelah user stop typing
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setSearchQuery(value)
        if (debounceRef.current) clearTimeout(debounceRef.current)
        debounceRef.current = setTimeout(() => {
            setDebouncedSearch(value)
            setCurrentPage(1)
        }, 400)
    }

    useEffect(() => {
        async function fetchProducts() {
            setIsLoading(true)
            setError(null)
            try {
                const productsRes = await productApi.getProducts({
                    status: "available",
                    page: currentPage,
                    category_id: selectedCategory || undefined,
                    search: debouncedSearch || undefined
                })
                setProducts(productsRes.data)
                if (productsRes.meta) {
                    setLastPage(productsRes.meta.last_page)
                }
            } catch {
                setError("Failed to load menu. Please try again.")
            } finally {
                setIsLoading(false)
            }
        }

        fetchProducts()
    }, [currentPage, selectedCategory, debouncedSearch])

    const handleCategoryChange = (catId: number | null) => {
        setSelectedCategory(catId)
        setCurrentPage(1)
    }

    const filteredProducts = products

    return (
        <CustomerLayout title="Table 03" subtitle="Find your favorite meal">
            {/* Search bar — hanya muncul di Homepage */}
            <div className="mb-5">
                <Search
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search menu items..."
                />
            </div>

            {/* Category filters */}
            {categories.length > 0 && (
                <div className="flex gap-2 mb-5 overflow-x-auto pb-2 scrollbar-hide">
                    <button
                        onClick={() => handleCategoryChange(null)}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors shrink-0 ${selectedCategory === null
                            ? "bg-primary text-primary-foreground"
                            : "bg-card border border-border text-foreground hover:bg-accent"
                            }`}
                    >
                        All
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => handleCategoryChange(cat.id)}
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors shrink-0 ${selectedCategory === cat.id
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
            {!isLoading && !error && (
                <>
                    <MenuGrid items={filteredProducts} />
                    {lastPage > 1 && (
                        <div className="mt-8 mb-4">
                            <PaginationButton
                                currentPage={currentPage}
                                lastPage={lastPage}
                                onPageChange={setCurrentPage}
                            />
                        </div>
                    )}
                </>
            )}
            <CartBar />
        </CustomerLayout>
    )
}