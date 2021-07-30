require('dotenv').config()
const { response } = require('express')
const express = require('express')
const app = express()
const morgan = require('morgan')
const Contact = require('./models/contact')

app.use(express.static('build'))
app.use(express.json())

morgan.token('body', (req, res) => JSON.stringify(req.body)) 
let form = ':method :url :status :res[content-length] - :response-time ms :body'
app.use(morgan(form))


app.get('/api/persons', (req, res) => {
  Contact.find({}).then(contacts => res.json(contacts))
})

app.get('/info', (req, res) => {
  Contact.find({}).then( contacts => 
  res.send(`
    <div>Phonebook has info for ${contacts.length} people</div><br />
    <div>${(new Date()).toUTCString()} `
  ))
})

app.get('/api/persons/:id', (req, res) => {
  Contact.findById(req.params.id).then(contact => {
    res.json(contact)
  })
})

app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id
  Contact.remove({ _id: id}).then(res.status(204).end())
})

app.post('/api/persons', async (req, res) => {
  const newPerson = req.body 
  const isContactInDb = !Contact.find({ name: newPerson.name })

  if (!newPerson.name || !newPerson.number || isContactInDb) {
    return res.status(400).json({ error: 'name must be unique'})
  }

  const contact = new Contact(newPerson)
  contact.save().then(contact => res.json(contact))
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})