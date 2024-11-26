import * as chai from "chai";
import supertest from "supertest";
import config from "../../config/index.js";
import Users from "../../src/dao/Users.dao.js";
import { fakeUserBody } from "../../src/services/mocks/users.js";

const ORIGIN = `${config.PROTOCOL}://${config.HOST}:${config.PORT}`;

const expect = chai.expect;
const requester = supertest(ORIGIN);

describe("Test Users Router", function() {
    let userMock;

    before(async function(){
        this.usersDao = new Users();
        userMock = await this.usersDao.save(fakeUserBody());
        userMock = JSON.parse(JSON.stringify(userMock));
    })

    it("GET /api/users en caso de exito debe retornar un status 200", async function(){
        const { statusCode, ok } = await requester.get("/api/users");
        expect(statusCode).to.be.equal(200);
        expect(ok).to.be.equal(true);
    })

    it("GET /api/users/:uid en caso de exito debe retornar un status 200", async function(){
        const { statusCode, ok } = await requester.get(`/api/users/${userMock._id}`);
        expect(statusCode).to.be.equal(200);
        expect(ok).to.be.equal(true);
    })

    it("PUT /api/users/:uid debe responder con un status 204 en caso de exito", async function(){
        const userDataMock = fakeUserBody();
        const { _body, statusCode, ok } = await requester.put(`/api/users/${userMock._id}`).send(userDataMock);
        expect(_body).to.be.an.undefined;
        expect(statusCode).to.be.equal(204);
        expect(ok).to.be.equal(true);
    })

    it("DELETE /api/users/:uid debe responder con un status 204 en caso de exito", async function(){
        const { _body, statusCode, ok } = await requester.delete(`/api/users/${userMock._id}`);
        expect(_body).to.be.an.undefined;
        expect(statusCode).to.be.equal(204);
        expect(ok).to.be.equal(true);
    })
})