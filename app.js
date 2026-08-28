/* WeatherFit — app.js */

// Date chip
(function(){
  var now = new Date();
  var opts = {weekday:"long",month:"short",day:"numeric"};
  document.getElementById("dateChip").textContent = now.toLocaleDateString("en-IN",opts);
})();

// WMO code decoder
function decodeWMO(c){
  var m={0:{l:"Clear Sky",e:"☀️"},1:{l:"Mostly Clear",e:"🌤️"},2:{l:"Partly Cloudy",e:"⛅"},3:{l:"Overcast",e:"☁️"},45:{l:"Foggy",e:"🌫️"},48:{l:"Icy Fog",e:"🌫️"},51:{l:"Light Drizzle",e:"🌦️"},53:{l:"Moderate Drizzle",e:"🌦️"},55:{l:"Heavy Drizzle",e:"🌧️"},61:{l:"Light Rain",e:"🌧️"},63:{l:"Moderate Rain",e:"🌧️"},65:{l:"Heavy Rain",e:"🌧️"},71:{l:"Light Snow",e:"🌨️"},73:{l:"Moderate Snow",e:"❄️"},75:{l:"Heavy Snow",e:"❄️"},77:{l:"Snow Grains",e:"🌨️"},80:{l:"Light Showers",e:"🌦️"},81:{l:"Moderate Showers",e:"🌧️"},82:{l:"Heavy Showers",e:"⛈️"},85:{l:"Snow Showers",e:"🌨️"},86:{l:"Heavy Snow Showers",e:"❄️"},95:{l:"Thunderstorm",e:"⛈️"},96:{l:"Thunderstorm w/ Hail",e:"⛈️"},99:{l:"Severe Thunderstorm",e:"🌩️"}};
  return m[c]||{l:"Unknown",e:"🌡️"};
}

function windDir(d){
  var dirs=["N","NE","E","SE","S","SW","W","NW"];
  return dirs[Math.round(d/45)%8];
}

function buildOutfit(o){
  var temp=o.temp,feels=o.feelsLike,hum=o.humidity,wind=o.windKph,prob=o.precipProb,mm=o.precipMm,code=o.wmoCode;
  var chips=[],parts=[],umb={show:false,warn:false};

  // Temperature
  var ta="";
  if(feels<10){
    chips.push({c:"chip-purple",i:"🧥",l:"Heavy Coat"},{c:"chip-purple",i:"🧣",l:"Scarf & Gloves"},{c:"chip-gray",i:"👢",l:"Warm Boots"});
    ta="Bundle up! It's freezing at <strong>"+Math.round(feels)+"°C</strong> feels-like. Wear a <strong>heavy winter coat</strong>, thermal layers, a <strong>warm scarf, gloves and beanie</strong>. Insulated waterproof boots are essential.";
  } else if(feels<15){
    chips.push({c:"chip-purple",i:"🧥",l:"Jacket"},{c:"chip-blue",i:"👖",l:"Warm Trousers"},{c:"chip-gray",i:"👟",l:"Closed Shoes"});
    ta="It's chilly (feels like <strong>"+Math.round(feels)+"°C</strong>). Layer up with a <strong>medium-weight jacket or fleece</strong> over a full-sleeve top. Wear <strong>warm trousers or jeans</strong> and <strong>closed shoes</strong>.";
  } else if(feels<20){
    chips.push({c:"chip-blue",i:"🧥",l:"Light Jacket"},{c:"chip-blue",i:"👖",l:"Jeans / Chinos"},{c:"chip-gray",i:"👟",l:"Sneakers"});
    ta="Pleasantly cool (feels like <strong>"+Math.round(feels)+"°C</strong>). A <strong>light jacket or cardigan</strong> over a T-shirt is perfect. <strong>Jeans or chinos</strong> and sneakers round off the look.";
  } else if(feels<25){
    chips.push({c:"chip-green",i:"👕",l:"T-shirt"},{c:"chip-blue",i:"👖",l:"Jeans / Trousers"},{c:"chip-gray",i:"👟",l:"Sneakers"});
    ta="Nice and comfortable at <strong>"+Math.round(feels)+"°C</strong> feels-like. A <strong>casual tee or shirt</strong> with <strong>jeans or light trousers</strong> is ideal. Sneakers work perfectly.";
  } else if(feels<30){
    chips.push({c:"chip-green",i:"👕",l:"Light Cotton"},{c:"chip-green",i:"🩳",l:"Shorts / Chinos"},{c:"chip-amber",i:"😎",l:"Sunglasses"});
    ta="Warm at <strong>"+Math.round(feels)+"°C</strong> feels-like. Opt for <strong>light cotton tees or linen shirts</strong> with <strong>shorts or light chinos</strong>. Sunglasses are a must if the sun's out.";
  } else {
    chips.push({c:"chip-amber",i:"👕",l:"Breathable Fabric"},{c:"chip-green",i:"🩳",l:"Shorts / Loose Trousers"},{c:"chip-amber",i:"🕶️",l:"Sun Protection"});
    ta="It's <strong>very hot</strong> — feels like <strong>"+Math.round(feels)+"°C</strong>! Wear the <strong>lightest, most breathable fabric</strong> you have — cotton or linen. Loose <strong>shorts or flowy trousers</strong> and don't skip <strong>sunscreen</strong> if heading outdoors.";
  }
  parts.push(ta);

  // Rain logic
  var isThunder=[95,96,99].indexOf(code)>-1;
  var isRainy=[51,53,55,61,63,65,80,81,82,95,96,99].indexOf(code)>-1;
  var isDrizzle=[51,53,55].indexOf(code)>-1;
  var isSnow=[71,73,75,77,85,86].indexOf(code)>-1;
  var rainHigh=(prob!==null&&prob>=60)||mm>3;
  var rainMed=(prob!==null&&prob>=30)||isRainy;

  if(isThunder){
    umb={show:true,warn:true,icon:"⛈️",title:"Thunderstorm warning — stay safe!",desc:"Severe weather expected. Carry a <strong>sturdy umbrella</strong>, avoid open spaces and tall trees. Consider delaying outdoor plans."};
    chips.push({c:"chip-red",i:"⛈️",l:"Storm Alert"},{c:"chip-red",i:"☂️",l:"Must-carry Umbrella"});
    parts.push("It's stormy — <strong>grab a sturdy umbrella and limit outdoor exposure</strong> as much as possible.");
  } else if(rainHigh||isRainy){
    var d=prob?"<strong>"+prob+"% rain probability</strong> today. Pack an umbrella and wear water-resistant footwear.":"Rain likely today. Pack an umbrella and wear water-resistant footwear.";
    umb={show:true,warn:true,icon:"☔",title:isDrizzle?"Drizzle expected — take a small umbrella":"Rain expected — don't forget your umbrella!",desc:d};
    chips.push({c:"chip-blue",i:"☂️",l:"Carry Umbrella"},{c:"chip-green",i:"👟",l:"Waterproof Shoes"});
    var ct=feels>22?" Choose <strong>dark-coloured clothing</strong> to hide rain splashes.":"";
    parts.push("Since rain is expected, carry a <strong>compact umbrella ☂️</strong> and choose <strong>waterproof or rubber-soled footwear</strong>."+ct+" Avoid suede or leather shoes today.");
  } else if(rainMed){
    var pd=prob!==null?prob+"% rain probability.":"Some rain probability.";
    umb={show:true,warn:false,icon:"🌂",title:"Small chance of rain — maybe pack an umbrella",desc:pd+" A foldable umbrella in your bag won't hurt."};
    chips.push({c:"chip-amber",i:"🌂",l:"Optional Umbrella"});
    parts.push("There's a <strong>small chance of rain</strong> — a foldable umbrella tucked away is a smart precaution.");
  } else {
    umb={show:true,warn:false,icon:"✅",title:"No rain expected — you're clear!",desc:"Low precipitation probability today. Leave the umbrella at home and enjoy the day!"};
  }

  if(isSnow){
    chips.push({c:"chip-purple",i:"❄️",l:"Snow Gear"},{c:"chip-red",i:"⚠️",l:"Avoid Slipping"});
    parts.push("Snow is falling — wear <strong>waterproof insulated boots</strong> with good grip to avoid slipping on icy surfaces.");
  }
  if(hum>80&&feels>22){
    chips.push({c:"chip-amber",i:"💧",l:"High Humidity"});
    parts.push("High humidity (<strong>"+hum+"%</strong>) will make it feel muggy. Choose <strong>moisture-wicking or breathable cotton</strong> to stay comfortable.");
  }
  if(wind>40){
    chips.push({c:"chip-red",i:"🌬️",l:"Strong Wind"});
    parts.push("<strong>Strong winds ("+Math.round(wind)+" km/h)</strong> today — avoid loose wide-brimmed hats. An umbrella may flip inside-out!");
  } else if(wind>25){
    chips.push({c:"chip-amber",i:"🌬️",l:"Breezy"});
    parts.push("It's breezy ("+Math.round(wind)+" km/h) — keep a light layer handy in case it feels cooler outside.");
  }
  return {chips:chips,text:parts.join(" "),umbrella:umb};
}

function showState(s){
  ["welcomeState","welcomeCta","loadingState","errorState","weatherResult"].forEach(function(id){
    var el=document.getElementById(id);
    if(el) el.style.display="none";
  });
  if(s==="welcome"){document.getElementById("welcomeState").style.display="";document.getElementById("welcomeCta").style.display="";}
  else if(s==="loading") document.getElementById("loadingState").style.display="";
  else if(s==="error")   document.getElementById("errorState").style.display="";
  else if(s==="result")  document.getElementById("weatherResult").style.display="";
}

function setLoading(m){document.getElementById("loadingMsg").textContent=m;showState("loading");}
function setError(t,d){document.getElementById("errorTitle").textContent=t;document.getElementById("errorDesc").textContent=d;showState("error");}

function renderStats(stats){
  document.getElementById("statPills").innerHTML=stats.map(function(s){
    return '<div class="stat-pill"><span class="sp-icon">'+s.icon+'</span><div class="sp-info"><span class="sp-val">'+s.val+'</span><span class="sp-label">'+s.label+'</span></div></div>';
  }).join("");
}

function renderUmbrella(u){
  var el=document.getElementById("umbrellaAlert");
  if(!u.show){el.style.display="none";return;}
  el.className="umbrella-alert"+(u.warn?"":" safe");
  el.style.display="";
  document.getElementById("alertIco").textContent=u.icon;
  document.getElementById("alertTitle").textContent=u.title;
  document.getElementById("alertDesc").innerHTML=u.desc;
}

function fetchWeather(){
  if(!navigator.geolocation){setError("Geolocation not supported","Your browser does not support location services. Try a modern browser like Chrome or Firefox.");return;}
  setLoading("Getting your location...");
  navigator.geolocation.getCurrentPosition(function(pos){
    var lat=pos.coords.latitude, lon=pos.coords.longitude;
    setLoading("Identifying your area...");
    var locName=lat.toFixed(4)+"°, "+lon.toFixed(4)+"°";
    fetch("https://nominatim.openstreetmap.org/reverse?lat="+lat+"&lon="+lon+"&format=json&zoom=12",{headers:{"Accept-Language":"en"}})
    .then(function(r){return r.json();})
    .then(function(g){
      var a=g.address||{};
      var parts=[a.suburb||a.neighbourhood||a.village||a.town||a.city_district,a.city||a.town||a.county,a.state].filter(Boolean);
      if(parts.length) locName=parts.join(", ");
    }).catch(function(){}).finally(function(){
      setLoading("Fetching live weather...");
      var url="https://api.open-meteo.com/v1/forecast?latitude="+lat+"&longitude="+lon
        +"&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,precipitation"
        +"&daily=precipitation_probability_max,temperature_2m_max,temperature_2m_min,precipitation_sum"
        +"&timezone=auto&forecast_days=1";
      fetch(url).then(function(r){
        if(!r.ok) throw new Error("Weather API error ("+r.status+")");
        return r.json();
      }).then(function(wx){
        var cur=wx.current, daily=wx.daily;
        var temp=Math.round(cur.temperature_2m);
        var feels=cur.apparent_temperature;
        var hum=cur.relative_humidity_2m;
        var wind=cur.wind_speed_10m;
        var wdir=cur.wind_direction_10m;
        var code=cur.weather_code;
        var prob=daily.precipitation_probability_max?daily.precipitation_probability_max[0]:null;
        var mm=daily.precipitation_sum?daily.precipitation_sum[0]:0;
        var tmax=Math.round(daily.temperature_2m_max?daily.temperature_2m_max[0]:temp);
        var tmin=Math.round(daily.temperature_2m_min?daily.temperature_2m_min[0]:temp);
        var decoded=decodeWMO(code);
        var outfit=buildOutfit({temp:temp,feelsLike:feels,humidity:hum,windKph:wind,precipProb:prob,precipMm:mm,wmoCode:code});

        document.getElementById("locName").textContent="📍 "+locName;
        document.getElementById("locCoords").textContent=lat.toFixed(2)+"°N, "+lon.toFixed(2)+"°E";
        document.getElementById("wxTemp").textContent=temp;
        document.getElementById("wxIcon").textContent=decoded.e;
        document.getElementById("wxCondition").textContent=decoded.e+" "+decoded.l;
        document.getElementById("wxMeta").textContent="Feels like "+Math.round(feels)+"°C · "+tmin+"° / "+tmax+"° today";

        renderStats([
          {icon:"💧",val:hum+"%",label:"Humidity"},
          {icon:"🌬️",val:Math.round(wind)+" km/h",label:"Wind "+windDir(wdir)},
          {icon:"🌡️",val:tmin+"° / "+tmax+"°",label:"Low / High"},
          {icon:"☔",val:prob!==null?prob+"%":(mm.toFixed(1)+" mm"),label:"Rain chance"},
          {icon:"💦",val:mm.toFixed(1)+" mm",label:"Rain sum"},
          {icon:"🕰️",val:new Date().toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"}),label:"Updated"}
        ]);

        renderUmbrella(outfit.umbrella);
        document.getElementById("outfitChips").innerHTML=outfit.chips.map(function(c){
          return '<span class="chip '+c.c+'">'+c.i+' '+c.l+'</span>';
        }).join("");
        document.getElementById("outfitText").innerHTML=outfit.text;
        showState("result");
      }).catch(function(err){setError("Failed to load weather",err.message||"Unexpected error. Check your connection.");});
    });
  },function(err){
    if(err.code===1) setError("Location access denied","Please allow location access in your browser and try again. WeatherFit needs your location for hyper-local data.");
    else if(err.code===2) setError("Location unavailable","Could not determine your position. Check your device GPS or network.");
    else if(err.code===3) setError("Location timed out","Your device took too long to respond. Please try again.");
    else setError("Location error","An unexpected error occurred. Please try again.");
  },{timeout:10000,maximumAge:60000});
}

function shareWeather(){
  var loc=document.getElementById("locName").textContent||"my location";
  var temp=document.getElementById("wxTemp").textContent;
  var cond=document.getElementById("wxCondition").textContent;
  var txt="WeatherFit says: "+cond+" · "+temp+"°C near "+loc+". Check what to wear today!";
  if(navigator.share){navigator.share({title:"WeatherFit",text:txt}).catch(function(){});}
  else if(navigator.clipboard){navigator.clipboard.writeText(txt).then(function(){alert("Copied to clipboard!");});}
}

// Auto-start if permission already granted
if(navigator.permissions){
  navigator.permissions.query({name:"geolocation"}).then(function(s){
    if(s.state==="granted") fetchWeather();
  });
}