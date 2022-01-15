"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
let token;
describe("Signup", () => {
    const data = {
        firstName: "segun",
        lastName: "adeleke",
        email: "segun30@gmail.com",
        DOB: "2022-12-09T10:09:27.309Z",
        phone_number: "08169897044",
        password: "123456",
        confirmPass: "123456"
    };
    test("/signup", async () => {
        try {
            const response = await (0, supertest_1.default)(app_1.default).post('/signup').send(data);
            expect(response.status).toBe(200);
            expect(response.body.message).toBe("Success! You have succesfully Created an Account");
            expect(response.body.newUser.email).toBe(data.email);
            expect(response.body.newUser.firstName).toBe(data.firstName);
            expect(response.body.newUser.lastName).toBe(data.lastName);
            expect(response.body.newUser.DOB).toBe(data.DOB);
            expect(response.body.newUser.phone_number).toBe(data.phone_number);
            expect(response.body.newUser.password).toBe(data.password);
        }
        catch (err) {
            console.error(err);
        }
    });
    test("login", async () => {
        const response = await (0, supertest_1.default)(app_1.default)
            .post("/login")
            .send(data);
        token = response.body.token;
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("You have successfully login");
        expect(response.body.cokies).toBe(token);
    });
});
test('should fectch balance by the account number', async () => {
    const res = await (0, supertest_1.default)(app_1.default)
        .get('/balance')
        .set("Authorization", `${token}`);
    token = res.body.token;
    expect(res.status).toBe(200); //
    expect(res.body.cokies).toBe(token);
});
function email(email) {
    throw new Error('Function not implemented.');
}
test('should create account for registered user', async () => {
    try {
        const res = await (0, supertest_1.default)(app_1.default)
            .post('/create-account')
            .send({ email: "segun3@gmail.com" });
        token = res.body.token;
        expect(res.body.email).toBe(email);
        expect(res.status).toBe(200);
        expect(res.body.cokies).toBe(token);
        expect(res.body.message).toBe("Account created successfuly. Thanks for choosen us");
        expect(res.body.balance).toBe(5000);
    }
    catch (error) {
        console.error(error);
    }
});
describe("transfer Fund", () => {
    const transfeData = {
        receiverAccount: 1234567896,
        amount: 1234,
        senderAccount: 1234567894,
        transferDescription: "A string of description"
    };
    test('should transfer amount specified to the account number provided', async () => {
        try {
            const res = await (0, supertest_1.default)(app_1.default)
                .post('/transfer')
                .send();
            token = res.body.token;
            expect(res.body.receiverAccount).toBe(transfeData.receiverAccount);
            expect(res.body.amount).toBe(transfeData.amount);
            expect(res.body.senderAccount).toBe(transfeData.senderAccount);
            expect(res.body.transferDescription).toBe(transfeData.transferDescription);
            expect(res.status).toBe(200);
            expect(res.body.cokies).toBe(token);
            expect(res.body.msg).toBe("Transaction Successful");
        }
        catch (error) {
            console.error(error);
        }
    });
});
test('should return the account balance for the provided account Number', async () => {
    const res = await (0, supertest_1.default)(app_1.default)
        .get('/balance/:account_number')
        .set("Authorization", `${token}`);
    token = res.body.token;
    expect(res.status).toBe(200); //
    expect(res.body.cokies).toBe(token);
    expect(res.body.msg);
});
test('should return the account balance for the provided User ID', async () => {
    const res = await (0, supertest_1.default)(app_1.default)
        .get('/balances/:userId')
        .set("Authorization", `${token}`);
    token = res.body.token;
    expect(res.status).toBe(200);
    expect(res.body.cokies).toBe(token);
    expect(res.body.msg);
});
test('should return all the balance for all the acount number', async () => {
    try {
        const res = await (0, supertest_1.default)(app_1.default)
            .get('/balances')
            .set("Authorization", `${token}`);
        token = res.body.token;
        expect(res.status).toBe(200);
        expect(res.body.cokies).toBe(token);
        expect(res.body.msg);
    }
    catch (error) {
        console.error(error);
    }
});
test('should return all the Debit Transaction for the provided acount number', async () => {
    try {
        const res = await (0, supertest_1.default)(app_1.default)
            .get('/transaction/debit/:account_number')
            .set("Authorization", `${token}`);
        token = res.body.token;
        expect(res.body.cokies).toBe(token);
        expect(res.status).toBe(200);
        expect(res.body.msg).toBe("Successful");
        expect(res.body.Status).toBe("Debit");
    }
    catch (error) {
        console.error(error);
    }
});
test('should return all the Credit Transaction for the provided acount number', async () => {
    try {
        const res = await (0, supertest_1.default)(app_1.default)
            .get('/transaction/credit/:account_number')
            .set("Authorization", `${token}`);
        token = res.body.token;
        expect(res.body.cokies).toBe(token);
        expect(res.status).toBe(200);
        expect(res.body.msg).toBe("Successful");
        expect(res.body.Status).toBe("Credit");
    }
    catch (error) {
        console.error(error);
    }
});
