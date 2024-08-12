import { useEffect, useState, useRef } from 'react';
import { googleLogout } from '@react-oauth/google';
import { useDispatch, useSelector } from 'react-redux';
import { logoutAction } from '../../redux/actions/auth';
import { showLoginAction } from '../../redux/actions/global';
import { NavLink, useNavigate } from 'react-router-dom';
import { NavHashLink } from 'react-router-hash-link';


import toast from "react-hot-toast";

const NavContainer = () => {
    document.body.classList.remove('bg-footer');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const profile = useSelector(state => state.userReducer.user);
    const homeData = useSelector(state => state.userReducer.homeData);
    const [isSticky, setIsSticky] = useState(false);
    const navbarRef = useRef(null);

    useEffect(() => {
        // document.getElementsByClassName('marquee');
        const navbar = navbarRef.current;
        if (!navbar) return;
        const stickyOffset = 399;
        function toggleSticky() {
            // const headerHeight = navbarRef.current.clientHeight;
            // placeholderRef.current.style.height = `${headerHeight}px`;
            if (window.scrollY >= stickyOffset) {
                setIsSticky(true);
            } else {
                setIsSticky(false);
            }
        }
        toggleSticky();
        window.addEventListener("scroll", toggleSticky);
        return () => {
            window.removeEventListener("scroll", toggleSticky);
        };
    }, []);
    const LoginBtnHandle = () => {
        dispatch(showLoginAction(true));
    }
    const toggleNavbar = () => {
        const navbarToggle = document.querySelector("#navbar-toggle");
        navbarToggle.classList.toggle("active");
        if (navbarToggle.classList.contains('active')) {
            document.querySelector("#navList").classList.add("slide-down");
            document.querySelector("#navList").classList.remove("slide-up");
        } else {
            document.querySelector("#navList").classList.add("slide-up");
            document.querySelector("#navList").classList.remove("slide-down");
        }
    };
    const ref= useRef(null)
    useEffect(() => {
        const handleMouseEnter = () => {
          animation.pause();
        };
      
        const handleMouseLeave = () => {
          animation.play();
        };
      
        const refElement = ref?.current;
        const animation = refElement?.animate([
          { transform: 'translateX(98%)' },
          { transform: `translateX(-${window.innerWidth + refElement.scrollWidth}px)` }
        ], {
          duration: 30000,
          iterations: Infinity,
          easing: 'linear'
        });
      
        refElement?.parentElement?.addEventListener('mouseenter', handleMouseEnter);
        refElement?.parentElement?.addEventListener('mouseleave', handleMouseLeave);
      
        return () => {
          animation?.cancel();
          refElement?.parentElement?.removeEventListener('mouseenter', handleMouseEnter);
          refElement?.parentElement?.removeEventListener('mouseleave', handleMouseLeave);
        };
      }, []); // empty dependency array ensures this effect runs only once after initial render
      
    return (
        <>
            <NavHashLink to="#bodyTop" className={`btn btn-orange btn-square ${isSticky ? "show" : "hide"}`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ height: 30 }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19.5v-15m0 0l-6.75 6.75M12 4.5l6.75 6.75" />
                </svg>
            </NavHashLink>
            <span className='btn-frame'>
                <NavLink id ="sfr" to='/frames' className={'btn btn-14'}>Buy Now</NavLink>
            </span>
            <div className='headerContainer' id="bodyTop">
                <header ref={navbarRef} className={isSticky ? "bg-fixed-grad sticky" : "bg-fixed-grad"} id="navbar">
                    
                    <div className="offer_bar "  style={{ overflow: 'hidden' }} >
                        {!(homeData?.offer) && <div ref={ref} className="scrolling-text">&nbsp;</div>}
                        {homeData?.offer?.length > 0 &&
                            <div ref={ref} className="scrolling-text">
                                {
                                    homeData?.offer?.map((discount, index, array) => {
                                        return (
                                            <span key={index + 15}>
                                                Get <strong>{discount.discountType === 'fixed' ? '₹' : ''}{discount?.discountAmount}{discount.discountType === 'fixed' ? '' : '%'}</strong> discount on minimum purchase of <strong>₹{discount.minimumAmount}</strong> By using <strong>{discount.code}</strong>
                                                {index !== array.length - 1 && <span className='mx-4'> | </span>}
                                            </span>
                                        )
                                    })
                                }
                            </div>
                        }
                    </div>
                    <div className="container nav-container d-flex justify-content-between align-items-center py-3">
                        <div className="brand">
                            <NavLink to="/">
                                <img src="/assets/images/logo.svg" alt="Family Vibes Logo" className="zoomIn" height="65" width="130" />
                            </NavLink>
                        </div>
                        <nav>
                            <div className="nav-mobile"><a id="navbar-toggle" onClick={toggleNavbar}><span></span></a></div>
                            <ul className="nav-list" id="navList">
                                <li >
                                    <NavLink to='/' id ="hm" >Home</NavLink>
                                </li>
                                <li>
                                    <NavLink to='/frames' id ="fr">Frames</NavLink>
                                </li>
                                <li >
                                    <NavHashLink to="/#gift_cards" className="t-dark" id ="gf">Gift Cards</NavHashLink>
                                </li>

                                {profile ?
                                    <>
                                        <li >
                                            <span className='navLinkItem' onClick={() => { navigate('/orders') }}>Orders</span>
                                        </li>
                                        <li >
                                            <NavLink to={'/my-account'} >My Account</NavLink>
                                        </li>
                                    </>
                                    : ''}

                                <li >
                                    {profile ?
                                        <button className='border-0 bg-transparent t-theme' onClick={() => {
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
                                        </button> :
                                        <button className="btn btn-orange rounded-pill swingAnimate" id ="lg" onClick={LoginBtnHandle}>Login</button>
                                    }
                                </li>
                            </ul>
                        </nav>
                    </div>
                </header>

            </div>
        </>
    );
}

export default NavContainer;
