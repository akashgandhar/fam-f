import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { showContactUsAction, showFAQAction } from '../redux/actions/global';

const Footer = () => {
    const homeData = useSelector(state => state.userReducer.homeData);
    const dispatch = useDispatch()

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }
    return (
        <>
            <footer className="pt-lg-5 pb-4">
                <div className="container">
                    <div className="row">
                        <div className="col-12 mt-5 text-center mb-4">
                            <h4 className="wow fadeInDown"> Follow Us </h4>
                        </div>
                        <div className="col-12 text-center social_links mb-5">
                            <a id ="fb" target="_blank" rel="noreferrer" href={homeData?.homepage?.facebook}>
                                <img src="/assets/images/facebook.svg" className="wow zoomIn" alt="Facebook Icon" height="30" width="30" />
                            </a>
                            <a id ="ins" target="_blank" rel="noreferrer" href={homeData?.homepage?.instragram}>
                                <img src="/assets/images/instagram.svg" className="wow zoomIn" alt="Instagram Icon" height="30" width="30" />
                            </a>
                            <a id ="ln" target="_blank" rel="noreferrer" href={homeData?.homepage?.linkedin}>
                                <img src="/assets/images/linkedin.svg" className="wow zoomIn" alt="LinkedIn Icon" height="30" width="30" />
                            </a>
                            <a id ="pn" target="_blank" rel="noreferrer" href={homeData?.homepage?.pinterest}>
                                <img src="/assets/images/pinterest.svg" className="wow zoomIn" alt="Pinterest Icon" height="30" width="30" />
                            </a>
                            <a id ="yt" target="_blank" rel="noreferrer" href={homeData?.homepage?.youTube}>
                                <img src="/assets/images/youtube.svg" className="wow zoomIn" alt="YouTube Icon" height="30" width="30" />
                            </a>
                        </div>
                    </div>
                    <div className="mb-5">
                        <ul className="footer-nav mb-0">
                            <li> <button className="btn border-0 bg-transparent p-0" onClick={() => dispatch(showFAQAction(true))}>Frequent Questions</button> </li>
                            <li> <NavLink to={'/terms'} onClick={scrollToTop}> Terms and Conditions </NavLink> </li>
                            <li> <NavLink to={'/privacyPolicy'} onClick={scrollToTop}> Privacy Policy </NavLink> </li>
                            <li> <NavLink to={'/return'} onClick={scrollToTop}> Return Policy </NavLink> </li>
                            <li> <NavLink to={'/refund'} onClick={scrollToTop}> Refund Policy </NavLink> </li>
                            <li> <NavLink to={'/shipping'} onClick={scrollToTop}> Shipping Policy </NavLink> </li>
                            <li> <NavLink to={'/contact-us'} onClick={scrollToTop}> Contact Us </NavLink> </li>
                        </ul>
                    </div>
                    <p className="text-center"> Copyright @2023 FAMILYVIBES E-COMMERCE PRIVATE LIMITED. All Rights Reserved </p>
                </div>
            </footer>
        </>
    )
}
export default Footer;
