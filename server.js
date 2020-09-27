const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const app = express()
const MongoClient = require('mongodb').MongoClient

const mongodbUrl = 'mongodb://127.0.0.1:27017'

const url = mongodbUrl + '/starwars-quotes'

mongoose.connect(url, { useNewUrlParser: true })

const db = mongoose.connection
db.once('open', _ => {
  console.log('Database connection: ', url)
})

db.on('error', err => {
  console.error('connection error:', err)
})

const Quote = require('./models/Quote')

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())


app.get('/', (req, res) => {
  async function getQuotes() {
    const quotes = await Quote.find()
    return quotes;
  }

  getQuotes()
    .then(quotes => {
      console.log(quotes)
      res.render('index.ejs', { quotes })
    })
})

app.post('/quotes', (req, res) => {
  console.log(req.body)

  async function saveQuote(payload) {
    const quote = new Quote(payload)

    const doc = await quote.save()
    console.log(doc)
  }

  saveQuote(req.body)
  .then(() => {
    res.redirect('/')
  })
  .catch(console.error)
})

app.put('/quotes', (req, res) => {
  async function updateQuote(query, payload) {
    const quote = await Quote.findOne(query)
    quote.name = payload.name
    quote.quote = payload.quote
    const doc = await quote.save()
    return doc
  }

  updateQuote({ name: 'Yoda' }, req.body)
    .then(() => {
      res.json('Success')
    })
    .catch(console.error)
})

app.delete('/quotes', (req, res) => {
  async function deleteQuote(query) {
    const quote = await Quote.findOne(query)
    if (quote) {
      await quote.remove();
      return true
    } else {
      return false
    }
  }

  deleteQuote({ name: req.body.name})
    .then(result => {
      if (result) {
        res.json('Deleted')
      } else {
        res.json('No quote to delete')
      }
    })
    .catch(console.error)
})



app.listen(3000, function() {
  console.log('listening on 3000')
})
