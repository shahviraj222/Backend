// here the files is in the loalstorage and now we are going to push into the cloudinary
import { v2 as cloudinary } from 'cloudinary'
import fs from "fs"


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) {
            return null;
        }
        //upload the file on the cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        //file has been uploaded successfully
        console.log("File is uploaded on cloudinary:", response.url)
        return response

    } catch (error) {
        fs.unlinkSync(localFilePath)  //remove the locally saved temporary file as upload operation got failed
        return null;
    }
}

export { uploadOnCloudinary }
// function by the cloudinary to upload
/* 
cloudinary.uploader.upload(
    'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg',
    { public_id: "olympic_flag" },
    function (error, result) { console.log(result); }
);
*/