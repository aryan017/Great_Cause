import React,{useState} from "react";
import { createCampaigns } from "../api/api";

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
            <h2>Create a Campaign</h2>
             <input
             type="text"
             name="title"
             placeholder="Campaign Title"
             value={formData.title}
             onChange={handleChange}
             required
             />

             <textarea
             name="description"
             placeholder="Campaign Description"
             value={formData.description}
             onChange={handleChange}
             required
             />

             <input
             type="number"
             name="goal_amount"
             placeholder="Goal Amount(in Rs)"
             value={formData.goal_amount}
             onChange={handleChange}
             required
             />

             <input
             type="text"
             name="creator"
             placeholder="Creator"
             value={formData.creator}
             onChange={handleChange}
             required
             />
             <button type="submit">Create Compaign</button>
        </form>
    );
}

export default CampaignForm;