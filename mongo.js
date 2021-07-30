const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]
//// mongodb+srv://fullstack:<password>@cluster0.pamar.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
const url =
  `mongodb+srv://fullstack:${password}@cluster0.pamar.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const contactSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Contact = mongoose.model('Contact', contactSchema)


const contact = new Contact({
  name: process.argv[3],
  number: process.argv[4]
})

if (process.argv.length === 3) {
  Contact.find({}).then(result => {
    result.forEach(contact => {
      console.log(contact)
    })
    mongoose.connection.close()
  })
}

contact.save().then(result => {
  console.log('contact saved!')
  mongoose.connection.close()
})