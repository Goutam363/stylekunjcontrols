import { useState, useEffect, useMemo, useContext } from "react";
import {
  Grid,
  Box,
  Typography,
  Switch,
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
import OrderActions from "./OrderActions";
import { AuthContext } from "../AuthProvider";
import RefreshBtn from "../RefreshButton/RefreshBtn";
import { FetchOrders } from "../Controller";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function Orders() {
  const { loggedin, amAdmin, ordersContext, setOrdersContext, tokenContext } =
    useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [rowId, setRowId] = useState(null);
  const [refresh, setRefresh] = useState(0);
  const [autoHeight, setAutoHeight] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (ordersContext.length === 0 || refresh > 0) {
          await FetchOrders(amAdmin, setOrdersContext, tokenContext);
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
    setOrders(ordersContext);
  }, [ordersContext]);

  const columns = useMemo(
    () => [
      {
        field: "id",
        headerName: "Order Id",
        width: 200,
        sortable: false,
        filterable: true,
      },
      {
        field: "payment_id",
        headerName: "Payment Id",
        width: 200,
        sortable: false,
        editable: false,
      },
      {
        field: "product_ids",
        headerName: "Product Ids",
        width: 200,
        sortable: false,
        editable: false,
      },
      {
        field: "product_names",
        headerName: "Product Names",
        width: 200,
        sortable: false,
        editable: false,
      },
      {
        field: "quantities",
        headerName: "Product Quantities",
        width: 200,
        sortable: false,
        editable: false,
      },
      {
        field: "total_price",
        headerName: "Total Price",
        width: 200,
        sortable: false,
        editable: false,
      },
      {
        field: "coupon_discount",
        headerName: "Coupon Discount",
        width: 200,
        sortable: false,
        editable: false,
      },
      {
        field: "total_discount",
        headerName: "Total Discount",
        width: 200,
        sortable: false,
        editable: false,
      },
      {
        field: "delivery_charge",
        headerName: "Delivery Charge",
        width: 200,
        sortable: false,
        editable: false,
      },
      {
        field: "net_amount",
        headerName: "Net Amount",
        width: 200,
        sortable: false,
        editable: false,
      },
      {
        field: "refund_amount",
        headerName: "Delivery Charge",
        width: 200,
        sortable: false,
        editable: false,
      },
      {
        field: "email",
        headerName: "Email Id",
        width: 200,
        sortable: false,
        editable: true,
      },
      {
        field: "mobile",
        headerName: "Mobile Number",
        width: 200,
        sortable: false,
        editable: true,
      },
      {
        field: "billing_address",
        headerName: "Billing Address",
        width: 400,
        sortable: false,
        editable: false,
        renderCell: (params) => {
          if (params.row.billing_address === "") {
            return null;
          }
          const addressArray = params.row.billing_address.split("|");
          return `${addressArray[0]}, ${addressArray[1]}, ${addressArray[2]}|${addressArray[6]}, ${addressArray[5]}, ${addressArray[4]}, ${addressArray[3]}, (Zip code: ${addressArray[7]})`;
        },
      },
      {
        field: "shipping_address",
        headerName: "Shipping Address",
        width: 400,
        sortable: false,
        editable: true,
        renderCell: (params) => {
          if (params.row.shipping_address === "") {
            return null;
          }
          const addressArray = params.row.shipping_address.split("|");
          return `${addressArray[0]}, ${addressArray[1]}, ${addressArray[2]}|${addressArray[6]}, ${addressArray[5]}, ${addressArray[4]}, ${addressArray[3]}, (Zip code: ${addressArray[7]})`;
        },
      },
      {
        field: "order_status",
        headerName: "Order Status",
        width: 200,
        sortable: false,
        type: "singleSelect",
        valueOptions: [
          "PENDING",
          "PLACED",
          "IN_PROGRESS",
          "PICKED",
          "CANCELED",
          "DELAYED",
          "DELIVERED",
          "PARTIALLY_DELIVERED",
        ],
        editable: true,
      },
      {
        field: "order_date",
        headerName: "Created",
        width: 200,
        renderCell: (params) => {
          const { istDate, istTime } = convertUTCToIST(params.row.order_date);
          return `${istDate}, ${istTime}`;
        },
      },
      {
        field: "actions",
        headerName: "Actions",
        type: "actions",
        renderCell: (params) => (
          <OrderActions {...{ params, rowId, setRowId }} />
        ),
      },
    ],
    [rowId]
  );

  const handleRefresh = () => {
    setRefresh((prevRefresh) => prevRefresh + 1);
  };

  {
    /*Prepare data for charts*/
  }
  const orderStatusData = orders.reduce((acc, order) => {
    const status = acc.find((s) => s.name === order.order_status);
    if (status) {
      status.value += 1;
    } else {
      acc.push({ name: order.order_status, value: 1 });
    }
    return acc;
  }, []);

  const quantityDistributionData = orders.reduce((acc, order) => {
    const productNames = order.product_names.split("|");
    const quantities = order.quantities.split("|").map(Number);

    productNames.forEach((productName, index) => {
      const existingProduct = acc.find(
        (product) => product.name === productName.trim()
      );
      if (existingProduct) {
        existingProduct.value += quantities[index];
      } else {
        acc.push({ name: productName.trim(), value: quantities[index] });
      }
    });
    return acc;
  }, []);

  const totalSalesData = orders.reduce((acc, order) => {
    const date = new Date(order.order_date).toISOString().split("T")[0];
    const existing = acc.find((entry) => entry.date === date);
    if (existing) {
      existing.total += order.total_price;
    } else {
      acc.push({ date, total: order.total_price });
    }
    return acc;
  }, []);

  const couponUsageData = [
    {
      name: "Coupon Used",
      value: orders.filter((order) => order.coupon_discount > 0).length,
    },
    {
      name: "No Coupon",
      value: orders.filter((order) => order.coupon_discount === 0).length,
    },
  ];

  const deliveryChargeData = orders.map((order) => ({
    name: order.id,
    delivery_charge: order.delivery_charge,
  }));

  // Ensure districtDistributionData is defined
  const districtDistributionData = [];

  const stateDistributionData = orders.reduce((acc, order) => {
    const shippingAddress = order.shipping_address.split("|");
    const state = shippingAddress[3]?.trim(); // State is at index 3
    const district = shippingAddress[4]?.trim(); // District is at index 4

    // Aggregating net_amount by state
    if (state) {
      const existingState = acc.find((entry) => entry.name === state);
      if (existingState) {
        existingState.value += order.net_amount;
      } else {
        acc.push({ name: state, value: order.net_amount });
      }
    }

    // Aggregating net_amount by district
    if (district) {
      const existingDistrict = districtDistributionData.find(
        (entry) => entry.name === district
      );
      if (existingDistrict) {
        existingDistrict.value += order.net_amount;
      } else {
        districtDistributionData.push({
          name: district,
          value: order.net_amount,
        });
      }
    }

    return acc;
  }, []);

  return (
    <div>
      {/*Charts*/}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Order Data Insights</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2} marginX={"1rem"}>
            {/* Order Status Distribution */}
            <Grid item xs={12} sm={6} md={4}>
              <Box>
                <Typography
                  variant="h6"
                  component="h2"
                  sx={{ textAlign: "center" }}
                >
                  Order Status Distribution
                </Typography>
                <PieChart width={400} height={400}>
                  <Pie
                    data={orderStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {orderStatusData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </Box>
            </Grid>

            {/* Quantity Distribution */}
            <Grid item xs={12} sm={6} md={4}>
              <Box>
                <Typography
                  variant="h6"
                  component="h2"
                  sx={{ textAlign: "center" }}
                >
                  Quantity Distribution
                </Typography>
                <PieChart width={400} height={400}>
                  <Pie
                    data={quantityDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {quantityDistributionData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </Box>
            </Grid>

            {/* Total Sales */}
            <Grid item xs={12} sm={6} md={4}>
              <Box>
                <Typography
                  variant="h6"
                  component="h2"
                  sx={{ textAlign: "center" }}
                >
                  Total Sales by Date
                </Typography>
                <BarChart width={500} height={300} data={totalSalesData}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="total" fill="#8884d8" />
                </BarChart>
              </Box>
            </Grid>

            {/* Coupon Usage */}
            <Grid item xs={12} sm={6} md={4}>
              <Box>
                <Typography
                  variant="h6"
                  component="h2"
                  sx={{ textAlign: "center" }}
                >
                  Coupon Usage
                </Typography>
                <PieChart width={400} height={400}>
                  <Pie
                    data={couponUsageData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {couponUsageData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </Box>
            </Grid>

            {/* District Distribution */}
            <Grid item xs={12} sm={6} md={4}>
              <Box>
                <Typography
                  variant="h6"
                  component="h2"
                  sx={{ textAlign: "center" }}
                >
                  District Distribution
                </Typography>
                <PieChart width={400} height={400}>
                  <Pie
                    data={districtDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {districtDistributionData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </Box>
            </Grid>

            {/* State Distribution */}
            <Grid item xs={12} sm={6} md={4}>
              <Box>
                <Typography
                  variant="h6"
                  component="h2"
                  sx={{ textAlign: "center" }}
                >
                  State Distribution
                </Typography>
                <PieChart width={400} height={400}>
                  <Pie
                    data={stateDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {stateDistributionData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </Box>
            </Grid>

            {/* Delivery Charge */}
            {/* <Grid item xs={12} sm={6} md={4}>
              <Box>
                <Typography
                  variant="h6"
                  component="h2"
                  sx={{ textAlign: "center" }}
                >
                  Delivery Charge
                </Typography>
                <BarChart width={500} height={300} data={deliveryChargeData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="delivery_charge" fill="#8884d8" />
                </BarChart>
              </Box>
            </Grid> */}
          </Grid>
        </AccordionDetails>
      </Accordion>
      <Box>
        <Typography
          variant="h1"
          component="h1"
          sx={{ textAlign: "center", mt: 3, mb: 3, fontSize: "3rem" }}
        >
          Manage Orders
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
          rows={orders}
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
