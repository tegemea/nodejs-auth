const express = require('express')
const bcrypt = require('bcrypt')

const app = express();
app.use(express.json());

const users = []

app.get('/users', (req, res) => { res.json(users) })
app.post('/users', async (req, res) => { 
  const hashedPass = await bcrypt.hash(req.body.password, 10)
  const user = { name: req.body.name, password: hashedPass }
  users.push(user); res.status(201).send(user)
 })

app.post('/users/login', async (req, res) => {
  const user = users.find(u => u.name === req.body.name)
  if(user === null) return res.status(404).send('Sorry, user not found')
  try {
    if(await bcrypt.compare(req.body.password, user.password)) {
      return res.send('Success')
    } else {
      return res.send('Not Authorized')
    }
  } catch(e) {
    res.send({ Error: e.name, Description: e.message })
  }
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`App running at port ${PORT}...`))