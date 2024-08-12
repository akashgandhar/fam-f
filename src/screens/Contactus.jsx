import React from 'react'
import NavContainer from './home/NavContainer';
import Footer from './Footer';
import { useDispatch, useSelector } from 'react-redux';
import { showContactUsAction } from '../redux/actions/global';
import TelIcon from '../assets/images/telephone-icon.png';
import MailIcon from '../assets/images/mail-icon.png';
import { useState } from 'react';
import { contactUsAction } from '../redux/actions/auth';
import toast from 'react-hot-toast';

const Contactus = () => {
    const dispatch = useDispatch();
    const showContactUs = useSelector(state => state.globalReducer.showContactUs);
    const homeData = useSelector(state => state.userReducer.homeData);
    const [emailValue, setEmailValue] = useState('');
    const [phoneValue, setPhoneValue] = useState('');
    const [firstNameValue, setFirstNameValue] = useState('');
    const [lastNameValue, setLastNameValue] = useState('');
    const [messageValue, setMessageValue] = useState('');

    const onSubmit = () => {
        const reg = /^\S+@\S+\.\S+$/
        if (!reg.test(emailValue)) {
            toast.error("Please enter valid email address.");
            return
        }
        else if (!phoneValue || phoneValue.length < 10) {
            toast.error("Please enter valid phone number.");
            return
        }
        else if (!firstNameValue || firstNameValue.length < 2) {
            toast.error("Please enter valid first name.");
            return
        }
        else if (!lastNameValue || lastNameValue.length < 2) {
            toast.error("Please enter valid last name.");
            return
        }
        else if (!messageValue || messageValue.length < 10) {
            toast.error("Please enter at least 10 characters.");
            return
        }

        dispatch(contactUsAction({
            "message": messageValue,
            "email": emailValue,
            "phone": phoneValue,
            "lastName": lastNameValue,
            "firstName": firstNameValue
        }));
    }
    return (
        <>
            <NavContainer />
            <div className="bg-fixed-grad">
                <div className="container pt-lg-5 pt-3" id="contacPage">
                    <div className="row justify-content-center">
                        <div className="col-12 text-center">
                            <h1 className="mb-5"><b>Contat Us</b></h1>
                        </div>
                        <div className="col-12">
                            <div className="container-fluid">
                                <div className="row border-radius-row">
                                    <div className="col-lg-4 p-0 bg-theme-orange">
                                        <div className="sidePopInfo">
                                            <div className="top">
                                                <h2 className='text-white'>We're Here <br /> to Help!</h2>
                                                <p className='text-white'>Your direct line to our dedicated team for inquiries, assistance, and collaboration</p>
                                            </div>
                                            <div className="bottom my-4 my-lg-2">
                                                   <div className="Item mb-2">
                                                         <p style={{color: "#fff"}}>62 JN ROAD,OPPOSITE SABZI MANDI TEH RANIA
                                                            Sirsa, Haryana 125076
                                                            India
                                                         </p>
                                                     </div>  
                                                <div className="Item mb-2">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                                                    </svg>
                                                    <a href="tel:+918755501243">+91 87555 01243</a>, <a href="tel:+919153304000">+91 9153304000</a>
                                                </div>
                                                <div className="Item mb-2">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                                    </svg>
                                                    <a href="mailto:contactus@familyvibes.in">contactus@familyvibes.in</a>
                                                </div>
                                                <div className="Item">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>

                                                    <span> Mon-Fri ... 9:00 AM - 5:00 PM </span>
                                                </div>
                                            </div>
                                            <div className="socialIcon text-right">
                                                <a target="_blank" rel="noreferrer" href={homeData?.homepage?.facebook}>
                                                    <img src="/assets/images/white-logo/facebook.svg" className="wow zoomIn" alt="Facebook Icon" height="24" width="24" />
                                                </a>
                                                <a target="_blank" rel="noreferrer" href={homeData?.homepage?.instragram}>
                                                    <img src="/assets/images/white-logo/instagram.svg" className="wow zoomIn" alt="Instagram Icon" height="24" width="24" />
                                                </a>
                                                <a target="_blank" rel="noreferrer" href={homeData?.homepage?.youTube}>
                                                    <img src="/assets/images/white-logo/youtube.svg" className="wow zoomIn" alt="YouTube Icon" height="24" width="24" />
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-8 p-0 ">
                                        <div className="contacForm">
                                            <div className="row">
                                                <div className="form-group col-lg-6">
                                                    <label htmlFor="input1">First Name <span className="text-danger">*</span></label>
                                                    <input type="text" className="form-control" placeholder="Your First Name" value={firstNameValue}
                                                        onChange={e => setFirstNameValue(e.target.value)} />
                                                </div>
                                                <div className="form-group col-lg-6">
                                                    <label>Last Name <span className="text-danger">*</span></label>
                                                    <input type="text" className="form-control" placeholder="Your Last Name" value={lastNameValue}
                                                        onChange={e => setLastNameValue(e.target.value)} />
                                                </div>

                                                <div className="form-group col-lg-6">
                                                    <label> Phone Number <span className="text-danger">*</span></label>
                                                    <input type="number" className="form-control" placeholder="Phone number" value={phoneValue}
                                                        onChange={e => setPhoneValue(e.target.value)} />
                                                </div>

                                                <div className="form-group col-lg-6">
                                                    <label >Email <span className="text-danger">*</span></label>
                                                    <input type="email" className="form-control" placeholder="Email" value={emailValue}
                                                        onChange={e => setEmailValue(e.target.value)} />
                                                </div>

                                                <div className="form-group col-lg-12">
                                                    <label>Write Your Message <span className="text-danger">*</span></label>
                                                    <textarea className="form-control " rows="5" placeholder="Write Your Message" value={messageValue}
                                                        onChange={e => setMessageValue(e.target.value)}></textarea>
                                                </div>
                                            </div>
                                            <div className="text-right mt-4">
                                                <button className="btn btn-orange" type="button" onClick={onSubmit}> <span>Submit</span></button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    )
}

export default Contactus
