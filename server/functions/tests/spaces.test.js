const Supertest = require("supertest")
const supertest = Supertest("http://localhost:5001/conflux-bacaa/us-central1/api")

const TENANTID = '0NyxKqBtD37vYqLlkDfa'
const USERID = 'pgrkn1noxtp'

describe("Spaces", () => {

   it("should return tenant spaces", async () => {
      let result = await supertest
         .get("/"+TENANTID+"/spaces")
         .send()
      expect(typeof result.text).toBe("string")
   })

})
