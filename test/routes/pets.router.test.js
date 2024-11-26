import * as chai from "chai";
import supertest from "supertest";
import config from "../../config/index.js";
import { fakePetBody } from "../../src/services/mocks/pets.js";

const ORIGIN = `${config.PROTOCOL}://${config.HOST}:${config.PORT}`;

const expect = chai.expect;
const requester = supertest(ORIGIN);

describe("Test Pets Router", function() {
    let responsePost, responseGet
    const petMock = fakePetBody();

    before(async function(){
        responsePost = await requester.post("/api/pets").send(petMock);
        responseGet = await requester.get("/api/pets");
    })

    it("GET /api/pets en caso de exito debe retornar un status 200", async function(){
        const { statusCode, ok } = responseGet;
        expect(statusCode).to.be.equal(200);
        expect(ok).to.be.equal(true);
    })
    
    it("POST /api/pets en caso de exito debe retornar un status 201", async function(){
        const { statusCode, ok } = responsePost;
        expect(statusCode).to.be.equal(201);
        expect(ok).to.be.equal(true);           
    })

    it("POST /api/pets debe rechazar la peticion con un status 400 si faltan campos requeridos", async function(){
        const responseFailed = await requester.post("/api/pets").send({ specie: "dog", birthDate: "11-02-2009" });
        const { statusCode, ok } = responseFailed;
        expect(ok).to.be.equal(false);
        expect(statusCode).to.be.equal(400);
    })

    it("PUT /api/pets/:pid debe responder con un status 204 en caso de exito", async function(){
        const originalPet = responsePost._body.payload;
        const { _body, statusCode } = await requester.put(`/api/pets/${originalPet._id}`).send({ name: "Juancho" });
        
        expect(_body).to.be.an.undefined;
        expect(statusCode).to.be.equal(204);
    })

    it("DELETE /api/pets/:pid debe responder con un status 204 en caso de exito", async function(){
        const originalPet = responsePost._body.payload;
        const { _body, statusCode } = await requester.delete(`/api/pets/${originalPet._id}`);
        
        expect(_body).to.be.an.undefined;
        expect(statusCode).to.be.equal(204);
    })
})
