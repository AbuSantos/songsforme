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

interface BullchordWelcomeEmailProps {
    userFirstname: string;
}

export const BullchordWelcomeEmail = ({
    userFirstname,
}: BullchordWelcomeEmailProps) => (
    <Html>
        <Head />
        <Preview>
            Your Sound. Your Asset.
        </Preview>
        <Body style={main}>
            <Container style={container}>
                {/* ADD BULLCHORD LOGO */}
                {/* <Img
                    src={`${baseUrl}/static/koala-logo.png`}
                    width="170"
                    height="50"
                    alt="Koala"
                    style={logo}
                /> */}
                <Text style={paragraph}>Hi {userFirstname},</Text>
                <Text style={paragraph}>
                    Welcome to Bullchord, a platform where fans and artistes matters most. We are excited to have you onboard. Your sound, Your asset.
                </Text>
                <Section style={btnContainer}>
                    <Button style={button} href="https://bullchord.xyz/dashboard">
                        Get started
                    </Button>
                </Section>
                <Text style={paragraph}>
                    Best,
                    <br />
                    The Bullchord team
                </Text>
            </Container>
        </Body>
    </Html>
);

BullchordWelcomeEmail.PreviewProps = {
    userFirstname: "Alan",
} as BullchordWelcomeEmailProps;

export default BullchordWelcomeEmail;

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
