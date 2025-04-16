require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8080;

// Schema & Model
const schemaData = mongoose.Schema({
    title: String,
    before_thought: { type: String, default: "" },
    after_thought: { type: String, default: "" },
    start_date: { type: String, default: null },
    end_date: { type: String, default: null },
    isPaused: { type: Boolean, default: false },
    isCompleted: { type: Boolean, default: false }
}, {
    timestamps: true
});

const booksModel = mongoose.model("books", schemaData);

// Routes

// Read all books
app.get("/", async (req, res) => {
    try {
        const data = await booksModel.find({});
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: "Failed to fetch data", error: err.message });
    }
});

// Create a new book
app.post("/create", async (req, res) => {
    try {
        const data = new booksModel(req.body);
        await data.save();
        res.send({ success: true, message: "Data saved successfully", data });
    } catch (err) {
        res.status(500).json({ success: false, message: "Failed to create data", error: err.message });
    }
});

// Update a book
app.put("/update/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const updatedData = await booksModel.updateOne({ _id: id }, req.body);
        res.send({ success: true, message: "Data updated successfully", data: updatedData });
    } catch (err) {
        res.status(500).json({ success: false, message: "Failed to update data", error: err.message });
    }
});

// Delete a book
app.delete("/delete/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const deletedData = await booksModel.deleteOne({ _id: id });
        res.send({ success: true, message: "Data deleted successfully", data: deletedData });
    } catch (err) {
        res.status(500).json({ success: false, message: "Failed to delete data", error: err.message });
    }
});

// DB Connection and Server Start
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
})
.catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
});
