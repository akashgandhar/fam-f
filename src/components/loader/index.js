import { useSelector } from 'react-redux';

const Loader = () => {
    const isLoading = useSelector(state => state.globalReducer.isLoading);

    return isLoading && (
        <div style={{
            position: 'fixed',
            width: '100vw',
            height: '100vh',
            top: 0,
            zIndex: 9999999,
            backgroundColor: '#00000055',
            overflowY: 'auto',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <div className="loader"></div>

        </div>
    )
}
export default Loader