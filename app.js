const express = require('express')
const Joi = require('joi')
const app = express()
var request = require("request");

app.use(express.json())

const url = "http://notes_service:5001/"

const courses = [
    {id: 1, name: 'course1', active: true, price: 10, notes: [

    ]},
    {id: 2, name: 'course2', active: false, price: 9, notes: [
   
    ]},
    {id: 3, name: 'course3', active: true, price: 7, notes: [

    ]}
]

let notes = []

app.get('/', (req, res) => {

    res.send("2 task")
})

app.get('/api/courses', (req, res) => {


    request(url + "notes", function (error, response, body) {
        if (!error && response.statusCode == 200) {
            notes = body
            var json = JSON.parse(JSON.stringify(notes));
            var a = JSON.parse(json)

            if(courses[0].notes.length == 0 ) {
                courses[0].notes.push(a.data.find(c => c.title == "Pirkiniai"))
                courses[1].notes.push(a.data.find(c => c.title == "Atostogos"))
                courses[2].notes.push(a.data.find(c => c.title == "Dienotvarke"))
            }
        }
    })

    res.send(courses)

    const course = courses[0].notes.find(c => c.title == "Pirkiniai")
    const course1 = courses[1].notes.find(c => c.title == "Atostogos")
    const course2 = courses[2].notes.find(c => c.title == "Dienotvarke")

    const index = courses[0].notes.indexOf(course)
    const index2 = courses[1].notes.indexOf(course1)
    const index3 = courses[2].notes.indexOf(course2)


    courses[0].notes.splice(index, 1)
    courses[1].notes.splice(index2, 1)
    courses[2].notes.splice(index3, 1)


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
    request.post(url + "notes", {
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
    const note = courses[req.params.id-1].notes.find(c => c.title === req.params.note_title)
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