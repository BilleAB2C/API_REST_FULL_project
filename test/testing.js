let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../server");
let apiRouter = require("../apiRouter").router;
let config = require("../config/config");
var randomEmail = require("random-email");
let token;
let tokenValidateAccount;
let userId;
let emailConnexion;

var expect = require("chai").expect;
var should = require("should"),
  assert = require("assert"),
  request = require("supertest")(`${process.env.URL}:3000`),
  superagent = require("superagent");

const userCredentials = {
  email: emailConnexion,
  password: "@roose509",
};

const userCreateData = {
  gender: "monsieur",
  nom: "sequez",
  prenom: "sequelize",
  email: randomEmail(),
  password: "@roose509",
  password_confirm: "@roose509",
  address: "15 rue de la tour eifel",
  zipCode: "95100",
  city: "Argenteuil",
  optin: "yes",
};

/**
 * Register
 */
describe("User register", function () {
  it("should return status OK (201)", function (done) {
    request
      .post(`${config.rootAPI}user/register`)
      .type("form")
      .send(userCreateData)
      .end(function (err, res) {
        if (err) {
          throw err;
        }
        assert.ok(res.status, 201);
        res.status.should.be.equal(201);

        tokenValidateAccount = res.body.token;
        userId = res.body.id;
        emailConnexion = res.body.email;

        done();
      });
  });
});

describe("confirmation USER account", function () {
  /**
   * Validation Account
   */
  it("should return status OK (200)", function (done) {
    request
      .post(`${config.rootAPI}user/mailValidation/${userId}`)
      .type("form")
      .send({ token: tokenValidateAccount })
      .end(function (err, res) {
        if (err) {
          throw err;
        }
        assert.ok(res.status, 200);
        //res.status.should.equal(200);
        done();
      });
  });

  /**
   * Test the Get Route
   */
  /*   describe("GET all TICKETS for the User", () => {
    it("should GET all tickets", (done) => {
      request
        .get(`${config.rootAPI}user/tickets`)
        .set("Authorization", "Bearer " + token)
        .end((err, res) => {
          assert(token !== undefined, "missing TOKEN");
          assert.ok(res.status, 200);
          assert(Array.isArray([]), "empty arrays or full arrays");
          done();
        });
    });

    it("It should NOT GET all TICKETS for the User", (done) => {
      request.get(`${config.rootAPI}user/tickets`).end((err, response) => {
        if (err) {
          throw err;
        }

        assert.ok(response.text, "missing parameters");
        assert.ok(response.status, 400);
        done();
      });
    });
  }); */
});

describe("User LOGIN", function () {
  /**
   * Login
   */
  it("should return status OK (200)", function (done) {
    request
      .post(`${config.rootAPI}user/login`)
      .type("form")
      .send({
        email: emailConnexion,
        password: "@roose509",
      })
      .end(function (err, res) {
        if (err) {
          throw err;
        }
        token = res.body.token;
        assert.ok(res);
        assert.ok(res.body);
        assert.ok(res.status, 200);
        res.body.should.have.property("token");
        done();
      });
  });
});

describe("GET all Users", function () {
  let tokenAdmin;
  /**
   * Admin login
   */
  it("should return status OK (200)", function (done) {
    request
      .post(`${config.rootAPI}user/login`)
      .type("form")
      .send({
        email: "sequelize5901@yopmail.com",
        password: "@roose509",
      })
      .end(function (err, res) {
        if (err) {
          throw err;
        }
        tokenAdmin = res.body.token;
        assert.ok(res);
        assert.ok(res.body);
        assert.ok(res.status, 200);
        res.body.should.have.property("token");
        done();
      });
  });

  /**
   * Admin
   */
  it("should return status OK (200)", function (done) {
    request
      .get(`${config.rootAPI}admin/users`)
      .set("Authorization", "Bearer " + tokenAdmin)
      .end(function (err, res) {
        if (err) {
          throw err;
        }
        token = res.body.token;
        assert.ok(res);
        assert.ok(res.body);
        res.status.should.be.equal(200);
        expect(res.body).to.be.an("array");
        console.log(res.body);
        done();
      });
  });
});
// test push billel
