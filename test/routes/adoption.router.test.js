import * as chai from "chai";
import supertest from "supertest";
import config from "../../config/index.js";
import { fakeUserBody } from "../../src/services/mocks/users.js";
import { fakePetBody } from "../../src/services/mocks/pets.js";
import Users from "../../src/dao/Users.dao.js";
import Pet from "../../src/dao/Pets.dao.js";
import { faker } from "@faker-js/faker";

const ORIGIN = `${config.PROTOCOL}://${config.HOST}:${config.PORT}`;

const expect = chai.expect;
const requester = supertest(ORIGIN);

describe("Test Adoption Router", function() {
    let userMock, petMock, adoption;

    before(async function(){
    this.usersDao = new Users();
    this.petsDao = new Pet();
    userMock = await this.usersDao.save(fakeUserBody())
    petMock = await this.petsDao.save(fakePetBody())
    })

    it("GET /api/adoptions en caso de exito debe retornar un status 200", async function(){
        const { statusCode, ok } = await requester.get("/api/adoptions");
        expect(statusCode).to.be.equal(200);
        expect(ok).to.be.equal(true);
    })

    it("POST /api/adoptions/:uid/:pid en caso de exito debe retornar un status 201", async function(){
        const { statusCode, ok, _body } = await requester.post(`/api/adoptions/${userMock._id}/${petMock._id}`);

        adoption = _body.payload;
        expect(statusCode).to.be.equal(201);
        expect(ok).to.be.equal(true);           
    })

    it("POST /api/adoptions/:uid/:pid en caso de que el usuario o la mascota no exista debe retornar un status 404", async function(){
        const { statusCode, ok } = await requester.post(`/api/adoptions/${faker.database.mongodbObjectId()}/${faker.database.mongodbObjectId()}`);

        expect(ok).to.be.equal(false);
        expect(statusCode).to.be.equal(404);
    })

    it("POST /api/adoptions/:uid/:pid debe retornar un status 400 si la mascota ya ha sido adoptada", async function(){
        const { statusCode, ok } = await requester.post(`/api/adoptions/${userMock._id}/${petMock._id}`);
        expect(statusCode).to.be.equal(400);
        expect(ok).to.be.false;           
    })

    it("GET /api/adoptions/:aid en caso de exito debe retornar un status 200", async function(){
        const { statusCode, ok } = await requester.get(`/api/adoptions/${adoption._id}`);
        expect(statusCode).to.be.equal(200);
        expect(ok).to.be.equal(true);
    })
})
