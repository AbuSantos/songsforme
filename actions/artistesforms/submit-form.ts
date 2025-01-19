"use server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendArtistesForm = async (email: string, wallet: string) => {
  try {
    const { data } = await resend.emails.send({
      from: "onboard@bullchord.xyz",
      to: "abusomwansantos@gmail.com",
      subject: "Artiste Form Submission",
      html: `<p>Email: ${email}</p><p>Wallet: ${wallet}</p>`,
    });
    return { message: data, status: "success" };
  } catch (error) {
    console.log(error);
    return { status: error, message: null };
  }
};
