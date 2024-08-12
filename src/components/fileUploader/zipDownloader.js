import { baseUrl } from "../../theme/appConstants";
import JSZip from "jszip";

export const downloadImagesAsZip = async (items, customer = "products") => {
  try {
    const zip = new JSZip();

    for (const item of items) {
      // Assuming 'keys' is an array or object with the keys you want to iterate over
      for (const key in item) {
        if (Object.prototype.hasOwnProperty.call(item, key)) {
          let imgName = item?.[key]?.replace(`public\\temp\\`, "");

          const response = await fetch(`${baseUrl}admin/send-file?imageName=${imgName}`, {
            method: 'GET',
            headers: {
              'customer': customer,
            },
          });

          if (!response.ok) {
            throw new Error(`Failed to fetch image (${imgName}). Status: ${response.status}`);
          }

          const fileBlob = await response.blob();
          zip.file(imgName, fileBlob);
        }
      }
    }

    // Create a blob from the zip content
    const zipBlob = await zip.generateAsync({ type: "blob" });

    // Create a link element
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(zipBlob);

    // Set the filename using the 'download' attribute
    downloadLink.download = "images.zip";

    // Append the link to the body and trigger the download
    document.body.appendChild(downloadLink);
    downloadLink.click();

    // Remove the link from the DOM
    document.body.removeChild(downloadLink);
  } catch (error) {
    console.error("Error downloading images:", error);
    // Handle the error as appropriate for your application
    throw error; // You may want to rethrow the error or handle it differently
  }
};
