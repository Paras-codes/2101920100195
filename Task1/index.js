import express from "express"
const app=express();
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.get("/",(req,res)=>{
    res.send("Hello World")
})

app.listen(4000,()=>{
    console.log("Server is running on port 3000")
}
)
export{app}