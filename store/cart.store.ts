import { CartCustomization, CartStore } from "@/type";
import { create } from "zustand";

function areCustomizationsEqual(
    a: CartCustomization[] = [],
    b: CartCustomization[] = []
): boolean {
    if (a.length !== b.length) return false;

    // Filter out any undefined/null and items without id
    const aFiltered = a.filter((x) => x && x.id);
    const bFiltered = b.filter((x) => x && x.id);

    if (aFiltered.length !== bFiltered.length) return false;

    const aSorted = [...aFiltered].sort((x, y) => x.id.localeCompare(y.id));
    const bSorted = [...bFiltered].sort((x, y) => x.id.localeCompare(y.id));

    return aSorted.every((item, idx) => item.id === bSorted[idx].id);
}

export const useCartStore = create<CartStore>((set, get) => ({
    items: [],

   addItem: (item) => {
  const customizations = item.customizations ?? [];

  const existing = get().items.find(
    (i) =>
      i.id === item.id &&
      areCustomizationsEqual(i.customizations ?? [], customizations)
  );

  if (existing) {
    set({
      items: get().items.map((i) =>
        i.id === item.id &&
        areCustomizationsEqual(i.customizations ?? [], customizations)
          ? { ...i, quantity: i.quantity + item.quantity } 
          : i
      ),
    });
  } else {
    set({
      items: [
        ...get().items,
        { ...item, quantity: item.quantity, customizations }, 
      ],
    });
  }
},


    removeItem: (id, customizations = []) => {
        set({
            items: get().items.filter(
                (i) =>
                    !(
                        i.id === id &&
                        areCustomizationsEqual(i.customizations ?? [], customizations)
                    )
            ),
        });
    },

    increaseQty: (id, customizations = []) => {
        set({
            items: get().items.map((i) =>
                i.id === id &&
                areCustomizationsEqual(i.customizations ?? [], customizations)
                    ? { ...i, quantity: i.quantity + 1 }
                    : i
            ),
        });
    },

    decreaseQty: (id, customizations = []) => {
        set({
            items: get()
                .items.map((i) =>
                    i.id === id &&
                    areCustomizationsEqual(i.customizations ?? [], customizations)
                        ? { ...i, quantity: i.quantity - 1 }
                        : i
                )
                .filter((i) => i.quantity > 0),
        });
    },

    clearCart: () => set({ items: [] }),

    getTotalItems: () =>
        get().items.reduce((total, item) => total + item.quantity, 0),

    getTotalPrice: () =>
        get().items.reduce((total, item) => {
            const base = item.price;
            const customPrice =
                item.customizations?.reduce(
                    (s: number, c: CartCustomization) => s + c.price,
                    0
                ) ?? 0;
            return total + item.quantity * (base + customPrice);
        }, 0),
}));
