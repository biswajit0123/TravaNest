const User = require("../models/user.js")

module.exports.renderSignupForm = (req, res) => {
    res.render("user/signup.ejs")
}

module.exports.signup =  async(req, res) => {

    try {
           let {username, email, password} = req.body;
    console.log(username, email,password)
   const newUesr = await User.register({username,email},password)
   //or
//    const newu = new User({
//     username:username,
//     email
//    })
//    const result = await User.register(newu, password);
  req.login(newUesr, (err) => {
    if(err) {
        return next(err);
    }
    req.flash('success', 'Welcome to TravaNest!')  
    res.redirect("/listings")
  })

    } catch (error) {
        req.flash('error', error.message)
        res.redirect("/signup")
    }

}

module.exports.renderLoginForm =(req, res) => {
    res.render("user/login.ejs")
}

module.exports.login =   async(req, res) =>{
    req.flash('success', `Welcome back! ${req.body.username}`)
    console.log(res.locals.redirectUrl)
    res.redirect(res.locals.redirectUrl)
}


module.exports.logout =(req, res)=>{
    req.logout((err) => {
        if(err){
            return next(err);
        }
        req.flash('success', 'Goodbye!')  
        res.redirect('/listings')  
    })
}