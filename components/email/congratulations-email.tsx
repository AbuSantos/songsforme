import {
    Body,
    Button,
    Container,
    Head,
    Hr,
    Html,
    Img,
    Preview,
    Section,
    Text,
} from "@react-email/components";
import * as React from "react";

export interface BullchordWelcomeEmailProps {
    price: number, imageUrl: string, songName: string, itemUrl: string
}

export const BullchordCongratulatoryEmail = ({
    songName, price, imageUrl, itemUrl
}: BullchordWelcomeEmailProps) => (
    <Html>
        <Head />
        <Preview>
            Bullchord
        </Preview>
        <Body style={main}>
            <Container style={container}>

                <Text style={paragraph}>Congratulations, your items sold!</Text>
                <Text style={paragraph}>
                    You successfully sold your item, {songName} for {price}!  Your sound, Your asset.
                </Text>
                <Img
                    src={`${imageUrl}`}
                    width="400"
                    height="100"
                    alt={songName}
                    style={logo}
                />

                <Section style={btnContainer}>
                    <Button style={button} href="https://getkoala.com">
                        View Item
                    </Button>
                </Section>
                <Text style={paragraph}>
                    Bullcord,
                    <br />
                    Play,Trade,Earn
                </Text>
            </Container>
        </Body>
    </Html>
);



export default BullchordCongratulatoryEmail;

const main = {
    backgroundColor: "#ffffff",
    fontFamily:
        '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
    margin: "0 auto",
    padding: "20px 0 48px",
};

const logo = {
    margin: "0 auto",
    p: "10px"
};

const paragraph = {
    fontSize: "16px",
    lineHeight: "26px",
};

const btnContainer = {
    textAlign: "center" as const,
};

const button = {
    backgroundColor: "#5F51E8",
    borderRadius: "3px",
    color: "#fff",
    fontSize: "16px",
    textDecoration: "none",
    textAlign: "center" as const,
    display: "block",
    padding: "12px",
};

const hr = {
    borderColor: "#cccccc",
    margin: "20px 0",
};

const footer = {
    color: "#8898aa",
    fontSize: "12px",
};
