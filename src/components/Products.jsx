import React, { useState, useEffect } from "react";
import { useAtom } from "jotai";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { directus } from "../lib/directus";
import { readItems } from "@directus/sdk";
import ProductCard from "./ProductCard";
import { cartAtom } from "../lib/atom";

const Products = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState(data);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [, setCart] = useAtom(cartAtom);

  const addProduct = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prevCart, { ...product, qty: 1 }];
    });
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
        <div className="container">
          <div className="row">
            <div className="col-12">
              <Skeleton height={40} width={200} className="mb-4" />
            </div>
          </div>
          <div className="row mb-4">
            <div className="col-12">
              <div className="d-flex flex-wrap justify-content-center">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Skeleton key={n} width={80} height={38} className="m-2" />
                ))}
              </div>
            </div>
          </div>
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="col">
                <Skeleton height={500} />
              </div>
            ))}
          </div>
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
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h2 className="mb-4">Latest Products</h2>
            </div>
          </div>
          <div className="row mb-4">
            <div className="col-12">
              <div className="d-flex flex-wrap justify-content-center">
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
            </div>
          </div>
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {filter.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                addToCart={addProduct}
              />
            ))}
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <div className="container my-5">
        {loading ? <Loading /> : <ShowProducts />}
      </div>
    </>
  );
};

export default Products;
