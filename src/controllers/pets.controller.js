import path from "path";
import PetDTO from "../dto/Pet.dto.js";
import { petsService } from "../services/index.js"
import __dirname from "../utils/index.js";
import CustomError from "../services/errors/CustomError.js"
import { generatePetErrorInfo } from "../services/errors/info.js";
import EErrors from "../services/errors/enums.js";
import logger from "../utils/winston.js";

const getAllPets = async(req,res)=>{
    const pets = await petsService.getAll();
    res.send({status:"success",payload:pets})
}

const createPet = async(req,res,next)=> {
    const {name,specie,birthDate} = req.body;
    try {
        if(!name||!specie||!birthDate) {
            CustomError.createError({
            name: "Pet creation error",
            cause: generatePetErrorInfo(req.body),
            message: "Error Trying to create Pet",
            code: EErrors.INVALID_TYPES_ERROR
          });
        }
        const pet = PetDTO.getPetInputFrom({name,specie,birthDate});
        const result = await petsService.create(pet);
        res.send({status:"success",payload:result})
    } catch (error) {
        next(error)
    }
}

const updatePet = async(req,res) =>{
    const petUpdateBody = req.body;
    const petId = req.params.pid;
    const result = await petsService.update(petId,petUpdateBody);
    res.send({status:"success",message:"pet updated"})
}

const deletePet = async(req,res)=> {
    const petId = req.params.pid;
    const result = await petsService.delete(petId);
    res.send({status:"success",message:"pet deleted"});
}

const createPetWithImage = async(req,res,next) =>{
    const file = req.file;
    const {name,specie,birthDate} = req.body;
    try {
        if(!name||!specie||!birthDate) {
            CustomError.createError({
            name: "Pet creation error",
            cause: generatePetErrorInfo(req.body),
            message: "Error Trying to create Pet",
            code: EErrors.INVALID_TYPES_ERROR
          });
        }
        logger.debug(file);
        const pet = PetDTO.getPetInputFrom({
            name,
            specie,
            birthDate,
            image: path.join(`${__dirname}`,`/../public/img/${file.filename}`)
        });
        logger.debug(pet);
        const result = await petsService.create(pet);
        res.send({status:"success",payload:result})
    } catch (error) {
       next(error) 
    }
}
export default {
    getAllPets,
    createPet,
    updatePet,
    deletePet,
    createPetWithImage
}