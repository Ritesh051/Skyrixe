import axios from 'axios';
import { credAndUrl } from '../../config/config';


// Create an Axios instance
const axiosInstance = axios.create({
    baseURL: credAndUrl.BASE_URL // Your API base URL
});

export default axiosInstance;
