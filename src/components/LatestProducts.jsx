import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import ProductCard from "./ProductCard";
import { cartAtom } from "../lib/atom";
import { directus } from "../lib/directus";
import { readItems } from "@directus/sdk";

const fetchProducts = async () => {
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
    })
  );
  return products;
};

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

const LatestProducts = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["latestProducts"],
    queryFn: fetchProducts,
  });

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

  if (isLoading) {
    return (
      <div className="container my-5">
        <Loading />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

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
                addToCart={() => addProduct(product)}
              />
            ))}
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="container my-5">
      <ShowProducts />
    </div>
  );
};

export default LatestProducts;
