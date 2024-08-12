import { useDispatch, useSelector } from 'react-redux';
import { showFAQAction } from '../../redux/actions/global';
import { useState } from 'react';

const FAQ = () => {
    const dispatch = useDispatch();
    const showFAQ = useSelector(state => state.globalReducer.showFAQ);
    const homeData = useSelector(state => state.userReducer.homeData);

    return showFAQ && (
        <div style={{
            position: 'fixed',
            width: '100vw',
            height: '100vh',
            top: 0,
            zIndex: 9999,
            backgroundColor: '#0008',
            overflowY: 'auto'
        }}
            onClick={(e) => {
                e.stopPropagation()
                dispatch(showFAQAction(false))
            }}>
            <div className="modal-dialog modal-lg" onClick={(e) => {
                e.stopPropagation()
            }}>
                <div className="modal-content">
                    <div className="modal-header" style={{
                        justifyContent: 'center'
                    }}>
                        <h6 className="modal-title" style={{ marginLeft: 0 }}><b>Frequent Questions</b></h6>
                        <button type="button" className="close" onClick={(e) => {
                            e.stopPropagation()
                            dispatch(showFAQAction(false))
                        }}>&times;</button>
                    </div>
                    <div style={{
                        gap: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        overflowY: 'auto',
                        paddingBottom: 16,
                        paddingTop: 16
                    }}>
                        {homeData?.faq.map(item => <FAQSubComponent item={item} />)}
                    </div>
                </div>
            </div>
        </div>
    )
}

export const FAQSubComponent = ({ item }) => {
    const [isHover, setHover] = useState(false);
    const display = isHover ? { display: 'block' } : null;

    return (
        <div className="faq-bgcolor"
            key={Math.random().toString()}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)} >
            <h6 className="show"><b>{item?.question}</b></h6>
            <p className="para" style={display}>{item?.answer}</p>
        </div>
    )
}

export default FAQ