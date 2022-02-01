const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/protected', (req, res, next) => {
  // authentication middleware
  const auth = { login: 'yourlogin', password: 'yourpassword' } // change this

  // parse login and password from headers
  const b64auth = (req.headers.authorization || '').split(' ')[1] || ''
  const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':')

  // Verify login and password are set and correct
  if (login && password && login === auth.login && password === auth.password) {
    // Access granted...
    return next()
  }

  // Access denied...
  res.set('WWW-Authenticate', 'Basic realm="401"')
  res.status(401).send('Authentication required.') // custom message
})

app.get('/protected', (req, res) => {
  res.send('This is protected')
})

app.listen(port, () => {
  console.log(`http://localhost:${port}`)
})
