var WeatherData = function() {
  if (navigator.geolocation) {
    var obj = this;

    var options = {
        enableHighAccuracy: true,
          timeout: 5000,
            maximumAge: 0
    };
    navigator.geolocation.getCurrentPosition(function(position) {
      obj.coords = position.coords;
      obj.updateHtml();
    }, function(error) {
      $.getJSON("http://ip-api.com/json", function(data) {
        obj.coords = {}; 
        obj.coords.latitude = data.lat;
        obj.coords.longitude = data.lon;
        obj.updateHtml();
      });
    }, options);
  }
}
WeatherData.prototype = {
  updateHtml:  function() {
    /*{"coord":{"lon":139,"lat":35},
     * "sys":{"country":"jp","sunrise":1369769524,"sunset":1369821049},
     * "weather":[{"id":804,"main":"clouds","description":"overcast
     * clouds","icon":"04n"}],
     * "main":{"temp":289.5,"humidity":89,"pressure":1013,"temp_min":287.04,"temp_max":292.04},
     * "wind":{"speed":7.31,"deg":187.002},
     * "rain":{"3h":0},
     * "clouds":{"all":92},
     * "dt":1369824698,
     * "id":1851632,
     * "name":"shuzenji",
     * "cod":200}
     */
    var self = this;
    $.getJSON("http://api.openweathermap.org/data/2.5/weather?lat=" + 
        this.coords.latitude + "&lon=" + this.coords.longitude, function(data) {
          self.tempType = "&deg;F"; 
          self.url = "http://openweathermap.org/img/w/" + 
            data.weather[0].icon + ".png"; 
          self.mainDescription = data.weather[0].main;
          self.wordyDescription = data.weather[0].description;
          self.tempKelvin = data.main.temp;
          self.tempFahrenheit =  9/5 * ((self.tempKelvin) - 273) + 32;
          self.tempCelsius = 5/9 * ((self.tempFahrenheit) - 32);
          self.humidityPercent = data.main.humidity + "%";
          self.windSpeed = Math.round((data.wind.speed*3600/1610.3*1000)/1000);
          var val=Math.floor((data.wind.deg/22.5)+.5)
          var arr=["N","NNE","NE","ENE","E","ESE", "SE", "SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"]
          self.windDirection = arr[val];
          self.sunriseAtUtc = data.sys.sunrise;
          self.sunsetAtUtc = data.sys.sunset;
          self.country = data.sys.country;
          self.city = data.name;
          self.setIcon();
          self.setTemp();
          self.setDescription();
          self.setWind();
          self.setLocation();
          $("button").on("click", function() {self.toggleTemp(); });
        });
  },
  setLocation: function() {
    $("#loc").text(this.city + ", " + this.country);
  },
  setIcon: function() {
    $("#icon img").attr("src",this.url);
  },
  setTemp: function() {
    if (this.tempType.charAt(5) === 'F')
    {
      $("button span").html("&deg;C");
      $("#temp").html($("<label>").html(Math.round(this.tempFahrenheit) + this.tempType));
    }
    else
    {
      $("button span").html("&deg;F");
      $("#temp").html($("<label>").html(Math.round(this.tempCelsius) + this.tempType));
    }
  },
  toggleTemp: function() {
    if (this.tempType.charAt(5) === 'F')
      this.tempType = "&deg;C";
    else
      this.tempType = "&deg;F";
    this.setTemp();
  },
  setDescription: function() {
    $("#desc").html($("<label>").text(this.wordyDescription)); 
  },
  setWind: function() {
    $("#wind").html($("<label>").text(this.windSpeed + " mph " + this.windDirection)); 
  }
};

$(document).ready(function() {
  weatherdata = new WeatherData(); 
});
