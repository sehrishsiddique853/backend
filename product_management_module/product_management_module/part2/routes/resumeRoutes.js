const express = require("express");
const Resume = require("../model/resumeModel");

const router = express.Router();

// GET /resumes - render all resumes
router.get('/', async (req, res) => {
    try {
        const resumes = await Resume.find();
        res.render("home", { resumes });
    } catch (error) {
        res.status(500).render("error", { error: error.message });
    }
});

// GET /resumes/addNew - render form to add a new resume
router.get('/addNew', (req, res) => {
    res.render("newCV");
});

// POST /resumes - save new resume to database
router.post('/', async (req, res) => {
    try {
        const newResume = new Resume(req.body);
        await newResume.save();
        res.redirect('/resumes');
    } catch (error) {
        res.status(500).render("error", { error: error.message });
    }
});

// GET /resumes/:id - render full details of a resume
router.get('/:id', async (req, res) => {
    try {
        const resume = await Resume.findById(req.params.id);
        if (!resume) {
            return res.status(404).render("error", { error: "Resume not found" });
        }
        res.render("details", { resume });
    } catch (error) {
        res.status(500).render("error", { error: error.message });
    }
});

// GET /resumes/edit/:id - render edit form 
router.get('/edit/:id', async (req, res) => {
    try {
        const resume = await Resume.findById(req.params.id);
        if (!resume) {
            return res.status(404).render("error", { error: "Resume not found" });
        }
        res.render("edit", { resume });
    } catch (error) {
        res.status(500).render("error", { error: error.message });
    }
});

// PATCH /resumes/:id - edit/update a specific resume record in database
router.post('/update/:id', async (req, res) => {
    try {
        const updatedResume = await Resume.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedResume) {
            return res.status(404).render("error", { error: "Resume not found" });
        }
        res.redirect(`/resumes/${req.params.id}`);
    } catch (error) {
        res.status(500).render("error", { error: error.message });
    }
});

// DELETE /resumes/:id - delete a resume
router.post('/delete/:id', async (req, res) => {
    try {
        const deletedResume = await Resume.findByIdAndDelete(req.params.id);
        if (!deletedResume) {
            return res.status(404).render("error", { error: "Resume not found" });
        }
        res.redirect('/resumes');
    } catch (error) {
        res.status(500).render("error", { error: error.message });
    }
});

module.exports = router;