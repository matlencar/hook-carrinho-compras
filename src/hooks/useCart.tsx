import { createContext, ReactNode, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Product, Stock } from '../types';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem('@RocketShoes:cart');

    if (storagedCart) {
      return JSON.parse(storagedCart);
    }

    return [];
  });

  const addProduct = async (productId: number) => {
    try {
      const cartUpdated = [...cart]
      const updateProductCartExists = cartUpdated.find(p => p.id === productId)
      
      const stock = await api.get(`/stock/${productId}`)
      const stockCartAmount = stock.data.value;
      const stockCartCurrent = updateProductCartExists ? updateProductCartExists.amount : 0
      const amount = stockCartCurrent + 1;

      if(amount >  stockCartAmount) {
        toast.error('Quantidade soliicitada fora do estoque');
        return;
      }
      else if (updateProductCartExists) {
        updateProductCartExists.amount = amount
      }
      else {
        const product = await api.get(`/product/${productId}`)

        const newProduct = {
          ...product.data, 
          amount: 1
        }
        cartUpdated.push(newProduct)
      }
      
      setCart(cartUpdated)
      
    } catch {
      toast.error('Erro na adição do produto');
    }
  };

  const removeProduct = (productId: number) => {
    try {
      
    } catch {
      
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      
    } catch {
     
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
