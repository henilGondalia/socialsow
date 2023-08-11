import React from "react";
import {
  Box,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
  Divider,
  Link,
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import UpDownMove from "components/UpDownMove";
import { useNavigate } from "react-router-dom";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  easeOut,
  cubicBezier,
} from "framer-motion";

function LandingPage() {
  const { palette } = useTheme();
  const navigate = useNavigate();
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const isMobileScreens = useMediaQuery("(min-width: 700px)");
  const imgDivRef = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: imgDivRef,
    offset: ["start end", "end end"],
  });
  const opacity = useTransform(scrollYProgress, [0.75, 1], ["1", "0"], {
    ease: easeOut,
  });
  const top = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.75, 1],
    ["-20vh", "-15vh", "-10vh", "5vh", "15vh"]
  );
  const rotateX = useTransform(scrollYProgress, [0, 1], [10, 0]);
  const rotateXSpringProps = useSpring(rotateX, {
    stiffness: 100,
    damping: 30,
  });

  const moreDivRef = React.useRef(null);
  const { scrollYProgress: whatMoreProgress } = useScroll({
    target: moreDivRef,
    offset: ["start end", "end end"],
  });
  const topMore = useTransform(
    whatMoreProgress,
    [0.3, 0.4, 0.5, 0.53, 0.9, 1],
    ["0%", "-5%", "-10%", "-30%", "-40%", "-50%"],
    { ease: cubicBezier(0.42, 0, 0.58, 1) }
  );
  const bottomMore = useTransform(
    whatMoreProgress,
    [0.3, 0.4, 0.5, 0.53, 0.9, 1],
    ["14%", "36%", "50%", "70%", "100%", "100%"],
    { ease: cubicBezier(0.42, 0, 0.58, 1) }
  );

  const communityDivRef = React.useRef(null);
  const { scrollYProgress: communityProgress } = useScroll({
    target: communityDivRef,
    offset: ["start end", "end end"],
  });
  const marginTop = useTransform(
    communityProgress,
    [0.3, 1],
    ["380px", "0px"],
    {
      ease: cubicBezier(0.42, 0, 0.58, 1),
    }
  );
  const marginTopLight = useTransform(
    communityProgress,
    [0.3, 1],
    ["-450px", "70px"],
    {
      ease: cubicBezier(0.42, 0, 0.58, 1),
    }
  );
  return (
    <Box backgroundColor={palette.background.alt}>
      {/* Navbar */}
      <FlexBetween
        width="100%"
        backgroundColor={palette.background.alt}
        p="1rem 6%"
        textAlign="center"
      >
        <Typography fontWeight="bold" fontSize="32px" color="primary">
          SocialSow
        </Typography>

        <Button
          onClick={() => navigate("/welcome")}
          sx={{
            color: palette.background.alt,
            backgroundColor: palette.primary.main,
            borderRadius: "3rem",
            padding: "0.6rem 2rem",
            fontSize: "14px",
          }}
        >
          Login
        </Button>
      </FlexBetween>
      {/* Hero Section */}
      <Box backgroundColor={palette.primary.light}>
        <UpDownMove
          alt="Message"
          crossOrigin="anonymous"
          src="../assets/Msg.png"
          style={{ left: "10vw" }}
        />
        <UpDownMove
          alt="Likes"
          crossOrigin="anonymous"
          src="../assets/Like.png"
          style={{ right: "10vw" }}
        />
        <Box
          width={isNonMobileScreens ? "50%" : "80%"}
          p="12% 2rem"
          m="auto"
          borderRadius="1.5rem"
          textAlign="center"
        >
          <Typography
            fontWeight="900"
            fontSize="4vw"
            textAlign="center"
            // sx={{ mb: "1rem" }}
          >
            Social Media Web App
          </Typography>
          <Typography
            fontWeight="500"
            fontSize="3vw"
            textAlign="center"
            sx={{ mb: "0.2rem" }}
          >
            Enhance Your Social Media Presence
          </Typography>
          <Typography
            fontWeight="200"
            fontSize={isNonMobileScreens ? "16px" : "2vw"}
            textAlign="center"
            sx={{ mb: "1.5rem", px: "25%" }}
          >
            Unlock the Potential of Your Social Reach Join Us Today
          </Typography>
          <Button
            onClick={() => navigate("/welcome")}
            sx={{
              color: palette.background.alt,
              backgroundColor: palette.primary.main,
              borderRadius: "3rem",
              padding: isNonMobileScreens ? "1rem 2rem" : "0.6rem 1.5rem",
              fontSize: isNonMobileScreens ? "16px" : "2vw",
            }}
          >
            Get Started
          </Button>
        </Box>
      </Box>
      {/* App Images */}
      <motion.div
        style={{
          position: "relative",
          width: "100%",
          height: isNonMobileScreens
            ? "60rem"
            : isMobileScreens
            ? "40rem"
            : "25rem",
          perspective: "600px",
        }}
        ref={imgDivRef}
      >
        <motion.img
          width="60%"
          height="auto"
          alt="writtenimage"
          crossOrigin="anonymous"
          src="../assets/DarkMode.png"
          style={{
            position: "absolute",
            left: "20%",
            top: top,
            rotateX: rotateXSpringProps,
          }}
        />
        <motion.img
          width="60%"
          height="auto"
          alt="blankimage"
          crossOrigin="anonymous"
          src="../assets/LightMode.png"
          style={{
            opacity: opacity,
            position: "absolute",
            left: "20%",
            // transform: `translate(-50%, 0) rotateX(10deg)`,
            rotateX: rotateXSpringProps,
            top: top,
          }}
        />
      </motion.div>
      {/* features */}
      <Box
        display="none"
        width="100%"
        // width={isNonMobileScreens ? "50%" : "93%"}
        // p={isNonMobileScreens ? "1rem 12%" : "1rem 6%"}
        m="auto"
        position="relative"
        overflow="hidden"
        ref={moreDivRef}
      >
        <motion.div
          id="top"
          style={{
            top: topMore,
            padding: `${isNonMobileScreens ? "1rem 12%" : "1rem 6%"}`,
          }}
        >
          <h1 id="top-h1" fontSize="15rem">
            What
          </h1>
        </motion.div>
        <motion.div id="center">
          <Box
            className="content"
            p={isNonMobileScreens ? "4rem 12%" : "4rem 6%"}
            mt="30vh"
          >
            <FlexBetween gap="4rem" my="4rem">
              <Typography fontSize="2rem" textAlign="center">
                Give people the power to build community
              </Typography>
              <img
                width="60%"
                height="auto"
                alt="social"
                crossOrigin="anonymous"
                src="../assets/social1.jpg"
              />
            </FlexBetween>
            <FlexBetween gap="4rem" mb="4rem">
              <img
                width="60%"
                height="auto"
                alt="social"
                crossOrigin="anonymous"
                src="../assets/social2.jpg"
              />
              <Typography fontSize="2rem" textAlign="center">
                and bring the world closer together
              </Typography>
            </FlexBetween>
            <FlexBetween gap="4rem" mb="4rem">
              <Typography fontSize="2rem" textAlign="center">
                Have a conversation to a friend or select group of people
              </Typography>
              <img
                width="60%"
                height="auto"
                alt="social"
                crossOrigin="anonymous"
                src="../assets/social3.jpg"
              />
            </FlexBetween>
            <FlexBetween gap="4rem" mb="4rem">
              <img
                width="60%"
                height="auto"
                alt="social"
                crossOrigin="anonymous"
                src="../assets/social4.jpg"
              />
              <Typography fontSize="2rem" textAlign="center">
                Discover content and People based on your interests
              </Typography>
            </FlexBetween>
          </Box>
        </motion.div>
        <motion.div
          id="bottom"
          style={{
            top: bottomMore,
            padding: `${isNonMobileScreens ? "1rem 12%" : "1rem 6%"}`,
          }}
        >
          <h1 id="bottom-h1">More</h1>
        </motion.div>
      </Box>
      {/* Connect */}
      <FlexBetween
        gap="1rem"
        sx={{
          height: "100vh",
          width: "100%",
          position: "relative",
          padding: `${isNonMobileScreens ? "1rem 12%" : "1rem 6%"}`,
          background: palette.primary.light,
        }}
        ref={communityDivRef}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            height: "100%",
            width: "40%",
          }}
        >
          <Typography
            sx={{ fontSize: "5vw", fontWeight: "900", lineHeight: "1" }}
          >
            Our community is evolving, so are we
          </Typography>
          <Typography fontSize="1vw">
            Connect with more people, build influence, and create compelling
            content that's distinctly yours.
          </Typography>

          <img
            height={isMobileScreens ? "50%" : "30%"}
            width={isMobileScreens ? "90%" : "100%"}
            alt="blankimage"
            crossOrigin="anonymous"
            src="../assets/Chatting.png"
            style={{ display: "none" }}
          />
        </Box>
        <Box
          sx={{
            width: "25%",
            height: "100vh",
            overflow: "hidden",
            display: isMobileScreens ? "block" : "none",
          }}
        >
          <motion.div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              width: "100%",
              height: "100vh",
              marginTop: marginTop,
            }}
          >
            <img
              width="100%"
              height="50%"
              alt="blankimage"
              crossOrigin="anonymous"
              src="../assets/darkpost1.png"
            />
            <img
              width="100%"
              height="50%"
              alt="blankimage"
              crossOrigin="anonymous"
              src="../assets/darkpost2.png"
            />
            <img
              width="100%"
              height="50%"
              alt="blankimage"
              crossOrigin="anonymous"
              src="../assets/darkpost3.png"
            />
          </motion.div>
        </Box>
        <Box
          sx={{
            width: isMobileScreens ? "25%" : "40%",
            height: "100vh",
            overflow: "hidden",
          }}
        >
          <motion.div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              width: "100%",
              height: "100vh",
              marginTop: marginTopLight,
            }}
          >
            <img
              width="100%"
              height="50%"
              alt="blankimage"
              crossOrigin="anonymous"
              src="../assets/lightpost1.png"
            />
            <img
              width="100%"
              height="50%"
              alt="blankimage"
              crossOrigin="anonymous"
              src="../assets/lightpost2.png"
            />
            <img
              width="100%"
              height="50%"
              alt="blankimage"
              crossOrigin="anonymous"
              src="../assets/lightpost3.png"
            />
          </motion.div>
        </Box>
      </FlexBetween>
      <Box
        sx={{
          height: "max-contnet",
          width: "100%",
          position: "relative",
          padding: `${isNonMobileScreens ? "1rem 12%" : "1rem 6%"}`,
          background: "rgb(0, 0, 0)",
        }}
      >
        <FlexBetween gap="1rem" marginBottom="0.5rem">
          <Typography color="#FFFFFF" fontSize="6vw">
            Want to Explore?
          </Typography>
          <Button
            onClick={() => navigate("/welcome")}
            sx={{
              color: palette.background.alt,
              backgroundColor: palette.primary.main,
              borderRadius: "3rem",
              padding: `${isNonMobileScreens ? "0.6rem 2rem" : "0.5rem 6%"}`,
              fontSize: "14px",
            }}
          >
            Get Started
          </Button>
        </FlexBetween>
        <Divider color="#FFFFFF" />
        <FlexBetween gap="1rem" marginTop="0.5rem">
          <Typography color="#FFFFFF">©️ 2023 Social Sow</Typography>
          <Link
            href="https://github.com/henilGondalia/socialsow"
            sx={{
              color: "#FFFFFF",
              fontSize: "14px",
              cursor: "pointer",
            }}
            underline="hover"
          >
            GitHub.
          </Link>
        </FlexBetween>
      </Box>
    </Box>
  );
}

export default LandingPage;
