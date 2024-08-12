import { useEffect } from "react";

const VideoContainer = ({homeData}) => {
    useEffect(()=>{
console.log(homeData,"ku dikhda ni");
    },[homeData])
    return (
        <>
            <section id="video">
                <div className="container pt-lg-4">
                    <div className="row pt-5">
                        <div className="col-12 py-4 text-center">
                            <h5 className="subtitle"> Video </h5>
                            <h2 className="my-3">Check our Work</h2>
                        </div>
                    </div>
                    <div className="row justify-content-center">
                        <div className="col-lg-4 col-sm-6 mb-4">
                            <iframe src={homeData?.homepage?.youTubeLink1  + "?rel=0&loop=1"}
                                title="YouTube video player"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen></iframe>
                        </div>
                        <div className="col-lg-4 col-sm-6 mb-4">
                            <iframe src={homeData?.homepage?.youTubeLink2 + "?rel=0&loop=1"}
                                title="YouTube video player"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen></iframe>
                        </div>
                        <div className="col-lg-4 col-sm-6 mb-4">
                            <iframe src={homeData?.homepage?.youTubeLink3 + "?rel=0&loop=1"}
                                title="YouTube video player"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen></iframe>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
export default VideoContainer;
