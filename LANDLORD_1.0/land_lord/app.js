const express = require('express');
const session = require('express-session');
const passport = require('./config/passport');
const path = require('path');
const ejs = require('ejs');
const User = require('./models/userModel');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;

// View Engine Setup
app.set('view engine', 'ejs');

// Database Connection
mongoose.connect('mongodb://localhost:27017/LandLord', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(error => console.error('Error connecting to MongoDB:', error));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'Loice',
    resave: true,
    saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Internal server error');
});

// Custom Middleware for Authentication
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

// Routes
app.get('/', (req, res) => {
    res.render('index');
});


app.get('/register', (req, res) => {
    res.render('register');
});


app.post("/register", (req, res) => {
    // register method 'register()' comes from passport local mongoose package.
    // It helps us to handles creating and saving users and interacts with mangoose directly
    User.register(
      { username: req.body.username },
      req.body.password,
      function (err, user) {
        if (err) {
          console.log(err);
          res.redirect("/register");
        } else {
          // the function here will only trigger if authnticated by passport
          passport.authenticate("local")(req, res, function () {
            res.redirect("/index");
          });
        }
      }
    );
  });
  
// app.post('/register', async (req, res) => {
//     const { username, email, password } = req.body;
  
//     // Validate input
//     if (!username || !email || !password) {
//       return res.send('Please provide all required fields.');
//     }
  
//     // Check if the username is already taken
//     const existingUser = await User.findOne({ username: username });
//     if (existingUser) {
//       return res.send('Username already taken. Please choose a different one.');
//     }
  
//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);
  
//     // Create a new user with a default role (you can adjust this based on your application's needs)
//     const newUser = new User({ username, email, password: hashedPassword, role: 'user' });
  
//     try {
//       // Save the new user to the database
//       await newUser.save();
//       res.redirect('/login');
//     } catch (error) {
//       // Handle database save error
//       console.error(error);
//       res.send('Error during registration.');
//     }
//   });
app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', (req, res) => {
    const user = new User({
        username: req.body.username,
        password: req.body.password,
    });

    req.login(user, err => {
        if (err) {
            console.log(err);
        } else {
            passport.authenticate('local')(req, res, () => {
                res.redirect('/index');
            });
        }
    });
});


  
// app.post('/register', async (req, res) => {
//     const { username, email, password } = req.body;
  
//     // Validate input
//     if (!username || !email || !password) {
//       return res.send('Please provide all required fields.');
//     }
  
//     // Check if the username is already taken
//     const existingUser = await User.findOne({ username: username });
//     if (existingUser) {
//       return res.send('Username already taken. Please choose a different one.');
//     }
  
//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);
  
//     // Create a new user
//     const newUser = new User({ username, email, password: hashedPassword });
//     await newUser.save();
  
//     res.redirect('/login');
//   });
  
app.post('/properties', (req, res) => {
    const property = {
        id: properties.length + 1,
        name: req.body.name,
        description: req.body.description,
        status: req.body.status
    };

    properties.push(property);
    res.status(201).send(property);
});

app.get('/properties', (req, res) => {
    res.send(properties);
});

app.put('/properties/:id', (req, res) => {
    const property = properties.find(p => p.id === parseInt(req.params.id));
    if (!property) return res.status(404).send('The property with the given ID was not found.');

    property.name = req.body.name;
    property.description = req.body.description;
    property.status = req.body.status;

    res.send(property);
});

app.delete('/properties/:id', (req, res) => {
    const property = properties.find(p => p.id === parseInt(req.params.id));
    if (!property) return res.status(404).send('The property with the given ID was not found.');

    const index = properties.indexOf(property);
    properties.splice(index, 1);

    res.send(property);
});

app.get('/listings', (req, res) => {
    const listings = [
        { id: 1, title: 'Modern 3BR Home', price: 400000 },
        { id: 2, title: 'Rustic 2BR Cabin', price: 250000 },
        { id: 3, title: 'Elegant 4BR Mansion', price: 1000000 },
    ];

    res.json(listings);
});

// 404 Not Found Middleware
app.use((req, res, next) => {
    res.status(404).send('Page not found');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
