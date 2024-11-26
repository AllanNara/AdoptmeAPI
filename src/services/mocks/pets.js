import { faker } from "@faker-js/faker"

export default function generateMockPets(length = 10) {
    return Array.from({ length }, () => fakePet())
}

const fakePet = () => {
    let specie = faker.animal.type();
    return {
        name: faker.animal.petName(),
        specie,
        birthDate: faker.date.birthdate(),
        adopted: false,
        owner: null,
        image: faker.image.urlLoremFlickr({ category: specie })
    }
}

export const fakePetBody = () => {
    let specie = faker.animal.type();
    return {
        name: faker.animal.petName(),
        specie,
        birthDate: faker.date.birthdate().toISOString(),
        image: ""
    }
}