import nodemailer from "nodemailer"
import { Institution } from "../models/institution.model.js";
import { Sensor } from "../models/sensor.model.js";

const {
  GOOGLE_GMAIL_USER,
  GOOGLE_APP_PASSWORD,
} = process.env;

const alertMail = (name, location) => {
                          return `<div style="background-color: #f2f2f2; padding: 20px;">
                            <h2 style="color: #ff0000;">
                              Alert: Device Issue
                            </h2>
                            <p> <strong> Device Name: </strong> ${name} </p>
                            <p> <strong> Location: </strong> ${location.latitude} , ${location.longitude} </p>
                            <p> We have detected an issue with the device. Immediate action may be required.</p><p>Please investigate the issue promptly.</p>
                            <p> Thank you. </p>
                          </div>`};

const warningMail = (name, location) => {
                            return `<div style="background-color: #f2f2f2; padding: 20px;">
                            <h2 style="color: #ff9900;">
                              Warning: Device Alert
                            </h2>
                            <p> <strong> Device Name: </strong> ${name} </p>
                            <p> <strong> Location: </strong> ${location.latitude} , ${location.longitude} </p>
                            <p> We have detected a warning on the device. Please take necessary precautions.</p>
                            <p>This may require attention to prevent a potential issue.</p>
                            <p>Thank you.</p>
                          </div>`};

export const sendEmail = async (sensorId, emailType) => {
    if (!sensorId) {
      throw new Error("Sensor ID is required");
    }
    if (!emailType) {
      throw new Error("Email Type is required");
    }
    if (!["warning", "alert"].includes(emailType)) {
      return;
    }
    try {
      const { device : { institution, name, location } } = await Sensor.findById(sensorId).populate("device");
      const { email } = await Institution.findById(institution);
      const transporter = nodemailer.createTransport({
      service: "gmail",
        auth: {
          user: GOOGLE_GMAIL_USER,
          pass: GOOGLE_APP_PASSWORD
        }
      });
      const mailOptions = {
        to: email,
        subject: `${emailType} for Device ${name} at ${location.latitude}, ${location.longitude}`,
        html: `${emailType == "warning" ? warningMail(name, location) : alertMail(name, location)}`,
      };
      const mailResponse = await transporter.sendMail(mailOptions);
      return mailResponse;
  } catch (error) {
    throw new Error(error);
  }
}