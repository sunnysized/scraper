'use strict';

var express = require('express');
var router = express.Router();
var request = require('request');
var cherrio = require('cheerio');
var Article = require('../../models/article');
var Note = require('../../models/note.js');

// get all notes from database
router.get('/', function(req, res) {
    Note
        .find({})
        .exec(function(err, notes) {
            if (err) {
                console.log(err);
                res.status(500);
            } else {
                res.status(200).json(notes);
            }
        });
});

// Add a note to save article
router.post('/:id', function(req, res) {
    let newNote = new Note(req.body);
    newNote.save(function(err, doc) {
        if (err) {
            console.log(err);
            res.status(500);
        } else {
            Article.findOneAndUpdate(
                { _id: req.params.id },
                { $push: { 'notes': doc.id } },
                function(error, newDoc) {
                    if (error) {
                        console.log(error);
                        res.status(500);
                    } else {
                        res.redirect('/saved');
                    }
                }
            );
        }
    });
});

// Delete a note from a saved article
router.delete('/:id', function(req, res) {
    Note.findByIdAndRemove(req.params.id, function(err, note) {
        if (err) {
            console.log(err);
            res.status(500);            
        } else {
            res.redirect('/saved');
        }
    });
});

module.exports = router;