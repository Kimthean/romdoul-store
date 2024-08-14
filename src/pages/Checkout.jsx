import React, { useState } from "react";
import { Footer, Navbar } from "../components";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Checkout = () => {
  const state = useSelector((state) => state.handleCart);
  const [step, setStep] = useState(1);

  const EmptyCart = () => {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-12 py-5 bg-light text-center">
            <h4 className="p-3 display-5">No item in Cart</h4>
            <Link to="/" className="btn btn-outline-dark mx-4">
              <i className="fa fa-arrow-left"></i> Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  };

  const ShowCheckout = () => {
    const subtotal = state.reduce(
      (acc, item) => acc + parseFloat(item.price.replace(",", "")) * item.qty,
      0
    );
    const shipping = 30.0;

    const OrderSummary = () => (
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <h5 className="card-title mb-4">Order Summary</h5>
          {state.map((item) => (
            <div key={item.id} className="d-flex justify-content-between mb-2">
              <span>
                {item.product_name} (x{item.qty})
              </span>
              <span>${parseFloat(item.price.replace(",", "")) * item.qty}</span>
            </div>
          ))}
          <hr />
          <div className="d-flex justify-content-between mb-2">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="d-flex justify-content-between mb-2">
            <span>Shipping</span>
            <span>${shipping.toFixed(2)}</span>
          </div>
          <hr />
          <div className="d-flex justify-content-between mb-2">
            <strong>Total</strong>
            <strong>${(subtotal + shipping).toFixed(2)}</strong>
          </div>
        </div>
      </div>
    );

    const BillingForm = () => (
      <form className="needs-validation" noValidate>
        <div className="row g-3">
          <div className="col-sm-6">
            <label htmlFor="firstName" className="form-label">
              First name
            </label>
            <input
              type="text"
              className="form-control"
              id="firstName"
              required
            />
          </div>
          <div className="col-sm-6">
            <label htmlFor="lastName" className="form-label">
              Last name
            </label>
            <input
              type="text"
              className="form-control"
              id="lastName"
              required
            />
          </div>
          <div className="col-12">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="col-12">
            <label htmlFor="address" className="form-label">
              Address
            </label>
            <input
              type="text"
              className="form-control"
              id="address"
              placeholder="1234 Main St"
              required
            />
          </div>
          <div className="col-md-5">
            <label htmlFor="country" className="form-label">
              Country
            </label>
            <select className="form-select" id="country" required>
              <option value="">Choose...</option>
              <option>United States</option>
            </select>
          </div>
          <div className="col-md-4">
            <label htmlFor="state" className="form-label">
              State
            </label>
            <select className="form-select" id="state" required>
              <option value="">Choose...</option>
              <option>California</option>
            </select>
          </div>
          <div className="col-md-3">
            <label htmlFor="zip" className="form-label">
              Zip
            </label>
            <input type="text" className="form-control" id="zip" required />
          </div>
        </div>
      </form>
    );

    const PaymentForm = () => (
      <form className="needs-validation" noValidate>
        <div className="row gy-3">
          <div className="col-md-6">
            <label htmlFor="cc-name" className="form-label">
              Name on card
            </label>
            <input type="text" className="form-control" id="cc-name" required />
            <small className="text-muted">Full name as displayed on card</small>
          </div>
          <div className="col-md-6">
            <label htmlFor="cc-number" className="form-label">
              Credit card number
            </label>
            <input
              type="text"
              className="form-control"
              id="cc-number"
              required
            />
          </div>
          <div className="col-md-3">
            <label htmlFor="cc-expiration" className="form-label">
              Expiration
            </label>
            <input
              type="text"
              className="form-control"
              id="cc-expiration"
              required
            />
          </div>
          <div className="col-md-3">
            <label htmlFor="cc-cvv" className="form-label">
              CVV
            </label>
            <input type="text" className="form-control" id="cc-cvv" required />
          </div>
        </div>
      </form>
    );

    return (
      <div className="container py-5">
        <div className="row">
          <div className="col-md-4 order-md-2 mb-4">
            <OrderSummary />
          </div>
          <div className="col-md-8 order-md-1">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h4 className="mb-3">
                  {step === 1 ? "Billing Details" : "Payment Information"}
                </h4>
                {step === 1 ? <BillingForm /> : <PaymentForm />}
                <hr className="my-4" />
                <div className="d-flex justify-content-between">
                  {step > 1 && (
                    <button
                      className="btn btn-secondary"
                      onClick={() => setStep(step - 1)}
                    >
                      Back
                    </button>
                  )}
                  <button
                    className="btn btn-primary"
                    onClick={() =>
                      step === 1 ? setStep(2) : alert("Order placed!")
                    }
                  >
                    {step === 1 ? "Continue to Payment" : "Place Order"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <div className="container my-3 py-3">
        <h1 className="text-center mb-4">Checkout</h1>
        <div className="progress mb-4" style={{ height: "5px" }}>
          <div
            className="progress-bar bg-primary"
            role="progressbar"
            style={{ width: step === 1 ? "50%" : "100%" }}
            aria-valuenow={step === 1 ? 50 : 100}
            aria-valuemin="0"
            aria-valuemax="100"
          ></div>
        </div>
        <div className="d-flex justify-content-between mb-5">
          <span className={`text-${step === 1 ? "primary" : "muted"}`}>
            Billing
          </span>
          <span className={`text-${step === 2 ? "primary" : "muted"}`}>
            Payment
          </span>
          <span className="text-muted">Confirmation</span>
        </div>
        {state.length ? <ShowCheckout /> : <EmptyCart />}
      </div>
      <Footer />
    </>
  );
};

export default Checkout;
