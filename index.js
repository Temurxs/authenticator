const http = require("node:http")
const fs = require("node:fs/promises")

const server = http.createServer(async (req, res) => {
  if (req.url === `/login` && req.method === "POST") {
    let body = ""

    req.on("data", chunck => {
      body += chunck.toString()
    })



    req.on("end", async () => {
      let users = await fs.readFile("./users.json", "utf-8")
      let parsedUsers = JSON.parse(users)
      let parsedBody = JSON.parse(body)
      let { name, password } = parsedBody

      if (!parsedUsers.find(el => el.name == name && el.password == password)) {
        res.writeHead(403)
        return res.end(JSON.stringify("The username or password is incorrect"))
      } 
        return res.end(JSON.stringify("Successfully logged in "))
      

    })
  }

  if (req.url === "/register" && req.method === "POST") {

    let body = ""

    req.on("data", chunk => {
      body += chunk.toString()
    })

    req.on("end", async () => {
      let users = await fs.readFile("./users.json", "utf-8")
      let parsedUsers = JSON.parse(users)
      let parsedBody = JSON.parse(body)
      let { name, password } = parsedBody

    

          let hasUpper = false;
          let hasLower = false;
          let hasNumber = false;
          let hasSymbol = false;
        

      for (let i = 0; i < password.length; i++) {
        let ch = password[i];
         if (ch >= 'A' && ch <= 'Z') {
          hasUpper = true;
        } else if (ch >= 'a' && ch <= 'z') {
          hasLower = true;
        } else if (ch >= '0' && ch <= '9') {
          hasNumber = true;
        } else {
          hasSymbol = true;
        }
      }


     if ( password.length < 4 ) {
            res.writeHead(405)
            res.end(JSON.stringify("There must be at least 4 characters"))
      }
        if (password.length > 10){
        res.writeHead(405)
        return res.end(JSON.stringify("There must be max 10 characters"))
      }

      if (!hasUpper) {
          res.writeHead(403, { "content-type": "application/json" })
      return  res.end(JSON.stringify("Password must contain at least one uppercase letter."));
      } 
       if (!hasLower) {
        res.writeHead(403, { "content-type": "application/json" })
       return res.end(JSON.stringify("Password must contain at least one lowercase letter."));
      } 
      
      if (!hasNumber) {
        res.writeHead(403, { "content-type": "application/json" })
      return  res.end(JSON.stringify("Password must contain at least one number."));
      } 
      
      if (!hasSymbol) {
        res.writeHead(403, { "content-type": "application/json" })
       return res.end(JSON.stringify("Password must contain at least one symbol."));
      } 

      if (parsedUsers.find(el => el.name == name)) {
        res.writeHead(403, { "content-type": "application/json" })
        return res.end(JSON.stringify("User already exists"))
      }

      parsedUsers.push(parsedBody)
      fs.writeFile("./users.json", JSON.stringify(parsedUsers, null, 2))
      res.writeHead(200, { "content-type": "application/json" })
      return res.end(JSON.stringify("Successfuly registered"))
    })
  

  }
});

server.listen(3003, () => {
  console.log("Server running at http://localhost:3003`");
});
