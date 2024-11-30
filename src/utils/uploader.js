import path from "path";
import __dirname from "./index.js";
import multer from 'multer';

const storage = multer.diskStorage({
    destination:function(req,file,cb){
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