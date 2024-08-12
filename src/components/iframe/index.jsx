const IFrame = ({ showDialog, setShowDialog }) => {

    return showDialog && (
        <div style={{
            position: 'fixed',
            width: '100vw',
            height: '100vh',
            top: 0,
            zIndex: 9999,
            backgroundColor: '#00000055',
            overflowY: 'auto'
        }}
            onClick={(e) => {
                e.stopPropagation()
                setShowDialog(null)
            }}>
            <div className="modal-dialog" onClick={(e) => {
                e.stopPropagation()
            }}>
                <div className="modal-content">
                    <div className="modal-body">
                        <iframe width="470" height="350" src={showDialog} title="YouTube video player"
                            frameborder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            sandbox='allow-same-origin allow-forms allow-popups allow-scripts allow-presentation'
                            allowfullscreen></iframe>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default IFrame