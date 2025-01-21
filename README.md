# EnviScribe

EnviScribe is a comprehensive environmental monitoring system designed to collect, analyze, and visualize data from various sensors. This allows institutions to effectively track and respond to environmental changes, ensuring the safety and sustainability of their surroundings.  It provides real-time alerts and historical data logging for informed decision-making.

## Features

* **Real-Time Monitoring:**  Collects up-to-the-minute data from connected sensors, providing a live view of environmental conditions.
* **Alert System:**  Triggers email notifications based on predefined thresholds, enabling immediate response to critical events.
* **Data Logging and Visualization:** Stores historical sensor data and presents it in an intuitive dashboard for analysis and reporting.
* **User Management:** Supports different user roles with varying levels of access to ensure data security and control.
* **Device and Sensor Management:** Enables easy registration and configuration of devices and associated sensors.
* **Institution Management:**  Provides a platform for institutions to manage their profiles and associated devices/sensors.
* **Image Upload:** Facilitates uploading images related to environmental events or sensor locations.

## Technologies Used

* **Frontend:** React, TypeScript, Radix UI, Lucide React, React Hook Form, Zod, Sonner, Axios
* **Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, Cloudinary, Multer, Nodemailer
* **Database:** MongoDB

## Project Structure

The project is structured into frontend and backend directories.  Key functionalities are modularized into different routes and components. Middleware is used for authentication, authorization, and handling file uploads.  Utilities and helper functions are implemented for API responses, error handling, and other common tasks.


## Getting Started (For Developers)

1. Clone the repository: `git clone <repository_url>`
2. Navigate to the project directory: `cd EnviScribe`
3. Install dependencies (Frontend): `cd client && npm install`
4. Install dependencies (Backend): `cd server && npm install`
5. Configure environment variables: Create `.env` files in both the client and server directories and populate them with the required credentials.
6. Start the development server (Frontend): `npm run dev` (in the client directory)
7. Start the backend server: `npm start` (in the server directory)


## Future Enhancements

* **Advanced Analytics:** Integration of advanced data analysis techniques for predictive modeling and trend identification.
* **Mobile Application:** Development of a mobile app for convenient access to data and alerts.
* **Data Export:** Functionality to export data in various formats for reporting and integration with other systems.
* **Map Integration:** Displaying sensor locations and data on a map interface.


This README provides a high-level overview of EnviScribe. More detailed documentation and setup instructions can be found within the respective frontend and backend directories.
