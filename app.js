const express = require("express");
const https = require("https");
const path = require('path');

const app = express();
app.set("view engine", "ejs");

app.use(express.urlencoded({
    extended: true
}))
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
app.use(express.static("public"));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/index.html");
});

app.post("/weatherInfo", function(req, res){
    const city = req.body.city_name;
    const apiKey="a29ba3bf9e571fdc43e74c50965f02de";
    const unit ="metric";
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey + "&unit=" + unit;
    https.get(url, function(response){
        response.on("data", function(data){
        if(response.statusCode===200){
            const weatherData=JSON.parse(data);
            const temp = Math.round(weatherData.main.temp - 273.15);
            const des = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const image= "http://openweathermap.org/img/wn/" + icon + "@2x.png";
            const reqData =  {
                cityName: city,
                temperature: temp,
                description: des,
                weatherImage:image
            };
            res.render("weatherInfo", {infoData : reqData});
        }else{
            res.render("failure");
        } 
           
        })
    })
    
   
})
app.post("/home", function(req, res){
    res.redirect("/");
})

app.listen(3000, function(){
    console.log("Server is running on port 3000.");
});

    
  