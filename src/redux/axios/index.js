
import Axios from 'axios';
import { baseUrl } from '../../theme/appConstants';


const authAxios = Axios.create();
authAxios.interceptors.request.use(
    async function (options) {
        options.baseURL = baseUrl;
        const tokenn = localStorage.getItem('token');
        if (tokenn) {
            options.headers['Authorization'] = `Bearer ${tokenn}`;
            options.headers['x-access-token'] = `Bearer ${tokenn}`;
        }
        return options;
    },
    function (error) {
        // console.log('Api Request error: ', error);
        const errorData = {
            status: false,
            message: 'Api Request Error Occur',
        }
        return Promise.reject(errorData);
    },
);

export default authAxios;