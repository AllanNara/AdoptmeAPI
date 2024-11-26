import * as chai from "chai";
import supertest from "supertest";
import mongoose from "mongoose";
import config from "../../config/index.js";
import { fakePetBody } from "../../src/services/mocks/pets.js";
import { fakeUserBody, fakeUser } from "../../src/services/mocks/users.js";
import Pet from "../../src/dao/Pets.dao.js";
import Users from "../../src/dao/Users.dao.js";

const ORIGIN = `${config.PROTOCOL}://${config.HOST}:${config.PORT}`;

const expect = chai.expect;
const requester = supertest(ORIGIN);

describe("**Integration Tests**", function(){
    describe("Test de mascotas", function(){
        let responsePost, responseGet
        const petMock = fakePetBody();
        
        before(async function(){
            this.petsDao = new Pet();
            responsePost = await requester.post("/api/pets").send(petMock);
            responseGet = await requester.get("/api/pets");
        })

        it("GET /api/pets debe devolver una lista de mascotas en la propiedad 'payload'", async function(){
            const body = responseGet._body;
            expect(body.payload).to.be.an("array")
            expect(body.payload[0]).to.be.deep.include.keys(responsePost._body.payload);
        })
        it("POST /api/pets debe crear una mascota correctamente", async function(){
            const body = responsePost._body;
            expect(body.payload).to.have.property("_id")
            expect(mongoose.Types.ObjectId.isValid(body.payload._id)).to.be.true;
        })
        it("POST /api/pets debe crear una mascota con la propiedad 'adopted' en false", async function(){
            const body = responsePost._body;
            expect(body.payload).to.have.property("adopted").to.be.equal(false);
        })
        it("PUT /api/pets/:pid debe poder actualizar correctamente a una mascota por su ID", async function(){
            const petMock2 = fakePetBody();
            const originalPet = responsePost._body.payload;
            const { ok } = await requester.put(`/api/pets/${originalPet._id}`).send(petMock2);
            
            const getPet = await this.petsDao.getBy({ _id: originalPet._id });
            const petUpdateParse = JSON.parse(JSON.stringify(getPet))

            expect(ok).to.be.equal(true);
            expect(petUpdateParse).to.be.not.deep.equal(originalPet)
            expect(petUpdateParse).to.be.include(petMock2)
            
        })
        it("DELETE /api/pets/:pid debe poder eliminar una mascota por su ID", async function(){
            const originalPet = responsePost._body.payload;
            const { ok } = await requester.delete(`/api/pets/${originalPet._id}`);
            const getPet = await this.petsDao.getBy({ _id: originalPet._id });

            expect(ok).to.be.equal(true);
            expect(getPet).to.be.equal(null);
        })
    })

    describe("Test de usuarios", function(){
        let userMock;

        before(async function(){
            this.usersDao = new Users();
            userMock = await this.usersDao.save(fakeUserBody());
            userMock = JSON.parse(JSON.stringify(userMock));
        })
        
        it("GET /api/users debe devolver una lista de usuarios en la propiedad 'payload'", async function(){
            const { _body: body } = await requester.get("/api/users");
            expect(body.payload).to.be.an("array")
            expect(body.payload[0]).to.be.deep.include.keys(userMock);
        })
        it("GET /api/users/:uid debe poder obtener un usuario por su ID", async function(){
            const getUser = await this.usersDao.getBy({ _id: userMock._id });
            const userGetParse = JSON.parse(JSON.stringify(getUser));
            expect(userGetParse).to.be.deep.equal(userMock)
        })
        it("PUT /api/users/:uid debe poder actualizar correctamente a un usuario por su ID", async function(){
            const userDataMock = fakeUserBody();
            const { ok } = await requester.put(`/api/users/${userMock._id}`).send(userDataMock);
            
            const getUser = await this.usersDao.getBy({ _id: userMock._id });
            const userUpdateParse = JSON.parse(JSON.stringify(getUser))

            expect(ok).to.be.equal(true);
            expect(userUpdateParse).to.be.not.deep.equal(userMock)
            expect(userUpdateParse).to.be.include(userDataMock)
            
        })
        it("DELETE /api/users/:uid debe poder eliminar un usuario por su ID", async function(){
            const { ok } = await requester.delete(`/api/users/${userMock._id}`);
            const getUser = await this.usersDao.getBy({ _id: userMock._id });

            expect(ok).to.be.equal(true);
            expect(getUser).to.be.equal(null);
        })
    })
})
