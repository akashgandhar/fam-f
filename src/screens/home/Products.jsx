import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col } from "react-bootstrap";
import styled from "styled-components";
import axios from "axios";
import toast from "react-hot-toast";
import Header from "../../components/header";
import { useNavigate, NavLink } from "react-router-dom";
import { shuffle } from "lodash";
import Loader from "../../components/loader";
import {
  showCheckOutAction,
  showProductsCheckoutAction,
  loaderAction,
} from "../../redux/actions/global";
import CheckoutForProducts from "../Components/CheckoutForProducts";
import { ProductContext } from "../../context/ProductContext";
import { useFrameContext } from "../../context/FrameContext";
import ProductInfoModel from "../../components/ProductModel";

const ProductCard = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
  text-align: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: translateY(-3px);
  }

  @media (max-width: 768px) {
    margin-bottom: 10px;
  }

  img {
    max-width: 100%;
    height: 200px;
    object-fit: cover;
    margin-bottom: 10px;
    border-radius: 4px;
  }

  h4 {
    margin-bottom: 5px;
  }

  .btn {
    margin-top: 10px;
  }
`;

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { selectedProduct, setSelectedProduct } = useContext(ProductContext);
  const [framesPreset, setFramesPreset] = useFrameContext(); // Get framesPreset and setFramesPreset from context
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState([
    "product",
    "frame",
  ]);

  const [isOpen, setIsOpen] = useState(false);

  const [sortQuery, setSortQuery] = useState(""); // State to store the sort option
  const [isOpenSort, setIsOpenSort] = useState(false); // State to control the sort dropdown


  function SortArray(arr, query) {
    if (!query || query === 'relevance') {
      return arr; // No sorting or default to original order for 'relevance'
    }
  
    const sortedArr = [...arr]; // Create a copy to avoid mutating the original
  
    if (query === 'price_asc') {
      sortedArr.sort((a, b) => a.price - b.price); // Assuming each item has a 'price' property
    } else if (query === 'price_desc') {
      sortedArr.sort((a, b) => b.price - a.price);
    } 
    // Add more sorting logic for other potential query values as needed
  
    return sortedArr;
  }

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/getAllFrameNumbers"
        );
        setProducts(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to fetch products");
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleBuyNow = (item) => {};

  const handleAddToCart = (numberOfFrames) => {
    window.localStorage.setItem("FramesNumber", numberOfFrames);
    window.location.href = "/frames";
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <div className="text-center my-5 text-danger">Error: {error}</div>;
  }

  const displayedProducts = shuffle(products);

  // const handleBuyNowClick = async (product) => {
  //     console.log('product', product);
  //     setSelectedProduct(product);

  //     try {
  //         const response = await axios.post('http://localhost:8000/order/bookprod', {
  //             product: product, // Use the product passed to the function
  //             address: 'address',
  //             paymentType: 'online'
  //         });

  //         console.log('Response from server:', response.data);

  //         // Check if the response contains a redirect URL
  //         let { data } = response
  //         if (data.success) {

  //             if (data?.data?.isFree) {

  //                 window.location.href = `https://familyvibes.in/thank-you?type=order&order_id=${data?.data?.id}`
  //             }
  //             data = data?.data?.data
  //             let urlInfo = data?.instrumentResponse?.redirectInfo;
  //             if (urlInfo) {
  //                 window.location.href = urlInfo?.url;
  //             }
  //         }
  //         else {
  //             alert("Payment initiate error.");
  //         }

  //     } catch (error) {
  //         alert("Server error. Are you online under? " + error?.message);
  //         // dispatch(loaderAction(false));
  //         return;
  //     }
  // };
  const handleBuyNowClick = async (product) => {
    //navigate to /checkout
    setSelectedProduct(product);
    navigate("/checkout");
  };

  const handleSelectChange = (value) => {
    setSelectedCategory(
      selectedCategory.includes(value)
        ? selectedCategory.filter((category) => category !== value)
        : [...selectedCategory, value]
    );
  };

  return (
    <>
      <Header showCheckout={false} />
      <section id="products" className="w-100">
        <div className="frame-main h-100">
          <div
            id="mainFrameScrollContainer"
            className="h-100"
            style={{ overflowX: "hidden" }}
          >
            <h1 className="text-center my-5">All Products</h1>
            <div
              style={{
                width: "100%",
                borderRadius: "0.5rem",
                padding: "1rem",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "1rem",

                // maxWidth: "20rem",
                marginBottom: "1rem",
              }}
            >
              <div>
                {/* <h2
                  style={{
                    fontFamily: "os",
                    fontSize: "1.25rem",
                    fontWeight: "bold",
                  }}
                >
                  Categories
                </h2> */}

                <div style={{ position: "relative" }}>
                  {" "}
                  {/* Container for dropdown */}
                  <div
                    onClick={() => setIsOpen(!isOpen)}
                    style={{
                      cursor: "pointer",
                      padding: "0.5rem 0.75rem",
                      border: "1px solid #7e3af2",
                      borderRadius: "0.25rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    Select Categories
                    <span>{isOpen ? "▲" : "▼"}</span> {/* Dropdown arrow */}
                  </div>
                  {isOpen && (
                    <ul
                      style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        width: "100%",
                        backgroundColor: "white",
                        border: "1px solid #7e3af2",
                        borderRadius: "0.25rem",
                        padding: 0,
                        margin: 0,
                        listStyle: "none",
                        zIndex: 1, // Ensure it's on top
                      }}
                    >
                      <li
                        onClick={() => handleSelectChange("frame")}
                        style={{
                          padding: "0.5rem",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={selectedCategory.includes("frame")}
                          onChange={() => {}} // Prevent default checkbox behavior
                          style={{ marginRight: "0.5rem" }}
                        />
                        Frames
                      </li>
                      <li
                        onClick={() => handleSelectChange("product")}
                        style={{
                          padding: "0.5rem",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={selectedCategory.includes("product")}
                          onChange={() => {}}
                          style={{ marginRight: "0.5rem" }}
                        />
                        Products
                      </li>
                      {/* Add more options as needed */}
                    </ul>
                  )}
                </div>
              </div>

              <div>
                {/* <h2
                  style={{
                    fontFamily: "os",
                    fontSize: "1.25rem",
                    fontWeight: "bold",
                  }}
                >
                  Sort By
                </h2> */}

                <div style={{ position: "relative",  }}>
                  {" "}
                  {/* Sort by dropdown */}
                  <div
                    onClick={() => setIsOpenSort(!isOpenSort)}
                    style={{
                      cursor: "pointer",
                      padding: "0.5rem 0.75rem",
                      border: "1px solid #7e3af2",
                      borderRadius: "0.25rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    Sort By: {sortQuery || "Select"}{" "}
                    {/* Display selected option or default text */}
                    <span>{isOpenSort ? "▲" : "▼"}</span>
                  </div>
                  {isOpenSort && (
                    <ul
                      style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        width: "100%",
                        backgroundColor: "white",
                        border: "1px solid #7e3af2",
                        borderRadius: "0.25rem",
                        padding: 0,
                        margin: 0,
                        listStyle: "none",
                        zIndex: 1,
                      }}
                    >
                      <li
                        onClick={() => {
                          setSortQuery("relevance");
                          setIsOpenSort(false);
                        }}
                        style={{
                          padding: "0.5rem",
                          cursor: "pointer",
                        }}
                      >
                        Relevance
                      </li>
                      <li
                        onClick={() => {
                          setSortQuery("price_asc");
                          setIsOpenSort(false);
                        }}
                        style={{
                          padding: "0.5rem",
                          cursor: "pointer",
                        }}
                      >
                        Price (Low to High)
                      </li>
                      <li
                        onClick={() => {
                          setSortQuery("price_desc");
                          setIsOpenSort(false);
                        }}
                        style={{
                          padding: "0.5rem",
                          cursor: "pointer",
                        }}
                      >
                        Price (High to Low)
                      </li>
                      {/* Add more sort options as needed */}
                    </ul>
                  )}
                </div>
              </div>

              {/* <ul
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  flexWrap: "wrap",
                  marginTop: "1rem",
                }}
              >
                <li style={{ flex: "1", margin: "0.25rem" }}>
                  <a
                    style={{
                      cursor: "pointer",
                      padding: "0.5rem 0.75rem",
                      border: "1px solid #7e3af2", // purple-800
                      marginBottom: "1rem",
                      borderRadius: "0.25rem",
                      fontWeight: "500",
                      backgroundColor: selectedCategory.includes("frame")
                        ? "rgba(143, 98, 172, 0.15)"
                        : "transparent", // purple-400/25
                      color: "#7e3af2", // purple-800
                      textDecoration: "none", // Ensure it looks like a link
                      display: "inline-block", // For better hover behavior
                      transition: "background-color 0.3s, border-color 0.3s", // Smooth hover effect
                    }}
                    onClick={() =>
                      setSelectedCategory(
                        selectedCategory.includes("frame")
                          ? selectedCategory.filter(
                              (category) => category !== "frame"
                            )
                          : [...selectedCategory, "frame"]
                      )
                    }
                  >
                    Frames
                  </a>
                </li>
                <li style={{ flex: "1", margin: "0.25rem" }}>
                  <a
                    style={{
                      cursor: "pointer",
                      padding: "0.5rem 0.75rem",
                      border: "1px solid #7e3af2", // purple-800
                      marginBottom: "1rem",
                      borderRadius: "0.25rem",
                      fontWeight: "500",
                      backgroundColor: selectedCategory.includes("product")
                        ? "rgba(143, 98, 172, 0.15)"
                        : "transparent", // purple-400/25
                      color: "#7e3af2", // purple-800
                      textDecoration: "none",
                      display: "inline-block",
                      transition: "background-color 0.3s, border-color 0.3s",
                    }}
                    onClick={() =>
                      setSelectedCategory(
                        selectedCategory.includes("product")
                          ? selectedCategory.filter(
                              (category) => category !== "product"
                            )
                          : [...selectedCategory, "product"]
                      )
                    }
                  >
                    Products
                  </a>
                </li>
              </ul> */}
            </div>

            <Row style={{ flexWrap: "wrap" }}>
              {SortArray(displayedProducts, sortQuery)
                ?.filter((product) => selectedCategory.includes(product.type))
                .map((product) => (
                  <Col key={product._id} xs={12} sm={6} md={4} lg={3}>
                    <ProductInfoModel data={product}>
                      <ProductCard>
                        <img src={product.imageUrl} alt={product.name} />
                        <h4>
                          {product.type === "frame"
                            ? `${product.numberOfFrames} Frames`
                            : product.name}
                        </h4>
                        <p className="text-muted">{product.description}</p>
                        <p>
                          Price: ₹ {product.price}{" "}
                          {product?.comparePrice && (
                            <span
                              id="compare price"
                              style={{
                                textDecoration: "line-through",
                                color: "#f65514",
                                marginLeft: "2px",
                              }}
                            >
                              ₹ {product?.comparePrice}
                            </span>
                          )}
                        </p>
                        <button
                          onClick={() =>
                            product.type === "product"
                              ? handleBuyNowClick(product)
                              : handleAddToCart(product.numberOfFrames)
                          } // Call handleAddToCart for frames
                          className="btn btn-orange rounded-pill"
                        >
                          {product.type === "frame" ? "Add to Cart" : "Buy Now"}
                        </button>
                      </ProductCard>
                    </ProductInfoModel>
                  </Col>
                ))}
            </Row>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProductsPage;
