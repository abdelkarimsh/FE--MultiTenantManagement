import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ProductDto } from '../api/productsApi';
import type { CartItem } from '../types/order';
import { useAuth } from './AuthContext';

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addItem: (tenantId: string, product: ProductDto, quantity?: number) => void;
  removeItem: (productId: string) => void;
  increaseQuantity: (productId: string) => void;
  decreaseQuantity: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const toSafeQuantity = (quantity: number, maxStock: number) => {
  if (!Number.isFinite(quantity)) return 1;
  const normalized = Math.max(1, Math.floor(quantity));
  if (maxStock > 0) {
    return Math.min(normalized, maxStock);
  }
  return normalized;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { currentTenantId } = useAuth();

  useEffect(() => {
    if (!currentTenantId) {
      setItems([]);
      return;
    }

    setItems((prev) => prev.filter((item) => item.tenantId === currentTenantId));
  }, [currentTenantId]);

  const updateItemQuantity = (productId: string, nextQuantity: number) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.productId !== productId) return item;
          return {
            ...item,
            quantity: toSafeQuantity(nextQuantity, item.stockQuantity),
          };
        })
        .filter((item) => item.quantity >= 1),
    );
  };

  const addItem = (tenantId: string, product: ProductDto, quantity = 1) => {
    setItems((prev) => {
      const scopedItems = prev.filter((item) => item.tenantId === tenantId);
      const existingItem = scopedItems.find((item) => item.productId === product.id);
      const stockQuantity = Math.max(0, product.stockQuantity ?? 0);

      if (existingItem) {
        return scopedItems.map((item) => {
          if (item.productId !== product.id) return item;
          return {
            ...item,
            quantity: toSafeQuantity(item.quantity + quantity, stockQuantity),
            price: product.price,
            stockQuantity,
            imageUrl: product.imageUrl,
            name: product.name,
          };
        });
      }

      return [
        ...scopedItems,
        {
          productId: product.id,
          tenantId,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          quantity: toSafeQuantity(quantity, stockQuantity),
          stockQuantity,
        },
      ];
    });
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const value = useMemo<CartContextValue>(() => {
    const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return {
      items,
      itemCount,
      subtotal,
      addItem,
      removeItem,
      increaseQuantity: (productId: string) => {
        const item = items.find((x) => x.productId === productId);
        if (!item) return;
        updateItemQuantity(productId, item.quantity + 1);
      },
      decreaseQuantity: (productId: string) => {
        const item = items.find((x) => x.productId === productId);
        if (!item) return;
        const nextQuantity = item.quantity - 1;
        if (nextQuantity < 1) {
          removeItem(productId);
          return;
        }
        updateItemQuantity(productId, nextQuantity);
      },
      setQuantity: (productId: string, quantity: number) => {
        if (quantity < 1) {
          removeItem(productId);
          return;
        }
        updateItemQuantity(productId, quantity);
      },
      clearCart,
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
