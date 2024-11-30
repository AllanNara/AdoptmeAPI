import path from "path";
import multer from 'multer';
import config from "../../config/index.js";

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        if(config.NODE_ENV === "test") 
            return cb(null, path.resolve("src", "public", "tests"));
        let folder;
        if(req.baseUrl === "/api/pets") {
            folder = "pets"
        } else if(req.baseUrl === "/api/users") {
            folder = "documents"
        }
        if(!folder) throw new Error("Missing folder name")
        const pathImg = path.resolve("src", "public", "uploads", folder)
        cb(null, pathImg)
    },
    filename:function(req,file,cb){
        cb(null,`${Date.now()}-${file.originalname}`)
    }
})

const uploader = multer({storage})

export default uploader;