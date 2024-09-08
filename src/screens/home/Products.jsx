import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import styled from 'styled-components';
import axios from 'axios';
import toast from 'react-hot-toast';
import Header from '../../components/header';
import { useNavigate, NavLink } from 'react-router-dom';
import { shuffle } from 'lodash';
import Loader from '../../components/loader';
import { showCheckOutAction, showProductsCheckoutAction, loaderAction } from '../../redux/actions/global';
import CheckoutForProducts from '../Components/CheckoutForProducts';
import { ProductContext } from '../../context/ProductContext';

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
    const { selectedProduct , setSelectedProduct } = useContext(ProductContext);
    const navigate = useNavigate();


    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:8000/getAllFrameNumbers');
                setProducts(response.data);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching products:', error);
                setError('Failed to fetch products');
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleBuyNow = (item) => {

    };

    const handleAddToCart = (item) => {
        navigate('/frames');
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
        setSelectedProduct(product)
        navigate('/checkout');
    };

    return (
        <>
            <Header showCheckout={false} />
            <section className='w-100'>
                <div className="frame-main h-100">
                    <div id='mainFrameScrollContainer' className="h-100" style={{ overflowX: 'hidden' }}>
                        <h1 className="text-center my-5">All Products</h1>
                        <Row style={{ flexWrap: 'wrap' }}>
                            {displayedProducts.map(product => (
                                <Col key={product._id} xs={12} sm={6} md={4} lg={3}>
                                    <ProductCard>
                                        <img src={product.imageUrl} alt={product.name} />
                                        <h4>
                                            {product.type === 'frame' ? `${product.numberOfFrames} Frames` : product.name}
                                        </h4>
                                        <p className="text-muted">{product.description}</p>
                                        <p>Price: ₹ {product.price}</p>
                                        <button
                                            onClick={() => product.type === 'product' ? handleBuyNowClick(product) : handleBuyNow(product)}
                                            className="btn btn-orange rounded-pill"
                                        >
                                            {product.type === 'frame' ? 'Add to Cart' : 'Buy Now'}
                                        </button>
                                    </ProductCard>
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