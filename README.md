# tln-iam

## mutation
### login
```
mutation {
  login(username: "admin", password: "admin") {
    err
    token
    user {
      id
      username
      role
      language
      logoutTimeout
    }
  }
}
```