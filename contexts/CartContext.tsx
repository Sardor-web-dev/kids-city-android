import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export type CartItem = {
  id: number;
  name: string;
  Image: string;
  description: string;
  size: string[]; 
  price: number;
  quantity: number;
  gender: string;
  authorId: number;
  selectedSize: string;
};

type CartContextType = {
  items: CartItem[];
  isReady: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (id: number) => void;
  clearCart: () => void;
  removeFromCart: (id: number) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("CartProvider is missing");
  return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isReady, setIsReady] = useState(false);

  // Загрузка из AsyncStorage
  useEffect(() => {
    const loadCart = async () => {
      try {
        const stored = await AsyncStorage.getItem("cartItems");
        if (stored) {
          setItems(JSON.parse(stored));
        }
      } catch (error) {
        console.error("Ошибка при загрузке корзины:", error);
      } finally {
        setIsReady(true);
      }
    };
    loadCart();
  }, []);

  // Сохранение в AsyncStorage
  useEffect(() => {
    if (!isReady) return; // не сохраняем до полной загрузки
    const saveCart = async () => {
      try {
        await AsyncStorage.setItem("cartItems", JSON.stringify(items));
      } catch (error) {
        console.error("Ошибка при сохранении корзины:", error);
      }
    };
    saveCart();
  }, [items, isReady]);

  const addItem = (item: CartItem) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) => i.id === item.id && i.selectedSize === item.selectedSize
      );
      if (existing) {
        return prev.map((i) =>
          i.id === item.id && i.selectedSize === item.selectedSize
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...prev, item];
    });
  };

  const removeItem = (id: number) => {
    setItems((prev) => {
      const target = prev.find((i) => i.id === id);
      if (target && target.quantity > 1) {
        return prev.map((i) =>
          i.id === id ? { ...i, quantity: i.quantity - 1 } : i
        );
      }
      return prev.filter((item) => item.id !== id);
    });
  };

  const removeFromCart = (id: number) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const clearCart = async () => {
    try {
      await AsyncStorage.removeItem("cartItems");
    } catch (error) {
      console.error("Ошибка при очистке корзины:", error);
    }
    setItems([]);
  };

  return (
    <CartContext.Provider
      value={{ items, isReady, addItem, removeItem, clearCart, removeFromCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
