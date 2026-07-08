import { ShoppingCart } from "lucide-react";
import { useCart } from "../stores/stores";

export default function Cart() {
  const cart = useCart(); // assuming this returns the array directly

  const totalPrice = cart.reduce((total, item) => {
    return total + item.price;
  }, 0);

  return (
    <div className="cart absolute top-20 right-20 w-96 bg-white rounded-2xl shadow-2xl overflow-hidden z-50 border border-gray-100">
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
                    <p className="font-semibold text-lg">{item.color.label}</p>
                    <p className="text-gray-600">{item.decal.label}</p>
                  </div>
                  <p className="font-medium text-amber-600">${item.price}</p>
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
    </div>
  );
}
