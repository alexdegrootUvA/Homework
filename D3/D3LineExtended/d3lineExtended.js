   // maak het speelveld klaar
var margin = {top: 20, right: 100, bottom: 30, left: 50},
    width = 1000 - margin.left - margin.right,
    height = 550 - margin.top - margin.bottom,
    x = d3.time.scale().range([0, width]),
    y = d3.scale.linear().range([height, 0]),
    parseDate = d3.time.format("%Y").parse;
        
// genereert verschillende kleuren voor de lijnen
var color = d3.scale.category10(); 
    
// to be used later
var countries,
    filtered,
    transpose;
    
// interpoleert de lijn op basis wijze
var valueLine = d3.svg.line()
   .interpolate("basis")
   .x(function(d) { return x(d.year); })
   .y(function(d) { return y(d.waarde); });
    
// voeg svg toe aan pagina in body    
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// voeg een x-as toe 
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
   svg.append("svg:g")
    .attr("class", "x axis");

// voeg een y-as toe 
var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    svg.append("svg:g")
    .attr("class", "y axis");
    
// update data na menu keuze   
var menu = d3.select("#menu select")
    .on("change", change);    
			    
// laad csv bestand in en zet het in countries variabel
// redraw function om nieuwe data in te laden
d3.csv("data.csv", function(csv) {
		countries = csv;
        redraw();
    });

d3.select(window)
    .on("keydown", function() { altKey = d3.event.altKey; })
    .on("keyup", function() { altKey = false; });

var altKey;

// set terms of transition that will take place
// when a new economic indicator is chosen   
function change() {
  clearTimeout(timeout);

  d3.transition()
      .duration(altKey ? 7500 : 1500)
      .each(redraw);
}
// redraw functie werkt prachtig maar delen snap ik niet. gebruikt van d3js.org
// waar nederlandse comments bij staan snap ik hem
function redraw() {
    
    // split de data op door nest functie. elke lijn afzonderlijk getekend
    // key zorgt voor grouping (op indicatorCode)
    var nested = d3.nest()
		.key(function(d) { return d.indicatorCode; })
		.map(countries)
    
    // gebruik waarde uit t menu. option waarden staan gelijk aan de indicatorCode dus dan weet redraw welke data nodig is
    var series = menu.property("value");
    
        var data = nested[series];
    
    // om onderscheid te maken tussen de landen voor elk land een andere "key"
    // the keyring variable contains only the names of the countries
    var keyring = d3.keys(data[0]).filter(function(key) { 
     	    return (key !== "indicatorName" && key !== "yearCode" && key !== "indicatorCode" && key !== "year");
     	});
    
    // haalt per land de waardeistics uit de data en mapt ze naar een key
    var transpose = keyring.map(function(name) {
            return {
              name: name,
              values: data.map(function(d) {
                return {year: parseDate(d.year), waarde: +d[name]};
              })
            };
        });

    // stel de domeinen van x en y in. gebruikt years en bijhorende values uit data
    x.domain([
    d3.min(transpose, function(c) { return d3.min(c.values, function(v) { return v.year; }); }),
    d3.max(transpose, function(c) { return d3.max(c.values, function(v) { return v.year; }); })
  ]);

    y.domain([
    d3.min(transpose, function(c) { return d3.min(c.values, function(v) { return v.waarde; }); }),
    d3.max(transpose, function(c) { return d3.max(c.values, function(v) { return v.waarde; }); })
  ]);

    // variable country aanmaken om de data per land daar in te zetten
    // "country" that makes use of the transposed data 
    var country = svg.selectAll(".country")
      .data(transpose);
     
    // binnen country moet elk land een uniek ID hebben
    var countryEnter = country.enter().append("g")
      .attr("class", "country")
      .attr("id", function(d) { return d.name; });
    
    // hier worden de lijnen vd landen daadwerkelijk getekend
    countryEnter.append("path")
      .attr("class", "valueLine")
      .attr("d", function(d) { return valueLine(d.values); })
      .style("stroke", function(d) { return color(d.name); });

    // labels voor de lijnen. d.name en wordt neergezet aan het eind vd lijn (net als bij simple line chart)
    countryEnter.append("text")
     .attr("class", "names")
     .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
     .attr("transform", function(d) { return "translate(" + x(d.value.year) + "," + y(d.value.waarde) + ")"; })
     .attr("x", 4)
     .attr("dy", ".35em")
     .text(function(d) { return d.name; });
     
    // stelt de update vd lijnen in met d3 functie
    var countryUpdate = d3.transition(country);
    
    // bepaalt de nieuwe lijn
    countryUpdate.select("path")
      .attr("d", function(d) { return valueLine(d.values); });
    
    // stelt de positie vamn de labels opnieuw in  
    countryUpdate.select("text")
       .attr("transform", function(d) { return "translate(" + x(d.values[d.values.length - 1].year) + "," + y(d.values[d.values.length - 1].waarde) + ")"; });
  
  // de assen worden opnieuw geroepen. alleen y-as verschilt  
      d3.transition(svg).select(".y.axis")
          .call(yAxis);   
          
      d3.transition(svg).select(".x.axis")
            .attr("transform", "translate(0," + height + ")")
          .call(xAxis);
}

// zorgt dat grafiek opnieuw gemaakt wordt na paar seconden
var timeout = setTimeout(function() {
  menu.property("value", "ENEUSE").node().focus();
  change();
}, 7000);

// dit is slordig js maar door tijdgebrek
function eulight() {
    var checkbox = document.getElementById("eu");
    if (checkbox.checked) {
        document.getElementById("EU").style.cssText = "opacity:1;"
        
    } else { 
        document.getElementById("EU").style.cssText = "";
        
    }};
    
function canlight() {
    var checkbox = document.getElementById("can");
    if (checkbox.checked) {
        document.getElementById("Canada").style.cssText = "opacity:1;"
        
    } else { 
        document.getElementById("Canada").style.cssText = "";
        
    }};
    
function fralight() {
    var checkbox = document.getElementById("fra");
    if (checkbox.checked) {
        document.getElementById("France").style.cssText = "opacity:1;"
        
    } else { 
        document.getElementById("France").style.cssText = "";
        
    }};
    
function deulight() {
    var checkbox = document.getElementById("deu");
    if (checkbox.checked) {
        document.getElementById("Germany").style.cssText = "opacity:1;"
        
    } else { 
        document.getElementById("Germany").style.cssText = "";
        
    }};
    
function jpnlight() {
    var checkbox = document.getElementById("jpn");
    if (checkbox.checked) {
        document.getElementById("Japan").style.cssText = "opacity:1;"
        
    } else { 
        document.getElementById("Japan").style.cssText = "";
        
    }};
    
function italight() {
    var checkbox = document.getElementById("ita");
    if (checkbox.checked) {
        document.getElementById("Italy").style.cssText = "opacity:1;"
        
    } else { 
        document.getElementById("Italy").style.cssText = "";
        
    }};
    
function ugblight() {
    var checkbox = document.getElementById("ugb");
    if (checkbox.checked) {
        document.getElementById("United Kingdom").style.cssText = "opacity:1;"
        
    } else { 
        document.getElementById("United Kingdom").style.cssText = "";
        
    }};
    
function usalight() {
    var checkbox = document.getElementById("usa");
    if (checkbox.checked) {
        document.getElementById("United States").style.cssText = "opacity:1;"
        
    } else { 
        document.getElementById("United States").style.cssText = "";
    }};