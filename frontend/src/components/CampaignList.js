import React,{useEffect,useState} from "react";
import {getCampaigns,donateToCampaign} from "../api/api"


const CampaignList=() => {
    const [campaigns,setCampaigns] =useState([]);
    const [selectedCampaign,setSelectedCampaign] =useState(null);


    useEffect(() => {
       const fetchCampaigns=async() => {
        const {data}=await getCampaigns();
        setCampaigns(data);
       }
       fetchCampaigns();
    },[])

}