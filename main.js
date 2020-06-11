let dataDate = [];
let dataGDP = [];
let dataSet = [];
let dataTest = [100, 300, 600];

function data() {
  fetch(
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
  )
    .then((response) => response.json())
    .then((d) => {
      for (let i = 0; i < d.data.length; i++) {
        dataDate.push(d.data[i][0]);
        dataGDP.push(d.data[i][1]);
      }
      dataSet = d.data;
      DrawBar();
    });
}
data();

let width = 800;
let height = 400;

let margin = { top: 50, right: 20, bottom: 50, left: 100 };

let DrawBar = () => {
  let tooltip = d3
    .select(".visHolder")
    .append("div")
    .attr("id", "tooltip")
    .style("position", "absolute")
    .style("padding", "15px")
    .style("background", "lightsteelblue")
    .style("border", "1px solid #000")
    .style("border-radius", "5px")
    .style("font-family", "Arial")
    .style("box-shadow", "2px 2px 10px")
    .style("color", "#000")
    .style("opacity", 0);
  let yearsDate = dataSet.map(function (item) {
    return new Date(item[0]);
  });

  let xMax = new Date(d3.max(yearsDate));
  xMax.setMonth(xMax.getMonth() + 3);

  let xScale = d3
    .scaleTime()
    .domain([d3.min(yearsDate), xMax])
    .range([0, width]);

  let yScale = d3
    .scaleLinear()
    .domain([0, d3.max(dataGDP, (d) => d)])
    .range([height, 0]);

  let xAxis = d3.axisBottom().scale(xScale);
  let yAxis = d3.axisLeft().scale(yScale);

  let svgContainer = d3
    .select(".visHolder")
    .append("svg")
    .attr("width", width + 100)
    .attr("height", height + 60)
    .attr("class", "svgContainer")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.right + ")");

  svgContainer
    .selectAll("rect")
    .data(dataSet)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .style("fill", "#33adff")
    .attr("x", (d, i) => {
      return i * (width / dataSet.length);
    })
    .attr("y", (d, i) => {
      return yScale(d[1]);
    })
    .attr("width", width / dataSet.length)
    .attr("height", (d) => {
      return height - yScale(d[1]);
    })
    .attr("data-date", (d) => {
      return d[0];
    })
    .attr("data-gdp", (d) => {
      return d[1];
    })
    .on("mouseover", (d, i) => {
      tooltip
        .transition()
        .style("opacity", 1)
        .style("left", d3.event.pageX + 10 + "px")
        .style("top", d3.event.pageY + 15 + "px");
      tooltip
        .html("<p>Date: " + d[0] + "</p><br>" + "<p>Bilions: " + d[1] + "</p>")
        .attr("data-date", dataSet[i][0]);

      d3.select().style("opacity", 0);
    })
    .on("mouseout", () => {
      tooltip.transition().style("opacity", 0);
      d3.select().style("opacity", 1);
    });

  svgContainer
    .append("g")
    .attr("id", "x-axis")
    .call(xAxis)
    .attr("transform", "translate(0,400)")
    .selectAll("text")
    .attr("dx", "-0.5em")
    .attr("dy", "-.55em")
    .attr("y", 30);

  svgContainer.append("g").attr("id", "y-axis").call(yAxis);
};
