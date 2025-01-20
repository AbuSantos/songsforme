"use server";
import { Resend } from "resend";
import BullchordCongratulatoryEmail from "../../components/email/congratulations-email";
import React from "react";

if (!process.env.RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY is not defined in the environment variables");
}

const resend = new Resend(process.env.RESEND_API_KEY as string);

export const sendCongratulatoryEmail = async (
  songName: string,
  price: string,
  imageUrl: string,
  email: string,
  itemUrl: string
) => {
  try {
    const { data } = await resend.emails.send({
      from: "sales@bullchord.xyz",
      to: email,
      subject: "Congratutions on your sale",
      react: React.createElement(BullchordCongratulatoryEmail, {
        songName: songName,
        price: price,
        imageUrl: imageUrl,
        itemUrl: itemUrl,
      }),
    });
    return { message: data, status: "success" };
  } catch (error) {
    console.log(error);
    return { status: error, message: null };
  }
};
