import { create } from "zustand";

export interface CartItem {
    id: number;
    product_id: number;
    name: string;
    price: number;
    quantity: number;
    notes?: string | null;
}

interface CartState {
    tableNumber: number | null;
    items: CartItem[];
    notes: string;

    setTableNumber: (tableNumber: number) => void;
    addItem: (product: Omit<CartItem, "quantity">) => void;
    removeItem: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    updateItemNotes: (productId: number, notes: string) => void;
    setNotes: (notes: string) => void;
    clearCart: () => void;
    getSubtotal: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
    tableNumber: null,
    items: [],
    notes: "",

    setTableNumber: (tableNumber) => set({ tableNumber }),

    addItem: (product) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item.id === product.id);

        if (existingItem) {
            set({
                items: currentItems.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            });

            return;
        }

        set({
            items: [
                ...currentItems,
                {
                    ...product,
                    quantity: 1,
                    notes: product.notes ?? null
                }
            ]
        });
    },

    removeItem: (productId) => {
        set({
            items: get().items.filter((item) => item.id !== productId)
        });
    },

    updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
            get().removeItem(productId);
            return;
        }

        set({
            items: get().items.map((item) =>
                item.id === productId ? { ...item, quantity } : item
            )
        });
    },

    updateItemNotes: (productId, notes) => {
        set({
            items: get().items.map((item) =>
                item.id === productId ? { ...item, notes } : item
            )
        });
    },

    setNotes: (notes) => set({ notes }),

    clearCart: () => {
        set({
            tableNumber: null,
            items: [],
            notes: ""
        });
    },

    getSubtotal: () => {
        return get().items.reduce(
            (total, item) => total + Number(item.price) * item.quantity,
            0
        );
    }
}));