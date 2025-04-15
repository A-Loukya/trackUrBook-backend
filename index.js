const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

const app=express()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 8080

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
})

const booksModel = mongoose.model("books",schemaData)

//read
app.get("/",async(req,res)=>{
    const data = await booksModel.find({})
    res.json({success:true,data:data})
})


//create data or save data in mongodb
app.post("/create",async(req,res)=>{
    console.log(req.body)
    const data=new booksModel(req.body)
    await data.save()
    res.send({success:true,message:"data saved successfully",data:data})
})


//update data
app.put("/update/:id",async(req,res)=>{
    console.log(req.body)
    const {...rest}=req.body
    const id=req.params.id
    // console.log("data")
    const data=await booksModel.updateOne({_id:id},rest)
    console.log(data)
    res.send({success:true,message:"data updated successfully",data:data})
})


//delete
app.delete("/delete/:id",async(req,res)=>{
    const id = req.params.id
    console.log(id)
    const data=await booksModel.deleteOne({_id:id})
    res.send({success:true,message:"data deleted successfully",data:data})
})

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log("Connected to DB")
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})
.catch((err) => console.log(err))