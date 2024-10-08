import React, { useMemo } from "react";
import { NavLink } from "react-router-dom";
import { useAtom } from "jotai";
import { cartAtom } from "../lib/atom";

const Navbar = () => {
  const [cart] = useAtom(cartAtom);
  const cartCount = cart.reduce((total, item) => total + item.qty, 0);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light sticky-top">
      <div className="container">
        <NavLink className="navbar-brand fw-bold fs-4" to="/">
          <img
            src="/assets/logo.png"
            alt="logo"
            width={100}
            className="nav-logo"
          />{" "}
          Romdoul Shop
        </NavLink>
        <button
          className="navbar-toggler mx-2"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav m-auto my-2 text-center">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/product">
                Products
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/about">
                About
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/contact">
                Contact
              </NavLink>
            </li>
          </ul>
          <div className="buttons text-center">
            <NavLink to="/cart" className="btn btn-outline-dark m-4">
              <i className="fa fa-cart-shopping mr-1"></i> Cart ({cartCount})
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
