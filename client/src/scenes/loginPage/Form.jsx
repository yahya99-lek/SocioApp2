import React,{useState} from 'react'
import {
    Box,
    Button,
    IconButton,
    TextField,
    useMediaQuery,
    Typography,
    useTheme,
    InputAdornment,
} from '@mui/material';
import { Visibility, VisibilityOff } from "@mui/icons-material";
import  EditOutlined  from '@mui/icons-material/EditOutlined';
import {Formik} from "formik";
import * as yup from "yup";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLogin } from 'state';
import Dropzone from 'react-dropzone';
import FlexBetween from 'components/FlexBetween';

const registerSchema = yup.object().shape({
    firstName: yup.string().required("required"),
    lastName: yup.string().required("required"),
    email: yup.string().email("invalid email").required("required"),
    password: yup.string().required("required"),
    location: yup.string().required("required"),
    occupation: yup.string().required("required"),
    picture: yup.string().required("required"),
});

const loginSchema = yup.object().shape({
    email: yup.string().email("invalid email").required("required"),
    password: yup.string().required("required"),

});

const initialValuesRegister = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    location: "",
    occupation: "",
    picture: "",
};

const initialValuesLogin = {
    email: "",
    password: "",
};

const Form = () => {
    // so this to set the page to login or register
    const [pageType,setPageType] = useState("login");
    const [showPassword,setShowPassword] = useState(false);
    const {palette} = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isNonMobile = useMediaQuery("min-width:600px");
    const isLogin = pageType === "login";
    const isRegister = pageType === "register";
    const register = async (values,onSubmitProps) => {
        //this allows us to send form info with image
        const formData = new FormData();
        for(let key in values){
            formData.append(key,values[key]);
        }
        formData.append("picturePath", values.picture.name);

        const savedUserResponse = await fetch(
            "http://localhost:3001/auth/register",
            {
                method: "POST",
                body: formData,
            }
        );
        const savedUser = await savedUserResponse.json();
        onSubmitProps.resetForm();

        if(savedUser){
            setPageType("login");
        }
    };
    const login = async(values,onSubmitProps) => {
        const loggedInResponse = await fetch(
            "http://localhost:3001/auth/login",
            {
                method: "POST",
                headers: {"Content-type": "application/json"},
                body: JSON.stringify(values),
            }
        );
        const loggedIn = await loggedInResponse.json();
        onSubmitProps.resetForm();
        if(loggedIn){
            dispatch(
                setLogin({
                    user: loggedIn.user,
                    token: loggedIn.token,
                })
            );
            navigate("/home");
        }

    }

    const handleFormSubmit = async(values,onSubmitProps) => {
        if(isLogin) await login(values,onSubmitProps);
        if(isRegister) await register(values,onSubmitProps);
    };
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
      };
    const passwordStrength = (password) => {
        // Define your password strength rules and return a correct message
        if (password.length < 8){
            return 'Password should be at least 8 caracters';
        }
        return 'password is Strong';
    };

  return (
    <Formik 
        onSubmit={handleFormSubmit}
        initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
        validationSchema={isLogin ? loginSchema : registerSchema}
    >
        {({
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
            setFieldValue,
            resetForm,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
                display="grid"
                gap="30px"
                gridTemplateColumns="repeat(4, minmax(0,1fr)"
                sx={{
                    "& > div": {gridColumn: isNonMobile ? undefined : "span 4"},
                }}
            >
                {isRegister && (
                    <>
                        <TextField 
                            label="first name"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.firstName}
                            name='firstName'
                            error={Boolean(touched.firstName) && Boolean(errors.firstName)}
                            helperText={touched.firstName && errors.firstName}
                            sx={{ gridColumn: "span 2"}}
                        />
                            <TextField 
                            label="last name"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.lastName}
                            name='lastName'
                            error={Boolean(touched.lastName) && Boolean(errors.lastName)}
                            helperText={touched.lastName && errors.lastName}
                            sx={{ gridColumn: "span 2"}}
                        />
                            <TextField 
                            label="location"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.location}
                            name='location'
                            error={Boolean(touched.location) && Boolean(errors.location)}
                            helperText={touched.location && errors.location}                            sx={{ gridColumn: "span 4"}}

                        />
                            <TextField 
                            label="occupation"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.occupation}
                            name='occupation'
                            error={Boolean(touched.occupation) && Boolean(errors.occupation)}
                            helperText={touched.occupation && errors.occupation}
                            sx={{ gridColumn: "span 4"}}
                            />
                        
                        <Box 
                        // this box for inputing profile image
                            gridColumn="span 4"
                            border={`1px solid ${palette.neutral.medium}`}
                            borderRadius="5px"
                            p="1rem"
                        >
                            <Dropzone 
                                acceptedFiles=".jpeg,.png,.jpeg"
                                multiple={false}
                                // so this is for setting the setFieldvalue for a specific formik picture   
                                onDrop={(acceptedFiles) =>
                                    setFieldValue("picture", acceptedFiles[0]) 
                                }
                            >
                                {({ getRootProps, getInputProps}) => (
                                    <Box 
                                      {...getRootProps()}
                                      border={`2px dashed ${palette.primary.main}`}
                                      p="1rem"
                                      sx={{"&:hover": { cursor: "pointer"}}}
                                    >
                                        <input {...getInputProps()} />
                                        {!values.picture ? (
                                            <p>Add picture Here</p> 
                                        ) : (
                                            <FlexBetween>
                                                <Typography>{values.picture.name}</Typography>
                                                <EditOutlined />
                                            </FlexBetween>
                                        )}
                                    </Box>
                                )}
                            </Dropzone>
                        </Box>
                    </>
                )}
                 <TextField 
                    label="Email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.email}
                    name='email'
                    error={Boolean(touched.email) && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                    sx={{ gridColumn: "span 4"}}        
                />
                <TextField 
                    label="password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.password}
                    name='password'
                    type={showPassword ? "text" : "password"}
                    error={Boolean(touched.password) && Boolean(errors.password)}
                    helperText={touched.password && errors.password}
                    sx={{ gridColumn: "span 4"}}  
                    InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={togglePasswordVisibility}
                              edge="end"
                            >
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}      
                />
                <Typography
                  variant="caption"
                  color={palette.primary.main}
                  gutterBottom
                >
                    {passwordStrength(values.password)}
                </Typography>
                {isRegister && (
                <TextField
                  label="confirm password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.confirmPassword}
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  error={
                    Boolean(touched.confirmPassword) &&
                    Boolean(errors.confirmPassword)
                  }
                  helperText={touched.confirmPassword && errors.confirmPassword}
                  sx={{ gridColumn: "span 4" }}
                />
                )}
            </Box>
            
            { /*BUTTONS */}
            <Box >
                <Button fullWidth
                type='submit'
                sx={{
                    m: "2rem 0",
                    p: "1rem",
                    backgroundColor: palette.primary.main,
                    color: palette.background.alt,
                    "&:hover" : {color: palette.primary.main},
                }}
                >
                    {isLogin ? "LOGIN" : "REGISTER"}
                </Button>
                <Typography onClick ={() => {
                    setPageType(isLogin ? "register" : "login");
                    resetForm();
                }}
                sx={{
                    textDecoration: "underline",
                    color: palette.primary.main,
                    "&:hover": {
                        cursor: "pointer",
                        color: palette.primary.light,
                    },
                }}
                >
                    	{ isLogin ? "dont have an account? sign up here"
                        : "Already have an account? Login here"}
                </Typography>
            </Box>
          </form>  
        )}

    </Formik>
  )
}

export default Form