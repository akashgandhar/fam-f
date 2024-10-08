import { baseUrl } from "../../theme/appConstants";

export const getImage = async (item, customer = "products") => {
  try {
    let imgName = item?.replace(`public\\temp\\`, "");

    console.log(`${baseUrl}admin/send-file?imageName=${imgName}`);
    

    const response = await fetch(`${baseUrl}admin/send-file?imageName=${imgName}`, {
      method: 'GET',
      headers: {
        'customer': customer, // Example of a custom header
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch image. Status: ${response.status}`);
    }

    const fileBlob = await response.blob();
    return URL.createObjectURL(fileBlob);
  } catch (error) {
    console.error("Error fetching image:", error);
    // Handle the error as appropriate for your application
    throw error; // You may want to rethrow the error or handle it differently
  }
};
