import React,{useState} from "react";
import '../index.css';

const DonateModal=({campaign,onClose,onDonate}) => {
       const [amount,setAmount]=useState("");
        
       const handleSubmit=(e) => {
        e.preventDefault();
        onDonate(campaign,amount);
        onClose();
       };

       return (
        <div className="donate-modal">
           <div className="modal-content">
            <h2>Donate to {campaign.title}</h2>
              <form onSubmit={handleSubmit}>
                <input
                type="number"
                placeholder="Enter Amount (Rs)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                />
                <button type="submit">Donate</button>
              </form>
              <button onClick={onClose}>Close</button>
           </div>
        </div>
       )
};

export default DonateModal