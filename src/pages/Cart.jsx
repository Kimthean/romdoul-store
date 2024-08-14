import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { addCart, delCart } from "../redux/action";
import { Link } from "react-router-dom";
import getMedia from "../lib/getMedia";
import { Navbar } from "../components";

const Cart = () => {
  const state = useSelector((state) => state.handleCart);
  const dispatch = useDispatch();

  const EmptyCart = () => (
    <div className="container py-5 text-center">
      <h3 className="mb-4">Your Cart is Empty</h3>
      <Link to="/" className="btn btn-outline-dark px-4 py-2">
        <i className="fa fa-arrow-left me-2"></i>Continue Shopping
      </Link>
    </div>
  );

  const addItem = (product) => {
    dispatch(addCart(product));
  };

  const removeItem = (product) => {
    dispatch(delCart(product));
  };

  const CartItem = ({ item }) => (
    <div className="row mb-4 d-flex justify-content-between align-items-center">
      <div className="col-md-2 col-lg-2 col-xl-2">
        <img
          src={getMedia(item.image)}
          className="img-fluid rounded-3"
          alt={item.product_name}
        />
      </div>
      <div className="col-md-3 col-lg-3 col-xl-3">
        <h6 className="text-muted">{item.category[0].category_id.name}</h6>
        <h6 className="text-black mb-0">{item.product_name}</h6>
      </div>
      <div className="col-md-3 col-lg-3 col-xl-2 d-flex">
        <button className="btn px-2" onClick={() => removeItem(item)}>
          <i className="fas fa-minus"></i>
        </button>
        <input
          type="number"
          className="form-control form-control-sm text-center"
          value={item.qty}
          readOnly
        />
        <button className="btn px-2" onClick={() => addItem(item)}>
          <i className="fas fa-plus"></i>
        </button>
      </div>
      <div className="col-md-3 col-lg-2 col-xl-2 offset-lg-1">
        <h6 className="mb-0">
          ${parseFloat(item.price.replace(",", "")) * item.qty}
        </h6>
      </div>
      <div className="col-md-1 col-lg-1 col-xl-1 text-end">
        <a href="#!" className="text-muted">
          <i className="fas fa-times"></i>
        </a>
      </div>
    </div>
  );

  const ShowCart = () => {
    const subtotal = state.reduce(
      (acc, item) => acc + parseFloat(item.price.replace(",", "")) * item.qty,
      0
    );
    const shipping = 30.0;
    const totalItems = state.reduce((acc, item) => acc + item.qty, 0);

    return (
      <div className="container py-5">
        <div className="row d-flex justify-content-center my-4">
          <div className="col-md-8">
            <div className="card mb-4">
              <div className="card-header py-3">
                <h5 className="mb-0">Cart - {totalItems} items</h5>
              </div>
              <div className="card-body">
                {state.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card mb-4">
              <div className="card-header py-3">
                <h5 className="mb-0">Summary</h5>
              </div>
              <div className="card-body">
                <ul className="list-group list-group-flush">
                  <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                    Products
                    <span>${subtotal.toFixed(2)}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                    Shipping
                    <span>${shipping.toFixed(2)}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 mb-3">
                    <div>
                      <strong>Total amount</strong>
                    </div>
                    <span>
                      <strong>${(subtotal + shipping).toFixed(2)}</strong>
                    </span>
                  </li>
                </ul>
                <Link to="/checkout" className="btn btn-dark btn-lg btn-block">
                  Go to checkout
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div>
        <Navbar />
      </div>
      <div className="container-fluid my-3 py-3">
        <h1 className="text-center mb-4">Shopping Cart</h1>
        {state.length > 0 ? <ShowCart /> : <EmptyCart />}
      </div>
    </>
  );
};

export default Cart;
