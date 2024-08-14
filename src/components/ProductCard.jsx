import React from "react";
import { Link } from "react-router-dom";
import getMedia from "../lib/getMedia";

const ProductCard = ({ product, addToCart }) => {
  return (
    <div className="col">
      <div className="card h-100 shadow-sm product-card">
        <div className="image-container">
          <img
            className="card-img-top"
            src={getMedia(product.image)}
            alt={product.product_name}
          />
          <div className="overlay">
            <button
              className="btn btn-light btn-sm quick-view"
              onClick={() => addToCart(product)}
            >
              Add to Cart
            </button>
          </div>
        </div>
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{product.product_name}</h5>
          <p className="card-text text-muted">
            {product.category.map((cat) => cat.category_id.name).join(", ")}
          </p>
          <div className="d-flex justify-content-between align-items-center mt-auto">
            <span className="price">${product.price}</span>
            <Link to={"/product/" + product.id} className="btn btn-dark">
              Buy Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
