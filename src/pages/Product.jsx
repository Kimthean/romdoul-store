import React, { useState, useCallback, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Footer, Navbar } from "../components";
import { directus } from "../lib/directus";
import { readItem, readItems } from "@directus/sdk";
import getMedia from "../lib/getMedia";
import ProductCard from "../components/ProductCard";
import { useAtom } from "jotai";
import { cartAtom } from "../lib/atom";

const fetchProduct = async ({ queryKey }) => {
  const [, id] = queryKey;
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
  return data;
};

const fetchSimilarProducts = async ({ queryKey }) => {
  const [, categoryId, id] = queryKey;
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
  return similarProductsData;
};

const Product = () => {
  const { id } = useParams();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: fetchProduct,
  });

  const { data: similarProducts, isLoading: isLoadingSimilar } = useQuery({
    queryKey: ["similarProducts", product?.category[0]?.category_id?.id, id],
    queryFn: fetchSimilarProducts,
    enabled: !!product?.category[0]?.category_id?.id,
  });

  const [isDescriptionExpanded, setDescriptionExpanded] = useState(false);

  const [, setCart] = useAtom(cartAtom);

  const addProduct = useCallback(
    (product) => {
      setCart((prevCart) => {
        const existingItem = prevCart.find((item) => item.id === product.id);
        if (existingItem) {
          return prevCart.map((item) =>
            item.id === product.id ? { ...item, qty: item.qty + 1 } : item
          );
        }
        return [...prevCart, { ...product, qty: 1 }];
      });
    },
    [setCart]
  );

  const maxLength = 300;

  const toggleDescription = () => {
    setDescriptionExpanded(!isDescriptionExpanded);
  };

  const description = isDescriptionExpanded
    ? product?.description
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
                alt={product.product_name}
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
                      .filter((name) => name)
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
              {product.description && (
                <>
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
                </>
              )}
            </div>
          </div>
        </div>
      </>
    );
  };

  const LoadingSimilar = () => {
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
        <div className="row">{isLoading ? <Loading /> : <ShowProduct />}</div>
        <div className="row my-5 py-5">
          {similarProducts?.length > 0 ? (
            <div>
              <h2>You may also Like</h2>
              <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 pt-4">
                {isLoadingSimilar ? <LoadingSimilar /> : <ShowSimilarProduct />}
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Product;
