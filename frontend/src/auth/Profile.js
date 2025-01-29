import React, { useEffect, useState } from "react";
import { fetchProfile, updateProfile, fetchUserCampaigns } from "../api/api"; 

const Profile = () => {
  const [user, setUser] = useState({});
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await fetchProfile();
        setUser(userResponse.data);
        const campaignsResponse = await fetchUserCampaigns();
        setCampaigns(campaignsResponse.data.campaigns);
      } catch (error) {
        console.error("Error fetching profile or campaigns:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateProfile({ username: user.username, email: user.email });
      alert("Profile updated!");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Your Profile</h2>
      <form onSubmit={handleUpdate}>
        <label>
          Username:
          <input
            type="text"
            value={user.username}
            onChange={(e) => setUser({ ...user, username: e.target.value })}
          />
        </label>
        <br />
        <label>
          Email:
          <input
            type="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />
        </label>
        <br />
        <button type="submit">Update Profile</button>
      </form>

      <h3>Your Campaigns</h3>
      {campaigns.length > 0 ? (
        <ul>
          {campaigns.map((campaign) => (
            <li key={campaign.id}>
              <h4>{campaign.title}</h4>
              <p>{campaign.description}</p>
              <p>
                Goal: {campaign.goal_amount}, Raised: {campaign.raised_amount}
              </p>
              <p>Status: {campaign.is_approved ? "Approved" : "Pending"}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>You have not created any campaigns yet.</p>
      )}
    </div>
  );
};

export default Profile;
