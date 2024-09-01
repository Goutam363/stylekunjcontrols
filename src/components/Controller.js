import axios from "axios";

const FetchOrders = async (amAdmin, setOrdersContext, tokenContext) => {
      // Make GET request to retrieve orders data
        let orderItemResponse;
        if(amAdmin) {
        orderItemResponse = await axios.get(
          `${process.env.REACT_APP_STYLEKUNJ_BACKEND_URL}/order/secure/admin`,
          {
            headers: {
              Authorization: `Bearer ${tokenContext}`,
            },
          }
        );
      } else {
        orderItemResponse = await axios.get(
          `${process.env.REACT_APP_STYLEKUNJ_BACKEND_URL}/order/secure/staff`,
          {
            headers: {
              Authorization: `Bearer ${tokenContext}`,
            },
          }
        );
      }
      const orderTemp = orderItemResponse.data;
      await setOrdersContext(orderTemp);
}

const FetchProducts = async (setProductsContext) => {
  // Make GET request to retrieve products data
  const productItemResponse = await axios.get(
    `${process.env.REACT_APP_STYLEKUNJ_BACKEND_URL}/product`);
  const productTemp = productItemResponse.data;
  await setProductsContext(productTemp);
  return;
}

const FetchUsers = async (amAdmin, setUsersContext, tokenContext) => {
    // Make GET request to retrieve users data
      let userItemResponse;
      if(amAdmin) {
      userItemResponse = await axios.get(
        `${process.env.REACT_APP_STYLEKUNJ_BACKEND_URL}/auth/secure/admin/get-users`,
        {
          headers: {
            Authorization: `Bearer ${tokenContext}`,
          },
        }
      );
    } else {
      userItemResponse = await axios.get(
        `${process.env.REACT_APP_STYLEKUNJ_BACKEND_URL}/auth/secure/staff/get-users`,
        {
          headers: {
            Authorization: `Bearer ${tokenContext}`,
          },
        }
      );
    }
    const userTemp = userItemResponse.data;
    await setUsersContext(userTemp);
}

const FetchStaffs = async (amAdmin, setStaffsContext, tokenContext) => {
    // Make GET request to retrieve users data
      if(amAdmin) {
      const staffItemResponse = await axios.get(
        `${process.env.REACT_APP_STYLEKUNJ_BACKEND_URL}/auth/secure/admin/get-staffs`,
        {
          headers: {
            Authorization: `Bearer ${tokenContext}`,
          },
        }
      );
        const staffTemp = staffItemResponse.data;
        await setStaffsContext(staffTemp);
    }
}

const FetchAdmins = async (amAdmin, setAdminsContext, tokenContext) => {
    // Make GET request to retrieve users data
      if(amAdmin) {
      const adminItemResponse = await axios.get(
        `${process.env.REACT_APP_STYLEKUNJ_BACKEND_URL}/auth/secure/admin/get-admins`,
        {
          headers: {
            Authorization: `Bearer ${tokenContext}`,
          },
        }
      );
        const adminTemp = adminItemResponse.data;
        await setAdminsContext(adminTemp);
    }
}

const FetchContacts = async (amAdmin, setContactsContext, tokenContext) => {
  // Make GET request to retrieve users data
    let contactItemResponse;
    if(amAdmin) {
    contactItemResponse = await axios.get(
      `${process.env.REACT_APP_STYLEKUNJ_BACKEND_URL}/contact/secure/admin`,
      {
        headers: {
          Authorization: `Bearer ${tokenContext}`,
        },
      }
    );
  } else {
    contactItemResponse = await axios.get(
      `${process.env.REACT_APP_STYLEKUNJ_BACKEND_URL}/contact/secure/staff`,
      {
        headers: {
          Authorization: `Bearer ${tokenContext}`,
        },
      }
    );
  }
  const contactTemp = contactItemResponse.data;
  await setContactsContext(contactTemp);
}

const VerifyProductByid = async (amAdmin, product_id, tokenContext) => {
if(amAdmin){
  const productItemResponse = await axios.get(
    `${process.env.REACT_APP_STYLEKUNJ_BACKEND_URL}/product/secure/admin/${product_id}/verify`,
    {
      headers: {
        Authorization: `Bearer ${tokenContext}`,
      },
    }
  );
  return productItemResponse.data;
}
}

const VerifyStaffByid = async (amAdmin, staff_id, tokenContext) => {
  if(amAdmin){
    const staffItemResponse = await axios.get(
      `${process.env.REACT_APP_STYLEKUNJ_BACKEND_URL}/auth/staff/secure/admin/${staff_id}/verify`,
      {
        headers: {
          Authorization: `Bearer ${tokenContext}`,
        },
      }
    );
    return staffItemResponse.data;
  }
  }

  const VerifyAdminByid = async (amAdmin, admin_id, tokenContext) => {
    if(amAdmin){
      const adminItemResponse = await axios.get(
        `${process.env.REACT_APP_STYLEKUNJ_BACKEND_URL}/auth/admin/secure/admin/${admin_id}/verify`,
        {
          headers: {
            Authorization: `Bearer ${tokenContext}`,
          },
        }
      );
      return adminItemResponse.data;
    }
    }

const UploadProductImagesIntoServer = async ( amAdmin, formData, tokenContext ) => {
  if(amAdmin){
    const productItemResponse = await axios.post(
      `${process.env.REACT_APP_STYLEKUNJ_BACKEND_URL}/firebase-storage/upload/product-images`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${tokenContext}`,
        },
      }
    );
    return productItemResponse.data;
  }
  
  }

  const UploadStaffDetailsIntoServer = async ( amAdmin, formData, tokenContext ) => {
    if(amAdmin){
      const staffItemResponse = await axios.post(
        `${process.env.REACT_APP_STYLEKUNJ_BACKEND_URL}/firebase-storage/upload/staff-details`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${tokenContext}`,
          },
        }
      );
      return staffItemResponse.data;
    }
    
    }

    const UploadAdminDetailsIntoServer = async ( amAdmin, formData, tokenContext ) => {
      if(amAdmin){
        const adminItemResponse = await axios.post(
          `${process.env.REACT_APP_STYLEKUNJ_BACKEND_URL}/firebase-storage/upload/admin-details`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${tokenContext}`,
            },
          }
        );
        return adminItemResponse.data;
      }
      
      }

export { FetchOrders, FetchProducts, FetchUsers, FetchStaffs, FetchAdmins, FetchContacts, VerifyProductByid, UploadProductImagesIntoServer, VerifyStaffByid, UploadStaffDetailsIntoServer, VerifyAdminByid, UploadAdminDetailsIntoServer };