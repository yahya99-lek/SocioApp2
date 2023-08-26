import { Box } from "@mui/material";

import React from 'react'

const UserImage = ({image, size="60px"}) => {
  //console.log(image);
  return (
    <Box width={size} height={size}>
        <img 
        //Object fit crops the side of the image to be centered
            style={{objectFit: "cover", borderRadius: "50%"}}
            width={size}
            height={size}
            alt="user"
            src={`http://localhost:3001/assets/${image}`}
        /> 
    </Box>
  )
}

export default UserImage