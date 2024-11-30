import * as chai from "chai";
import User from "../../src/dao/Users.dao.js";
import { fakeUserBody } from "../../src/services/mocks/users.js";

const expect = chai.expect;

describe("Testing Users Dao", function() {
    let userMock;
    const userDataMock = fakeUserBody();

    before(async function() {
        this.usersDao = new User();
    })

    it("El dao debe poder obtener los usuarios en formato de arreglo", async function(){
        const result = await this.usersDao.get();
        expect(Array.isArray(result)).to.be.equal(true);
    })

    it("El dao debe agregar un usuario correctamente a la base de datos", async function(){
        userMock = await this.usersDao.save(userDataMock)
        expect(userMock._id).to.be.ok;
    })

    it("El dao agregará una propiedad 'pets' como un arreglo vacío por defecto", async function(){
        expect(userMock.pets).to.be.deep.equal([]);
    })

    it("El dao agregará una propiedad 'documents' como un arreglo vacío por defecto", async function(){
        expect(userMock.documents).to.be.deep.equal([]);
    })

    it("El dao puede obtener a un usuario por email", async function(){
        const user = await this.usersDao.getBy({email: userDataMock.email});
        expect(typeof user).to.be.equal("object")
    })

    it("El dao puede actualizar un usuario por id", async function(){
        const user = await this.usersDao.update(userMock._id, {first_name: "Maria", last_name: "Magdalena"});
        expect(user.first_name).to.be.equal("Maria");
        expect(user.last_name).to.be.equal("Magdalena");
    })

    it("El dao puede eliminar un usuario por id", async function(){
        const user = await this.usersDao.delete(userMock._id);
        const userDeleted = await this.usersDao.getBy({email: userDataMock.email});
        expect(user).to.be.ok;
        expect(userDeleted).to.be.equal(null); 
    })

})