import UserService from "../../service/user.service";
import userDB from "../../repository/user.db";
import { UserInput, UserLoginInput } from "../../types";
import { Role } from "../../model/role";
import { User } from "../../model/user";
import bcrypt from 'bcrypt';

const validName = "Test";
const validEmail = "test@bingevault.com";
const validPassword = "TestT123!";

let validUser: User;
let createUserMock: jest.Mock;
let authenticateMock: jest.Mock;
let getUserByNameMock: jest.Mock;
let bcryptCompareMock: jest.Mock;

beforeEach(() => {
    validUser = new User({ name: validName, email: validEmail, password: validPassword });
    validUser.setRole(Role.USER);

    createUserMock = jest.fn();
    authenticateMock = jest.fn();
    getUserByNameMock = jest.fn();
    bcryptCompareMock = jest.fn();

});

afterEach(() => {
    jest.clearAllMocks();
});

test('given a valid user input, when creating a user, then user is created with those values', async () => {
    // given
    UserService.createUser = createUserMock;
    createUserMock.mockResolvedValue(validUser);

    // when
    await UserService.createUser({ name: validName, email: validEmail, password: validPassword });

    // then
    expect(createUserMock).toHaveBeenCalledTimes(1);
    expect(createUserMock).toHaveBeenCalledWith({ name: validName, email: validEmail, password: validPassword });
});

test('given an existing email, when creating a user, then an error is thrown', async () => {
    // given
    UserService.createUser = createUserMock;
    createUserMock.mockRejectedValue(new Error('User with this email already exists'));

    // when
    const createUser = UserService.createUser({ name: validName, email: validEmail, password: validPassword });

    // then
    await expect(createUser).rejects.toThrow('User with this email already exists');
});

