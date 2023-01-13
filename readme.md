# hostname 
- http://localhost:3000

# endpoint
- /all                                     GET
- /get-1?id=<user_id>                      GET


- /create                                  POST
  - Body => { "name": "username" }

- /update?id=<user_id>                     PUT
  - Body => { "name": "username" }

- /delete?id=<user_id>                     DELETE