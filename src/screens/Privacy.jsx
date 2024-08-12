import { useSelector } from "react-redux";
import NavContainer from "./home/NavContainer";
import Footer from "./Footer";
import parse from 'react-html-parser';
import { useEffect } from "react";

 
const PrivacyPolicy = () => {
    const homeData = useSelector(state => state.userReducer.homeData);
    // -------------- Adding Meta Tags --------------
    useEffect(() => {
       // Helper function to create and append meta tags
       const addMetaTag = (property, content) => {
         const metaTag = document.createElement('meta');
         metaTag.setAttribute('property', property);
         metaTag.setAttribute('content', content);
         document.head.appendChild(metaTag);
         return metaTag;
       };
   
       // Create and append meta tags
       const ogType = addMetaTag('og:type', 'website');
       const ogTitle = addMetaTag('og:title', 'Privacy Policy');
       const ogDescription = addMetaTag('og:description', 'Design Beautiful Walls Filled With Memories');
       const ogImage = addMetaTag('og:image', 'https://familyvibes.in/assets/images/app_logo.png');
       const ogUrl = addMetaTag('og:url', 'https://familyvibes.in/privacyPolicy');
       const fbAppId = addMetaTag('fb:app_id', '1349741572281692');
   
       // Clean up the added meta tags when the component is unmounted
       return () => {
         [ogType, ogTitle, ogDescription, ogImage, ogUrl, fbAppId].forEach((tag) => {
           document.head.removeChild(tag);
         });
       };
     }, []);
    // -------------- Adding Meta Tags --------------
    return (
        <>        
            <NavContainer />
            
            <div className="bg-theme">
                <div className="container pt-lg-5 pt-3" id="PageContent">
                    <div className="row justify-content-center">
                        <div className="col-12">
                            <h1 className="text-center mb-4"><b>Privacy Policy</b></h1>
                            {parse((homeData?.content?.privacy ?? '<div></div>').replaceAll('\n\n', '<br /><br />'))}
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    )
}

export default PrivacyPolicy;
