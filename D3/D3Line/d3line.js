// maak speelveld klaar
var margin = {top: 40, right: 120, bottom: 30, left: 50},
    width = 1200 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// time.parse en time.format om de datum uit csv te halen en vervolgens in een string op grafiek te zetten
//%Y%m%d zijn de specifiers voor time format (https://github.com/d3/d3-time-format)
var parseTime = d3.timeParse("%Y%m%d");
var formatTime = d3.timeFormat("%e %B");
// nodig voor tooltip van http://bl.ocks.org/mbostock/3902569 
var bisectDate = d3.bisector(function(d) { return d.date; }).left;

// ranges van de variabelen invullen
var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// maak variable voor de lijn
var valueLine = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.value); });
    
// maak svg aan in de body vd pagina (append)
// zet de svg links boven aan de pagina
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// data inlezen uit csv bestand. 
d3.csv("data.csv", function(error, data) {
  if (error) throw error;

  // data formatten met parseTime variable
  data.forEach(function(d) {
      d.date = parseTime(d.date);
      d.value = +d.value;
  });

  // domein vd data scalen
  x.domain(d3.extent(data, function(d) { return d.date; }));
  y.domain([0, d3.max(data, function(d) { return d.value; })]);

  // lijn toevoegen aan de svg (path)
  svg.append("path")
     .data([data])
     .attr("class", "line")
     .attr("d", valueLine)
     
   // x-as toevoegen aan de svg (onderaan)
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // y-as toevoegen (links)
  svg.append("g")
      .call(d3.axisLeft(y))
      .append("text")
      .attr("fill", "#000")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .style("text-anchor", "end")
      .text("Celsius (°C)");
  
  svg.append("text")
      .attr("x", (width / 2))
      .attr("y", 30 - (margin.top ))
      .attr("text-anchor", "middle")
      .style("font-size", "25px")
      .style("font-weight", "bold")
      .style("font", "Helvetica")
      .text("Average Temperature in De Bilt (2015)");
    
    var focus = svg.append("g")
      .attr("class", "focus")
      .style("display", "none")
     
    focus.append("circle")
      .attr("r", 4.5);

    focus.append("text")
      .attr("x", 9)
      .attr("dy", ".70em");

    svg.append("rect")
      .attr("class", "overlay")
      .attr("width", width)
      .attr("height", height)
      .on("mouseover", function() { focus.style("display", null); })
      .on("mouseout", function() { focus.style("display", "none"); })
      .on("mousemove", mousemove);
      
        // werkt maar ik vind hem niet mooi (wip) bron: d3js.org bij een tooltip voorbeeld
    function mousemove() {
    var x0 = x.invert(d3.mouse(this)[0]),
        i = bisectDate(data, x0, 1),
        d0 = data[i - 1],
        d1 = data[i],
        d = x0 - d0.date > d1.date - x0 ? d1 : d0;
    focus.attr("transform", "translate(" + x(d.date) + "," + y(d.value) + ")");
    focus.select("text").html(formatTime(d.date) + ",  " + (d.value) + "°C");
  }
   
   
   
});