const express = require('express');
const router = express.Router();
const Alteration = require('../models/Alteration');

router.get('/', async (req, res) => {
    try {
        const alterations = await Alteration.find();
        res.json(alterations);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', async (req, res) => {
    const alteration = new Alteration(req.body);
    try {
        const newAlteration = await alteration.save();
        res.status(201).json(newAlteration);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.patch('/:id', async (req, res) => {
    try {
        const alteration = await Alteration.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(alteration);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
