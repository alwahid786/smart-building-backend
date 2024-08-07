import multer from "multer";

 const storage = multer.diskStorage({

    destination(req, file, callback){

        callback(null, "upload");
    },

    filename(req, file, callback){

        callback(null, `${Date.now()}-${file.originalname}` )
    }
})

// this is for building image
export const fileUpload= multer({storage}).fields([{name: "images", maxCount:10}]);

export const profileImage = multer({storage}).single("profilePic");


export const buildingUpload= multer({storage}).single("image")