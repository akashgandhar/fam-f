import { useSelector } from "react-redux";
import { useEffect } from "react";
import parse from 'react-html-parser';
import NavContainer from "./home/NavContainer";
import Footer from "./Footer";
// import '../style.css';
const Terms = () => {
    const homeData = useSelector(state => state.userReducer.homeData);
    return (
        <>
            <NavContainer />
            <div className="bg-theme">
                <div className="container pt-lg-5 pt-3" id="PageContent">
                    <div className="row justify-content-center">
                        <div className="col-12">
                            <h1 className="term-heading mb-4"><b>Terms of Service</b></h1>
                            {parse((homeData?.content?.term ?? '<div></div>').replaceAll('\n\n','<br /><br />'))}
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    );
}

export default Terms;
