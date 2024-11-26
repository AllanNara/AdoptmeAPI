import generateMockUsers from "../services/mocks/users.js";
import generateMockPets from "../services/mocks/pets.js";
import { petsService, usersService } from "../services/index.js";
import petModel from "../dao/models/Pet.js";
import userModel from "../dao/models/User.js";

const mockingPets = (req, res, next) => {
    const quantity = parseInt(req.params.quantity);
    try {
        const mockPets = generateMockPets(isNaN(quantity) ? 50 : quantity);
        res.send({ status: "success", payload: mockPets });
    } catch (error) {
        next(error);
    }
};

const mockingUsers = async (req, res, next) => {
    const quantity = parseInt(req.params.quantity);
    try {
        const mockUsers = await generateMockUsers(isNaN(quantity) ? 50 : quantity);
        res.send({ status: "success", payload: mockUsers });
    } catch (error) {
        next(error);
    }
};

const generateDataMock = async (req, res, next) => {
    const users = parseInt(req.body.users);
    const pets = parseInt(req.body.pets);
    try {
        const mockUsers = await generateMockUsers(isNaN(users) ? 10 : users);
        const mockPets = generateMockPets(isNaN(pets) ? 10 : pets);
        await petsService.create(mockPets);
        await usersService.create(mockUsers);
        res.send({ status: "success", message: "Data Mocked" });
    } catch (error) {
        next(error);
    }
};

const deleteAllData = async (req, res, next) => {
    try {
        await petModel.deleteMany({});
        await userModel.deleteMany({});
        res.send({ status: "success", message: "Data Deleted" });
    } catch (error) {
        next(error);
    }
};

export default {
    mockingPets,
    mockingUsers,
    generateDataMock,
    deleteAllData
}