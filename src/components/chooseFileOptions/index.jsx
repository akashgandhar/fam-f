import { appImages } from "../../theme/appImages"

const ChooseFileOptions = () => {
    return (
        <div className="modal fade" id="myframe">
            <div className="modal-dialog    modal-sm modal-dialog-centered">
                <div className="modal-content">
                    <div className="fluid-container">
                        <div className="row">
                            <div className="col-lg-2">
                                <img src={appImages.CameraIcon} width="30" height="30" className="frame-cameraa" />
                            </div>
                            <div className="col-lg-10">
                                <a href="#">
                                    <input type="file" id="actual-btn" hidden />
                                    <label for="actual-btn">Choose File</label>
                                </a>
                            </div>
                        </div>
                        <hr style={{ color: "grey" }} />
                        <div className="row">
                            <div className="col-lg-2">
                                <img src={appImages.FBIcon} width="40" height="40" className="frame-camera" />
                            </div>
                            <div className="col-lg-10">
                                <a href="https://www.facebook.com/" className="frame-face">Import from Facebook</a>
                            </div>

                        </div>
                        <hr style={{ color: "grey" }} />
                        <div className="row frame-insta">
                            <div className="col-lg-2">
                                <img src={appImages.InstaIcon} width="30" height="30" className="frame-ins" />
                            </div>
                            <div className="col-lg-10">
                                <a href="https://www.instagram.com/" className="frame-face"> Import from Instagram</a>

                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChooseFileOptions