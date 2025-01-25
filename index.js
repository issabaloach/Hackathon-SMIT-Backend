import express from "express"
import morgan from "morgan"
const app = express()
const PORT = 4000

app.use(morgan("tiny"))


function middleware(req, res, next){
    console.log(Date.now())
    next()
}


app.use(middleware);

app.use(express.json())




app.get("/", (req, res)=>{
    console.log(req)
    res.send("hello")
})

app.post("/", (req, res)=>{
    res.send("post request")
})

app.put("/", (req, res)=>{
    res.send("put request")
})

app.delete("/", (req, res)=>{
    res.send("delete request")
})


app.listen(PORT, () => console.log("Server is running on PORT " + PORT))
