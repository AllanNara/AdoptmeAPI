import * as chai from "chai";
import Pet from "../../src/dao/Pets.dao.js";
import { fakePetBody } from "../../src/services/mocks/pets.js";

const expect = chai.expect;

describe("Testing Pets Dao", function() {
    let petMock;
    const petDataMock = fakePetBody();

    before(async function() {
        this.petsDao = new Pet();
    })

    it("El dao debe poder obtener las mascotas en formato de arreglo", async function(){
        const result = await this.petsDao.get();
        expect(Array.isArray(result)).to.be.equal(true);
    })

    it("El dao debe agregar una mascota correctamente a la base de datos", async function(){
        petMock = await this.petsDao.save(petDataMock);
        expect(petMock._id).to.be.ok;
    })

    it("El dao agregará al documento insertado una propiedad 'adopted' en false", async function(){
        expect(petMock.adopted).to.be.false;
    })

    it("El dao puede actualizar una mascota por id", async function(){
        const pet = await this.petsDao.update(petMock._id, {specie: "perro", name: "libreDePulgas"});
        expect(pet.specie).to.be.equal("perro");
        expect(pet.name).to.be.equal("libreDePulgas");
    })

    it("El dao puede eliminar una mascota por id", async function(){
        const pet = await this.petsDao.delete(petMock._id);
        const petDeleted = await this.petsDao.getBy({_id: petMock._id});
        expect(pet).to.be.ok;
        expect(petDeleted).to.be.equal(null); 
    })

})