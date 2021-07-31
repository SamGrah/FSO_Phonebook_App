require('dotenv').config()
const React = require('express')
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
    <div>${(new Date()).toUTCString()}`
  ))
})

app.get('/api/persons/:id', (req, res, next) => {
  Contact.findById(req.params.id).then(contact => {
    if (contact) {
      res.json(contact)
    } else {
      res.status(404).end()
    }
  }).catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id
  Contact.remove({ _id: id}).then(res.status(204).end())
})

app.post('/api/persons', async (req, res, next) => {
  const newPerson = req.body 
  const isContactInDb = (await Contact.find({ name: newPerson.name })).length
  console.log(`Db return of name check for ${newPerson.name}`, isContactInDb)

  if (isContactInDb) {
    return res.status(404).json({ error: 'name must be unique'})
  }

  const contact = new Contact(newPerson)
  contact.save().then(contact => res.json(contact))
                .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const contact = {
    name: req.body.name,
    number: req.body.number,
  }

  let opts = { new: true, runValidators: true }
  Contact.findByIdAndUpdate(req.params.id, contact, opts)
   .then( updatedContact => res.json(updatedContact))
   .catch(error => next(error))
})

const unknownEndpoint = (req, res) => {
  res.status(400).send({ error: 'unknown endpoint'})
}

const errorHandler = (error, req, res, next) => {
  console.log(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id'})
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})