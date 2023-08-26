import { Typography,useTheme } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import useMediaQuery from "@mui/material/useMediaQuery";

import React from 'react'

const AdvertWidget = () => {
    const { palette} = useTheme();
    const dark = palette.neutral.dark;
    const main = palette.neutral.main;
    const medium = palette.neutral.medium;

  return (
    <WidgetWrapper>
        <FlexBetween>
            <Typography color={dark} variant="h5" fontWeight="500">
                Sponsored
            </Typography>
            <Typography color={medium}>Created At</Typography>
        </FlexBetween>
        <img 
            width="100%"
            height="auto"
            alt="advert"
            src="http://localhost:3001/assets/info4.jpeg"
            style={{ borderRadius: "0.75rem", margin: "0.75rem 0"}}
        />

        <FlexBetween>
            <Typography color={main}>Yemma beauty</Typography>
            <Typography color={medium}>Yemmabeauty.com</Typography>
        </FlexBetween>

        <Typography color={medium} m="0.5rem 0" >
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam quaerat voluptas nih
        </Typography>
    </WidgetWrapper>
  )
}

export default function AdvertContainer() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const containerWidth = isSmallScreen ? "100%" : "900px";

    return (
      <div style={{ maxWidth: containerWidth, margin: "0 auto" }}>
        <AdvertWidget />
      </div>
    );
}