import React, { useState } from "react";
import { Link } from "react-router-dom";
import getMedia from "../lib/getMedia";
import Skeleton from "react-loading-skeleton";

const ProductCard = ({ product, addToCart }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <div className="col">
      <div className="card h-100 shadow">
        {!imageLoaded && (
          <div className="card-img-top ">
            <Skeleton height={348} baseColor="white" />
          </div>
        )}
        <img
          className={`card-img-top ${imageLoaded ? "loaded" : ""}`}
          src={getMedia(product.image)}
          alt={product.product_name}
          onLoad={handleImageLoad}
          style={{ display: imageLoaded ? "block" : "none" }}
        />
        <div className="card-body">
          <h5 className="card-title">{product.product_name}</h5>
          <p className="card-text text-muted">
            {product.category
              .map((cat) => cat.category_id?.name)
              .filter((name) => name)
              .join(", ")}
          </p>
          <div className="d-flex justify-content-between align-items-center">
            <span className="h5">${product.price}</span>
            <div>
              <button
                className="btn btn-outline-dark btn-sm me-2"
                onClick={() => addToCart(product)}
              >
                Add to Cart
              </button>
              <Link
                to={"/product/" + product.id}
                className="btn btn-dark btn-sm"
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
