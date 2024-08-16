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
        <div
          className="card-img-container position-relative"
          style={{ paddingTop: "100%" }}
        >
          {!imageLoaded && (
            <div className="position-absolute top-0 start-0 w-100 h-100">
              <Skeleton height="100%" baseColor="white" />
            </div>
          )}
          <img
            className={`card-img-top position-absolute top-0 start-0 w-80 h-100 object-fit-cover ${imageLoaded ? "loaded" : ""}`}
            src={getMedia(product.image)}
            alt={product.product_name}
            onLoad={handleImageLoad}
            style={{ display: imageLoaded ? "block" : "none" }}
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
