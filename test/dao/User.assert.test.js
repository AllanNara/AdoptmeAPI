import mongoose from "mongoose";
import User from "../../src/dao/Users.dao.js";
import Assert from "assert";

const assert = Assert.strict;

describe("Testing Users Dao (with assert)", function() {
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
        assert.strictEqual(Array.isArray(result), true);
    })

    it("El dao debe agregar un usuario correctamente a la base de datos", async function(){
        const result = await this.usersDao.save(mockUser);
        assert.ok(result._id);
    })

    it("El dao agregará al documento insertado un arreglo de mascotas vacío por defecto", async function(){
        const result = await this.usersDao.save(mockUser);
        assert.deepStrictEqual(result.pets, []);
    })

    it("El dao puede obtener a un usuario por email", async function(){
        const result = await this.usersDao.save(mockUser);
        const user = await this.usersDao.getBy({email: result.email});
        assert.strictEqual(typeof user, "object")
    })

})