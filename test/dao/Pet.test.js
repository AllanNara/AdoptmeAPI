import * as chai from "chai";
import mongoose from "mongoose";
import Pet from "../../src/dao/Pets.dao.js";
import { fakePetBody } from "../../src/services/mocks/pets.js";

const expect = chai.expect;

describe("Testing Pets Dao", function() {
    const petMock = fakePetBody();

    before(async function() {
        this.petsDao = new Pet();
    })
    beforeEach(async function() {
        await mongoose.connection.collections.pets.drop();
        this.timeout(5000);
    })

    it("El dao debe poder obtener las mascotas en formato de arreglo", async function(){
        const result = await this.petsDao.get();
        expect(Array.isArray(result)).to.be.equal(true);
    })

    it("El dao debe agregar una mascota correctamente a la base de datos", async function(){
        const result = await this.petsDao.save(petMock);
        expect(result._id).to.be.ok;
    })

    it("El dao agregará al documento insertado una propiedad 'adopted' en false", async function(){
        const result = await this.petsDao.save(petMock);
        expect(result.adopted).to.be.false;
    })

    it("El dao puede actualizar una mascota por id", async function(){
        const result = await this.petsDao.save(petMock);
        const pet = await this.petsDao.update(result._id, {specie: "perro", name: "libreDePulgas"});
        expect(pet.specie).to.be.equal("perro");
        expect(pet.name).to.be.equal("libreDePulgas");
    })

    it("El dao puede eliminar una mascota por id", async function(){
        const result = await this.petsDao.save(petMock);
        const pet = await this.petsDao.delete(result._id);
        const petDeleted = await this.petsDao.getBy({_id: result._id});
        expect(pet).to.be.ok;
        expect(petDeleted).to.be.equal(null); 
    })

})