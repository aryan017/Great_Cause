# Great_Cause
A modern crowdfunding application built to support and manage financial campaigns seamlessly. It allows users to create campaigns, make donations, and track progress with secure payment integrations.

# Table of Contents
- [About the Project](#about-the-project)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)

## About the Project
Great_Cause is a crowdfunding platform designed to enable users to support and manage meaningful campaigns. Users can browse active campaigns, contribute securely using Razorpay, and track the progress of their contributions. The application is built with modern technologies, offering a user-friendly and secure experience.

## Screenshots

### Dashboard
![Dashboard Screenshot](assets/Screenshot%20(28).png "Dashboard View")
![Dashboard Screenshot](assets/Screenshot%20(29).png "Dashboard View")

### Donate PopUp
![Donate PopUp](assets/Screenshot%20(30).png "Donate PopUp View")

### Razorpay Page
![Razorpay Page](assets/Screenshot%20(31).png "Razorpay Page View")
![Razorpay Page](assets/Screenshot%20(32).png "Razorpay Page View")
![Razorpay Page](assets/Screenshot%20(33).png "Razorpay Page View")
![Razorpay Page](assets/Screenshot%20(34).png "Razorpay Page View")
![Razorpay Page](assets/Screenshot%20(35).png "Razorpay Page View")

### Campaign Creation Page
![Campaign Creation Page](assets/Screenshot%20(36).png "Campaign Creation Page View")
![Campaign Creation Page](assets/Screenshot%20(37).png "Campaign Creation Page View")
![Campaign Creation Page](assets/Screenshot%20(38).png "Campaign Creation Page View")

## Features
- Campaign Management: Create, update, and delete campaigns.
- Secure Donations: Integrated Razorpay for safe and efficient payment processing.
- Real-Time Data Updates: Track campaign progress and contribution statuses dynamically.
- User Authentication: Secure login and registration for contributors and campaign creators.
- Responsive UI: Optimized for all devices with an intuitive design.

## Technologies Used
- **Frontend**: React, HTML, CSS, Tailwind CSS
- **Backend**: Flask
- **Database**: SQL (with SQLAlchemy ORM)
- **Authentication**: JWT (JSON Web Tokens)
- **Payment Gateway**: Razorpay
- **Styling**: CSS, Tailwind

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/Great_Cause.git

2. Navigate to the project directory:
   ```bash
   cd Great_Cause

3. Install Frontend dependencies:
   ```bash
   npm install

4. Run the frontend development server:
   ```bash
   npm start

5. Set up the backend:

6. Navigate to the backend folder:
   ```bash
   cd backend

7. Install Python dependencies:
   ```bash
   pip install -r requirements.txt

8. Run the Flask development server:
   ```bash
   flask run --reload

9. Ensure you configure environment variables:

10. Add your Razorpay keys in the .env file:
   RAZORPAY_KEY_ID=<your-razorpay-key-id>
   RAZORPAY_SECRET=<your-razorpay-secret>
