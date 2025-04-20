import { User } from "../types/user";

const api: User = {
    id: 1,
    name: "TFake User",
    email: "test-user@gmail.com",
    password: "12345678",
};

Object.freeze(api);

const fakeLogin: Promise<User> = new Promise((resolve) => {
    setTimeout(() => {
        resolve(api)
    }, 3000);
});

export default fakeLogin;