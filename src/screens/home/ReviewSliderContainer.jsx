import { useSelector } from 'react-redux';
import Slider from "react-slick";
import { getImage } from '../../components/fileUploader/getImage';
import { useEffect, useState } from 'react';

const ReviewSliderContainer = () => {
    const homeData = useSelector(state => state.userReducer.homeData);
    const [images,setImages]=useState([])
    useEffect(() => {
        const fetchData = async () => {
          try {
            const data = await Promise.all(
              homeData?.testimonial?.map(async (item) => {
                const img = await getImage(item.media, "review");
                return img;
              })
            );
      
            setImages(data);
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        };

        fetchData();
      }, [homeData]);
      
    var settings = {
        dots: false,
        arrows: true,
        infinite: true,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        speed: 2000,
        autoplaySpeed: 2000,
        responsive: [
            {
                breakpoint: 1366,
                settings: {
                    slidesToShow: 3,
                }
            },
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 690,
                settings: {
                    slidesToShow: 1,
                }
            },
        ]
    };
    return (
        <>
            <section id="review" className="container-fluid py-5 my-lg-5 position-relative">
                <div className="bg-dots-abs circle-abs"></div>
                <div className="bg-dots-abs circle-abs circle-abs-2"></div>
                <div className="row">
                    <div className="col-12 pt-5 pb-3 text-center">
                        <h5 className="subtitle"> Reviews </h5>
                        <h2 className="mt-4 pt-lg-3">Reviews that made our day</h2>
                    </div>
                </div>
                <div className="row justify-content-center ">
                    <div className="col-xl-11 my-3 my-lg-4  ">
                        <Slider {...settings}>
                            {homeData?.testimonial?.map( (item,i) => {
                                // let img = await getImage(item.media,"review")
                                return (
                                    <div className="reviewCard  " key={item._id}>
                                        <img src={images?.[i]} alt="Review Image" />
                                        <div className="content">
                                            {item?.text}
                                        </div>
                                    </div>
                                )
                            })}
                        </Slider>
                    </div>
                </div>
            </section>
        </> 
    );
}
export default ReviewSliderContainer;