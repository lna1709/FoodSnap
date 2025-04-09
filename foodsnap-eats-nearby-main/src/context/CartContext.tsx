import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the cart item type
export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  notes: string;
  restaurantId: string;
  restaurantName: string;
}

// Define the context type
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  updateNotes: (id: number, notes: string) => void;
  clearCart: () => void;
  totalItems: number;
}

// Create the context with a default value
const CartContext = createContext<CartContextType | undefined>(undefined);

// Mock initial data for development
const mockCartItems: CartItem[] = [
  {
    id: 1,
    name: "Classic Cheeseburger",
    price: 9.99,
    quantity: 2,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    notes: "No pickles, extra cheese",
    restaurantId: "1",
    restaurantName: "Burger Palace"
  },
  {
    id: 2,
    name: "French Fries",
    price: 3.99,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1585109649139-366815a0d713?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    notes: "",
    restaurantId: "1",
    restaurantName: "Burger Palace"
  },
  {
    id: 3,
    name: "Chocolate Milkshake",
    price: 4.99,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    notes: "Extra whipped cream",
    restaurantId: "1",
    restaurantName: "Burger Palace"
  }
];

// Provider component
export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize state from localStorage or use mock data
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : mockCartItems;
  });

  // Save to localStorage when cart changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Add item to cart
  const addToCart = (item: Omit<CartItem, 'quantity'>, quantity: number = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(cartItem => cartItem.id === item.id);
      
      if (existingItem) {
        // Update quantity if item exists
        return prevItems.map(cartItem => 
          cartItem.id === item.id 
            ? { ...cartItem, quantity: cartItem.quantity + quantity, notes: item.notes }
            : cartItem
        );
      } else {
        // Add new item
        return [...prevItems, { ...item, quantity }];
      }
    });
  };

  // Remove item from cart
  const removeFromCart = (id: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  // Update item quantity
  const updateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) return;
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  // Update item notes
  const updateNotes = (id: number, notes: string) => {
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, notes } : item
      )
    );
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Calculate total items
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      updateNotes,
      clearCart,
      totalItems
    }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the cart context
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 