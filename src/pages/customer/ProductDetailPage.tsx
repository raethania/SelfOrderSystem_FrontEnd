import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, ShoppingCart, Package, Tag, CheckCircle } from "lucide-react"
import { productApi } from "@/features/menu/api/productApi"
import { useCartStore } from "@/store/cartStore"
import type { Product } from "@/types/product.types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function ProductDetailPage() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const addItem = useCartStore((state) => state.addItem)

    const [product, setProduct] = useState<Product | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [quantity, setQuantity] = useState(1)
    const [added, setAdded] = useState(false)

    useEffect(() => {
        if (!id) return
        async function fetchProduct() {
            setIsLoading(true)
            setError(null)
            try {
                const res = await productApi.getProductById(Number(id))
                setProduct(res.data)
            } catch {
                setError("Produk tidak ditemukan atau gagal dimuat.")
            } finally {
                setIsLoading(false)
            }
        }
        fetchProduct()
    }, [id])

    const formatPrice = (price: number | string) =>
        `Rp. ${Number(price).toLocaleString("id-ID")}`

    const handleAddToCart = () => {
        if (!product) return
        for (let i = 0; i < quantity; i++) {
            addItem({
                id: product.id,
                product_id: product.id,
                name: product.name,
                price: Number(product.price),
            })
        }
        setAdded(true)
        setTimeout(() => setAdded(false), 1500)
    }

    const imageUrl = product?.image ?? "https://avatar.vercel.sh/food"
    const isUnavailable = product?.status === "unavailable"
    const outOfStock = (product?.stock ?? 0) === 0

    return (
        <div className="min-h-dvh bg-background flex flex-col">

            {/* ── Sticky Header ── */}
            <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border px-5 py-3 flex items-center gap-3">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => navigate(-1)}
                    aria-label="Kembali"
                    className="rounded-full shrink-0"
                >
                    <ArrowLeft className="w-4 h-4" />
                </Button>
                <h1 className="text-base font-semibold text-foreground truncate">
                    {product ? product.name : "Detail Produk"}
                </h1>
            </header>

            {/* ── Loading ── */}
            {isLoading && (
                <div className="flex-1 flex flex-col items-center justify-center gap-4 py-32">
                    <div className="animate-spin w-10 h-10 border-3 border-primary border-t-transparent rounded-full" />
                    <p className="text-muted-foreground text-sm">Memuat produk...</p>
                </div>
            )}

            {/* ── Error ── */}
            {error && (
                <div className="flex-1 flex items-center justify-center py-32 px-8">
                    <Card className="w-full max-w-sm text-center">
                        <CardContent className="pt-8 pb-8 flex flex-col items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                                <Package className="w-8 h-8 text-destructive" />
                            </div>
                            <p className="text-destructive font-medium">{error}</p>
                            <Button variant="link" onClick={() => navigate(-1)} className="w-auto">
                                Kembali ke menu
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* ── Main Content ── */}
            {!isLoading && !error && product && (
                <div className="flex-1 flex flex-col pb-32">

                    {/* Hero Image */}
                    <div className="relative w-full aspect-[4/3] max-h-72 overflow-hidden bg-muted">
                        <img
                            src={imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />

                        {/* Category badge */}
                        {product.category && (
                            <span className="absolute top-4 right-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-semibold shadow-lg">
                                <Tag className="w-3 h-3" />
                                {product.category.name}
                            </span>
                        )}

                        {/* Unavailable overlay */}
                        {isUnavailable && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <span className="bg-black/70 text-white text-sm font-semibold px-4 py-2 rounded-full">
                                    Tidak Tersedia
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Content Area */}
                    <div className="mx-auto w-full max-w-2xl px-5 pt-6 flex flex-col gap-5">

                        {/* ── Name & Price Card ── */}
                        <Card>
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between gap-4">
                                    <CardTitle className="text-xl font-bold leading-snug flex-1">
                                        {product.name}
                                    </CardTitle>
                                    <p className="text-xl font-bold text-primary shrink-0">
                                        {formatPrice(product.price)}
                                    </p>
                                </div>
                            </CardHeader>

                            <Separator />

                            <CardContent className="pt-4 flex items-center gap-3">
                                {/* Stock indicator */}
                                <div className={`flex items-center gap-1.5 text-sm font-medium ${product.stock > 10
                                    ? "text-emerald-600"
                                    : product.stock > 0
                                        ? "text-amber-600"
                                        : "text-destructive"
                                    }`}>
                                    <Package className="w-4 h-4" />
                                    {product.stock > 0 ? `${product.stock} tersedia` : "Stok habis"}
                                </div>

                                {/* Status badge */}
                                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${isUnavailable
                                    ? "bg-muted text-muted-foreground"
                                    : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                                    }`}>
                                    {isUnavailable ? "Tidak Tersedia" : "Tersedia"}
                                </span>
                            </CardContent>
                        </Card>

                        {/* ── Description Card ── */}
                        {product.description && (
                            <Card>
                                <CardHeader className="pb-3">
                                    <p className="text-xs font-bold uppercase tracking-widest text-primary">
                                        Deskripsi
                                    </p>
                                </CardHeader>
                                <Separator />
                                <CardContent className="pt-4">
                                    <p className="text-sm text-foreground/80 leading-relaxed">
                                        {product.description}
                                    </p>
                                </CardContent>
                            </Card>
                        )}

                        {/* ── Info Grid ── */}
                        <div className="grid grid-cols-2 gap-3">
                            <Card>
                                <CardContent className="pt-4 pb-4">
                                    <p className="text-xs text-muted-foreground mb-1">Kategori</p>
                                    <p className="text-sm font-semibold text-foreground">
                                        {product.category?.name ?? "—"}
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="pt-4 pb-4">
                                    <p className="text-xs text-muted-foreground mb-1">Stok</p>
                                    <p className="text-sm font-semibold text-foreground">
                                        {product.stock} pcs
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                    </div>
                </div>
            )}

            {/* ── Sticky Bottom Bar ── */}
            {!isLoading && !error && product && (
                <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border px-5 py-4">
                    <div className="mx-auto max-w-2xl flex items-center gap-3">

                        {/* Quantity selector */}
                        <div className="flex items-center gap-2 bg-card border border-border rounded-full px-3 py-2 shrink-0">
                            <Button
                                variant="ghost"
                                size="icon-sm"
                                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                disabled={quantity <= 1}
                                className="rounded-full"
                                aria-label="Kurangi"
                            >
                                −
                            </Button>
                            <span className="w-6 text-center text-sm font-semibold text-foreground select-none">
                                {quantity}
                            </span>
                            <Button
                                variant="ghost"
                                size="icon-sm"
                                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                                disabled={quantity >= product.stock}
                                className="rounded-full"
                                aria-label="Tambah"
                            >
                                +
                            </Button>
                        </div>

                        {/* Add to Cart Button */}
                        <Button
                            onClick={handleAddToCart}
                            disabled={isUnavailable || outOfStock}
                            className={`flex-1 rounded-full h-12 font-semibold gap-2 transition-all duration-200 ${added ? "bg-emerald-500 hover:bg-emerald-500 scale-95" : ""
                                }`}
                        >
                            {added
                                ? <><CheckCircle className="w-4 h-4" /> Ditambahkan!</>
                                : outOfStock || isUnavailable
                                    ? <><Package className="w-4 h-4" /> Tidak Tersedia</>
                                    : <><ShoppingCart className="w-4 h-4" /> Tambah ke Keranjang · {formatPrice(Number(product.price) * quantity)}</>
                            }
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
