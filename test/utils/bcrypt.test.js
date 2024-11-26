import * as chai from "chai";
import { createHash, passwordValidation } from "../../src/utils/index.js";

const expect = chai.expect;

describe("Testing bcrypt functionality", function() {
    const originalPassword = "comadreja123";
    let user = {}

    beforeEach(async function() {
        user.password = await createHash(originalPassword);
    })

    it("El hash resultante debe ser distinto de la contraseña original", async function(){
        expect(user.password).to.not.equal(originalPassword);
    })

    it("El hasheo realizado debe poder compararse de manera efectiva con la contraseña original", async function(){
        const compareResult = await passwordValidation(user, originalPassword);
        expect(compareResult).to.be.equal(true);
    })

    it("Si el hash no coincide con la contraseña, la comparación debe fallar", async function(){
        const compareResult = await passwordValidation(user, originalPassword + "123");
        expect(compareResult).to.be.equal(false);
    })
})