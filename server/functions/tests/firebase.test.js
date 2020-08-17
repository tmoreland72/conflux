const uid = require("uid")
const fb = require("../firebase")

const userId = uid(6)

const user = {
   uid: userId,
   email: "testuser@gmail.com",
   emailVerified: true,
   phoneNumber: "",
   password: "baseball+orange",
   displayName: "Test User",
   photoUrl: "",
   disabled: false,
}

describe("Authentication", () => {
   it("Create a new Auth user", async () => {
      let payload = { userId, item: user }
      let result = await fb.authAdd(payload)
      expect(result).toEqual(
         expect.objectContaining({
            "disabled": false,
            "displayName": undefined,
            "email": "testuser@gmail.com",
            "emailVerified": true,
            "password": "baseball+orange",
            "phoneNumber": undefined,
            "photoUrl": undefined
         })
      )
   })

   it("Delete an Auth user", async () => {
      let result = await fb.authDelete(userId)
      expect(result).toBeTruthy()
   })

})
