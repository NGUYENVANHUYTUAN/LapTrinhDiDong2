import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import * as db from '../database/db';

export interface CartItem {
  id: number; // ID dòng trong bảng cart (nếu có trong DB) hoặc số ngẫu nhiên cho guest
  productId: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    price: number;
    img: string;
  };
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: { id: number; name: string; price: number; img: string }, qty?: number) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  totalPrice: number;
  totalCount: number;
  loadCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  // Load giỏ hàng từ SQLite hoặc local state tùy theo user
  const loadCart = async () => {
    if (user) {
      try {
        const dbItems = await db.fetchCart(user.id);
        const mappedItems: CartItem[] = dbItems.map((item) => ({
          id: item.id,
          productId: item.productId,
          quantity: item.quantity,
          product: {
            id: item.productId,
            name: item.name || 'Sản phẩm',
            price: item.price || 0,
            img: item.img || 'hinh1.jpg',
          },
        }));
        setCart(mappedItems);
      } catch (err) {
        console.error('Error loading cart from DB:', err);
      }
    } else {
      // Nếu không đăng nhập, giỏ hàng guest giữ nguyên hoặc làm trống khi logout
    }
  };

  // Đồng bộ giỏ hàng khi user thay đổi (đăng nhập hoặc đăng xuất)
  useEffect(() => {
    if (user) {
      // Merge giỏ hàng guest hiện tại vào DB nếu có
      const mergeCart = async () => {
        if (cart.length > 0) {
          for (const item of cart) {
            // Nếu item chưa có id từ DB (tức là guest item)
            if (item.id < 0) {
              await db.addToCart(user.id, item.productId, item.quantity);
            }
          }
        }
        await loadCart();
      };
      mergeCart();
    } else {
      setCart([]);
    }
  }, [user]);

  // Tính tổng tiền và số lượng
  useEffect(() => {
    let price = 0;
    let count = 0;
    cart.forEach((item) => {
      price += item.product.price * item.quantity;
      count += item.quantity;
    });
    setTotalPrice(price);
    setTotalCount(count);
  }, [cart]);

  const addToCart = async (product: { id: number; name: string; price: number; img: string }, qty: number = 1) => {
    if (user) {
      try {
        await db.addToCart(user.id, product.id, qty);
        await loadCart();
      } catch (err) {
        console.error('Error adding to DB cart:', err);
      }
    } else {
      // Giỏ hàng guest (dùng id âm để đánh dấu)
      setCart((prevCart) => {
        const existingItem = prevCart.find((item) => item.product.id === product.id);
        if (existingItem) {
          return prevCart.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + qty }
              : item
          );
        }
        return [
          ...prevCart,
          {
            id: -Math.floor(Math.random() * 10000) - 1,
            productId: product.id,
            quantity: qty,
            product,
          },
        ];
      });
    }
  };

  const removeFromCart = async (productId: number) => {
    if (user) {
      try {
        const item = cart.find((c) => c.product.id === productId);
        if (item) {
          await db.removeFromCart(item.id);
          await loadCart();
        }
      } catch (err) {
        console.error('Error removing from DB cart:', err);
      }
    } else {
      setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
    }
  };

  const updateQuantity = async (productId: number, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    if (user) {
      try {
        const item = cart.find((c) => c.product.id === productId);
        if (item) {
          await db.updateCartQuantity(item.id, quantity);
          await loadCart();
        }
      } catch (err) {
        console.error('Error updating DB cart quantity:', err);
      }
    } else {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = async () => {
    if (user) {
      try {
        await db.clearCart(user.id);
        await loadCart();
      } catch (err) {
        console.error('Error clearing DB cart:', err);
      }
    } else {
      setCart([]);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalPrice,
        totalCount,
        loadCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
