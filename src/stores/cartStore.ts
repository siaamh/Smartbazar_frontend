import { create } from 'zustand';

interface CartState {
  itemCount: number;
  setItemCount: (n: number) => void;
  incrementCount: () => void;
  decrementCount: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  itemCount: 0,

  setItemCount: (n) => set({ itemCount: n }),

  incrementCount: () => set((state) => ({ itemCount: state.itemCount + 1 })),

  decrementCount: () =>
    set((state) => ({ itemCount: Math.max(0, state.itemCount - 1) })),
}));
