import { baseUrl } from "../../theme/appConstants";

const fileUpload = async (item, base = false) => {
    let file ;

    if (base) {
        const byteCharacters = atob(item.split(',')[1]);
        const byteNumbers = new Array(byteCharacters.length);

        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'image/png' });

        // Convert Blob to File
        file = new File([blob], 'capturedImage.png', { type: 'image/png' });
    } else {
        file = item;
    }

    const uploadUrl = `${baseUrl}user/upload-frame`;

    let formData = new FormData();
    formData.append('file', file);

    try {
        let resp = await fetch(uploadUrl, {
            method: 'POST',
            body: formData,
        });

        // Check if the response is valid JSON
        if (resp.ok) {
            const url = await resp.json();
            return url;
        } else {
            // Handle non-JSON response
            console.error('Server responded with error:', resp.status, resp.statusText);
            return null;
        }
    } catch (error) {
        console.error('Error during fetch:', error.message);
        return null;
    }
};

export default fileUpload;
