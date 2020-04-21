var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart and shift the latter by left and top margins
var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);


d3.csv("./data.csv", function(data){
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
    return data;
}).then(function(data) {
    console.log(data);

// Create scales
var xLinearScale = d3.scaleLinear()
    .domain([8, d3.max(data,function(d){
    return +d.poverty;
    })])
    .range([0, width]);

var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(data,function(d){
    return +d.healthcare;
    })])
    .range([height, 0]);

// Create axis
var bottomAxis = d3.axisBottom(xLinearScale);
var leftAxis = d3.axisLeft(yLinearScale);

// Adding in bottom and left axis
chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);
chartGroup.append("g")
    .call(leftAxis);

// Data points
var circlesGroup = chartGroup.selectAll("circle").data(data).enter()
      
circlesGroup.append("circle")
    .attr("cx", (d,i) => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "15")
    .attr("fill", "blue")
    .classed("stateCircle", true)

// State abbreviations
circlesGroup.append("text")
    .text(d => d.abbr)
    .data(data)
    .attr("x", d => xLinearScale(d.poverty))
    .attr("y", d => (yLinearScale(d.healthcare)+10/2.5))
    .attr("font-size", '9')
    .classed("stateText", true)
    .on("mouseover", function(data, index) {
        toolTip.show(data,this);
      d3.select(this)
      })
      .on("mouseout", function(data, index) {
          toolTip.hide(data,this)
       d3.select(this)
      });

// x labels
chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .classed("aText", true)
    .attr("data-axis-name", "healthcare")
    .text("Lacks Healthcare(%)");

// y labels
chartGroup.append("text")
    .attr("transform", "translate(" + width / 2 + " ," + (height + margin.top + 20) + ")")
    .attr("data-axis-name", "poverty")
    .classed("aText", true)
    .text("In Poverty (%)");

// ToolTip
var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([10, 20])
    .html(function(d) {
        return (`${d.abbr}<br>Healthcare (%): ${d.healthcare}%<br>Poverty: ${d.poverty}`);
    });


// Integrate ToolTip into chart
chartGroup.call(toolTip);



});
