import * as chai from "chai";
import supertest from "supertest";
import config from "../../config/index.js";
import { fakePetBody } from "../../src/services/mocks/pets.js";
import Pet from "../../src/dao/Pets.dao.js";

const ORIGIN = `${config.PROTOCOL}://${config.HOST}:${config.PORT}`;

const expect = chai.expect;
const requester = supertest(ORIGIN);

describe("Testing Uploads", function () {
  const petMock = fakePetBody();

  it("POST /api/pets/withimage debe poder crearse una mascota con la ruta de la imagen", async function () {
    const responsePost = await requester
      .post("/api/pets/withimage")
      .field("name", petMock.name)
      .field("specie", petMock.specie)
      .field("birthDate", petMock.birthDate)
      .attach("image", "test/coderDog.jpg");

      expect(responsePost.statusCode).to.be.equal(201);
      expect(responsePost.body.payload).to.have.property("_id");
      expect(responsePost.body.payload).to.have.property("image");
      expect(responsePost._body.payload.image).to.be.ok
  });
});
