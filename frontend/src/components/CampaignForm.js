import React,{useState} from "react";
import { createCampaigns } from "../api/api";
import '../assests/campaign.css';

const CampaignForm=() => {
    const [formData,setFormData] = useState({
       title : "",
       description : "",
       goal_amount : "",
       creator : ""
    });


    const handleChange=(e) => {
        setFormData({...formData,[e.target.name] : e.target.value});
    }

    const handleSubmit=async(e) => {
        e.preventDefault();
        try{
          await createCampaigns(formData);
          alert("Campaign Created SuccessFully!!!")
        }catch(error){
          console.log(error)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="campaign-form">
      <h2 className="form-title">Create Your Campaign 🚀</h2>

      <div className="form-group">
        <label htmlFor="title">Campaign Title</label>
        <input
          type="text"
          name="title"
          id="title"
          placeholder="Enter an eye-catching title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          name="description"
          id="description"
          placeholder="Tell your story to inspire contributors"
          value={formData.description}
          onChange={handleChange}
          rows="4"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="goal_amount">Goal Amount (₹)</label>
        <input
          type="number"
          name="goal_amount"
          id="goal_amount"
          placeholder="Set a target amount"
          value={formData.goal_amount}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="creator">Your Name</label>
        <input
          type="text"
          name="creator"
          id="creator"
          placeholder="Enter your name"
          value={formData.creator}
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit" className="submit-button">
        Create Campaign ✨
      </button>
    </form>
    );
}

export default CampaignForm;