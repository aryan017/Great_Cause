import React,{useEffect,useState} from "react";
import {getCampaigns,donateToCampaign, verifyPayment} from "../api/api";
import DonateModal from "./DonateModal";
import ShareCampaign from "./ShareCampaign";
import '../index.css';

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

    const handleDonate=async(campaign,amount) => {
        try{
            const {data} =await donateToCampaign(campaign.id,amount);
            const razorpayOptions={
                key : process.env.REACT_APP_RAZORPAY_KEY_ID,
                amount : data.amount,
                currency : data.currency,
                order_id : data.order_id,
                name : "Great Cause",
                decription : "CrowdFunding Platform to Support Campaigns",
                handler : async function (response){
                    try{                    
                    await verifyPayment({
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                    campaign_id: campaign.id,
                    amount: data.amount,
                    });
                    alert("Payment SucceFully");

                    const { data: updatedCampaigns } = await getCampaigns();
                    setCampaigns(updatedCampaigns);
                }catch(e){
                    console.log(e,"Payment Verification has Failed")
                }
                }              
            }
            const razorpay=new window.Razorpay(razorpayOptions);
            razorpay.open();

        }catch(error){
            console.log(error);
        }
    }

    return (
        <div className="campaign-list">
            <h2>Active Campaigns</h2>
            {campaigns.map((campaign) => (
                <div key={campaign.id} className="campaign-card">
                    <h3>{campaign.title}</h3>
                    <p>{campaign.description}</p>
                    <p>Goal Amount :Rs {campaign.goal_amount}</p>
                    <p>Raised Amount :Rs {campaign.raised_amount}</p>
                    <ShareCampaign campaign={campaign} />
                    <button onClick={() => setSelectedCampaign(campaign)}>Donate</button>
                </div>
            ))}

            {selectedCampaign &&(
            <DonateModal
               campaign={selectedCampaign}
               onClose={() => setSelectedCampaign(null)}
               onDonate={handleDonate}
            />
            )}
        </div>
    );
};

export default CampaignList;