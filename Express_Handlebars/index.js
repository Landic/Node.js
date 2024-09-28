import express from "express";
import "dotenv/config";
import exphbs from "express-handlebars"

const PORT = process.env.PORT || 3000;

const hbs = exphbs.create({
defaultLayout: "main",
extname: "hbs",
});

const app = express();
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set("views", "views");

app.use(express.json());

app.get('/', (req,res)=>{
    res.render("index", {title: "My APP"});
})
app.get('/about', (req,res)=>{
    res.render("about");
})
app.all('*', (req,res,next)=>{
    res.status(404).json({error:"not found"});
    next();
});

app.listen(PORT, ()=>{
    console.log(`Server is running http://localhost:${PORT}`)
})