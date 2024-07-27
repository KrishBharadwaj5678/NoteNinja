let express=require("express");
let path=require("path");
let fs=require("fs");
let app=express();

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,"public")))
app.set("view engine","ejs")

// Rendering of main page
app.get("/",(req,resp)=>{
    fs.readdir("./files",(err,files)=>{
         resp.render("index",{
            files:files
         });
    })
})

// Creation of Notes
app.post("/create",(req,resp)=>{
    fs.writeFile(`./files/${req.body.title.split(" ").join("")}.txt`,`${req.body.description}`,(err)=>{
        resp.redirect("/")
    })
})

// Reading of Notes
app.get("/read/:filename",(req,resp)=>{
    fs.readFile(`./files/${req.params.filename}`,"utf-8",(err,data)=>{
        resp.render("show",{
            filename:req.params.filename,
            filedata:data
        })
    })
})

// Updation of Notes
app.get("/edit/:filename",(req,resp)=>{
    fs.readFile(`./files/${req.params.filename}`,"utf-8",(err,data)=>{
        resp.render("edit",{
            filename:req.params.filename,
            filedata:data
        })
    })
})

app.post("/edit",(req,resp)=>{
    fs.rename(`./files/${req.body.oldtitle}`,`./files/${req.body.newtitle}`,(err)=>{
        fs.writeFile(`./files/${req.body.newtitle}`,req.body.newdesc,(err)=>{
            resp.redirect("/")
        })
    })
})

// Deletion of Notes
app.get("/delete/:filename",(req,resp)=>{
    fs.unlink(`./files/${req.params.filename}`,(err)=>{
        resp.render("delete",{
            filename:req.params.filename
        })
    })
})

app.listen(2200,()=>{
    console.log("Listening to port 2200...");
})