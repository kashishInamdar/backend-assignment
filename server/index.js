import express from "express"
import mongoose from "mongoose"
import bodyParser from 'body-parser';
import dotenv from "dotenv"
import Note from "./model/Note.js";
dotenv.config()

const app = express()
 app.use(express.json());

 const connectDB = async()=>{
    try{
        const conn = await mongoose.connect(process.env.MONGOOBD_URI)
        if(conn){
            console.log(" MongooDB Connected 😊") 
        }
    }catch(err){
        console.log(err.message)
    }
 }

app.use(bodyParser.json());

app.post('/api/notes', async (req, res) => {
    try {
      const { title, content } = req.body;
      const newNote = new Note({ title, content });
      const savedNote = await newNote.save();
      res.status(201).json({
        success : true,
        data : savedNote,
        message : "Added note Successfully"
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

app.get('/api/notes', async (req , res) => {
    try {
      const notes = await Note.find();
      res.status(200).json({
        success : true,
        data : notes,
        message : "Show notes"
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Retrieve Single Note
app.get('/api/notes/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.status(200).json({
        success : true,
        data : note,
        message : "Show notes"
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Note
app.put('/api/notes/:id', async (req, res) => {
    try {
      const { title, content } = req.body;
      const updatedNote = await Note.findByIdAndUpdate(
        req.params.id,
        { title, content, updatedAt: Date.now() },
        { new: true }
      );
      if (!updatedNote) {
        return res.status(404).json({ success : false,
            message: 'Note not found'
         });
      }
      res.status(200).json({
        success : true,
        data : updatedNote,
        message : "note updated"
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

// delete
  app.delete('/api/notes/:id', async (req, res) => {
    try {
      const deletedNote = await Note.findByIdAndDelete(req.params.id);
      if (!deletedNote) {
        return res.status(404).json({ message: 'Note not found' });
      }
      res.json(deletedNote);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });



 
 const PORT = process.env.PORT || 5000 ;
 app.listen(PORT , ()=>{
    console.log(`servert runing on port ${PORT}`)
    connectDB()
 })