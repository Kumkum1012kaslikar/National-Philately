"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { getUser } from "@/lib/auth";

interface CartItem {
  id: number;
  name: string;
  price: number;
  circle: string;
  image: string;
  quantity: number;
}

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
    setLoading(false);
  }, []);

  const updateCart = (newItems: CartItem[]) => {
    setCartItems(newItems);
    localStorage.setItem("cart", JSON.stringify(newItems));
    window.dispatchEvent(new Event("cart-updated"));
  };

  const handleQuantityChange = (id: number, delta: number) => {
    const updated = cartItems
      .map((item) => {
        if (item.id === id) {
          const nextQty = item.quantity + delta;
          return { ...item, quantity: Math.max(1, nextQty) };
        }
        return item;
      });
    updateCart(updated);
  };

  const handleRemove = (id: number) => {
    const filtered = cartItems.filter((item) => item.id !== id);
    updateCart(filtered);
  };

  const handleCheckout = () => {
    const user = getUser();
    if (!user) {
      alert("Please sign in or create an account to proceed with checkout.");
      router.push("/login");
      return;
    }

    if (cartItems.length === 0) return;

    // Create an order record
    const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder = {
      id: orderId,
      date: new Date().toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      items: cartItems,
      total: calculateTotal(),
      status: "Processing", // Status: Processing -> Shipped -> Delivered
    };

    // Store in user's order history
    const userOrdersKey = `orders_${user.email}`;
    const existingOrders = localStorage.getItem(userOrdersKey);
    const orders = existingOrders ? JSON.parse(existingOrders) : [];
    orders.unshift(newOrder); // Add to the top
    localStorage.setItem(userOrdersKey, JSON.stringify(orders));

    // Clear the cart
    updateCart([]);

    // Redirect to account dashboard
    alert("Purchase successful! Your order has been placed.");
    router.push("/account");
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.18; // 18% GST
  };

  const calculateTotal = () => {
    const sub = calculateSubtotal();
    if (sub === 0) return 0;
    return sub + calculateTax() + 45; // Subtotal + GST + Rs. 45 shipping fee
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-500 font-medium">Loading your cart...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 flex-grow">
      <h2 className="text-3xl font-bold text-blue-900 mb-8 flex items-center gap-2">
        <ShoppingBag className="w-8 h-8 text-blue-800" />
        Shopping Cart
      </h2>

      {cartItems.length === 0 ? (
        <Card className="max-w-md mx-auto text-center py-12 px-6">
          <CardHeader className="flex flex-col items-center">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
              <ShoppingBag className="w-8 h-8 text-blue-400" />
            </div>
            <CardTitle className="text-xl">Your Cart is Empty</CardTitle>
            <CardDescription className="mt-2 text-gray-500">
              You haven't added any stamps or postcards to your cart yet. Explore our national catalog to find rare items!
            </CardDescription>
          </CardHeader>
          <CardFooter className="justify-center mt-4">
            <Link href="/catalog">
              <Button className="bg-blue-800 hover:bg-blue-900">
                Browse Stamp Catalog
              </Button>
            </Link>
          </CardFooter>
        </Card>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id} className="overflow-hidden border-gray-200">
                <CardContent className="p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div className="flex gap-4 items-center self-start sm:self-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-md border border-gray-100 bg-gray-50"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-800">{item.name}</h3>
                      <p className="text-sm text-gray-500">{item.circle} Circle</p>
                      <p className="text-sm font-bold text-blue-800 mt-1">₹{item.price}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 justify-between w-full sm:w-auto">
                    {/* Quantity Controls */}
                    <div className="flex items-center border border-gray-200 rounded-md bg-gray-50 overflow-hidden">
                      <button
                        onClick={() => handleQuantityChange(item.id, -1)}
                        className="p-2 hover:bg-gray-100 text-gray-600 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-3 text-sm font-medium w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item.id, 1)}
                        className="p-2 hover:bg-gray-100 text-gray-600 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Total & Action */}
                    <div className="flex items-center gap-4">
                      <span className="font-semibold text-gray-900 w-20 text-right">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </span>
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Cart Summary Panel */}
          <div>
            <Card className="border-gray-200">
              <CardHeader className="bg-blue-50/50">
                <CardTitle className="text-lg">Order Summary</CardTitle>
                <CardDescription>Price breakdown for your items</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{calculateSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">GST (18%)</span>
                  <span className="font-medium">₹{calculateTax().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm pb-4 border-b border-gray-100">
                  <span className="text-gray-600">Delivery charges</span>
                  <span className="font-medium text-green-600">₹45.00</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-blue-900 pt-2">
                  <span>Grand Total</span>
                  <span>₹{calculateTotal().toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-3">
                <Button onClick={handleCheckout} className="w-full bg-blue-800 hover:bg-blue-900 text-white py-6">
                  Place Order
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Link href="/catalog" className="w-full text-center text-xs text-blue-600 hover:text-blue-800 font-medium">
                  Add more items
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
