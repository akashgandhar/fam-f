import { useSelector } from "react-redux";
import NavContainer from "./home/NavContainer";
import Footer from "./Footer";
import parse from 'react-html-parser';

const RefundPolicy = () => {
    const homeData = useSelector(state => state.userReducer.homeData);
    return (
        <>
            <NavContainer />
            <div className="bg-theme">
                <div className="container pt-lg-5 pt-3" id="PageContent">
                    <div className="row justify-content-center">
                        <div className="col-12">
                            <h1 className="text-center mb-4"><b>Refund/Cancellation Policy</b></h1>
                            <p>
                           WHAT IS THE REFUND PROCESS?
<br></br><br></br>
Once you applied for a return, our customer care team will respond to you with an RMA number. We may email you a return label which needs to be pasted on the outer packaging. You need to pack the product in the way it was delivered in tamper-proof packaging. Please ensure that all tags, invoices, etc. are intact. Please note if the tag is removed/tampered we might not accept the return. Hand over the same to the courier boy who would come to pick it up and ensure to get a receipt from him.
<br></br><br></br>
Once the product is delivered to us, we will perform a quality check, if the quality check is approved, we will process your replacement or refund.
<br></br><br></br>
Please note, if the item is returned because you did not like it or ordered it in error, the amount will be refunded in the form of an E-voucher or coupon which can be used on your next order with us.
<br></br><br></br>
You can also choose an equivalent amount of money in the form of replacement, coupon, other product, or cheque/online bank transfer within 3 - 7working days.
<br></br><br></br>
CANCELLATION OF ORDER
<br></br><br></br>
You can cancel the order before dispatch of the product by sending us an email on familyvibes@gmail.com or call us on +91 9153304000. The order shall be accepted for cancellation and a full refund shall be made in the same model to the customer.
<br></br><br></br>
For any clarifications or special cases please feel free to contact us at familyvibes@gmail.com.in or +91 9153304000. we will try to help you our best. All returns & refunds are subject to the discretion of Family Vibes(Familyvibes Ecommerce Private Limited), we are customer oriented.
                            </p>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    )
}

export default RefundPolicy;
