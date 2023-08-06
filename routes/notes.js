const express = require("express");
const router = express.Router();
const Note = require("../models/Notes");
const { body, validationResult } = require("express-validator");
const fetchUserID = require("../middleware/fetchuserID");

router.get("/fetchallnotes", fetchUserID, async (request, response) => {
  try {
    const notesList = await Note.find({ user: request.user.id });
    response.send(notesList);
  } catch (error) {
    console.log(error);
  }
});

router.post(
  "/addnewnote",
  [
    body("title", "title must be at least 3 characters").isLength({
      min: 3,
    }),
    body("description", "description must be at least 5 characters").isLength({
      min: 5,
    }),
  ],
  fetchUserID,
  async (request, response) => {
    try {
      const errors = validationResult(request);
      if (!errors.isEmpty()) {
        return response.status(400).json({ errors: errors.array() });
      }

      const { title, description } = request.body;

      let newNote = await Note.create({
        title,
        description,
        user: request.user.id,
      });
      // const createdNote = await newNote.save();    <= we dont need this Note.create() already saves it to the database

      response.send(newNote);
    } catch (error) {
      console.log(error);
    }
  }
);

router.put("/updatenote/:id", fetchUserID, async (request, response) => {
  try {
    const { title, description } = request.body;

    const newNote2 = {};

    if (title) {
      newNote2.title = title;
    }
    if (description) {
      newNote2.description = description;
    }

    let note = await Note.findById(request.params.id);

    if (!note) {
      return response.status(404).send("not found");
    }

    if (note.user.toString() !== request.user.id) {
      return response.status(401).send("not allowed");
    }

    note = await Note.findByIdAndUpdate(
      request.params.id,
      { $set: newNote2 },
      { new: true }
    );

    response.json({ note });
  } catch (error) {
    console.log(error);
  }
});

router.delete("/deletenote/:id", fetchUserID, async (request, response) => {
  try {
    let note = await Note.findById(request.params.id);

    if (!note) {
      return response.status(404).send("not found");
    }

    if (note.user.toString() !== request.user.id) {
      return response.status(401).send("not allowed");
    }

    note = await Note.findByIdAndDelete(request.params.id);

    response.json({ note, success: `success delted the note for ${note.id}` });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
