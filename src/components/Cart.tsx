import { useRef, useEffect } from "react";
import { ShoppingCart } from "lucide-react";
import { useCart, useCartOpen, useShirtActions } from "../stores/stores";
import { AnimatePresence, motion } from "motion/react";

export default function Cart() {
  const cart = useCart();
  const isOpen = useCartOpen();
  const { closeCart } = useShirtActions();
  const cartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (cartRef.current && !cartRef.current.contains(e.target as Node)) {
        closeCart();
      }
    };

    // Cart.tsx — in the useEffect
    document.addEventListener("pointerdown", handleClickOutside);
    return () =>
      document.removeEventListener("pointerdown", handleClickOutside);
  }, [isOpen, closeCart]);

  const totalPrice = cart.reduce((total, item) => total + item.price, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={cartRef}
          initial={{ opacity: 0, y: -10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.98 }}
          transition={{ duration: 0.2 }}
          className="cart absolute top-20 right-20 w-96 bg-white rounded-2xl shadow-2xl overflow-hidden z-50 border border-gray-100 pointer-events-auto"
        >
          {/* Header */}
          <div className="bg-linear-to-r from-amber-600 to-amber-700 text-white p-5 flex items-center gap-3">
            <ShoppingCart size={24} />
            <h2 className="text-xl font-semibold">Your Cart ({cart.length})</h2>
          </div>

          <div className="max-h-[65vh] overflow-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <ShoppingCart size={48} className="mx-auto mb-4 opacity-30" />
                <p>Your cart is empty</p>
              </div>
            ) : (
              <>
                {cart.map((item, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between">
                      <div>
                        <p className="font-semibold text-lg">
                          {item.color.label}
                        </p>
                        <p className="text-gray-600">{item.decal.label}</p>
                      </div>
                      <p className="font-medium text-amber-600">
                        ${item.price}
                      </p>
                    </div>

                    {/* Share Link */}
                    <a
                      href={window.location.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-amber-600 hover:underline mt-2 inline-block"
                    >
                      🔗 Share this design
                    </a>
                  </div>
                ))}

                {/* Total & Checkout */}
                <div className="pt-6 border-t border-gray-200 mt-4">
                  <div className="flex justify-between items-center mb-6 px-1">
                    <span className="text-xl font-semibold">Total</span>
                    <span className="text-3xl font-bold text-amber-600">
                      ${totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
