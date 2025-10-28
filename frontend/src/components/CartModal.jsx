import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import "../App.css";

const CartModal = ({ onClose }) => {
  const { cart, removeFromCart } = useContext(CartContext);
  const navigate = useNavigate();

  const total = cart.reduce(
    (sum, item) => sum + (item.Service?.price || 0) * item.quantity,
    0
  );

  return (
    <div className="modal-overlay">
      <div className="cart-modal">
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>
        <h2>Your Cart</h2>
        {cart.length === 0 ? (
          <p>No items in cart</p>
        ) : (
          <table className="cart-table">
            <thead>
              <tr>
                <th>Service</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.id}>
                  <td>{item.Service?.title}</td>
                  <td>₹{item.Service?.price}</td>
                  <td>{item.quantity}</td>
                  <td>
                    <button
                      onClick={() => {
                        removeFromCart(item.id);
                        Swal.fire("Removed!", "", "success");
                      }}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div className="cart-footer">
          <h3>Total: ₹{total}</h3>
          <button
            onClick={() => {
              if (cart.length === 0) {
                Swal.fire("Cart is empty", "Add some services first!", "info");
                return;
              }
              navigate(`/checkout/${cart[0].serviceId}`);
              onClose();
            }}
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartModal;
