import { useSelector } from "react-redux";
import NavContainer from "./home/NavContainer";
import Footer from "./Footer";
import parse from 'react-html-parser';

const ShippingPolicy = () => {
    const homeData = useSelector(state => state.userReducer.homeData);
    return (
        <>
            <NavContainer />
            <div className="bg-theme">
                <div className="container pt-lg-5 pt-3" id="PageContent">
                    <div className="row justify-content-center">
                        <div className="col-12">
                            <h1 className="text-center mb-4"><b>Shipping Policy</b></h1>
                            <p>
                          What are the delivery charges?
<br></br><br></br>
We offer free shipping across India for orders above ₹ 300.
<br></br><br></br>
What is the estimated delivery time?
<br></br><br></br>
Most of the products are delivered in 1-7 Days from the order date.
<br></br><br></br>
Sometimes, the delivery may take longer due to bad weather, flight delays, political disruptions, and other unforeseen circumstances. In such cases, we will proactively reach out to you. Please check your emails and SMS regularly for such updates.
<br></br><br></br>
How will the delivery be done?
<br></br><br></br>
We ship through known and reputed logistics partners like FedEx, Bluedart, Delivery, Ecom Express, India Post etc.
<br></br><br></br>
What pin codes do you ship to?
<br></br><br></br>
We ship across India, no restrictions.
<br></br><br></br>
We prefer shipping through major partners like FedEx, Bluedart, Delhivery, Ecom Express but if these service providers are not present in your location, we will ship it through India Post.
<br></br><br></br>
Can I expect delivery on all days of the week?
<br></br><br></br>
We ship 6 days of the week. We do not process orders on Sundays & on National Holidays unless it is the festive season. You can expect delivery of your order on any of the business days. Business days are defined as all working days from Monday to Saturday, excluding national and state holidays.
<br></br><br></br>
Are there any hidden costs (sales, taxes, octroi, etc)?
<br></br><br></br>
There are no extra taxes or hidden costs. The price tags with the products hold final price including everything. You will pay what you will see!
<br></br><br></br>
How do I track my order?
<br></br><br></br>
We notify our customers via confirmation email within twenty-four hours of dispatching. The shipping confirmation email will have the couriers tracking number and the link of tracking.
<br></br><br></br>
Do you ship internationally?
<br></br><br></br>
Yes, we do ship internationally. For international shipping, the rates would be applicable as per DHL & FedEx, our logistic partners and the duties to be levied as per the delivery country’s duty structure. This will be added to the prescribed MRP.
<br></br><br></br>
If you have additional questions or require more information about our Shipping Policy, do not hesitate to contact us through email at familyvibesindia@gmail.com
                            </p>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    )
}

export default ShippingPolicy;
