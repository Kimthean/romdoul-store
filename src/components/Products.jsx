import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addCart } from "../redux/action";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { directus } from "../lib/directus";
import { readItems } from "@directus/sdk";

import { Link } from "react-router-dom";
import getMedia from "../lib/getMedia";

const Products = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState(data);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const dispatch = useDispatch();

  const addProduct = (product) => {
    dispatch(addCart(product));
  };

  useEffect(() => {
    let componentMounted = true;

    const getProduct = async () => {
      setLoading(true);
      const products = await directus.request(
        readItems("products", {
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
      if (componentMounted) {
        setData(products);
        setFilter(products);
        setLoading(false);
      }
      return () => {
        componentMounted = false;
      };
    };

    const getCategories = async () => {
      const categories = await directus.request(
        readItems("category", {
          fields: ["*"],
        })
      );
      if (componentMounted) {
        setCategories(categories);
      }
    };

    getProduct();
    getCategories();
  }, []);

  const Loading = () => {
    return (
      <>
        <div className="col-12 py-5 text-center">
          <Skeleton height={40} width={560} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
      </>
    );
  };

  const filterProduct = (catName) => {
    const updatedList = data.filter((item) =>
      item.category.some((cat) => cat.category_id.name === catName)
    );
    setFilter(updatedList);
  };

  const ShowProducts = () => {
    return (
      <>
        <div className="buttons text-center py-5">
          <button
            className="btn btn-outline-dark btn-sm m-2"
            onClick={() => setFilter(data)}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              className="btn btn-outline-dark btn-sm m-2"
              onClick={() => filterProduct(category.name)}
            >
              {category.name}
            </button>
          ))}
        </div>

        {filter.map((product) => {
          return (
            <div
              id={product.id}
              key={product.id}
              className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4"
            >
              <div className="card text-center h-100" key={product.id}>
                <img
                  className="card-img-top img-fluid p-3"
                  src={getMedia(product.image)}
                  alt="Card"
                  height={300}
                />
                <div className="card-body">
                  <h5 className="card-title">{product.product_name}</h5>
                </div>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item lead">$ {product.price}</li>
                  <li className="list-group-item">
                    Categories:{" "}
                    {product.category
                      .map((cat) => cat.category_id.name)
                      .join(", ")}
                  </li>
                </ul>
                <div className="card-body">
                  <Link
                    to={"/product/" + product.id}
                    className="btn btn-dark m-1"
                  >
                    Buy Now
                  </Link>
                  <button
                    className="btn btn-dark m-1"
                    onClick={() => addProduct(product)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </>
    );
  };

  return (
    <>
      <div className="container my-3 py-3">
        <div className="row">
          <div className="col-12">
            <h2 className="display-5 text-center">Latest Products</h2>
            <hr />
          </div>
        </div>
        <div className="row justify-content-center">
          {loading ? <Loading /> : <ShowProducts />}
        </div>
      </div>
    </>
  );
};

export default Products;
