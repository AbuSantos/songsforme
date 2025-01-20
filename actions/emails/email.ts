"use server";
import { Resend } from "resend";
import BullchordWelcomeEmail from "../../components/email/Email";
import React from "react";

if (!process.env.RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY is not defined in the environment variables");
}

const resend = new Resend(process.env.RESEND_API_KEY as string);

export const sendWelcomeEmail = async (
  email: string,
  artisteName: string | "Artiste"
) => {
  try {
    const { data } = await resend.emails.send({
      from: "onboard@bullchord.xyz",
      to: email,
      subject: "Welcome To Bullchord",
      react: React.createElement(BullchordWelcomeEmail, {
        userFirstname: artisteName,
      }),
    });
    return { message: data, status: "success" };
  } catch (error) {
    console.log(error);
    return { status: error, message: null };
  }
};
