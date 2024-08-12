const PromoCode = () => {
    return (
        <div className="modal fade" id="Modal">
            <div className="modal-dialog modal-sm modal-dialog-centered">
                <div className="modal-content">

                    <div className="modal-header">
                        <h6 className="modal-promo"><b>Add Promo Code</b></h6>
                        <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                    </div>


                    <label className="modal-label">Your Code</label>
                    <input type="text" className="modal-field" autoFocus />

                    <a href="#" className="modal-done" >Done</a>


                </div>

            </div>

        </div>
    )
}

export default PromoCode