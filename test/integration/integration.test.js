import * as chai from "chai";
import fs from "fs";
import supertest from "supertest";
import mongoose from "mongoose";
import config from "../../config/index.js";
import { fakePetBody } from "../../src/services/mocks/pets.js";
import { fakeUserBody } from "../../src/services/mocks/users.js";
import Pet from "../../src/dao/Pets.dao.js";
import Users from "../../src/dao/Users.dao.js";
import { passwordValidation } from "../../src/utils/index.js";
import app from "../../src/app.js";

const ORIGIN = `${config.PROTOCOL}://${config.HOST}:${config.PORT}`;

const expect = chai.expect;
const requester = supertest(app);

describe("**Integration Tests**", function () {
  let userCoder = {
    first_name: "Coder",
    last_name: "House",
    email: "coder@mail.com",
    password: "coder123",
  };
  let cookie = {};

  before(async function () {
    this.usersDao = new Users()
    const { _body } = await requester
      .post("/api/sessions/register")
      .send(userCoder);
    userCoder._id = _body.payload;
  });

  after(async function () {
    await this.usersDao.delete(userCoder._id);
  });

  describe("Test de Sessiones", function () {
    const userDataMock = fakeUserBody();
    this.timeout(4000);

    it("Debe registrar correctamente a un usuario con codigo de estado 201", async function () {
      const { _body, statusCode } = await requester
        .post("/api/sessions/register")
        .send(userDataMock);

      expect(_body.payload).to.be.ok;
      expect(statusCode).to.be.equal(201);
      expect(mongoose.Types.ObjectId.isValid(_body.payload)).to.be.true;
    });

    it("Debe loguear correctamente al servidor y devolver una Cookie", async function () {
      const result = await requester
        .post("/api/sessions/login")
        .send({ email: userDataMock.email, password: userDataMock.password });
      const cookieResult = result.headers["set-cookie"][0];
      expect(cookieResult).to.be.ok;
      cookie = {
        name: cookieResult.split("=")[0],
        value: cookieResult.split("=")[1],
      };
      expect(cookie.name).to.be.ok.and.equal("coderCookie");
      expect(cookie.value).to.be.ok;
    });

    it("Debe enviar la cookie que contiene el usuario sin comprometer información sensible del usuario", async function () {
      const { _body } = await requester
        .get("/api/sessions/current")
        .set("Cookie", [`${cookie.name}=${cookie.value}`]);

      expect(_body.payload).not.deep.include.keys("password");
      expect(_body.payload.email).to.be.equal(userDataMock.email);
      expect(_body.payload.name).to.be.equal(
        `${userDataMock.first_name} ${userDataMock.last_name}`
      );
    });

    it("Debe poder cerrar la sesion correctamente limpiando la cookie", async function () {
      const result = await requester.post("/api/sessions/logout");
      expect(result.statusCode).to.be.equal(200);
      expect(result._body.status).to.be.equal("success");

      const cookieResult = result.headers["set-cookie"][0];
      cookie.name = cookieResult.split("=")[0];
      if (cookieResult.includes(`${cookie.name}=;`)) {
        cookie.value = "";
      }
      expect(cookie.name).to.be.ok.and.equal("coderCookie");
      expect(cookie.value).to.be.not.ok;
    });

    it("Debería actualizar last_connection al hacer login", async function () {
      await requester
        .post("/api/sessions/login")
        .send({ email: userCoder.email, password: userCoder.password });
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const user = await this.usersDao.getBy({ email: userCoder.email });

      expect(user.last_connection).to.be.a("date");
      const difference = new Date() - new Date(user.last_connection);
      expect(difference).to.be.greaterThan(2000);
      expect(difference).to.be.lessThan(5000);
    });

    it("Debería actualizar last_connection al hacer logout", async function () {
      await requester.post("/api/sessions/logout");
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const user = await this.usersDao.getBy({ email: userCoder.email });

      expect(user.last_connection).to.be.a("date");
      const difference = new Date() - new Date(user.last_connection);
      expect(difference).to.be.greaterThan(2000);
      expect(difference).to.be.lessThan(5000);
    });
  });

  describe("Test de usuarios", function () {
    let userDataMock = fakeUserBody();
    let userMock;

    it("La contraseña del usuario debe guardarse hasheada en la base de datos", async function () {
      const { _body } = await requester
        .post("/api/sessions/register")
        .send(userDataMock);

      userMock = JSON.parse(
        JSON.stringify(await this.usersDao.getBy({ _id: _body.payload }))
      );

      const { password: passMock } = userDataMock;
      expect(userMock.password).to.be.not.deep.equal(passMock);
      expect(await passwordValidation(userMock, passMock)).is.true;
    });

    it("GET /api/users debe devolver una lista de usuarios en la propiedad 'payload'", async function () {
      const { _body: body } = await requester.get("/api/users");
      expect(body.payload).to.be.an("array");
      expect(body.payload[0]).to.be.deep.include.keys(userMock);
    });
    it("GET /api/users/:uid debe poder obtener un usuario por su ID", async function () {
      const { _body } = await requester.get("/api/users/" + userMock._id);
      expect(_body.payload).to.be.deep.equal(userMock);
    });
    it("PUT /api/users/:uid debe poder actualizar correctamente a un usuario por su ID", async function () {
      const newDataToUpload = fakeUserBody();
      const { ok } = await requester
        .put(`/api/users/${userMock._id}`)
        .send(newDataToUpload);

      const getUser = await this.usersDao.getBy({ _id: userMock._id });
      const userUpdateParse = JSON.parse(JSON.stringify(getUser));

      expect(ok).to.be.equal(true);
      expect(userUpdateParse).to.be.not.deep.equal(userMock);
      expect(userUpdateParse).to.be.include(newDataToUpload);
    });
    it("DELETE /api/users/:uid debe poder eliminar un usuario por su ID", async function () {
      const { ok } = await requester.delete(`/api/users/${userMock._id}`);
      const getUser = await this.usersDao.getBy({ _id: userMock._id });

      expect(ok).to.be.equal(true);
      expect(getUser).to.be.equal(null);
    });
  });

  describe("Test de mascotas", function () {
    let responsePost, responseGet;
    const petMock = fakePetBody();

    before(async function () {
      this.petsDao = new Pet();
      responsePost = await requester.post("/api/pets").send(petMock);
      responseGet = await requester.get("/api/pets");
    });

    it("GET /api/pets debe devolver una lista de mascotas en la propiedad 'payload'", async function () {
      const body = responseGet._body;
      expect(body.payload).to.be.an("array");
      expect(body.payload[0]).to.be.deep.include.keys(
        responsePost._body.payload
      );
    });
    it("POST /api/pets debe crear una mascota correctamente", async function () {
      const body = responsePost._body;
      expect(body.payload).to.have.property("_id");
      expect(mongoose.Types.ObjectId.isValid(body.payload._id)).to.be.true;
    });
    it("POST /api/pets debe crear una mascota con la propiedad 'adopted' en false", async function () {
      const body = responsePost._body;
      expect(body.payload).to.have.property("adopted").to.be.equal(false);
    });
    it("PUT /api/pets/:pid debe poder actualizar correctamente a una mascota por su ID", async function () {
      const petMock2 = fakePetBody();
      const originalPet = responsePost._body.payload;
      const { ok } = await requester
        .put(`/api/pets/${originalPet._id}`)
        .send(petMock2);

      const getPet = await this.petsDao.getBy({ _id: originalPet._id });
      const petUpdateParse = JSON.parse(JSON.stringify(getPet));

      expect(ok).to.be.equal(true);
      expect(petUpdateParse).to.be.not.deep.equal(originalPet);
      expect(petUpdateParse).to.be.include(petMock2);
    });
    it("DELETE /api/pets/:pid debe poder eliminar una mascota por su ID", async function () {
      const originalPet = responsePost._body.payload;
      const { ok } = await requester.delete(`/api/pets/${originalPet._id}`);
      const getPet = await this.petsDao.getBy({ _id: originalPet._id });

      expect(ok).to.be.equal(true);
      expect(getPet).to.be.equal(null);
    });
  });

  describe("Testing Uploads", function () {

    before(function () {
      if(!fs.existsSync("src/public/tests")) {
        fs.mkdirSync("src/public/tests");
      }
    })

    after(function () {
      if(fs.existsSync("src/public/tests")) {
        fs.rmSync("src/public/tests", { recursive: true });
      }
    });

    it("POST /api/pets/withimage debe poder crearse una mascota con la ruta de la imagen", async function () {
    const petMock = fakePetBody();
      const responsePost = await requester
        .post("/api/pets/withimage")
        .field("name", petMock.name)
        .field("specie", petMock.specie)
        .field("birthDate", petMock.birthDate)
        .attach("image", "test/assets/coderDog.jpg");

      expect(responsePost.statusCode).to.be.equal(201);
      expect(responsePost.body.payload).to.have.property("_id");
      expect(responsePost.body.payload).to.have.property("image");
      expect(responsePost._body.payload.image).to.be.ok;
    });

    it("POST /api/users/:uid/documents debe subir documentos del usuario y guardar las rutas en su propiedad documents", async function () {
      const responsePost = await requester
        .post(`/api/users/${userCoder._id}/documents`)
        .attach("certified", "test/assets/certified.jpg")
        .attach("picture", "test/assets/profile.jpg")
        .attach("identification", "test/assets/license.jpg")
        .attach("cv-pet", "test/assets/cvPet.pdf");

      expect(responsePost.statusCode).to.be.equal(201);
    });

    it("Se debe poder cambiar un documento sin afectar los demas si es que no fueron modificados", async function () {
      const responsePost = await requester
        .post(`/api/users/${userCoder._id}/documents`)
        .attach("picture", "test/assets/coderDog.jpg");

      expect(responsePost.statusCode).to.be.equal(201);
      expect(responsePost._body.payload.documents).to.have.a.lengthOf(4);
    });
  });
});
