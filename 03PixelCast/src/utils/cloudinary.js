// here the files is in the loalstorage and now we are going to push into the cloudinary
import { v2 as cloudinary } from "cloudinary"
import fs from "fs"


cloudinary.config({

    cloud_name: 'dzipdmzi8',
    api_key: '948374429424384',
    api_secret: '6VWUqMoej3jaycfkW4sBZxDGzso'

    // cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    // api_key: process.env.CLOUDINARY_API_KEY,
    // api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    console.log(process.env.CLOUDINARY_API_KEY)
    try {
        if (!localFilePath) return null
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // file has been uploaded successfull
        //console.log("file is uploaded on cloudinary ", response.url);
        fs.unlinkSync(localFilePath)
        return response;

    } catch (error) {
        console.error('Error uploading file to Cloudinary:', error.message);
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
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