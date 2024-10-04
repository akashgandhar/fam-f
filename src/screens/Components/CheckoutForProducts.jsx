import React, { useContext, useState } from 'react';
import { useDispatch } from 'react-redux';
import { showCheckOutAction } from '../../redux/actions/global';
import { ProductContext } from '../../context/ProductContext';
import styled from 'styled-components';
import axios from 'axios';

const CheckoutContainer = styled.div`
  display: flex;
  flex-direction: column; 
  align-items: center;
  padding: 40px;
  border-radius: 15px;
  background: linear-gradient(135deg, #f0f0f0, #e0e0e0); 
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.2);
  max-width: 800px;
  margin: 50px auto;

  @media (max-width: 768px) {
    padding: 30px;
  }

  .product-image {
    width: 100%;
    max-height: 400px; 
    object-fit: contain; 
    border-radius: 10px;
    box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.1);
    margin-bottom: 30px;
  }

  .checkout-details {
    text-align: center;

    h2 {
      font-size: 3rem;
      margin-bottom: 20px;
      color: #222;
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1); 
    }

    .product-name {
      font-size: 1.8rem;
      font-weight: 600;
      margin-bottom: 10px;
      color: #333;
    }

    .product-price {
      font-size: 1.5rem;
      font-weight: 500;
      color: #555;
      margin-bottom: 10px;
    }

    .gst-info {
      font-size: 1rem;
      color: #777;
      margin-bottom: 30px;
    }

    .form-group {
      margin-bottom: 20px;
      text-align: left;
      width: 100%;

      label {
        display: block;
        margin-bottom: 5px;
        font-weight: 600;
        color: #333;
      }

      input {
        width: 100%;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
        font-size: 1rem;
      }
    }
  }

  .checkout-button {
    padding: 15px 30px;
    font-size: 1.2rem;
    font-weight: 600;
    background-color: #ff5814;
    color: #fff;
    border: none;
    border-radius: 25px; 
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);

    &:hover {
      background-color: #e64a0f;
      transform: translateY(-2px) scale(1.05); 
    }
  }
`;

export default function CheckoutForProducts() {
  const { selectedProduct } = useContext(ProductContext);
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [lastName, setLastName] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');

  const gstRate = 0.18; // 18% GST
  const gstAmount = selectedProduct ? selectedProduct.price * gstRate : 0;
  const totalAmount = selectedProduct ? selectedProduct.price + gstAmount : 0;

  const handleCheckout = async () => {
    const product = selectedProduct;
    console.log('product', product);

    const addressDetails = {
      name: customerName,
      lastName: lastName,
      street: address,
      city: city,
      pincode: pincode,
      state: state,
      country: country,
      email: email,
      phone: phoneNumber
    };

    try {
      const response = await axios.post('http://89.116.34.234:8000/order/bookprod', {
        product: product,
        address: addressDetails,
        paymentType: 'online'
      });

      console.log('Response from server:', response.data);

      let { data } = response;
      if (data.success) {
        console.log('Payment initiated successfully:', data);
        if (data?.data?.isFree) {
            console.log('Free product');
          window.location.href = `https://familyvibes.in/thank-you?type=order&order_id=${data?.data?.id}`;
        }
        console.log('Payment initiated successfully2 :', data);
        data = data?.data?.data;
        console.log('Payment initiated successfully3 :', data);
        let urlInfo = data?.instrumentResponse?.redirectInfo;
        if (urlInfo) {
            console.log('Payment initiated successfully4 :', urlInfo);
            window.open(urlInfo?.url, '_self'); 
          console.log('url: ' , urlInfo?.url)
          console.log('redirected to: ', urlInfo?.url);
        }
      } else {
        alert("Payment initiate error.");
      }
    } catch (error) {
      alert("Server error. Are you online under? " + error?.message);
      return;
    }
  };

  if (!selectedProduct) {
    return <div>No product selected for checkout.</div>;
  }

  return (
    <CheckoutContainer>
      {selectedProduct.imageUrl && (
        <img src={selectedProduct.imageUrl} alt={selectedProduct.name} className="product-image" />
      )}
      <div className="checkout-details">
        <h2>You're Almost There!</h2>
        <p className="product-name">{selectedProduct.name}</p>
        <p className="product-price">Price: ₹{selectedProduct.price}</p>
        <p className="gst-info">GST (18%): ₹{gstAmount.toFixed(2)}</p>
        <p className="product-price">Total: ₹{totalAmount.toFixed(2)}</p>
        <div className="form-group">
          <label htmlFor="customerName">First Name</label>
          <input
            type="text"
            id="customerName"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="phoneNumber">Phone Number</label>
          <input
            type="tel"
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="address">Address</label>
          <input
            type="text"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="city">City</label>
          <input
            type="text"
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="pincode">Pincode</label>
          <input
            type="text"
            id="pincode"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="state">State</label>
          <select style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '5px',
            fontSize: '1rem'
          }}
            type="text"
            id="state"
            value={state}
            onChange={(e) => setState(e.target.value)}
            required
          >
            <option value="">Select State</option>
            <option value="Andhra Pradesh">Andhra Pradesh</option>
            <option value="Arunachal Pradesh">Arunachal Pradesh</option>
            <option value="Assam">Assam</option>
            <option value="Bihar">Bihar</option>
            <option value="Chhattisgarh">Chhattisgarh</option>
            <option value="Goa">Goa</option>
            <option value="Gujarat">Gujarat</option>
            <option value="Haryana">Haryana</option>
            <option value="Himachal Pradesh">Himachal Pradesh</option>
            <option value="Jharkhand">Jharkhand</option>
            <option value="Karnataka">Karnataka</option>
            <option value="Kerala">Kerala</option>
            <option value="Madhya Pradesh">Madhya Pradesh</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Manipur">Manipur</option>
            <option value="Meghalaya">Meghalaya</option>
            <option value="Mizoram">Mizoram</option>
            <option value="Nagaland">Nagaland</option>
            <option value="Odisha">Odisha</option>
            <option value="Punjab">Punjab</option>
            <option value="Rajasthan">Rajasthan</option>
            <option value="Sikkim">Sikkim</option>
            <option value="Tamil Nadu">Tamil Nadu</option>
            <option value="Telangana">Telangana</option>
            <option value="Tripura">Tripura</option>
            <option value="Uttar Pradesh">Uttar Pradesh</option>
            <option value="Uttarakhand">Uttarakhand</option>
            <option value="West Bengal">West Bengal</option>
            <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
            <option value="Chandigarh">Chandigarh</option>
            <option value="Dadra and Nagar Haveli and Daman and Diu">Dadra and Nagar Haveli and Daman and Diu</option>
            <option value="Lakshadweep">Lakshadweep</option>
            <option value="Delhi">Delhi</option>
            <option value="Puducherry">Puducherry</option>
            <option value="Ladakh">Ladakh</option>
            <option value="Jammu and Kashmir">Jammu and Kashmir</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="country">Country</label>
          <input
            type="text"
            id="country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          />
        </div>
        <button onClick={handleCheckout} className="checkout-button">
          Complete Your Purchase
        </button>
      </div>
    </CheckoutContainer>
  );
}