"use client";

import { useState } from "react";

import { X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "../context/CartContext";

export default function CartDrawer() {
  const [open, setOpen] = useState(false);
  const { cartItems, removeFromCart, clearCart } = useCart();

  const total = cartItems.reduce((acc, item) => acc + (item.price || 0), 0);

  return (
    <>
      {/* Floating cart icon */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-orange-500 text-white p-3 rounded-full shadow-lg hover:bg-orange-600 transition"
      >
        🛒 <span className="ml-1">{cartItems.length}</span>
      </button>

      {/* Drawer */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40"
          onClick={() => setOpen(false)}
        >
          <div
            className="fixed right-0 top-0 h-full w-80 bg-white dark:bg-zinc-900 text-black dark:text-white shadow-lg p-4 z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Your Cart</h2>
              <button onClick={() => setOpen(false)}>
                <X size={20} />
              </button>
            </div>

            {cartItems.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Your cart is empty.
              </p>
            ) : (
              <>
                <ul className="space-y-4 overflow-y-auto max-h-[60vh]">
                  {cartItems.map((item, index) => (
                    <li
                      key={index}
                      className="flex gap-3 items-center border-b pb-2"
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-12 h-12 object-contain rounded"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.title}</p>
                        <p className="text-xs text-muted-foreground">
                          ${item.price?.toFixed(2)}
                        </p>
                      </div>
                      <button
                        className="text-red-500 hover:text-red-600"
                        onClick={() => removeFromCart(index)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </li>
                  ))}
                </ul>

                <div className="mt-4">
                  <div className="flex justify-between items-center text-sm font-medium mb-2">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>

                  <Button
                    className="w-full mb-2"
                    onClick={clearCart}
                    variant="destructive"
                  >
                    Clear Cart
                  </Button>
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    Checkout
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
