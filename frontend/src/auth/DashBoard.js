import React, { useEffect, useState } from "react"; 
import { getUserCampaigns, deleteCampaign, updateCampaign } from "../api/api";
import '../assests/dashboard.css';

const Dashboard = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [editingCampaign, setEditingCampaign] = useState(null);
    const [updatedData, setUpdatedData] = useState({ title: "", description: "", goal_amount: "" });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getUserCampaigns();
                setCampaigns(res.data.campaigns);
            } catch (error) {
                console.error("Error fetching dashboard data", error);
            }
        };
        fetchData();
    }, []);

    const handleDelete = async (campaignId) => {
        if (window.confirm("Are you sure you want to delete this campaign?")) {
            try {
                await deleteCampaign(campaignId);
                setCampaigns(prevCampaigns => prevCampaigns.filter(c => c.id !== campaignId));
            } catch (error) {
                console.error("Error deleting campaign:", error);
                alert("Campaign is Deleted Successfully");
            }
        }
    };

    const handleEdit = (campaign) => {
        setEditingCampaign(campaign.id);
        setUpdatedData({
            title: campaign.title,
            description: campaign.description,
            goal_amount: campaign.goal_amount
        });
    };

    const handleUpdate = async () => {
        try {
            await updateCampaign(editingCampaign, updatedData);
            setCampaigns(prevCampaigns => prevCampaigns.map(c => 
                c.id === editingCampaign ? { ...c, ...updatedData } : c
            ));
            setEditingCampaign(null);
        } catch (error) {
            console.error("Error updating campaign:", error);
            alert("Campaign is Updated Successfully");
        }
    };

    return (
        <div className="dashboard-container">
            <h2>My Dashboard</h2>
            
            <section className="my-campaigns">
                <h3>My Campaigns</h3>
                {campaigns.length > 0 ? campaigns.map(campaign => (
                    <div key={campaign.id} className="campaign-card">
                        {editingCampaign === campaign.id ? (
                            <div>
                                <input 
                                    type="text" 
                                    value={updatedData.title} 
                                    onChange={(e) => setUpdatedData({ ...updatedData, title: e.target.value })} 
                                />
                                <textarea 
                                    value={updatedData.description} 
                                    onChange={(e) => setUpdatedData({ ...updatedData, description: e.target.value })} 
                                />
                                <input 
                                    type="number" 
                                    value={updatedData.goal_amount} 
                                    onChange={(e) => setUpdatedData({ ...updatedData, goal_amount: e.target.value })} 
                                />
                                <button onClick={handleUpdate}>Save</button>
                                <button onClick={() => setEditingCampaign(null)}>Cancel</button>
                            </div>
                        ) : (
                            <>
                                <h4>{campaign.title}</h4>
                                <p>{campaign.description}</p>
                                <p>Goal: Rs {campaign.goal_amount}</p>
                                <p>Raised: Rs {campaign.raised_amount}</p>
                                <button className="edit-btn" onClick={() => handleEdit(campaign)}>Edit</button>
                                <button className="delete-btn" onClick={() => handleDelete(campaign.id)}>Delete</button>
                            </>
                        )}
                    </div>
                )) : <p>No campaigns created yet.</p>}
            </section>
        </div>
    );
};

export default Dashboard;