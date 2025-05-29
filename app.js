if(process.env.NODE_ENV != "production"){
const dotenv = require('dotenv').config()
}

const express = require('express')
const  {main}=require('./database.js')
const path = require('path')
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate')
const ExpressError = require('./utils/ExpressError.js')
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const listingRouter = require('./routers/listings.js')
const reviewRouter = require('./routers/reviews.js');
const userRouter = require('./routers/user.js')
const User= require("./models/user.js")
const passport = require('passport')
const LocalStrategy = require('passport-local')

const app = express()
const port = 3000
main().catch((e) =>{console.log("TravaNest connection Error" ,e)})
//set
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, '/public')))
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate)
    
//to read data 
app.use(express.urlencoded({extended:true}))
app.use(express.json())
const url = process.env.ATLASDB_URL
const store = MongoStore.create({
    mongoUrl:url,
    crypto:{
        secret:process.env.SECRET,

    },
    touchAfter:24 * 3600,
});

store.on("error", () => {
    console.log("errpr with mpongo store", err)
})
const sessionOption = {
    store,
    secret:process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 1000 * 60 * 60 * 24,
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
    }
}


app.use(session(sessionOption))
app.use(flash())

app.use(passport.initialize());       // 3. Passport init
app.use(passport.session());          // 4. Passport session support

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//flash
app.use((req, res, next) =>{
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    res.locals.currentUser = req.user;
    next()
})

//using passportjs
// app.use("/demouser" , async(req, res) =>{
//     const fakeuser = {
//         username:"biswajit",
//         email:"biswa@gmail.com"
//     }

//     const newuser =await User.register(fakeuser, "password")
//     res.send(newuser)
// })

app.use('/listings', listingRouter)
app.use('/listings/:id/review', reviewRouter)
app.use('/',userRouter)
app.use('/k', (req, res)=>{
    res.send("not implemented yet")
})

app.all(/.*/,(req,res,next) =>{
    console.log("Page not found yes")
 next(new ExpressError(404, "Page not found"))
})

//error handling
app.use((err,req,res,next)=>{
    console.log(err)
    let {status = 400, message = "something went wrong"} = err;
    console.log(err.status , "last error middlewire")
    res.status(status).render('error.ejs', { err})
})

//server
app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`)
})