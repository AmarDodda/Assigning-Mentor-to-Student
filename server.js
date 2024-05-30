const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Mentor = require('./models/Mentor');
const Student = require('./models/Student');

require('dotenv').config();

const app = express();
app.use(bodyParser.json());


// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

// API to create a mentor
app.post('/mentor', async (req, res) => {
    try {
        const mentor = new Mentor(req.body);
        await mentor.save();
        res.status(201).send(mentor);
    } catch (error) {
        res.status(400).send(error);
    }
});

// API to create a student
app.post('/student', async (req, res) => {
    try {
        const student = new Student(req.body);
        await student.save();
        res.status(201).send(student);
    } catch (error) {
        res.status(400).send(error);
    }
});

// API to assign a student to a mentor
app.post('/assign-student', async (req, res) => {
    const { studentId, mentorId } = req.body;
    try {
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).send({ error: 'Student not found' });
        }
        student.mentor = mentorId;
        await student.save();
        res.status(200).send(student);
    } catch (error) {
        res.status(400).send(error);
    }
});

// API to change the mentor for a particular student
app.put('/change-mentor', async (req, res) => {
    const { studentId, mentorId } = req.body;
    try {
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).send({ error: 'Student not found' });
        }
        student.mentor = mentorId;
        await student.save();
        res.status(200).send(student);
    } catch (error) {
        res.status(400).send(error);
    }
});

// API to get all students for a particular mentor
app.get('/mentor/:mentorId/students', async (req, res) => {
    try {
        const students = await Student.find({ mentor: req.params.mentorId });
        res.status(200).send(students);
    } catch (error) {
        res.status(400).send(error);
    }
});

// API to get the previously assigned mentor for a particular student
app.get('/student/:studentId/previous-mentor', async (req, res) => {
    try {
        const student = await Student.findById(req.params.studentId).populate('mentor');
        if (!student) {
            return res.status(404).send({ error: 'Student not found' });
        }
        res.status(200).send(student.mentor);
    } catch (error) {
        res.status(400).send(error);
    }
});

// API to get all students without mentors
app.get('/students/no-mentor', async (req, res) => {
    try {
        const students = await Student.find({ mentor: null });
        res.status(200).send(students);
    } catch (error) {
        res.status(400).send(error);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
