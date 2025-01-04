import axios from "axios";

const API=axios.create({
    baseURL : "http://127.0.0.1:5000"
});

export const getCampaigns=() => API.get('/campaigns');
export const createCampaigns=(data) => API.post('/campaigns',data);
export const donateToCampaign=(id,amount) => API.post(`/campaigns/${id}/donate`,{amount})