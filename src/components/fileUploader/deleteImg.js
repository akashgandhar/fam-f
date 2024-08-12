import { baseUrl } from "../../theme/appConstants";

export const handleUnlinkFile = async (filePath) => {
    try {
      const response = await fetch(`${baseUrl}user/unlink-image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filePath }),
      });

      const data = await response.json();
      return data
    } catch (error) {
      console.error('Error fetching:', error.message);
    }
  };