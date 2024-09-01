import "./CreateAdmin.css";
import { useState, useContext } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  TextField,
  Typography,
  Button,
  IconButton,
  InputAdornment,
} from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { AuthContext } from "../AuthProvider";
import axios from "axios";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FetchAdmins } from "../Controller";

export default function CreateAdmin() {
  const { loggedin, amAdmin, tokenContext, setAdminsContext } =
    useContext(AuthContext);
  const [name, setName] = useState("");
  const [emailId, setEmailid] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [signupDisabled, setSignupDisabled] = useState(false);

  // Regex patterns for validation
  const nameRegex = /^[a-zA-Z\s]{4,40}$/;
  const usernameRegex = /^[a-zA-Z\d\s]{4,40}$/;
  const emailRegex = /^[^\s@]{1,50}@[^\s@]{1,50}\.[^\s@]{2,50}$/;
  const passwordRegex =
    /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;

  function generatePassword() {
    const length = 20;
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*_+-=|:.?";
    let password = "";

    while (password.length < length) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      const randomChar = charset.charAt(randomIndex);
      password += randomChar;
    }

    // Check if the password satisfies the regex rule
    if (!passwordRegex.test(password)) {
      // If the generated password does not satisfy the regex rule, generate a new one recursively
      return generatePassword();
    }

    return password;
  }

  const handleGeneratePassword = async () => {
    setPassword(generatePassword());
  };

  const handleCopyPassword = async () => {
    setConfirmPassword(password);
  };

  const validate = async () => {
    if (!emailRegex.test(emailId)) {
      toast.warn("Enter a valid Email address!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
        onClose: () => {
          setSignupDisabled(false);
        },
      });
      return false;
    }
    if (!nameRegex.test(name)) {
      toast.warn("Name should be in a-z or A-Z and 4-40 character long", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
        onClose: () => {
          setSignupDisabled(false);
        },
      });
      return false;
    }
    if (!usernameRegex.test(username)) {
      toast.warn(
        "Username should be in a-z or A-Z or 0-9 and 4-40 character long",
        {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
          onClose: () => {
            setSignupDisabled(false);
          },
        }
      );
      return false;
    }
    if (!passwordRegex.test(password)) {
      toast.warn(
        "Password must contain 1 upper case letter, 1 lower case letter, 1 number or special character",
        {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
          onClose: () => {
            setSignupDisabled(false);
          },
        }
      );
      return false;
    }
    if (password !== confirmPassword) {
      toast.warn("Password does not match with confirm password", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
        onClose: () => {
          setSignupDisabled(false);
        },
      });
      return false;
    }
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_STYLEKUNJ_BACKEND_URL}/auth/check/${username}/admin`
      );
      if (res.data.exist) {
        toast.warn("Username already exists", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
          onClose: () => {
            setSignupDisabled(false);
          },
        });
        return false;
      } else {
        return true;
      }
    } catch (error) {
      toast.error("Failed to fetch data from server", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
        onClose: () => {
          setSignupDisabled(false);
        },
      });
      return false;
    }
  };

  const handleCreateAdmin = async () => {
    setSignupDisabled(true);
    const res = await validate();
    if (res && loggedin && amAdmin) {
      try {
        await axios.post(
          `${process.env.REACT_APP_STYLEKUNJ_BACKEND_URL}/auth/secure/admin/signup/by-adm`,
          {
            name,
            email: emailId,
            username,
            password,
          },
          {
            headers: {
              Authorization: `Bearer ${tokenContext}`,
            },
          }
        );
        await axios.post(
          `${process.env.REACT_APP_STYLEKUNJ_BACKEND_URL}/mail/notification/create-admin`,
          {
            username,
            password,
          },
          {
            headers: {
              Authorization: `Bearer ${tokenContext}`,
            },
          }
        );

        await FetchAdmins(amAdmin, setAdminsContext, tokenContext);

        toast.success("Admin created!", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
          onClose: () => {
            setName("");
            setEmailid("");
            setUsername("");
            setPassword("");
            setConfirmPassword("");
            setSignupDisabled(false);
          },
        });
      } catch (error) {
        if (error.code === "ERR_NETWORK") {
          toast.error("Check your internet connection!", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Bounce,
            onClose: () => {
              setSignupDisabled(false);
            },
          });
        } else {
          toast.error("Failed to create Admin!", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Bounce,
            onClose: () => {
              setSignupDisabled(false);
            },
          });
        }
      }
    }
  };

  return (
    <>
    <div className="signup-container">
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "calc(100vh - 3.7rem)",
        }}
      >
        <Grid container justifyContent="center">
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.4)",
                borderRadius: "15px",
              }}
            >
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Create New Admin
                </Typography>
                <form>
                  <TextField
                    fullWidth
                    label="Name"
                    variant="outlined"
                    disabled={signupDisabled}
                    placeholder="Enter Full Name"
                    onChange={(e) => setName(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Email Address"
                    variant="outlined"
                    placeholder="Enter Email"
                    onChange={(e) => setEmailid(e.target.value)}
                    disabled={signupDisabled}
                  />
                  <TextField
                    fullWidth
                    label="Username"
                    variant="outlined"
                    placeholder="Enter Username"
                    disabled={signupDisabled}
                    onChange={(e) => setUsername(e.target.value)}
                    sx={{ mt: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Password"
                    variant="outlined"
                    type="password"
                    placeholder="Enter Password"
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={signupDisabled}
                    value={password}
                    sx={{ mt: 2 }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleGeneratePassword}
                            disabled={signupDisabled}
                            size="large"
                          >
                            <AutoAwesomeIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Confirm Password"
                    variant="outlined"
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    disabled={signupDisabled}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    sx={{ mt: 1 }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleCopyPassword}
                            disabled={signupDisabled}
                            size="large"
                          >
                            <ContentCopyIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleCreateAdmin}
                    disabled={signupDisabled}
                    sx={{ mt: 3 }}
                  >
                    Create Admin
                  </Button>
                </form>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </div>
    <ToastContainer />
    </>
  );
}
