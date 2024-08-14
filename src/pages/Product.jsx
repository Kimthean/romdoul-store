import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { Link, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addCart } from "../redux/action";

import { Footer, Navbar } from "../components";
import { directus } from "../lib/directus";
import { readItem, readItems } from "@directus/sdk";
import getMedia from "../lib/getMedia";
import ProductCard from "../components/ProductCard";

const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [isDescriptionExpanded, setDescriptionExpanded] = useState(false);

  const dispatch = useDispatch();

  const addProduct = (product) => {
    dispatch(addCart(product));
  };

  useEffect(() => {
    const getProduct = async () => {
      setLoading(true);
      setLoading2(true);
      const data = await directus.request(
        readItem("products", id, {
          fields: [
            "*",
            {
              category: [
                {
                  category_id: ["*"],
                },
              ],
            },
          ],
        })
      );

      setProduct(data);
      setLoading(false);

      const categoryId = data.category[0].category_id.id;
      const similarProductsData = await directus.request(
        readItems("products", {
          filter: {
            category: {
              category_id: {
                _eq: categoryId,
              },
            },
            id: {
              _neq: id,
            },
          },
          fields: [
            "*",
            {
              category: [
                {
                  category_id: ["*"],
                },
              ],
            },
          ],
        })
      );
      setSimilarProducts(similarProductsData);
      setLoading2(false);
    };
    getProduct();
  }, [id]);

  const maxLength = 300;

  const toggleDescription = () => {
    setDescriptionExpanded(!isDescriptionExpanded);
  };

  const description = isDescriptionExpanded
    ? product.description
    : product?.description?.substring(0, maxLength) + "...";

  const Loading = () => {
    return (
      <>
        <div className="container my-5 py-2">
          <div className="row">
            <div className="col-md-6 py-3">
              <Skeleton height={400} width={400} />
            </div>
            <div className="col-md-6 py-5">
              <Skeleton height={30} width={250} />
              <Skeleton height={90} />
              <Skeleton height={40} width={70} />
              <Skeleton height={50} width={110} />
              <Skeleton height={120} />
              <Skeleton height={40} width={110} inline={true} />
              <Skeleton className="mx-3" height={40} width={110} />
            </div>
          </div>
        </div>
      </>
    );
  };

  const ShowProduct = () => {
    return (
      <>
        <div className="container my-2 py-2">
          <div className="row">
            <div className="col-md-6 col-sm-12 py-3">
              <img
                className="img-fluid"
                src={getMedia(product.image)}
                alt={product.title}
                width="500px"
                height="500px"
              />
            </div>
            <div className="col-md-6 col-md-6 py-5">
              <h1 className="display-5">{product.product_name}</h1>
              <p className="text-uppercase text-muted">
                Categories:{" "}
                {product.category
                  ? product.category
                      .map((cat) => cat.category_id.name)
                      .join(", ")
                  : "No categories available"}
              </p>
              <h3 className="display-6 my-4">${product.price}</h3>
              <button
                className="btn btn-outline-dark"
                onClick={() => addProduct(product)}
              >
                Add to Cart
              </button>
              <Link to="/cart" className="btn btn-dark mx-3">
                Go to Cart
              </Link>
              <p
                dangerouslySetInnerHTML={{ __html: description }}
                className="pt-4"
              ></p>
              <button
                onClick={toggleDescription}
                type="button"
                className="btn btn-light"
              >
                {isDescriptionExpanded ? "Show Less" : "Show More"}
              </button>
            </div>
          </div>
        </div>
      </>
    );
  };

  const Loading2 = () => {
    return (
      <>
        <div className="my-4 py-4">
          <div className="d-flex">
            <div className="mx-4">
              <Skeleton height={400} width={250} />
            </div>
            <div className="mx-4">
              <Skeleton height={400} width={250} />
            </div>
            <div className="mx-4">
              <Skeleton height={400} width={250} />
            </div>
            <div className="mx-4">
              <Skeleton height={400} width={250} />
            </div>
          </div>
        </div>
      </>
    );
  };

  const ShowSimilarProduct = () => {
    return (
      <>
        {similarProducts.map((product) => {
          return (
            <ProductCard
              key={product.id}
              product={product}
              addToCart={addProduct}
            />
          );
        })}
      </>
    );
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="row">{loading ? <Loading /> : <ShowProduct />}</div>
        <div className="row my-5 py-5">
          <div>
            <h2>You may also Like</h2>
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 pt-4">
              {loading2 ? <Loading2 /> : <ShowSimilarProduct />}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Product;
