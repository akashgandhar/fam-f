import { useDispatch, useSelector } from "react-redux";
import { googleLogout } from '@react-oauth/google';
import { logoutAction } from '../../redux/actions/auth';
import { appImages } from "../../theme/appImages";
import { showFAQAction, showLoginAction } from '../../redux/actions/global';
import toast from 'react-hot-toast';
import { NavLink, useNavigate } from "react-router-dom";
import NavContainer from "../../screens/home/NavContainer";
import { useEffect, useState } from "react";

const Header = ({ showCheckout = false, convertHtmlToImg }) => {
    document.body.classList.add('bg-footer');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const profile = useSelector(state => state.userReducer.user);
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const [isChecked, setIsChecked] = useState(true);
    const handleSideBar = (elID) => {
        console.log(document.getElementById(elID));
        if (document.getElementById(elID).checked) {
            document.getElementById('sidebarMenu').classList.add('showsidebar')
            document.body.classList.remove('sidebarHide');
        } else {
            document.getElementById('sidebarMenu').classList.remove('showsidebar')
            document.body.classList.add('sidebarHide');
        }
        setIsChecked(!isChecked);
    }
    useEffect(() => {
        const handleResize = () => {
            setScreenWidth(window.innerWidth);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    useEffect(() => {
        if (screenWidth < 992) {
            setIsChecked(false);
            document.getElementById('sidebarMenu').classList.remove('showsidebar');
            document.body.classList.add('sidebarHide');
        } else {
            setIsChecked(true);
            document.getElementById('sidebarMenu').classList.add('showsidebar');
            document.body.classList.remove('sidebarHide');
        }
    }, [screenWidth]);
    return (
        <>
            <div className="main-wrapper wow slideInDown" id="AdminHeader">
                <div className="header container-fluid">
                    <div className="row h-100 align-content-center">
                        <div className="col">
                            <NavLink to={'/'}>
                                <img src="/assets/images/logo.svg" alt="" height={48} width={96} />
                            </NavLink>
                        </div>

                        <div className="col text-right">
                            <div className="d-flex justify-content-end">

                                <div>
                                    {showCheckout && <a onClick={() => {
                                        if (!profile) {
                                            toast.error("Please login first.");
                                            dispatch(showLoginAction(true));
                                            return
                                        }
                                        convertHtmlToImg()
                                    }
                                    } className="checkout_cta  btn btn-orange zoom-in-out-box btn-sm mr-3 t-blue d-md-flex align-items-md-center">
                                        <img src={appImages.CheckOutIcon} width="32px" height="32px" style={{ marginRight: 10 }} />
                                        <span className=" ">Checkout</span>
                                    </a>}
                                </div>
                                <input type="checkbox" className="openSidebarMenu" id="openSidebarMenu" onChange={() => handleSideBar('openSidebarMenu')} checked={isChecked} />
                                <label htmlFor="openSidebarMenu" className="sidebarIconToggle">
                                    <div className="spinner diagonal part-1"></div>
                                    <div className="spinner horizontal"></div>
                                    <div className="spinner diagonal part-2"></div>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="sidebarMenu" className="showsidebar d-flex justify-content-between flex-column">
                    <ul className="sidebarMenuInner wow slideInLeft">
                        <li className="profile p-2">{profile ? (`Hi, ${profile.name}`) : 'Hi'}</li>
                        <li><NavLink to={'/my-account'} id ="acc" >My Account</NavLink></li>
                        <li><NavLink to={'/frames'} id="fr" >Frames</NavLink></li>
                        <li><NavLink to={'/orders'} id ="or" >My Orders</NavLink></li>
                        <li><NavLink to={'/gifts'} id ="gf" >My Gifts</NavLink></li>
                        <li><NavLink to={'/privacyPolicy'} >Privacy Policy</NavLink></li>
                        <li><NavLink to={'/terms'}>Terms of Use</NavLink></li>
                        <li><button className="btn border-0 bg-transparent text-light" onClick={() => dispatch(showFAQAction(true))}>Frequent Questions</button></li>
                    </ul>
                    <ul className="nonLogin text-center mb-0">
                        <li className="border-0 p-2">
                            {profile ?

                                <button className='btn btn-orange rounded-pill btn-sm' onClick={() => {
                                    if (profile) {
                                        googleLogout();
                                        localStorage.setItem('token', '');
                                        dispatch(logoutAction());
                                        toast.success('Logged Out Successfully !');
                                        setTimeout(() => {
                                            window.location.reload();
                                        }, 1500);
                                        return
                                    }
                                }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke='currentColor' viewBox="0 0 24 24" strokeWidth={2.2} style={{ height: "24px" }}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1012.728 0M12 3v9" />
                                    </svg>
                                </button>
                                :
                                <div>
                                    <button className="bg-transparent border-0 text-light swingAnimate hover-underline" onClick={() => dispatch(showLoginAction(true))}>Sign In Now</button>
                                </div>
                            }
                        </li>
                    </ul>
                </div>
            </div >
        </>
    )
}

export default Header
