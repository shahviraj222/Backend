import multer from 'multer'

// cd = callback
// here the file is stored in diskstorage we can also store on the memory storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)            //you can change the filename by the many filed provide by file.
    }
})

export const upload = multer({
    storage,
})