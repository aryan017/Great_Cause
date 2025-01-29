import axios from "axios";

const API=axios.create({
    baseURL : "http://127.0.0.1:5000"
});

// Interceptor to add the Authorization header with JWT token
API.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      console.log("Token in Axios Interceptor:", token); 
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      console.log("Request Config:", config); 
      return config;
    },
    (error) => Promise.reject(error)
  );
  
  // Interceptor to handle token expiration or 401 errors
  API.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login"; // Redirect to login on token expiration
      }
      return Promise.reject(error);
    }
  );


export const getCampaigns=() => API.get('/campaigns');
export const createCampaigns=(data) => API.post('/campaigns',data);
export const donateToCampaign=(id,amount) => API.post(`/campaigns/${id}/donate`,{amount});
export const verifyPayment=(paymentData) => API.post('/payments/verify',paymentData,{
    headers: { "Content-Type": "application/json" }});
export const register=(data) => API.post('/register',data);
export const login=(data) => API.post('/login',data);
export const fetchProfile = () => API.get('/profile');
export const updateProfile = (data) => API.put('/profile', data);
export const fetchUserCampaigns = () => API.get('/profile/campaigns');
