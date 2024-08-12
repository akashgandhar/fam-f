import { useSelector } from "react-redux";
import NavContainer from "./home/NavContainer";
import Footer from "./Footer";
import parse from 'react-html-parser';

const ReturnPolicy = () => {
    const homeData = useSelector(state => state.userReducer.homeData);
    return (
        <>
            <NavContainer />
            <div className="bg-theme">
                <div className="container pt-lg-5 pt-3" id="PageContent">
                    <div className="row justify-content-center">
                        <div className="col-12">
                            <h1 className="text-center mb-4"><b>Return Policy</b></h1>
                            <p>
                            We offer our esteemed customers the privilege to return or exchange products – not just in case of faulty products, but also if we fail to meet our customers’ expectations. Customer Delight is our motto - our team carefully inspects all products to meet our beloved customers’ expectations.
<br></br><br></br>
In cases where the customer is found to betaking unceremonious advantage of such a privilege, Family Vibes reserves the right to not accept the return or exchange from the customer.
<br></br><br></br>
WHAT IF I RECEIVED PRODUCTS IN BAD CONDITION?
<br></br><br></br>
If you think, you have received the product in a bad condition or if the packaging is tampered with or damaged before delivery, please refuse to accept the package and return the package to the delivery person. Also, please call our customer care at +91 9153304000 or email us at familyvibes@gmail.com mentioning your Order ID. We will personally ensure that a brand-new replacement is issued to you at no additional cost. Please make sure that the original product tag and packing are intact when you send us the product back.
<br></br><br></br>
You can return almost all the products which are not used and are in original condition.
<br></br><br></br>
Please send an email on familyvibes@gmail.com within 30 days of delivery, with the reason for return. Our team will arrange a reverse pickup for you, provide the pin code is serviceable by our logistics partners for a reverse pickup, most of the locations are covered by our logistics partners.
<br></br><br></br>
In case your location is not serviceable by our logistics partners for a reverse pickup you will have to ship the product yourself. For the return shipping address please write to us. Ship the package using a traceable source(i.e., DTDC, Blue dart, Aramex, etc.). We are not responsible for products lost or damaged in shipping.
<br></br><br></br>
WHAT IS THE RETURN PROCESS?
<br></br><br></br>
Once you applied for a return, our customer care team will respond to you with an RMA number. We may email you a return label which needs to be pasted on the outer packaging. You need to pack the product in the way it was delivered in tamper-proof packaging. Please ensure that all tags, invoices, etc. are intact. Please note if the tag is removed/tampered we might not accept the return. Hand over the same to the courier boy who would come to pick it up and ensure to get a receipt from him.
<br></br><br></br>
Once the product is delivered to us, we will perform a quality check, if the quality check is approved, we will process your replacement or refund.
<br></br><br></br>
Please note, if the item is returned because you did not like it or ordered it in error, the amount will be refunded in the form of an E-voucher or coupon which can be used on your next order with us.
<br></br><br></br>
You can also choose an equivalent amount of money in the form of replacement, coupon, other product, or cheque/online bank transfer within 3 - 7working days.
                            </p>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    )
}

export default ReturnPolicy;
