const express = require('express');
const router = require("./routers/route");
const path = require('path');
const hbs = require('hbs');
// Initializing the express server
const app  = express();
const port = process.env.PORT || 3000;

//Creating Paths For Expresse Configuartion
const publicDirectoryPath = path.join(__dirname,'../public');
const viewsPath = path.join(__dirname,'../templates/views');
const partialPath = path.join(__dirname,'../templates/paritals');

// Setting up handlebars and all the views options
app.set('view engine','hbs');
app.set('views',viewsPath);

//Register Paritals
hbs.registerPartials(partialPath);


//Setting up what the express server will make use of
app.use(express.static(publicDirectoryPath));
app.use(express.json());
app.use(router);


//Listening to the port
app.listen(port, () => {
    console.log("Server is running on PORT " + port);
})