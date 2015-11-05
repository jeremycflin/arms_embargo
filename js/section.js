

var scrollVis = function(){

	//Global variables 
	//////////////////
	//Set svg width, height and margins
	var width = 700;
  var height = 620;
  var margin = {top:0, left:20, bottom:40, right:10};


  // Keep track of which visualization
  // we are on and which was the last
  // index activated. When user scrolls
  // quickly, we want to call all the
  // activate functions that they pass.
  var lastIndex = -1;
  var activeIndex = 0;

  // Main svg used for visualization
  var svg = null;

  // d3 selection that will be used
  // for displaying visualizations
  var g = null;

  // Parsing time 
  var parseDate = d3.time.format("%b %y").parse

  // Set up scale and range  
  var x = d3.time.scale().range([0, width]);
	var y = d3.scale.linear().range([height, 0]);

	//Set up X and Y axis
	var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(5);
	var yAxis = d3.svg.axis().scale(y)
    .orient("left").ticks(10);

  var valueline = d3.svg.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.value); })

  // When scrolling to a new section
  // the activation function for that
  // section is called.
  var activateFunctions = [];
  // If a section has an update function
  // then it is called while scrolling
  // through the section with the current
  // progress through the section.
  var updateFunctions = [];


  /**
   * chart
   *
   * @param selection - the current d3 selection(s)
   *  to draw the visualization in. For this
   *  example, we will be drawing it in #vis
   */
  var chart = function(selection){
  	selection.each(function(rawData) {

  		rawData.forEach(function(d) {
        d.date = parseDate(d.date);
        d.value = +d.value;
    	});


      // create svg and give it a width and height
      svg = d3.select(this).selectAll("svg").data(rawData);
      // svg.enter().append("svg").call(responsivefy).append("g");
      svg.enter().append("svg").append("g");

      svg.attr("width", width + margin.left + margin.right);
      svg.attr("height", height + margin.top + margin.bottom);

      // set domain
      x.domain(d3.extent(rawData, function(d) { return d.date; }));
    	y.domain([0, d3.max(rawData, function(d) { return Math.max( d.value); })]) 


      // this group element will be used to contain all
      // other elements.
      g = svg.select("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

     
      setupVis(rawData);

      setupSections();

    });
  }

  /**
  * setupVis - creates initial elements for all
  * sections of the visualization.
  */

   setupVis = function(rawData) {
    // axis
    g.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);
    g.select(".x.axis").style("opacity", 0);

     g.append("g")
      .attr("class", "y axis")
      .call(yAxis);
    g.select(".y.axis").style("opacity", 0);

    // count openvis title
    g.append("text")
      .attr("class", "title openvis-title")
      .attr("x", width / 2)
      .attr("y", height / 3)
      .text("2013");

    g.append("text")
      .attr("class", "sub-title openvis-title")
      .attr("x", width / 2)
      .attr("y", (height / 3) + (height / 5) )
      .text("OpenVis Conf");

    g.selectAll(".openvis-title")
      .attr("opacity", 0);

    // count filler word count title
    g.append("text")
      .attr("class", "title count-title highlight")
      .attr("x", width / 2)
      .attr("y", height / 3)
      .text("180");

    g.append("text")
      .attr("class", "sub-title count-title")
      .attr("x", width / 2)
      .attr("y", (height / 3) + (height / 5) )
      .text("Filler Words");

    g.selectAll(".count-title")
      .attr("opacity", 0);

    // var singleLine = svg.append("path")      
    //   .attr("class", "line") 
    //   .attr("d", valueline(rawData));

		svg.append("path")      
      .attr("class", "line") 
      .attr("d", valueline(rawData))
      // .attr("opacity", 0);

     // console.log(rawData)

    // var hist = g.selectAll(".hist").data(histData);
   	// 		hist.enter().append("rect")

    // var singleLine = g.selectAll(".line").data(rawData);
    // 	singleLine.enter().append("path")
  };

  /**
   * setupSections - each section is activated
   * by a separate function. Here we associate
   * these functions to the sections based on
   * the section's index.
   *
   */
  setupSections = function() {
    // activateFunctions are called each
    // time the active section changes
    activateFunctions[0] = showTitle;
    activateFunctions[1] = showFillerTitle;
    activateFunctions[2] = showLine;
    activateFunctions[3] = showTitle;
    activateFunctions[4] = showFillerTitle;
    activateFunctions[5] = showLine;
    activateFunctions[6] = showTitle;
    activateFunctions[7] = showFillerTitle;
    activateFunctions[8] = showLine;

    // updateFunctions are called while
    // in a particular section to update
    // the scroll progress in that section.
    // Most sections do not need to be updated
    // for all scrolling and so are set to
    // no-op functions.
    for(var i = 0; i < 2; i++) {
      updateFunctions[i] = function() {};
    }
    // updateFunctions[7] = updateCough;
  };

  /**
  * ACTIVATE FUNCTIONS
  *
  * These will be called their
  * section is scrolled to.
  *
  * General pattern is to ensure
  * all content for the current section
  * is transitioned in, while hiding
  * the content for the previous section
  * as well as the next section (as the
  * user may be scrolling up or down).
  *
  */

  /**
   * showTitle - initial title
   *
   * hides: count title
   * (no previous step to hide)
   * shows: intro title
   *
   */
  function showTitle() {
  	hideXAxis();
  	hideYAxis();

    g.selectAll(".count-title")
      .transition()
      .duration(0)
      .attr("opacity", 0);

    g.selectAll(".openvis-title")
      .transition()
      .duration(600)
      .attr("opacity", 1.0);
  }

  /**
   * showFillerTitle - filler counts
   *
   * hides: intro title
   * hides: square grid
   * shows: filler count title
   *
   */
  function showFillerTitle() {
  	hideXAxis();
  	hideYAxis();

    g.selectAll(".openvis-title")
      .transition()
      .duration(0)
      .attr("opacity", 0);

    g.selectAll(".line")
      .transition()
      .duration(0)
      .attr("opacity", 0);

    g.selectAll(".count-title")
      .transition()
      .duration(600)
      .attr("opacity", 1.0);
  }


  /**
   * showLine - single line chart
   *
   * hides: square grid
   * hides: histogram
   * shows: barchart
   *
   */
  function showLine() {
    // ensure bar axis is set
    showXAxis(xAxis);
    showYAxis(yAxis);

    g.selectAll(".count-title")
      .transition()
      .duration(800)
      .attr("opacity", 0);

    g.selectAll(".line")
      // .attr("d", valueline(rawData))
      .transition()
      .duration(800)
      .attr("opacity", 1);
  }


  /**
   * showXAxis - helper function to
   * display particular xAxis
   *
   * @param axis - the axis to show
   *  (xAxisHist or xAxisBar)
   */
  function showXAxis(xAxis) {
    g.select(".x.axis")
      .call(xAxis)
      .transition().duration(500)
      .style("opacity", 1);
  }

  /**
   * showYAxis - helper function to
   * display particular yAxis
   *
   * @param axis - the axis to show
   *  (xAxisHist or xAxisBar)
   */
  function showYAxis(yAxis) {
    g.select(".y.axis")
      .call(yAxis)
      .transition().duration(500)
      .style("opacity", 1);
  }


  /**
   * hideAxis - helper function
   * to hide the Xaxis
   *
   */
  function hideXAxis() {
    g.select(".x.axis")
      .transition().duration(500)
      .style("opacity",0);
  }

  /**
   * hideYAxis - helper function
   * to hide the Yaxis
   *
   */
  function hideYAxis() {
    g.select(".y.axis")
      .transition().duration(500)
      .style("opacity",0);
  }

	/**
	* UPDATE FUNCTIONS
	*
	* These will be called within a section
	* as the user scrolls through it.
	*
	* We use an immediate transition to
	* update visual elements based on
	* how far the user has scrolled
	*
	*/

  /**
  * updateCough - increase/decrease
  * cough text and color
  *
  * @param progress - 0.0 - 1.0 -
  *  how far user has scrolled in section
  */
  function updateCough(progress) {
    g.selectAll(".path")
      .transition()
      .duration(0)
      .attr("opacity", progress);

    // g.selectAll(".hist")
    //   .transition("cough")
    //   .duration(0)
    //   .style("fill", function(d,i) {
    //     return (d.x >= 14) ? coughColorScale(progress) : "#008080";
      // });
  }


  /**
   * activate -
   *
   * @param index - index of the activated section
   */
  chart.activate = function(index) {
    activeIndex = index;
    var sign = (activeIndex - lastIndex) < 0 ? -1 : 1;
    var scrolledSections = d3.range(lastIndex + sign, activeIndex + sign, sign);
    scrolledSections.forEach(function(i) {
      activateFunctions[i]();
    });
    lastIndex = activeIndex;
  };

  /**
   * update
   *
   * @param index
   * @param progress
   */
  chart.update = function(index, progress) {
    updateFunctions[index](progress);
  };

  // return chart function
  return chart;

};



/**
 * display - called once data
 * has been loaded.
 * sets up the scroller and
 * displays the visualization.
 *
 * @param data - loaded tsv data
 */
function display(data){
  // create a new plot and
  // display it
  var plot = scrollVis();
  d3.select("#vis")
    .datum(data)
    .call(plot);

  // setup scroll functionality
  var scroll = scroller()
    .container(d3.select('#graphic'));

  // pass in .step selection as the steps
  scroll(d3.selectAll('.step'));

  // setup event handling
  scroll.on('active', function(index) {
    // highlight current step text
    d3.selectAll('.step')
      .style('opacity',  function(d,i) { return i == index ? 1 : 0.1; });

    // activate current section
    plot.activate(index);
  });

  scroll.on('progress', function(index, progress){
    plot.update(index, progress);
  });


};

// function responsivefy(svg) {
//   var container = d3.select(svg.node().parentNode),
//     width = parseInt(svg.style("width")),
//     height = parseInt(svg.style("height")),
//     aspect = width / height;

//     svg.attr("viewBox", "0 0 " + width + " " + height)
//     .attr("perserveAspectRatio", "xMinYMid")
//     .call(resize);

//     d3.select(window).on("resize." + container.attr("#vis"), resize);

//     function resize() {
//     	var targetWidth = parseInt(container.style("width"));
//       svg.attr("width", targetWidth);
//       svg.attr("height", Math.round(targetWidth / aspect));
//     }
// }


d3.csv("data/test.csv", display);