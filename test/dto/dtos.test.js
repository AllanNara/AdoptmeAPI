import * as chai from "chai";
import { fakePet } from "../../src/services/mocks/pets.js";
import PetDTO from "../../src/dto/Pet.dto.js";
import { fakeUser } from "../../src/services/mocks/users.js";
import UserDTO from "../../src/dto/User.dto.js";

const expect = chai.expect;

describe("Testing Dtos", function() {
    it("El dto de Pet debe eliminar propiedades innecesarias", async function(){
        const pet = fakePet();
        pet.extra = "esta es una propiedad intrusa";
        pet.mother = "jane doe";
        const petDTO = PetDTO.getPetInputFrom(pet);
        expect(petDTO).to.not.have.property("extra");
        expect(petDTO).to.not.have.property("owner");
        expect(petDTO).to.not.have.property("mother");
    })

    it("El dto de Pet debe incorporar la propiedad 'adopted' en false", async function(){
        const pet = fakePet();
        delete pet.adopted;
        const petDTO = PetDTO.getPetInputFrom(pet);
        expect(petDTO).to.be.deep.equal({ 
            adopted: false, 
            birthDate: pet.birthDate, 
            image: pet.image, 
            name: pet.name, 
            specie: pet.specie 
        });
    })

    it("El dto de User debe unificar el nombre y apellido en una única propiedad", async function(){
        const user = await fakeUser();
        const userDTO = UserDTO.getUserTokenFrom(user);
        expect(userDTO).to.be.deep.equal({
            name: `${user.first_name} ${user.last_name}`,
            role: user.role,
            email: user.email
        })
    })

    it("El dto de User debe eliminar propiedades innecesarias", async function(){
        const user = await fakeUser();
        const userDTO = UserDTO.getUserTokenFrom(user);
        expect(userDTO).to.not.have.property("first_name");
        expect(userDTO).to.not.have.property("last_name");
        expect(userDTO).to.not.have.property("password");
        expect(userDTO).to.not.have.property("pets");
    })
})
