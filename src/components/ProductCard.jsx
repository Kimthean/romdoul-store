import React from "react";
import { Link } from "react-router-dom";
import getMedia from "../lib/getMedia";

const ProductCard = ({ product, addToCart }) => {
  return (
    <div className="col">
      <div className="card h-100 shadow">
        <div
          className="card-img-container position-relative"
          style={{ paddingTop: "100%" }}
        >
          <img
            src={getMedia(product.image)}
            alt=""
            className="card-img-top position-absolute top-0 start-0 w-80 h-100 object-fit-cover"
          />
        </div>
        <div className="card-body d-flex flex-column">
          <h5 className="card-title text-truncate">{product.product_name}</h5>
          <p className="card-text text-muted small">
            {product.category
              .map((cat) => cat.category_id?.name)
              .filter((name) => name)
              .join(", ")}
          </p>
          <div className="mt-auto">
            <span className="h5 d-block mb-2">${product.price}</span>
            <div className="d-flex flex-wrap gap-2">
              <button
                className="btn btn-outline-dark btn-sm flex-grow-1"
                onClick={() => addToCart(product)}
              >
                Add to Cart
              </button>
              <Link
                to={"/product/" + product.id}
                onClick={() => window.scrollTo(0, 0)}
                className="btn btn-dark btn-sm flex-grow-1"
              >
                View
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
