import React, { useState } from "react";
import {
    FacebookShareButton,
    TwitterShareButton,
    WhatsappShareButton,
    LinkedinShareButton,
} from "react-share";
import { FaFacebook, FaTwitter, FaWhatsapp, FaLinkedin } from "react-icons/fa"; 
import { shareCampaign } from "../api/api";

const ShareCampaign = ({ campaign }) => {
    const [shareCount, setShareCount] = useState(campaign.share_count);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleShare = async () => {
        setIsLoading(true);
        setError("");
        try {
            await shareCampaign(campaign.id);
            setShareCount((prev) => prev + 1);
        } catch (err) {
            setError("Failed to update share count. Please try again.");
            console.error("Error updating share count:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const shareUrl = `${window.location.origin}/campaigns/${campaign.id}`;
    const shareMessage = `Support this campaign: ${campaign.title}`;

    return (
        <div className="share-campaign bg-white p-6 rounded-2xl shadow-lg max-w-sm mx-auto">
            <p className="text-blue-600 font-semibold">
                Shares: {shareCount}
                {shareCount > 0 ? ' People shared the Campaign' : ''}
                </p>

            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

            <div className="social-buttons flex gap-4 mt-4 justify-center">
                <FacebookShareButton
                    url={shareUrl}
                    quote={shareMessage}
                    onClick={handleShare}
                    className="flex items-center justify-center"
                >
                    <FaFacebook
                        size={40}
                        className="text-[#1877F2] hover:scale-110 transition-transform cursor-pointer"
                        title="Share on Facebook"
                    />
                </FacebookShareButton>


                <TwitterShareButton
                    url={shareUrl}
                    title={shareMessage}
                    onClick={handleShare}
                    className="flex items-center justify-center"
                >
                    <FaTwitter
                        size={40}
                        className="text-[#1DA1F2] hover:scale-110 transition-transform cursor-pointer"
                        title="Share on Twitter"
                    />
                </TwitterShareButton>


                <WhatsappShareButton
                    url={shareUrl}
                    title={shareMessage}
                    onClick={handleShare}
                    className="flex items-center justify-center"
                >
                    <FaWhatsapp
                        size={40}
                        className="text-[#25D366] hover:scale-110 transition-transform cursor-pointer"
                        title="Share on WhatsApp"
                    />
                </WhatsappShareButton>

            
                <LinkedinShareButton
                    url={shareUrl}
                    title={shareMessage}
                    summary={campaign.description}
                    source={shareUrl}
                    onClick={handleShare}
                    className="flex items-center justify-center"
                >
                    <FaLinkedin
                        size={40}
                        className="text-[#0077B5] hover:scale-110 transition-transform cursor-pointer"
                        title="Share on LinkedIn"
                    />
                </LinkedinShareButton>
            </div>

            {isLoading && <p className="text-sm text-gray-500 mt-2">Updating share count...</p>}
        </div>
    );
};

export default ShareCampaign;
