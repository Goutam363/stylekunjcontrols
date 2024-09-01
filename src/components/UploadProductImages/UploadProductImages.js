import { useState, useContext } from "react";
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  CardActions,
} from "@mui/material";
import { AuthContext } from "../AuthProvider";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FetchProducts, UploadProductImagesIntoServer, VerifyProductByid } from "../Controller";

export default function UploadProductImages() {
  const { amAdmin, tokenContext, setProductsContext } = useContext(AuthContext);
  const [productid, setProductid] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [submitDisabled, setSubmitDisabled] = useState(false);

  // Regex patterns for validation
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const jpgRegex = /\.jpg$/i;

  const validate = () => {
    if (selectedFiles.length === 0) {
      toast.warn("Please select at least one file", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
      return false;
    }
    if (!uuidRegex.test(productid)) {
      toast.warn("It's not a valid product id. Enter carefully.", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
      return false;
    }
    for (const file of selectedFiles) {
      if (!jpgRegex.test(file.name)) {
        toast.warn("Please select only JPG files", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
        });
        return false;
      }
    }
    return true;
  };

  const handleProductidChange = (event) => {
    setProductid(event.target.value);
  };

  const handleFileChange = (event) => {
    setSelectedFiles(Array.from(event.target.files));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitDisabled(true);
    if (validate()) {
      try {
        const product = await VerifyProductByid(
          amAdmin,
          productid,
          tokenContext
        );

        if (product) {
          // Upload the files to Firebase Storage
          const formData = new FormData();
          selectedFiles.forEach((file, index) => {
            const modifiedFilename = `${productid}${index + 1}.jpg`;
            formData.append("files", file, modifiedFilename);
          });

          await UploadProductImagesIntoServer(amAdmin, formData, tokenContext);

          // await FetchProducts(amAdmin, setProductsContext, tokenContext);
          setTimeout(async () => {
            await FetchProducts(amAdmin, setProductsContext, tokenContext);
          }, 2000);

          setProductid("");
          setSelectedFiles([]);

          toast.success("Product images uploaded successfully!", {
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
              setSubmitDisabled(false);
            },
          });
        } else {
          toast.warn(`Product with id: ${productid} not found!`, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Bounce,
          });
          setSubmitDisabled(false);
        }
      } catch (error) {
        if (error.code === "ERR_NETWORK") {
          toast.warn("Check your internet connection!", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Bounce,
          });
          setSubmitDisabled(false);
        } else {
          console.log(error);
          toast.error(
            `Something went wrong! error code "${error.code}". Please contact to stylekunj team.`,
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
            }
          );
          setSubmitDisabled(false);
        }
      }
    } else {
      setSubmitDisabled(false);
    }
  };

  return (
    <>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Upload Product Images
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Product id"
              value={productid}
              placeholder="Enter Product id"
              onChange={handleProductidChange}
              fullWidth
              margin="normal"
            />
            <input
              type="file"
              accept="image/jpeg"
              multiple
              onChange={handleFileChange}
            />
            <Typography variant="body2" color="textSecondary" component="p">
              {selectedFiles.length > 0
                ? `${selectedFiles.length} files selected`
                : "No files selected"}
            </Typography>
            <CardActions>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={submitDisabled}
              >
                Submit
              </Button>
            </CardActions>
          </form>
        </CardContent>
      </Card>
      <ToastContainer />
    </>
  );
}
