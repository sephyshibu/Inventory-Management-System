import axios,{AxiosError,type InternalAxiosRequestConfig} from "axios";
import {persistor, store} from '../app/store'
import { addtoken } from "../features/UserToken";
import {toast} from 'react-toastify'

const axiosInstanceUser=axios.create({
    baseURL:import.meta.env.VITE_PORT,
    withCredentials:true
})

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig{
    _retry?:boolean
}

axiosInstanceUser.interceptors.request.use(
    (config:CustomAxiosRequestConfig)=>{
        const state=store.getState()
        const token=state.usertoken.usertoken
        const user=state.user.user

        if (typeof token !== 'string') {
        console.error("Token is not a string:", token);
      }
  
      if (token) {
        console.log("if(token)", token);
        config.headers['Authorization'] = `Bearer ${token}`;
      }

      if (user && user._id) {
        config.headers['user-id'] = user._id;
      } 
      return config
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
    
)

axiosInstanceUser.interceptors.response.use(
    (response) => response, // Forward successful responses
    async (error: AxiosError) => {
      const originalRequest = error.config as CustomAxiosRequestConfig;
  
      if (error.response?.status === 401 && !originalRequest._retry) {
        console.log('401 error detected:', error.response);
        originalRequest._retry = true;
  
        try {
          console.log('Triggering token refresh...');
          const response = await axiosInstanceUser.post<{ token: string }>('/refresh', {}, { withCredentials: true });
          const { token } = response.data;
  
          console.log("response axios ", token);
          store.dispatch(addtoken({ usertoken:token })); // Update Redux with new token
  
          axiosInstanceUser.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
  
          return axiosInstanceUser(originalRequest);
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
          // store.dispatch(logoutuser());
          toast.error("Session expired. Please login again.");
          await persistor.purge();
          localStorage.removeItem("techId");
          window.location.href = '/';
          return Promise.reject(refreshError);
        }
      }
      if (error.response?.status === 403) {
        const data = error.response.data as { message: string; action?: string };
        console.log("403 Error:", data); // 👈 Add this
        if (data?.action === 'blocked') {
          toast.error(data.message || "You are blocked by admin!");
          localStorage.removeItem('techId')
          await persistor.purge()
          window.location.href = '/'

          // Optionally: You can logout the user or redirect to login page if needed
        }
      }
      return Promise.reject(error);
    }
  );

  export default axiosInstanceUser