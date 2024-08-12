import { appImages } from "../../theme/appImages"

const Language = () => {
    return (
        <div className="modal fade" id="language">
            <div className="modal-dialog modal-dialog-scrollable">
                <div className="modal-content">

                    <div className="modal-header">
                        <h4 className="modal-title">Change Language</h4>
                        <hr />
                        <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                    </div>


                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-lg-3 col-md-6 col-12">
                                <a href="#"><img src={appImages.AmericaIcon} width="20px" height="20px" className="toggle-img" /></a>
                            </div>
                            <div className="col-lg-6 col-md-6 col-12">
                                <a href="#" className="toggle-lang"><h5 >English</h5></a>
                            </div>
                            <hr style={{ width: 290, marginLeft: 70, color: "grey" }} />
                        </div>

                        <div className="row">
                            <div className="col-lg-3 col-md-6 col-12">
                                <a href="#"><img src={appImages.EspIcon} width="20px" height="20px" className="toggle-img" /></a>
                            </div>
                            <div className="col-lg-6 col-md-6 col-12">
                                <a href="#" className="toggle-lang"><h5 >Espanol</h5></a>
                            </div>
                            <hr style={{ width: 290, marginLeft: 70, color: "grey" }} />
                        </div>


                        <div className="row">
                            <div className="col-lg-3 col-md-6 col-12">
                                <a href="#"><img src={appImages.FranIcon} width="20px" height="20px" className="toggle-img" /></a>
                            </div>
                            <div className="col-lg-6 col-md-6 col-12">
                                <a href="#" className="toggle-lang"><h5 >Francais</h5></a>
                            </div>
                            <hr style={{ width: 290, marginLeft: 70, color: "grey" }} />
                        </div>

                        <div className="row">
                            <div className="col-lg-3 col-md-6 col-12">
                                <a href="#"><img src={appImages.DeutIcon} width="20px" height="20px" className="toggle-img" /></a>
                            </div>
                            <div className="col-lg-6 col-md-6 col-12">
                                <a href="#" className="toggle-lang"><h5 >Deutsch</h5></a>
                            </div>
                            <hr style={{ width: 290, marginLeft: 70, color: "grey" }} />
                        </div>

                        <div className="row">
                            <div className="col-lg-3 col-md-6 col-12">
                                <a href="#"><img src={appImages.ItalIcon} width="20px" height="20px" className="toggle-img" /></a>
                            </div>
                            <div className="col-lg-6 col-md-6 col-12">
                                <a href="#" className="toggle-lang"><h5 >Italiano</h5></a>
                            </div>
                            <hr style={{ width: 290, marginLeft: 70, color: "grey" }} />
                        </div>



                    </div>

                </div>

            </div>

        </div>
    )
}

export default Language