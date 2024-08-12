import { appImages } from "../../theme/appImages";

const ChatBot = () => {
    return (

        <div className="modal fade" id="myChat">
            <div className="modal-dialog modal-dialog-scrollable">
                <div className="modal-content">

                    <button type="button" className="btn-close" style={{ marginTop: 10 }} data-bs-dismiss="modal"></button>


                    <div className=" container-fluid modal-body">

                        <div className="row ">
                            <div className="col-lg-2">
                                <div className="contact-bg-image"></div>
                            </div>
                            <div className="col-lg-2">
                                <div className="contact-bg-image-two"></div>
                            </div>

                            <div className="col-lg-2">
                                <div className="contact-bg-image-three"></div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-lg-6">
                                <h1 className="contact-content">Hi there</h1>
                            </div>

                            <div className="col-lg-4">
                                <img src={appImages.HandIcon} className="contact-hand-icon" />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-lg-12">
                                <h1 className="contact-content-help">How can we help?</h1>
                            </div>
                        </div>


                        <div className="row">
                            <div className="col-lg-12">
                                <div className="contact-border-three">
                                    <br /><a href="#" className="contact-search">Search for help</a>
                                </div>


                            </div>
                        </div>

                        <div className="row">
                            <div className="col-lg-12">
                                <div className="contact-border-four">
                                    <a href="#" className="contact-message-link"> Send us a message</a>
                                    <div className="row">
                                        <div className="col-lg-10">
                                            <p className="contact-paragraph">We'll be back online later today</p>


                                        </div>
                                        <div className="col-lg-2">

                                        </div>

                                    </div>
                                </div>


                            </div>
                        </div>

                        <div className="row">
                            <div className="col-lg-12">
                                <div className="contact-border-five">

                                    <br /><a href="#" className="contact-yes">I need my order comfirmation </a><br /><br /><br />


                                </div>


                            </div>

                        </div>

                        <div className="row">
                            <div className="col-lg-12">
                                <div className="contact-border-six"><br />

                                    <a href="#" className="contact-order">I need my order status</a>

                                </div>


                            </div>
                        </div>

                        <div className="row contact-border-seven">

                            <div className="col-lg-4">
                                <div className="contact-icon-border"><br />
                                    <center><img src={appImages.HomeIcon} className="contact-home-img" /></center>
                                    <a href="/" className="contact-home-content"><h6>Home</h6></a>
                                </div>
                            </div>


                            <div className="col-lg-4">
                                <div className="contact-icon-border"><br />
                                    <center><img src={appImages.ChatIcon} className="contact-home-img" /></center>
                                    <a href="#" className="contact-home-content"><h6>Messages</h6></a>
                                </div>
                            </div>


                            <div className="col-lg-4">
                                <div className="contact-icon-border"><br />
                                    <center><img src={appImages.QuestionIcon} className="contact-home-img" /></center>
                                    <a href="#" className="contact-home-content"><h6>Help</h6></a>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

            </div>

        </div>

    )
}

export default ChatBot