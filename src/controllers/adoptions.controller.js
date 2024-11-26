import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enums.js";
import { resourceNotFoundErrorInfo, validateIdErrorInfo } from "../services/errors/info.js";
import { adoptionsService, petsService, usersService } from "../services/index.js"
import mongoose from "mongoose";

const getAllAdoptions = async(req,res)=>{
    const result = await adoptionsService.getAll();
    res.send({status:"success",payload:result})
}

const getAdoption = async(req,res,next)=>{
    const adoptionId = req.params.aid;
    try {
        if(!adoptionId || !mongoose.Types.ObjectId.isValid(adoptionId)) {
           CustomError.createError({
               name: "Adoption ID error",
               cause: validateIdErrorInfo(adoptionId),
               message: "Param AID is not valid",
               code: EErrors.INVALID_PARAM
           })
        }   
        const adoption = await adoptionsService.getBy({_id:adoptionId})
        if(!adoption) {
            CustomError.createError({
                name: "Resource not found",
                cause: resourceNotFoundErrorInfo("Adoption"),
                message: "Adoption not found",
                code: EErrors.RESOURCE_NOT_FOUND
            })
        }
        res.send({status:"success",payload:adoption})
    } catch (error) {
        next(error)   
    }
}

const createAdoption = async(req,res,next)=>{
    const {uid,pid} = req.params;
    try {
        if(!mongoose.Types.ObjectId.isValid(uid) || !mongoose.Types.ObjectId.isValid(pid)) {
           CustomError.createError({
               name: "Adoption ID error",
               cause: validateIdErrorInfo(`uid:${uid} pid:${pid}`),
               message: "Param UID or PID is not valid",
               code: EErrors.INVALID_PARAM
           })
        }  
        const user = await usersService.getUserById(uid);
        if(!user) {
            CustomError.createError({
                name: "Resource not found",
                cause: resourceNotFoundErrorInfo("User"),
                message: "User not found",
                code: EErrors.RESOURCE_NOT_FOUND
            })
        }
        const pet = await petsService.getBy({_id:pid});
        if(!pet) {
            CustomError.createError({
                name: "Resource not found",
                cause: resourceNotFoundErrorInfo("Pet"),
                message: "Pet not found",
                code: EErrors.RESOURCE_NOT_FOUND
            })
        }
        if(pet.adopted) {
            CustomError.createError({
                name: "Request error",
                cause: "Pet already adopted",
                message: "Pet already adopted",
                code: EErrors.BAD_REQUEST
            })
        }
        user.pets.push(pet._id);
        await usersService.update(user._id,{pets:user.pets})
        await petsService.update(pet._id,{adopted:true,owner:user._id})
        await adoptionsService.create({owner:user._id,pet:pet._id})
        res.send({status:"success",message:"Pet adopted"})
    } catch (error) {
        next(error)
    }
}

export default {
    createAdoption,
    getAllAdoptions,
    getAdoption
}