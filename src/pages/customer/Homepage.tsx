import PaginationButton from "@/components/ui/PaginationButton"
import { Search } from "@/components/ui/search"
import { RefreshButton } from "@/components/ui/RefreshButton"
import { useEffect, useRef, useState, useCallback } from "react"
import { useCartStore } from "@/store/cartStore"
import { Edit2, Check } from "lucide-react"

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

    const tableNumber = useCartStore((state) => state.tableNumber)
    const setTableNumber = useCartStore((state) => state.setTableNumber)
    const [isEditingTable, setIsEditingTable] = useState(false)
    const [tempTable, setTempTable] = useState(tableNumber?.toString() || "")

    const handleSaveTable = () => {
        const val = parseInt(tempTable)
        setTableNumber(isNaN(val) ? null : val)
        setIsEditingTable(false)
    }

    const titleNode = (
        <div className="flex items-center gap-3">
            {isEditingTable ? (
                <div className="flex items-center gap-2">
                    <span>Table</span>
                    <input 
                        type="number"
                        min="1"
                        className="w-16 md:w-20 px-2 py-1 border border-primary rounded-md outline-none focus:ring-2 focus:ring-primary/50 text-xl md:text-2xl lg:text-3xl font-semibold bg-transparent"
                        value={tempTable}
                        onChange={(e) => setTempTable(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleSaveTable()
                        }}
                        autoFocus
                    />
                    <button onClick={handleSaveTable} className="p-1 md:p-1.5 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                        <Check size={20} />
                    </button>
                </div>
            ) : (
                <>
                    <span>Table {tableNumber || "0"}</span>
                    <button 
                        onClick={() => {
                            setTempTable(tableNumber?.toString() || "")
                            setIsEditingTable(true)
                        }}
                        className="p-1 md:p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors"
                        title="Edit Table Number"
                    >
                        <Edit2 size={18} />
                    </button>
                </>
            )}
        </div>
    )

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

    const fetchProducts = useCallback(async () => {
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
    }, [currentPage, selectedCategory, debouncedSearch])

    useEffect(() => {
        fetchProducts()
    }, [fetchProducts])

    const handleCategoryChange = (catId: number | null) => {
        setSelectedCategory(catId)
        setCurrentPage(1)
    }

    const filteredProducts = products

    return (
        <CustomerLayout title={titleNode} subtitle="Find your favorite meal">
            {/* Search bar — hanya muncul di Homepage */}
            <div className="mb-5 flex items-center gap-3">
                <div className="flex-1">
                    <Search
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Search menu items..."
                    />
                </div>
                <RefreshButton onRefresh={fetchProducts} colorClass="text-orange-600" />
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