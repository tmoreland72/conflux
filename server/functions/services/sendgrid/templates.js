exports.register = ({ name }) => {
   return `
   <html>
   <body>
   <p>Welcome, ${name}!</p>
   <p>You have been successfully registered on Conflux!</p>
   <p>If you have any problems or questions, please let us know!</p>
   <p>Conflux Staff</p>
   </body>
   </html>
   `
}

exports.passwordReset = ({ name, password }) => {
   return `
   <html>
   <body>
   <p>Hi, ${name}!</p>
   <p>Your Conflux password has been reset to: ${password}</p>
   <p>Conflux Staff</p>
   </body>
   </html>
   `
}
