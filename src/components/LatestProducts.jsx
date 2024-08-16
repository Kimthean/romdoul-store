import React, { useState, useEffect } from "react";
import { useAtom } from "jotai";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { directus } from "../lib/directus";
import { readItems } from "@directus/sdk";
import ProductCard from "./ProductCard";
import { cartAtom } from "../lib/atom";

const LatestProducts = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [, setCart] = useAtom(cartAtom);

  const addProduct = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item,
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
          sort: ["date_updated"],
          limit: 10,
        }),
      );
      if (componentMounted) {
        setData(products);
        setLoading(false);
      }
      return () => {
        componentMounted = false;
      };
    };

    getProduct();
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

  const ShowProducts = () => {
    return (
      <>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h2 className="mb-4">Latest Products</h2>
            </div>
          </div>
          <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-2 g-md-3 g-lg-4">
            {data.map((product) => (
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

export default LatestProducts;
