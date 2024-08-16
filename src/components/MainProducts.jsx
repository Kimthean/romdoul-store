import React, { useState, useEffect, useMemo, useRef } from "react";
import { useAtom } from "jotai";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { directus } from "../lib/directus";
import { readItems } from "@directus/sdk";
import ProductCard from "./ProductCard";
import { cartAtom } from "../lib/atom";
import { FaSearch } from "react-icons/fa";

const MainProducts = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [priceRange, setPriceRange] = useState({ min: 0, max: Infinity });
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [, setCart] = useAtom(cartAtom);

  const searchInputRef = useRef(null);

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
              brand: ["*"],
            },
          ],
        }),
      );

      if (componentMounted) {
        setData(products);
        setLoading(false);
      }
    };

    const getCategories = async () => {
      const categories = await directus.request(
        readItems("category", {
          fields: ["*"],
        }),
      );
      if (componentMounted) {
        setCategories(categories);
      }
    };

    const getBrands = async () => {
      const brands = await directus.request(
        readItems("brand", {
          fields: ["*"],
        }),
      );
      if (componentMounted) {
        setBrands(brands);
      }
    };

    getProduct();
    getCategories();
    getBrands();

    return () => {
      componentMounted = false;
    };
  }, []);

  const filteredAndSortedProducts = useMemo(() => {
    let result = data;

    if (selectedCategory) {
      result = result.filter((item) =>
        item.category.some((cat) => cat.category_id.name === selectedCategory),
      );
    }

    if (selectedBrand) {
      result = result.filter(
        (item) => item.brand && item.brand.name === selectedBrand,
      );
    }

    result = result.filter((item) => {
      const price = parseFloat(item.price.replace(/,/g, ""));
      return (
        price >= priceRange.min &&
        price <=
          (priceRange.max === Infinity
            ? Number.MAX_SAFE_INTEGER
            : priceRange.max)
      );
    });

    if (searchQuery) {
      const lowercaseQuery = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.product_name.toLowerCase().includes(lowercaseQuery) ||
          (item.description &&
            item.description.toLowerCase().includes(lowercaseQuery)),
      );
    }

    result.sort((a, b) => {
      let comparison = 0;
      if (sortBy === "name") {
        comparison = a.product_name.localeCompare(b.product_name);
      } else if (sortBy === "price") {
        const priceA = parseFloat(a.price.replace(/,/g, ""));
        const priceB = parseFloat(b.price.replace(/,/g, ""));
        comparison = priceA - priceB;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return result;
  }, [
    data,
    selectedCategory,
    selectedBrand,
    priceRange,
    searchQuery,
    sortBy,
    sortOrder,
  ]);

  const handleSearch = (e) => {
    const searchQuery = searchInputRef.current.value;
    setSearchQuery(searchQuery);
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handlePriceRangeChange = (e) => {
    const { name, value } = e.target;
    setPriceRange((prev) => ({
      ...prev,
      [name]: value ? parseFloat(value) : name === "min" ? 0 : Infinity,
    }));
  };

  const Loading = () => {
    return (
      <div className="container">
        <div className="row">
          <div className="col-12">
            <Skeleton height={50} width={300} className="mb-4" />
          </div>
        </div>
        <div className="row mb-4">
          <div className="col-12 col-md-4 mb-3">
            <Skeleton height={40} />
          </div>
          <div className="col-12 col-md-4 mb-3">
            <Skeleton height={40} />
          </div>
          <div className="col-12 col-md-4 mb-3">
            <Skeleton height={40} />
          </div>
        </div>
        <div className="row">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="col-12 col-md-6 col-lg-4 mb-4">
              <Skeleton height={400} />
            </div>
          ))}
        </div>
      </div>
    );
  };

  const ShowProducts = () => {
    return (
      <>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h2 className="mb-4">Products</h2>
            </div>
          </div>
          <div className="filter-container">
            <div className="search-container">
              <div className="input-group">
                <span className="input-group-text">
                  <FaSearch />
                </span>
                <input
                  type="text"
                  className="form-control search-input"
                  placeholder="Search products..."
                  ref={searchInputRef}
                  onKeyDown={onKeyDown}
                />
                <button
                  className="btn btn-search"
                  type="button"
                  onClick={handleSearch}
                >
                  Search
                </button>
              </div>
            </div>
            <div className="filter-row">
              <div className="filter-item">
                <select
                  className="form-select"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="filter-item">
                <select
                  className="form-select"
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                >
                  <option value="">All Brands</option>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.name}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="filter-item">
                <div className="price-range">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Min Price"
                    name="min"
                    value={priceRange.min}
                    onChange={handlePriceRangeChange}
                  />
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Max Price"
                    name="max"
                    value={priceRange.max === Infinity ? "" : priceRange.max}
                    onChange={handlePriceRangeChange}
                  />
                </div>
              </div>
              <div className="filter-item">
                <select
                  className="form-select"
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [newSortBy, newSortOrder] = e.target.value.split("-");
                    setSortBy(newSortBy);
                    setSortOrder(newSortOrder);
                  }}
                >
                  <option value="name-asc">Name (A-Z)</option>
                  <option value="name-desc">Name (Z-A)</option>
                  <option value="price-asc">Price (Low to High)</option>
                  <option value="price-desc">Price (High to Low)</option>
                </select>
              </div>
            </div>
          </div>
          <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-2 g-md-3 g-lg-4">
            {filteredAndSortedProducts.map((product) => (
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
    <div className="container my-5">
      {loading ? <Loading /> : <ShowProducts />}
    </div>
  );
};

export default MainProducts;
