
// viewed--keep track of whether a site was already viewed
var viewed = [true, false, false, false, false];
// current--keep track of the current viewed site
var current = [false, false, false, false, false]; //is this being used???
//siteID is number of current site (markers.js)
var timeouts = [];

//main.js initiates the map and runs the functionality of the map 

var map;
 window.onload = loadmap();
 
var currentTile = 'modern';
//define variables hold the path to each tile layer
//below was commented out to cut the historical tiles for time being
// var historicTileset = L.tileLayer ('https://{s}.tiles.mapbox.com/v3/carolinerose.71spds4i/{z}/{x}/{y}.png');
var modernTileset = L.tileLayer ('http://{s}.www.toolserver.org/tiles/bw-mapnik/{z}/{x}/{y}.png');

function loadmap(){
  map = L.map('map', { zoomControl:true});
  // tiles can change once we know our basemap 
  L.tileLayer('http://{s}.www.toolserver.org/tiles/bw-mapnik/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a> <a href="http://http://leafletjs.com"> Leaflet </a> Tiles <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    minzoom: 5,
  }).addTo(map);
  // initial zoom & set map coords, these will change 
      
  //addTileToggle();

  map.setView([43.076364, -89.384336], 14);
}

// adds the find me control
L.Control.Button = L.Control.extend({
  options: {
    position: 'topleft'
  },
  initialize: function (options) {
    this._button = {};
    this.setButton(options);
  },
 
  onAdd: function (map) {
    this._map = map;
    var container = L.DomUtil.create('div', 'leaflet-control-button');
    
    this._container = container;
    
    this._update();
    return this._container;
  },
 
  onRemove: function (map) {
  },
 
  setButton: function (options) {
    var button = {
      'iconUrl': options.iconUrl,           //string
      'onClick': options.onClick,           //callback function
      'maxWidth': options.maxWidth || 70,     //number
      'doToggle': options.toggle,           //bool
      'toggleStatus': false                 //bool
    };
 
    this._button = button;
    this._update();
  },
  

  getIconUrl: function () {
    return this._button.iconUrl;
  },
  
  destroy: function () {
    this._button = {};
    this._update();
  },
  
  toggle: function (e) {
    if(typeof e === 'boolean'){
        this._button.toggleStatus = e;
    }
    else{
        this._button.toggleStatus = !this._button.toggleStatus;
    }
    this._update();
  },
  
  _update: function () {
    if (!this._map) {
      return;
    }
 
    this._container.innerHTML = '';
    this._makeButton(this._button);
 
  },
 
  _makeButton: function (button) {
    var newButton = L.DomUtil.create('div', 'leaflet-buttons-control-button leaflet-bar a', this._container);
    if(button.toggleStatus)
        L.DomUtil.addClass(newButton,'leaflet-buttons-control-toggleon');
        
    var image = L.DomUtil.create('img', 'leaflet-buttons-control-img', newButton);
    image.setAttribute('src',button.iconUrl);
    
 
    L.DomEvent
      .addListener(newButton, 'click', L.DomEvent.stop)
      .addListener(newButton, 'click', button.onClick,this)
      .addListener(newButton, 'click', this._clicked,this);
    L.DomEvent.disableClickPropagation(newButton);
    return newButton;
 
  },
  
  _clicked: function () {  //'this' refers to button
    if(this._button.doToggle){
        if(this._button.toggleStatus) { //currently true, remove class
            L.DomUtil.removeClass(this._container.childNodes[0],'leaflet-buttons-control-toggleon');
        }
        else{
            L.DomUtil.addClass(this._container.childNodes[0],'leaflet-buttons-control-toggleon');
        }
        this.toggle();
    }
    return;
  }
 
});

var myButtonOptions = {
      'iconUrl': './images/img/icon_12638/icon_12638_24r.png',  // string
      'onClick': my_button_onClick,  // callback function
      'hideText': true,  // bool
      'maxWidth': 30,  // number
      'doToggle': false,  // bool
      'toggleStatus': false  // bool
}   

var myButton = new L.Control.Button(myButtonOptions).addTo(map);

function my_button_onClick() {
    console.log("someone clicked my button");
     GetLocation(map);
}

//end of find me control

function addTileToggle() { //called at the end of loadmap function

//could not get the default layer control to work. Substituted my own using the toggleTiles function. 
//	L.control.layers(baseMaps, null, {position: 'bottomleft', collapsed: false}).addTo(map);
	
	document.getElementById("tileToggle").addEventListener("click", toggleTiles);
	
}
/* Toggles Tiles */
function toggleTiles(){
	if (currentTile == 'modern'){
		console.log("switch to historic basemap"); 
		//this just adds the historic basemap on top of the existing tiles
		historicTileset.addTo(map);
		//change the button text
		document.getElementById("tileToggle").innerHTML = "<b>Hide Historic Basemap</b>"; 
		//reset variable 
		currentTile = 'historic';
	}
	else if (currentTile == 'historic') {
		console.log("switch to modern basemap"); 
		//this removes the historic basemap tile layer 
		map.removeLayer (historicTileset);
		//change the button text
		document.getElementById("tileToggle").innerHTML = "<b>Show Historic Basemap</b>"; 
		//reset variable 
		currentTile = 'modern';
	}
}


// sends to responsive.js this allows map elements to be responsive
setMap(map);


/* Loads Markers Into Map*/
addMarkers(map, 0); //function defined in markers.js file


/* initial script */
    //to allow for next buttons for the intro script
if(siteID==0){
  $('.script').html(PointsofInterest[0].features[0].properties.Scripts[0]);
  $('.script').before( "<b><a href='#' class='previous' style='color:#C41E3A; padding-left:20px' >< previous</a></b>" );
  $('.script').before( "<b><a href='#' class='next' style='color:#C41E3A; float:right; padding-right:20px' >next ></a></b>" );
}

var s=0;
$('.next').click(function(){
  for (var i in timeouts){
    window.clearTimeout(timeouts[i]);
  };
  forwardScript();
});

$('.previous').click(function(){
    s--;
    s = s == -1 ? PointsofInterest[0].features[siteID].properties.Scripts.length-1 : s;
    updateScript(s); 

    for (var i in timeouts){
      window.clearTimeout(timeouts[i]);
    };
});

function forwardScript(){
  s++;
  s = s == PointsofInterest[0].features[siteID].properties.Scripts.length ? 0 : s;
  updateScript(s);
}

function updateScript(scr){
    $('.script').html(PointsofInterest[0].features[siteID].properties.Scripts[scr]);
}

/*Load Route Into Map*/ 
var routeStyle = {
    "color": "#E2788B",
    "weight": 5,
    "opacity": 0.7
};

// the style of the highlighted route segment
var highlightStyle = {
    "color": "#C41E3A",
    "weight": 5,
    "opacity": 1
};

//first route segment
var initrouteLayer = L.geoJson(routes[0].features[0], routeStyle).addTo(map);
var highlightLayer = L.geoJson(routes[0].features[0], highlightStyle).addTo(map);

var audioMobile = $("audio");

function updateRoute(){
  console.log(viewed);
  // show the route to next site after the previous site was viewed
  for(var i=0; i<viewed.length-1; i++){
    if(viewed[i] && !viewed[i+1]){
      L.geoJson(routes[0].features[i+1], routeStyle).addTo(map); //visited style route underlays highlight
    }
  }
}

function highlightRoute() {
  if(highlightLayer){
      map.removeLayer(highlightLayer);
  }
	if(siteID < 5){
		highlightLayer = L.geoJson(routes[0].features[siteID], {style: highlightStyle}).addTo(map);
	}
}

function addScript(){
  $('.next').remove();
  $('.previous').remove();
  $('.script').html(PointsofInterest[0].features[siteID].properties.Scripts[0])
}

function playAudio(isdesktop){	
  //var winHeight = $(window).height();
  //var winWidth = $(window).width();
  console.log('playAudio site '+siteID);

  $("audio").prop('autoplay', true);
  $("audio").attr('src', PointsofInterest[0].features[siteID].properties.audio);

  if (isdesktop){
    $("audio").prop('muted', false);
    $("audio").show();
    $("#textModal .close-reveal-modal").click(function(){ hideAudio() });
  } 
}

function hideAudio(){
  $("audio").prop('muted', true);
  $("audio").prop('autoplay', false);
  $("audio").hide();
}

function readAloud(){
  $("#readAloud").click(function(){
    console.log("clicked");
    i = 0;
    updateScript(i);
    //start audio
    //start timer

    var scripts = PointsofInterest[0].features[siteID].properties.Scripts;

    var delay = 0;
    for (var i=0; i<scripts.length-1; i++){                      
      delay = delay + (scripts[i].length*68.2);
      timeouts[i] = window.setTimeout(function(){
        forwardScript();
      }, delay);
    }
    playAudio(true);
  })
}

function updateLocationMenu(){   
    var locationMenu = document.getElementById('locationMenu');
    // show site in location menu after the site was explored
    for(var i=0; i<viewed.length-1; i++){
        if(viewed[i] && !viewed[i+1]){
            
            if(i==0 && document.getElementsByClassName('Railroad').length==0){
                var locationLi = document.createElement('li');
                locationLi.setAttribute('class', 'Railroad');
                locationLi.innerHTML = '<a href="#"><img src="images/transportation24design1.png"  alt="Locations"/> Railroad Station</a>';
                locationMenu.appendChild(locationLi);
                $("li.Railroad").click(function(){                    map.setView(POI.features.Railroad.geometry.coordinates,zoomPOI)
});
            }
            
            if(i==1 && document.getElementsByClassName('Power_Plant').length==0){
                var locationLi = document.createElement('li');
                locationLi.setAttribute('class', 'Power_Plant');
                locationLi.innerHTML = '<a href="#"><img src="images/energy24design2.png" alt="Locations"/> Power Plant</a>';
                locationMenu.appendChild(locationLi);
                $("li.Power_Plant").click(function(){
  map.setView(POI.features.Power_Plant.geometry.coordinates,zoomPOI)
});
            }
            if(i==2 && document.getElementsByClassName('Wil_Mar').length==0){
                var locationLi = document.createElement('li');
                locationLi.setAttribute('class', 'Wil_Mar');
                locationLi.innerHTML = '<a href="#"><img src="images/housing24design2.png" alt="Locations"/> Community Center</a>';
                locationMenu.appendChild(locationLi);
                $("li.Wil_Mar").click(function(){
  map.setView(POI.features.Wil_Mar.geometry.coordinates,zoomPOI)
});
            }
            if(i==3 && document.getElementsByClassName('candy').length==0){
                var locationLi = document.createElement('li');
                locationLi.setAttribute('class', 'candy');
                locationLi.innerHTML = '<a href="#"><img src="images/coffee24_grey.png"  alt="Locations"/> Candy Company</a>';
                locationMenu.appendChild(locationLi);
                $("li.candy ").click(function(){
  map.setView(POI.features.Candy_Factory.geometry.coordinates,zoomPOI)
});
                var locationLi = document.createElement('li');
                locationLi.setAttribute('class', 'allLocations');
                locationLi.innerHTML = '<a href="#">All Locations</a>';
                locationMenu.appendChild(locationLi);
                $("li.allLocations").click(function(){
  map.setView([ 43.078307,-89.377041],zoomPOI-3)
});
            }
            
            
        }
    }
}
