const express = require('express')
const Joi = require('joi')
const app = express()
var request = require("request");

app.use(express.json())

const courses = [
    {id: 1, name: 'course1', active: true, price: 10, notes: []},
    {id: 2, name: 'course2', active: false, price: 9, notes: []},
    {id: 3, name: 'course3', active: true, price: 7, notes: []}
]
let notes = []
request("http://notes_service:5001/notes", function (error, response, body) {
        if (!error && response.statusCode == 200) {
            // Print out the response body
            notes = body
            console.log(body)
        }
})

app.get('/', (req, res) => {
    res.send(notes + '2 Task. localhost:8000/api/courses/ ')
})

app.get('/api/courses', (req, res) => {
    res.send(courses)
})

app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id))
    if(!course) return res.status(404).send('The course with given id was not found')
    res.send(course)
})

app.post('/api/courses', (req, res) => {
    const { error } = validateCourse(req.body)

    if(error) return res.status(400).send(error.details[0].message)
    const course = {
        id: courses.length + 1,
        name: req.body.name,
        active: req.body.active,
        price: req.body.price
    }    
    courses.push(course)
    res.status(201).send(course)
})

app.put('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id))
    if(!course) return res.status(404).send('The course with given id was not found')

    const { error } = validateCoursePut(req.body)

    if(error) return res.status(400).send(error.details[0].message)

    course.name = req.body.name
    course.active = req.body.active
    course.price = req.body.price
    res.send(course)
})

app.patch('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id))
    if(!course) return res.status(404).send('The course with given id was not found')

    const { error } = validateCourse(req.body)

    if(error) return res.status(400).send(error.details[0].message)

    if(req.body.name != null) {
        course.name = req.body.name
    }

    if(req.body.active != null) {
        course.active = req.body.active
    }
    if(req.body.price != null) {
        course.price = req.body.price
    }

    res.send(course)
})

app.delete('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id))
    if(!course) return res.status(404).send('The course with given id was not found')

    const index = courses.indexOf(course)
    courses.splice(index, 1)
    res.send(course)
})

app.post('/api/courses/:id/notes', (req, res) => {
    const { error } = validateNote(req.body)

    if(error) return res.status(400).send(error.details[0].message)
    const note = {
        title: req.body.title,
        author: req.body.author,
        comment: req.body.comment,
        expiration: req.body.expiration
    }
    request.post('http://notes_service:5001/notes', {
    json: note
    }, (error, res, body) => {
    if (error) {
        console.error(error)
        return
    }
    console.log(`statusCode: ${res.statusCode}`)
    console.log(body)
    })    
    courses[req.params.id-1].notes.push(note)
    res.status(201).send(courses[req.params.id-1].notes)
})

app.get('/api/courses/:id/notes', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id))
    if(!course) return res.status(404).send('The course with given id was not found')
 
    res.send(courses[req.params.id-1].notes)
})

app.delete('/api/courses/:id/notes/:note_title', (req, res) => {
    const note = courses[req.params.id-1].notes.find(c => c.title === req.params.notes_title)
    if(!note) return res.status(404).send('The note with given title was not found')
    courses[req.params.id-1].notes.splice(note, 1)
    res.send(note)
})

const port = 8000

app.listen(port, () => console.log(`Listening ...`))

function validateCourse(course) {
    const schema = {
        name: Joi.string().min(3),
        active: Joi.boolean(),
        price: Joi.number()
    }
    return Joi.validate(course, schema)
}

function validateCoursePut(course) {
    const schema = {
        name: Joi.string().min(3).required(),
        active: Joi.boolean().required(),
        price: Joi.number().required()
    }
    return Joi.validate(course, schema)
}

function validateNote(note) {
    const schema = {
        title: Joi.string(),
        author: Joi.string(),
        comment: Joi.string(),
        expiration: Joi.string()
    }
    return Joi.validate(note, schema)
}