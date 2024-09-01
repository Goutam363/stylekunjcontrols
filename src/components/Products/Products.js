import "./Products.css";
import { useState, useEffect, useMemo, useContext } from "react";
import {
  Box,
  Switch,
  Typography,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import DescriptionIcon from "@mui/icons-material/Description";
import { Link } from "react-router-dom";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { convertUTCToIST } from "../timeUtils";
import ProductActions from "./ProductActions";
import { AuthContext } from "../AuthProvider";
import RefreshBtn from "../RefreshButton/RefreshBtn";
import { FetchProducts } from "../Controller";
import { Checkbox } from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  Legend,
} from "recharts";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function Products() {
  const { loggedin, amAdmin, productsContext, setProductsContext } =
    useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [rowId, setRowId] = useState(null);
  const [refresh, setRefresh] = useState(0);
  const [autoHeight, setAutoHeight] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (productsContext.length === 0 || refresh > 0) {
          await FetchProducts(setProductsContext);
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
          return;
        } else {
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
          return;
        }
      }
    };

    fetchData();
  }, [refresh, loggedin]);

  useEffect(() => {
    setProducts(productsContext);
  }, [productsContext]);

  const columns = useMemo(
    () => [
      {
        field: "id",
        headerName: "Product id",
        width: 200,
        sortable: false,
        filterable: true,
      },
      {
        field: "product_name",
        headerName: "Product Name",
        width: 200,
        sortable: true,
        filterable: true,
        editable: true,
      },
      {
        field: "product_description",
        headerName: "Product Description",
        width: 200,
        sortable: false,
        filterable: true,
        editable: true,
      },
      {
        field: "isFeatured",
        headerName: "IsFeatured",
        width: 100,
        sortable: true,
        filterable: false,
        editable: true,
        type: "boolean",
      },
      {
        field: "keywords",
        headerName: "Keywords",
        width: 200,
        sortable: false,
        filterable: true,
        editable: true,
      },
      {
        field: "image",
        headerName: "Images",
        width: 130,
        sortable: false,
        filterable: false,
        editable: true,
        renderCell: (params) => {
          const imageLinks = params.value.split("|");
          return (
            <div>
              {imageLinks.map((link, index) => (
                <a
                  key={index}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ marginRight: 8 }}
                >
                  <ImageIcon />
                </a>
              ))}
            </div>
          );
        },
      },
      {
        field: "category",
        headerName: "Product Category",
        width: 200,
        sortable: false,
        filterable: true,
        type: "singleSelect",
        valueOptions: [
          "Anklets",
          "Bangles",
          "Bracelets",
          "Brooches",
          "Chain",
          "Charms",
          "Choker",
          "Earrings",
          "Ghungroo",
          "Jewelry_Sets",
          "Jhumkas",
          "Maang_Tikka",
          "Mangalsutra",
          "Necklaces",
          "Nose_Ring",
          "Pendants",
          "Rings",
          "Toe_Ring",
          "Waist_Chains",
          "Watches",
        ],
        editable: true,
      },
      {
        field: "price",
        headerName: "Price",
        width: 130,
        sortable: true,
        filterable: false,
        editable: amAdmin,
      },
      {
        field: "mrp",
        headerName: "MRP",
        width: 130,
        sortable: true,
        filterable: false,
        editable: amAdmin,
      },
      {
        field: "stock",
        headerName: "Stock",
        width: 130,
        sortable: true,
        filterable: false,
        editable: true,
      },
      {
        field: "actions",
        headerName: "Actions",
        type: "actions",
        renderCell: (params) => (
          <ProductActions {...{ params, rowId, setRowId }} />
        ),
      },
    ],
    [rowId]
  );

  const handleRefresh = () => {
    setRefresh((prevRefresh) => prevRefresh + 1);
  };

  // Prepare data for charts
  const categoryData = products.reduce((acc, product) => {
    const category = acc.find((c) => c.name === product.category);
    if (category) {
      category.value += 1;
    } else {
      acc.push({ name: product.category, value: 1 });
    }
    return acc;
  }, []);

  const stockData = products.map((product) => ({
    name: product.product_name,
    category: product.category,
    stock: product.stock,
  }));

  const priceTrendData = products.map((product) => ({
    name: product.product_name,
    price: product.price,
    mrp: product.mrp,
  }));

  const featuredData = [
    {
      name: "Featured",
      value: products.filter((product) => product.isFeatured).length,
    },
    {
      name: "Not Featured",
      value: products.filter((product) => !product.isFeatured).length,
    },
  ];

  const mrpVsPriceData = products.map((product) => ({
    name: product.product_name,
    price: product.price,
    mrp: product.mrp,
  }));

  const priceDistribution = products.map((product) => ({
    price: product.price,
    name: product.product_name,
  }));

  const stockCategoryData = products.reduce((acc, product) => {
    const category = acc.find((c) => c.category === product.category);
    if (category) {
      category.stock += product.stock;
    } else {
      acc.push({ category: product.category, stock: product.stock });
    }
    return acc;
  }, []);

  return (
    <div>
      {/* Charts */}
      <Accordion className="acrdn">
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Chart Overviews of Products</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-around",
              mb: 4,
            }}
          >
            {/* Product Category Distribution */}
            <Box>
              <Typography
                variant="h6"
                component="h2"
                sx={{ textAlign: "center" }}
              >
                Product Category Distribution
              </Typography>
              <PieChart width={400} height={400}>
                <Pie
                  data={categoryData}
                  cx={200}
                  cy={200}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </Box>

            {/* Stock Levels by Category */}
            <Box>
              <Typography
                variant="h6"
                component="h2"
                sx={{ textAlign: "center" }}
              >
                Stock Levels by Category
              </Typography>
              <BarChart width={600} height={300} data={stockData}>
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip
                  content={({ payload }) => {
                    if (payload && payload.length) {
                      const { name, category, stock } = payload[0].payload;
                      return (
                        <div
                          style={{
                            backgroundColor: "#fff",
                            padding: "5px",
                            border: "1px solid #ccc",
                          }}
                        >
                          <p>
                            <strong>Product Name:</strong> {name}
                          </p>
                          <p>
                            <strong>Category:</strong> {category}
                          </p>
                          <p>
                            <strong>Stock:</strong> {stock}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="stock" fill="#82ca9d" />
              </BarChart>
            </Box>

            {/* Featured Products */}
            <Box>
              <Typography
                variant="h6"
                component="h2"
                sx={{ textAlign: "center" }}
              >
                Featured Products
              </Typography>
              <PieChart width={400} height={400}>
                <Pie
                  data={featuredData}
                  cx={200}
                  cy={200}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {featuredData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </Box>

            {/* Price Trends */}
            <Box>
              <Typography
                variant="h6"
                component="h2"
                sx={{ textAlign: "center" }}
              >
                Price Trends
              </Typography>
              <LineChart width={600} height={300} data={priceTrendData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  content={({ payload }) => {
                    if (payload && payload.length) {
                      const { name, price, mrp } = payload[0].payload;
                      return (
                        <div
                          style={{
                            backgroundColor: "#fff",
                            padding: "5px",
                            border: "1px solid #ccc",
                          }}
                        >
                          <p>
                            <strong>Product Name:</strong> {name}
                          </p>
                          <p>
                            <strong>Price:</strong> {price}
                          </p>
                          <p>
                            <strong>MRP:</strong> {mrp}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="price" stroke="#8884d8" />
                <Line type="monotone" dataKey="mrp" stroke="#82ca9d" />
              </LineChart>
            </Box>

            {/* MRP vs Selling Price */}
            <Box>
              <Typography
                variant="h6"
                component="h2"
                sx={{ textAlign: "center" }}
              >
                MRP vs Selling Price
              </Typography>
              <BarChart width={600} height={300} data={mrpVsPriceData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="price" fill="#8884d8" />
                <Bar dataKey="mrp" fill="#82ca9d" />
              </BarChart>
            </Box>

            {/* Price Distribution */}
            <Box>
              <Typography
                variant="h6"
                component="h2"
                sx={{ textAlign: "center" }}
              >
                Price Distribution
              </Typography>
              <BarChart width={600} height={300} data={priceDistribution}>
                <XAxis dataKey="price" />
                <YAxis />
                <Tooltip
                  content={({ payload }) => {
                    if (payload && payload.length) {
                      const { name, price } = payload[0].payload;
                      return (
                        <div
                          style={{
                            backgroundColor: "#fff",
                            padding: "5px",
                            border: "1px solid #ccc",
                          }}
                        >
                          <p>
                            <strong>Product Name:</strong> {name}
                          </p>
                          <p>
                            <strong>Price:</strong> {price}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="price" fill="#8884d8" />
              </BarChart>
            </Box>
            {/* Stock and Category Heat Map */}
            <Box>
              <Typography
                variant="h6"
                component="h2"
                sx={{ textAlign: "center" }}
              >
                Stock and Category Heat Map
              </Typography>
              <BarChart width={600} height={300} data={stockCategoryData}>
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="stock" stackId="a" fill="#8884d8" />
              </BarChart>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>

      {/*Refresh & Auto Height*/}
      <Box>
        <Typography
          variant="h1"
          component="h1"
          sx={{ textAlign: "center", mt: 3, mb: 3, fontSize: "3rem" }}
        >
          Manage Products
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <RefreshBtn onClick={handleRefresh} />
          <FormControlLabel
            control={
              <Switch
                checked={autoHeight}
                onChange={(e) => setAutoHeight(e.target.checked)}
                name="autoHeight"
                color="primary"
              />
            }
            label="Auto Height"
          />
        </Box>
      </Box>

      <Box
        sx={{
          height: 400,
          width: "100%",
        }}
      >
        <DataGrid
          columns={columns}
          rows={products}
          getRowId={(row) => row.id}
          getRowSpacing={(params) => ({
            top: params.isFirstVisible ? 0 : 5,
            bottom: params.isLastVisible ? 0 : 5,
          })}
          autoHeight={autoHeight}
          onCellEditStop={(params) => {
            setRowId(params.id);
          }}
        />
      </Box>
      <ToastContainer />
    </div>
  );
}
