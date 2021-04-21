const Supertest = require("supertest")
const supertest = Supertest("http://localhost:5001/conflux-bacaa/us-central1/api")

const TENANTID = '0NyxKqBtD37vYqLlkDfa'
const USERID = 'pgrkn1noxtp'

describe("Users", () => {

   it("should create a user", async () => {
      let user = {
         id: '1234ABCD',
         userId: '1234ABCD',
         name: 'Troy Moreland',
         email: 'troy@morelands.net',
         mobile: '+17139623345',
      }
      await supertest
         .post("/"+TENANTID+"/users",)
         .send({item: user})
         .set('Content-Type', 'application/json')
         .set('Accept', 'application/json')
         .expect(201)
         .end(function(err, res) {
            if(err) throw err
            done()
         })
   })

   it("should return users", async () => {
      let result = await supertest
         .get("/"+TENANTID+"/users")
         .send()
      expect(typeof result.text).toBe("string")
   })

   it("should delete a user", async () => {
      await supertest
         .delete("/"+TENANTID+"/users/1234ABCD",)
         .send()
         .expect(204)
         .end(function(err, res) {
            if(err) throw err
            done()
         })
   })

})
