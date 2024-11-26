import * as chai from "chai";
import mongoose from "mongoose";
import User from "../../src/dao/Users.dao.js";

const expect = chai.expect;

describe("Testing Users Dao", function() {
    let mockUser = {
        first_name: "Coder",
        last_name: "House",
        email: "correoprueba@correo.com",
        password: "coder123",
    }

    before(async function() {
        this.usersDao = new User();
    })
    beforeEach(async function() {
        await mongoose.connection.collections.users.drop();
        this.timeout(5000);
    })

    it("El dao debe poder obtener los usuarios en formato de arreglo", async function(){
        const result = await this.usersDao.get();
        expect(Array.isArray(result)).to.be.equal(true);
    })

    it("El dao debe agregar un usuario correctamente a la base de datos", async function(){
        const result = await this.usersDao.save(mockUser);
        expect(result._id).to.be.ok;
    })

    it("El dao agregará al documento insertado un arreglo de mascotas vacío por defecto", async function(){
        const result = await this.usersDao.save(mockUser);
        expect(result.pets).to.be.deep.equal([]);
    })

    it("El dao puede obtener a un usuario por email", async function(){
        const result = await this.usersDao.save(mockUser);
        const user = await this.usersDao.getBy({email: result.email});
        expect(typeof user).to.be.equal("object")
    })

    it("El dao puede actualizar un usuario por id", async function(){
        const result = await this.usersDao.save(mockUser);
        const user = await this.usersDao.update(result._id, {first_name: "Maria", last_name: "Magdalena"});
        expect(user.first_name).to.be.equal("Maria");
        expect(user.last_name).to.be.equal("Magdalena");
    })

    it("El dao puede eliminar un usuario por id", async function(){
        const result = await this.usersDao.save(mockUser);
        const user = await this.usersDao.delete(result._id);
        const userDeleted = await this.usersDao.getBy({email: result.email});
        expect(user).to.be.ok;
        expect(userDeleted).to.be.equal(null); 
    })

})