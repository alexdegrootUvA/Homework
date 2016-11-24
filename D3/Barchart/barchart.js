/*  Alexander de Groot
    10078797

    Data Processing
    Bar chart in D3 following Mike Bostock's tutorials
*/
// speelveld klaarmaken
var svg = d3.select("svg"),
    margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;

// tooltip toevoegen voor later
var tooltip = d3.select("body").append("div")
      .attr("class", "toolTip")

var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
    y = d3.scaleLinear().rangeRound([height, 0]);


var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


d3.json("data.json", function(error,data) {
  if (error) throw error;

  x.domain(data.map(function(d) { return d.month; }));
  y.domain([0, d3.max(data, function(d) { return d.value; })]);

  g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));


  g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y).ticks(5).tickFormat(function(d) {
        return parseInt(d); }).tickSizeInner([-width]))
// y-as label toevoegen
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -35)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .attr("fill", "#5D6971")
      .style("font-family", "helvetica")
      .text("Regen in mm");

// data toevoegen aan chart
  g.selectAll(".bar")
    .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.month); })
      .attr("y", function(d) { return y(d.value); })
      .attr("width", x.bandwidth())
      .attr("height", function(d) { return height - y(d.value); })
// mouseover tooltip toevoegen, positie boven de muis
      .on("mousemove", function(d) {
            tooltip
              .style("left", d3.event.pageX - 50 + "px")
              .style("top", d3.event.pageY - 70 + "px")
              .style("display", "inline-block")
              .html((d.value + " mm"));
        })
    		.on("mouseout", function(d){ tooltip.style("display", "none");});

// titel toevoegen aan bar chart
  g.append("text")
      .attr("x", (width / 2))
      .attr("y", 30 - (margin.top / 2))
      .attr("text-anchor", "middle")
      .style("font-size", "25px")
      .style("font-weight", "bold")
      .style("font", "Helvetica")
      .text("Neerslag in mm per maand in De Bilt (2015)");


});
