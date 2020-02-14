    //general
var express = require("express"),
    app = express(),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    //db
    mongoose = require('mongoose'),
    User = require("./models/user"),
    seedDB = require("./seedDB"),
    //passport
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    //routes
    authRoutes = require('./routes/authentication'),
    testRoutes = require('./routes/test'),
    questionsRoutes = require('./routes/questions'),
    profileRoutes = require('./routes/profile');

app.use(require("express-session")({
    secret: "Si sabes esperar, durant molts anys",
    resave: false,
    saveUninitialized: false
}));

app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});
mongoose.connect("mongodb+srv://admin:admin@valentine-abe6i.mongodb.net/real?retryWrites=true&w=majority", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
}).then(() => {
    console.log('connected to db');
}).catch(err => {
    console.log('error: ' + err);
});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
//============================================== GENERAL =================================================
app.get("/", function(req, res){
    res.render("index");
});

app.use(questionsRoutes);
app.use(testRoutes);
app.use(authRoutes);
app.use(profileRoutes);

//GENERIC:
app.get("*", function(req, res){
    res.send('this page does not exists');
});
//PORT:
//app.listen(3000, function(){
app.listen(process.env.PORT, process.env.IP, function(){
    //seedDB();
    console.log('server started');
    	User.findById("5e38a5be4121040017f4a85a", function(err, user){
		if(err) console.log(err);
		else{
			console.log(user);
			 user.setPassword("BW", function(err, newUser){
				if(err) console.log(err);
				 else{
					console.log('password changed');
					console.log(newUser);	 
				 }
			 });
		}
	});
});
