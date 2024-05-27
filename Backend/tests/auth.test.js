const { signup } = require("../controllers/signupControllers");
const { login } = require("../controllers/loginControllers");
const database = require("../database");
const signupUser = require("../models/signupUser");

beforeAll(async () => {
  await database();
});

afterAll(async () => {
  await signupUser.deleteOne({});
});

const createTestUser = async () => {
  await signupUser.create({
    name: "Tarun",
    email: "tarun@gmail.com",
    password: "Tarun@123",
  });
};

//Create New User

test("Create New User", async () => {
  // Arrange
  const req = {
    body: {
      name: "Tarun",
      email: "tarun@gmail.com",
      password: "Tarun@123",
    },
  };
  const res = { json: jest.fn() };

  // Act
  await signup(req, res);

  // Assert
  expect(res.json).toHaveBeenCalled();
  expect(res.json).toHaveBeenCalledWith({
    success: true,
    info: "Account Created Successfully!!",
  });
});

//User already exists

test("User already exists", async () => {
  // Arrange
  const req = {
    body: {
      name: "Tarun",
      email: "tarun@gmail.com",
      password: "Tarun@123",
    },
  };
  const res = { json: jest.fn() };

  // Act
  await signup(req, res);

  // Assert
  expect(res.json).toHaveBeenCalled();
  expect(res.json).toHaveBeenCalledWith({
    success: false,
    error: "Email Address is already registered!",
  });
});

// Login User

test("Login User", async () => {
  // Arrange
  const req = {
    body: {
      email: "tarun@gmail.com",
      password: "Tarun@123",
    },
  };
  const res = { json: jest.fn() };

  // Act
  await login(req, res);

  // Assert
  expect(res.json).toHaveBeenCalled();
  expect(res.json).toHaveBeenCalledWith({
    success: true,
    info: "Login Success",
    token: expect.any(String),
  });
});

//Login User with wrong credentials

test("Login User with wrong credentials", async () => {
  // Arrange
  const req = {
    body: {
      email: "tarun@gmail.com",
      password: "Tarun@123",
    },
  };
  const res = { json: jest.fn() };

  // Act
  await login(req, res);

  // Assert
  expect(res.json).toHaveBeenCalled();
  expect(res.json).toHaveBeenCalledWith({
    success: false,
    error: "Invalid Credentials!",
  });
});
