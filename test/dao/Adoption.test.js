import * as chai from "chai";
import Adoption from "../../src/dao/Adoption.dao.js";
import Users from "../../src/dao/Users.dao.js";
import Pet from "../../src/dao/Pets.dao.js";
import { fakeUserBody } from "../../src/services/mocks/users.js";
import { fakePetBody } from "../../src/services/mocks/pets.js";

const expect = chai.expect;

describe("Testing Adoptions Dao", function () {
  let userMock, petMock, adoptionMock;

  before(async function () {
    this.adoptionDao = new Adoption();
    this.usersDao = new Users();
    this.petsDao = new Pet();
    userMock = JSON.parse(
      JSON.stringify(await this.usersDao.save(fakeUserBody()))
    );
    petMock = JSON.parse(
      JSON.stringify(await this.petsDao.save(fakePetBody()))
    );
  });

  it("El dao debe poder obtener las adopciones en formato de arreglo", async function () {
    const result = await this.adoptionDao.get();
    expect(Array.isArray(result)).to.be.equal(true);
  });

  it("El dao debe poder agregar una adopcion correctamente a la base de datos", async function () {
    const newAdoption = await this.adoptionDao.save({
      owner: userMock._id,
      pet: petMock._id,
    });
    adoptionMock = JSON.parse(JSON.stringify(newAdoption));

    expect(adoptionMock._id).to.be.ok;
    expect(adoptionMock.owner).to.be.equal(userMock._id);
    expect(adoptionMock.pet).to.be.equal(petMock._id);
  });

  it("El dao debe poder traer una adopcion por id", async function () {
    const adoption = await this.adoptionDao.getBy({ _id: adoptionMock._id });

    expect(typeof adoption).to.be.equal("object");
    expect(adoption._id.toString()).to.be.equal(adoptionMock._id);
  });
});
