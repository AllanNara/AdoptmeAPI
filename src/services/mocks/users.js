import { faker } from "@faker-js/faker"
import { createHash } from "../../utils/index.js"

export default async function generateMockUsers(length = 10) {
    const users = [];
    for(let i = 0; i < length; i++){
        const userFake = await fakeUser()
        users.unshift(userFake)
    }
    return users
}

export const fakeUser = async () => {
    return {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: await createHash("coder123"),
        role: faker.helpers.arrayElement(["admin", "user"]),
        pets: []
    }
}