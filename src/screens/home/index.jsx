import React from 'react';
import NavContainer from './NavContainer';
import HomeUI from './HomeUI';
import ContactUs from '../../components/contactUs';
import Whatsapp from '../../assets/images/whatsapp_100X100.gif';

const Home = () => {
    return (
        <div>
            <NavContainer />
            <HomeUI />
            <ContactUs />
            <a href="https://api.whatsapp.com/send?phone=917015573305" className='whats-float' id="wht" rel="noreferrer" target="_blank"><img src={Whatsapp} width="55" /></a>
        </div>
    );
}

export default Home;
