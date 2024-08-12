import authAxios from "./index";

const header = {
  Accept: "application/json",
  "Content-Type": "application/json",
};
export const LoginWithPhone = async (data) => {
  const response = await authAxios.post("user/login", data, {
    headers: header,
  });
  return response.data;
};

export const VerifyLoginPhone = async (data) => {
  const response = await authAxios.post("user/verify-login", data, {
    headers: header,
  });
  return response.data;
};
export const UpdateUserApi = async (data) => {
  const response = await authAxios.put("user/update/profile", data, {
    headers: header,
  });
  return response.data;
};
export const LoginApi = async (data) => {
  const response = await authAxios.post("user/social-login", data, {
    headers: header,
  });
  return response.data;
};

export const GetOrderListApi = async () => {
  const response = await authAxios.post("user/order/list", {
    headers: header,
  });
  return response.data;
};

export const GetGiftListApi = async () => {
  const response = await authAxios.post("user/order/promo/list", {
    headers: header,
  });
  return response.data;
};

export const GetGiftCardApi = async () => {
  const response = await authAxios.get("user/promo/list", {
    headers: header,
  });
  return response.data;
};

export const GetWebsiteDataApi = async () => {
  const response = await authAxios.get("user/website", {
    headers: header,
  });
  console.log(response,"res");
  return response.data;
};

export const GetAddressApi = async () => {
  const response = await authAxios.get("user/address/view", {
    headers: header,
  });
  return response.data;
};

export const BuyGiftCardApi = async (data) => {
  const response = await authAxios.post("user/promo/buy", data, {
    headers: header,
  });
  return response.data;
};

export const CheckPriceApi = async (data) => {
  const response = await authAxios.post("user/order/cost", data, {
    headers: header,
  });
  return response.data;
};

export const UpdateAddressApi = async (data) => {
  const response = await authAxios.put("user/address/edit", data, {
    headers: header,
  });
  return response.data;
};

export const contactUsApi = async (data) => {
  const response = await authAxios.post("user/contact", data, {
    headers: header,
  });
  return response.data;
};

export const sendOTPApi = async (data) => {
  const response = await authAxios.post("user/otp/send", data, {
    headers: header,
  });
  return response.data;
};

export const verifyOTPApi = async (data) => {
  const response = await authAxios.post("user/otp/verify", data, {
    headers: header,
  });
  return response.data;
};

export const DownloadInvoiceSection = async (data) => {
  try {
    const response = await authAxios.post("user/order/invoice", data, {
      headers: header,
    });


    return response.data;
  } catch (error) {
    console.error("Error in DownloadInvoiceSection:", error);
    return error; // Returning the error
  }
};
