const path=require('path');
const express = require('express');
const app = express();
const hbs = require('hbs');
const geocode=require('./utils/geocode');
const forecast=require('./utils/forecast');

const publicDirectoryPath = path.join(__dirname, '../public');
const viewPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

app.set('view engine', 'hbs');
app.set('views', viewPath);
hbs.registerPartials(partialsPath);


app.use(express.static(publicDirectoryPath));

// app.get('/help', (req, res) => {
//     res.send('This is help page');
// });

// app.get('/about', (req, res) => {
//     res.send(aboutPath);
// });

app.get('', (req, res) => {
    res.render('index', {
        title:'Weather',
        name:'Abdulla'
    });
});

app.get('/about', (req, res) => {
    res.render('about', {
        title:'About',
        name:'Abdulla'
    });
});

app.get('/help', (req, res) => {
    res.render('help', {
        title:"Help",
        name:'Abdulla'
    })
});

app.get('/weather', (req, res) => {
    if(!req.query.address){
        return res.send({
            error:'There is no address query string'
        })
    }

    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => { //destruturing example
        if(error){
            return res.send({error})
        }
        forecast(latitude, longitude, (error, forecastData) => {
            if(error){
                return res.send({error})
            }
            res.send({
                forecaste: forecastData,
                location, //short hand example
                address: req.query.address
            });
        })
    })
});

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404 Error',
        name:'Abdulla',
        errorTxt:'document is not found'
    })
});

app.get('*', (req, res) => {
    res.render('404', {
        title: '404 Error',
        name: 'Abdulla Mufeeth',
        errorTxt: 'Page is not found'
    })
});

app.listen(3000, () => {
    console.log('Server is up on the port 3000.');
})