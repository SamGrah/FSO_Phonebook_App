const { response } = require('express')
const express = require('express')
const app = express()
const morgan = require('morgan')

app.use(express.static('build'))
app.use(express.json())

morgan.token('body', (req, res) => JSON.stringify(req.body)) 
let form = ':method :url :status :res[content-length] - :response-time ms :body'
app.use(morgan(form))

let persons = [
  { 
    "name": "Arto Hellas", 
    "number": "040-123456",
    "id": 1
  },
  {
    "name": "Ada Lovelace", 
    "number": "39-44-5323523",
    "id": 2
  },
  { 
    "name": "Dan Abramov", 
    "number": "12-43-234345",
    "id": 3
  },
  { 
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122",
    "id": 4
  }
]


app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/info', (req, res) => {
  res.send(`
    <div>Phonebook has info for ${persons.length} people</div><br />
    <div>${(new Date()).toUTCString()}
  `)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)

  res.json(person)
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id) 

  res.status(204).end()
})

app.post('/api/persons', (req, res) => {
  const newPerson = {...req.body, id: null }

  if (!newPerson.name
      || !newPerson.number
      || persons.some(person => person.name === newPerson.name)) {
    return res.status(400).json({ error: 'name must be unique'})
  }

  
  while(true){
    newPerson.id = Math.floor(Math.random() * 1000)
    if (persons.every(person => person.id !== newPerson.id)) break
  }

  persons = [...persons, newPerson] 
  res.json(newPerson)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})