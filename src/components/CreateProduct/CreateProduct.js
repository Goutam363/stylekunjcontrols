import "./CreateProduct.css";
import { useState, useContext } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  MenuItem,
} from "@mui/material";
import { ToastContainer, toast, Bounce } from "react-toastify";
import { AuthContext } from "../AuthProvider";
import { FetchProducts } from "../Controller";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProductCategory = {
  Anklets: "Anklets",
  Bangles: "Bangles",
  Bracelets: "Bracelets",
  Brooches: "Brooches",
  Chain: "Chain",
  Charms: "Charms",
  Choker: "Choker",
  Earrings: "Earrings",
  Ghungroo: "Ghungroo",
  Jewelry_Sets: "Jewelry_Sets",
  Jhumkas: "Jhumkas",
  Maang_Tikka: "Maang_Tikka",
  Mangalsutra: "Mangalsutra",
  Necklaces: "Necklaces",
  Nose_Ring: "Nose_Ring",
  Pendants: "Pendants",
  Rings: "Rings",
  Toe_Ring: "Toe_Ring",
  Waist_Chains: "Waist_Chains",
  Watches: "Watches",
};

export default function CreateProduct() {
  const { loggedin, amAdmin, tokenContext, setProductsContext } = useContext(AuthContext);
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [keywords, setKeywords] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [mrp, setMrp] = useState(0);
  const [createpdDisabled, setCreatepdDisabled] = useState(false);
  const navigate = useNavigate();

  // Regex patterns for validation
  const nameRegex = /^[a-zA-Z0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{4,40}$/;
  const descriptionRegex = /^[a-zA-Z0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{10,3000}$/;
  const keywordsRegex = /^[a-zA-Z0-9,\s]{10,5000}$/;

  const validate = async () => {
    if (!nameRegex.test(productName)) {
      toast.warn("Name should be 4-40 characters long", {
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
          setCreatepdDisabled(false);
        },
      });
      return false;
    }
    if (!descriptionRegex.test(productDescription)) {
      toast.warn("Name should be between 10-3000 characters", {
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
          setCreatepdDisabled(false);
        },
      });
      return false;
    }
    if (!keywordsRegex.test(keywords)) {
      toast.warn(
        `Keywords should be in a-z or A-Z or 0-9 and separated by "," & "space" and should be 10-5000 characters long`,
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
            setCreatepdDisabled(false);
          },
        }
      );
      return false;
    }
    return true;
  };


  const handleCreateProduct = async () => {
    // Handle create product logic here
    setCreatepdDisabled(true);
    const res = await validate();
    if (res && loggedin && amAdmin) {
      try {
        await axios.post(`${process.env.REACT_APP_STYLEKUNJ_BACKEND_URL}/product`, {
            product_name: productName,
            product_description: productDescription,
            keywords,
            category,
            price,
            stock,
            mrp,
          }, {
            headers: {
              Authorization: `Bearer ${tokenContext}`,
            },
          });

        await FetchProducts(setProductsContext);

        toast.success("Product created!", {
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
            setProductName("");
            setProductDescription("");
            setKeywords("");
            setCategory("");
            setPrice(0);
            setStock(0);
            setMrp(0);
            setCreatepdDisabled(false);
            navigate("/products");
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
              setCreatepdDisabled(false);
            },
          });
        } else {
          toast.error("Failed to create Product!", {
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
              setCreatepdDisabled(false);
            },
          });
        }
      }
    }
  };
  return (
    <>
      <div className="createpd-container">
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
                    Create New Product
                  </Typography>
                  <form>
                    <TextField
                      fullWidth
                      label="Product Name"
                      variant="outlined"
                      placeholder="Enter Product Name"
                      disabled={createpdDisabled}
                      onChange={(e) => setProductName(e.target.value)}
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      fullWidth
                      label="Product Description"
                      variant="outlined"
                      placeholder="Enter Product Description"
                      disabled={createpdDisabled}
                      onChange={(e) => setProductDescription(e.target.value)}
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      fullWidth
                      label="Keywords"
                      variant="outlined"
                      placeholder="Enter Keywords"
                      disabled={createpdDisabled}
                      onChange={(e) => setKeywords(e.target.value)}
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      fullWidth
                      select
                      label="Category"
                      variant="outlined"
                      value={category}
                      disabled={createpdDisabled}
                      onChange={(e) => setCategory(e.target.value)}
                      sx={{ mb: 2 }}
                    >
                      {Object.values(ProductCategory).map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </TextField>
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <TextField
                          fullWidth
                          label="Price"
                          variant="outlined"
                          type="text"
                          disabled={createpdDisabled}
                          placeholder="Enter Price"
                          value={price}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (
                              value === "" ||
                              (/^\d*\.?\d*$/.test(value) &&
                                !value.includes("-") &&
                                !value.includes("+") &&
                                !value.includes("/"))
                            ) {
                              setPrice(value);
                            }
                          }}
                          sx={{ mb: 2 }}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <TextField
                          fullWidth
                          label="Stock"
                          variant="outlined"
                          type="text"
                          disabled={createpdDisabled}
                          placeholder="Enter Stock"
                          value={stock}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (
                              value === "" ||
                              (/^\d*$/.test(value) &&
                                !value.includes("-") &&
                                !value.includes("+") &&
                                !value.includes("/"))
                            ) {
                              setStock(value);
                            }
                          }}
                          sx={{ mb: 2 }}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <TextField
                          fullWidth
                          label="MRP"
                          variant="outlined"
                          type="text"
                          disabled={createpdDisabled}
                          placeholder="Enter MRP"
                          value={mrp}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (
                              value === "" ||
                              (/^\d*\.?\d*$/.test(value) &&
                                !value.includes("-") &&
                                !value.includes("+") &&
                                !value.includes("/"))
                            ) {
                              setMrp(value);
                            }
                          }}
                          sx={{ mb: 2 }}
                        />
                      </Grid>
                    </Grid>

                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      disabled={createpdDisabled}
                      onClick={handleCreateProduct}
                      sx={{ mt: 3 }}
                    >
                      Create Product
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
