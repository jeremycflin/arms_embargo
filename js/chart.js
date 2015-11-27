

  var Scroller = {

    svg                        : {},
    width                      : 900,
    height                     : 500,
    margin                     : {top: 10, right: 30, bottom: 30, left: 50},

    data                       : {},

    x                          : d3.time.scale(),
    y                          : d3.scale.linear(),
    z                          : d3.scale.category20c(),
    xAxis                      : d3.svg.axis(),
    yAxis                      : d3.svg.axis(),
    parseDate                  : d3.time.format("%Y").parse,
    valueline                  : d3.svg.line().interpolate("basis"),
    area                       : d3.svg.area().interpolate("basis"),
    stack                      : d3.layout.stack(),
    hasMyanmarAreaTriggered    : false,
    hasBeenTriggered           : false, 
    hasChinaAreaTriggered      : false,
    hasChinaEmbargoTriggered   : false,
    hasCleanChinaAreaTriggered : false,
    hasChinaMainPlayerTriggered: false,
    hasMyanmarEmbargoTriggered : false,
    hasKoreaStackedTriggered   : false,
    hasCleanMyanmarTriggered   : false,
    hasKoreaEmbargoTriggered   : false,
    hasLineTriggered           : false,
    hasIranAreaTriggered       : false,
    hasCleanKoreaTriggered     : false,
    hasIranEmbargoTriggered    : false,



    init : function(){

      var _that = this;

      this.x.range([0, this.width]);
      this.y.range([this.height, 0]);

      this.xAxis.scale(this.x);
      this.yAxis.scale(this.y);

      d3.select(window).on("scroll", function(){ _that.scroll(); });

      this.makeSVG();
      
      d3.csv("data/clean/null_adjust/data_adjusted.csv", function(error, data){ _that.processdata(data);} )
  

    },

    scroll: function(){
      this.trigger();
    },

    makeSVG: function(){
      var _that = this;

      this.svg = d3.select("#graphic")
      .append("svg")
      .attr("width","100%")
      .attr("height","100%")
      .attr("viewBox", "0 0 " + (this.width + this.margin.left + this.margin.right) + " " + (this.height + this.margin.top + this.margin.bottom))
      .attr("preserveAspectRatio", "xMinYMax")
      .attr("class", "graph-svg-component")
      .append("g")
      .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");


    },

    trigger: function(){
      var animation_height = $(window).innerHeight() * 0.4;
      var _that = this;

      var objectTop;
      var windowBottom;

      $(".text").each(function(){

          objectTop = $(this).offset().top;
          windowBottom = $(window).scrollTop() + $(window).innerHeight();

          if ( objectTop < windowBottom ) {
            if ( objectTop < windowBottom - animation_height ) {
              $(this).css( {
                transition: 'opacity 0.8s linear',
                opacity: 1
              });
          } else {
            $(this).css( {
              transition: 'opacity 0.8s linear',
              // opacity: (windowBottom - objectTop) * ratio
              opacity: 0
            });
          }

      } else {
        $(this).css( 'opacity', 0 );
        }
      });


      $(".title").each(function(){
          // var objectTop = $(this).offset().top;
          // var windowBottom = $(window).scrollTop() + $(window).innerHeight();

          objectTop = $(this).offset().top;
          windowBottom = $(window).scrollTop() + $(window).innerHeight();

          if ( objectTop < windowBottom ) {
            if ( objectTop < windowBottom - animation_height ) {
              $("#graphic").css( {
                transition: 'background-color 1.7s linear',
                'background-color': 'white'
              });

              $(".title").css( {
                transition: 'color 1.7s linear',
                'color': 'rgba(0,0,0,.8)'
              });
          } else {
            $("#graphic").css( {
              transition: 'background-color 0.8s linear',
              // opacity: (windowBottom - objectTop) * ratio
              'background-color': 'rgba(0,0,0,.9)'
            });

          }

      } else {
        $("#graphic").css( 'background-color', 'rgba(0,0,0,.9)' );
        }
      });

      objectTop = $(".text").offset().top;
      windowBottom = $(window).scrollTop() + $(window).innerHeight();

      // var hasBeenTriggered = false;

      if (objectTop < windowBottom - animation_height && this.hasBeenTriggered === false) {
        this.drawEmbargo();
        this.showAxis();
        // this.ShowAllLines();
        this.myanmarStack();
        this.koreaStack();
        this.iranStack();
        this.hasBeenTriggered = true;

        // if (objectTop >  windowBottom - animation_height){
        //   this.svg
        //     .transition()
        //     .duration(1000)
        //     .style("opacity",0)
        // }
     
      };


      objectTop = $("#two").offset().top;
      windowBottom = $(window).scrollTop() + $(window).innerHeight();


      if (objectTop < windowBottom - animation_height && this.hasChinaAreaTriggered === false) {
        // this.cleanLine()
        this.showChinaStack();
        this.hasChinaAreaTriggered = true;
      } 


      objectTop = $("#three").offset().top;
      windowBottom = $(window).scrollTop() + $(window).innerHeight();

      if (objectTop < windowBottom - animation_height && this.hasChinaEmbargoTriggered === false) {
        this.showChinaEmbargo();
        this.hasChinaEmbargoTriggered = true;
      } 


      objectTop = $("#four").offset().top;
      windowBottom = $(window).scrollTop() + $(window).innerHeight();

      if (objectTop < windowBottom - animation_height && this.hasChinaMainPlayerTriggered === false) {
        this.showChinaMain();
        // this.cleanChinaStacked();      
        this.hasChinaMainPlayerTriggered = true;  
      } 

      objectTop = $("#five").offset().top;
      windowBottom = $(window).scrollTop() + $(window).innerHeight();

      if (objectTop < windowBottom - animation_height && this.hasCleanChinaAreaTriggered === false) {
        this.cleanChinaStacked();

        this.hasCleanChinaAreaTriggered = true;  
      } 


      objectTop = $("#six").offset().top;
      windowBottom = $(window).scrollTop() + $(window).innerHeight();

      if (objectTop < windowBottom - animation_height && this.hasMyanmarAreaTriggered === false) {
        this.showMyanmarStack();
        // this.DrawEmbargoMyanmar();
        this.hasMyanmarAreaTriggered = true;
        
      } 

      objectTop = $("#seven").offset().top;
      windowBottom = $(window).scrollTop() + $(window).innerHeight();

      if (objectTop < windowBottom - animation_height && this.hasMyanmarEmbargoTriggered === false) {
        this.showMyanmarEmbargo();
        this.hasMyanmarEmbargoTriggered = true;
        
      } 

      objectTop = $("#eight").offset().top;
      windowBottom = $(window).scrollTop() + $(window).innerHeight();

      if (objectTop < windowBottom - animation_height && this.hasCleanMyanmarTriggered === false) {
        this.cleanMyanmarStack();
        this.hasCleanMyanmarTriggered = true;
        
      } 

      objectTop = $("#nine").offset().top;
      windowBottom = $(window).scrollTop() + $(window).innerHeight();

      if (objectTop < windowBottom - animation_height && this.hasKoreaEmbargoTriggered === false) {
        this.showKoreaStack();
        this.showKoreaEmbargo();
        this.hasKoreaEmbargoTriggered = true;
        
      } 

      objectTop = $("#ten").offset().top;
      windowBottom = $(window).scrollTop() + $(window).innerHeight();

      if (objectTop < windowBottom - animation_height && this.hasCleanKoreaTriggered === false) {
        this.cleanKorearStack();
        this.hasCleanKoreaTriggered = true;
        
      }

      objectTop = $("#eleven").offset().top;
      windowBottom = $(window).scrollTop() + $(window).innerHeight();

      if (objectTop < windowBottom - animation_height && this.hasIranAreaTriggered === false) {
        this.showIranStack();
        this.hasIranAreaTriggered = true;
        
      }

      objectTop = $("#twelve").offset().top;
      windowBottom = $(window).scrollTop() + $(window).innerHeight();

      if (objectTop < windowBottom - animation_height && this.hasIranEmbargoTriggered === false) {
        this.showIranEmbargo();
        this.hasIranEmbargoTriggered = true;
        
      } 

    },

    processdata : function(data){
      var _that = this;

      _that.data = data;

      _that.data.forEach(function(d) {
        d.year = _that.parseDate(d.year);
        d.value = +d.value;

      });

      if (this.hasLineTriggered === false) {
        this.lineChart();
        this.hasLineTriggered = true;
        
      } 
      // this.lineChart();
      
    },


    /************************
    * Axix related functions 
    ************************
    ************************
    ************************ 
    */

    createXAxis : function(){
      return d3.svg.axis()
        .scale(this.x)
        .orient("bottom")
        .ticks(20)
    },

    createYAxis: function(){
      return d3.svg.axis()
        .scale(this.y)
        .orient("left")
        .ticks(6)
    },

    showAxis: function(){
      var _that = this;

      this.svg
        .selectAll(".axis")
        .transition()
        .duration(100)
        .style("opacity", 1.0);

      this.svg
        .selectAll(".axis_lable")
        .transition()
        .duration(100)
        .delay(500)
        .style("opacity", 1.0);

    },

    /************************
    * Lines related functions
    ************************
    ************************
    ************************ 
    */

    lineChart: function(){
      var _that = this;
      // this.svg = svg;

      this.x.domain(d3.extent(this.data, function(d) { return d.year; }));
      this.y.domain([0, d3.max(this.data, function(d) { return Math.max( d.value); })]);

      this.valueline
        .x(function(d) { return _that.x(d.year); })
        .y(function(d) { return _that.y(d.value); });



      // console.log(this.valueline(this.data))
      this.svg.append("g")         // Add the X Axis
        .attr("class", "x axis grid")
        .attr("transform", "translate(0," + this.height + ")")
        .call(this.createXAxis()
          .tickSize(-this.height)
        )
        .style("opacity",0);

      this.svg.append("g")         // Add the Y Axis
        .attr("class", "y axis grid")
        .call(this.createYAxis()
          .tickSize(-this.width)
        )
        .style("opacity",0)
        .append("text")
        .attr("class", "axis_lable")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .style("font-size",10)
        .text("Million dollar")
        .style("opacity",0);

      this.svg.append("path")      
        .attr("class", "line") 
        .attr("id", "china") 
        // .attr("d", this.valueline(this.data));   
        .attr("d", this.valueline(this.data.filter(
          function(d){
            return d.country == "Total" && d.recipient == "China";
          }
        )))
 
      this.svg.append("path")      
        .attr("class", "line")
        .attr("id", "iran") 
        .attr("d", this.valueline(this.data.filter(
          function(d){
            return d.country == "Total" && d.recipient == "Iran";
          }
        )))

      this.svg.append("path")      
        .attr("class", "line")
        .attr("id", "korea")  
        .attr("d", this.valueline(this.data.filter(
          function(d){
            return d.country == "Total" && d.recipient == "North Korea";
          }
        )))
       
      this.svg.append("path")      
        .attr("class", "line") 
        .attr("id", "myanmar") 
        .attr("d", this.valueline(this.data.filter(
          function(d){
            return d.country == "Total" && d.recipient == "Myanmar";
          }
        )))

      this.svg.append("path")      
        .attr("class", "line") 
        .attr("id", "syria") 
        .attr("d", this.valueline(this.data.filter(
          function(d){
            return d.country == "Total" && d.recipient == "Syria";
          }
        )))

      this.svg  
        .selectAll(".line")
        .transition()
        .duration(29000)
        // .delay(500)
        .ease("linear")
        .style("stroke-dashoffset", 0);

      this.svg  
        .selectAll("#china")
        .transition()
        .duration(18000)
        // .delay(500)
        .ease("linear")
        .style("stroke-dashoffset", 0);
    },

    // showLine: function(){
    //   var _that = this;

    //   this.svg
    //     .selectAll(".line")
    //     .transition()
    //     .duration(100)
    //     .delay(1500)
    //     .style("opacity", 1.0);

    //   this.svg
    //     .selectAll(".line")
    //     .transition()
    //     .duration(100)
    //     .ease("linear")
    //     .attr("stroke-dashoffset", 0);

    // },

    cleanLine: function(){
      var _that = this;

      this.svg
      .selectAll(".line")
      .transition()
      .duration(100)
      .delay(300)
      .style("opacity",0)
    },

    // ShowAllLines: function(){
    //   var _that = this;

    //   this.svg  
    //     .selectAll(".line")
    //     .transition()
    //     .duration(29000)
    //     // .delay(500)
    //     .ease("linear")
    //     .style("stroke-dashoffset", 0);

    //   this.svg  
    //     .selectAll("#china")
    //     .transition()
    //     .duration(18000)
    //     // .delay(500)
    //     .ease("linear")
    //     .style("stroke-dashoffset", 0);

    // },

    /************************
    * Stacked area charts 
    * related functions
    ************************
    ************************
    ************************ 
    */

    iranStack: function(){
      var _that = this;

      this.stack
        .offset("zero")
        .values(function(d) { return d.values; })
        .x(function(d) { return d.year; })
        .y(function(d) { return d.value; });

      var nest = d3.nest()
        .key(function(d) { return d.country; });

      this.area
        .x(function(d) { return _that.x(d.year); })
        .y0(function(d) { return _that.y(d.y0); })
        .y1(function(d) { return _that.y(d.y0 + d.y); })
        // .attr("clip-path", "url(#rectClip)");


      var layersIran = this.stack(nest.entries(this.data.filter(
        function(d){return d.country !== "Total" && d.recipient == "Iran";}
        )));

      this.x.domain(d3.extent(this.data, function(d) { return d.year; }));
      this.y.domain([0, d3.max(this.data, function(d) { return d.y0 + d.y; })]);

      this.svg.selectAll(".layersIran")
        .data(layersIran)
        .enter()
        .append("path")
        .attr("class", "layers")
        .attr("class", "layersIran")
        .attr("clip-path", "url(#rectClip)")
        .attr("d", function(d, i) {console.log(i); return _that.area(d.values); })
        .style("fill", 
          function(d){
            if(d.key == "Poland"){ return "#de9e02"}
            else if
              (d.key == "Russia"){ return "#fdb917"}
            else if
              (d.key == "United Kingdom"){ return "#fdc949"}
            else if
              (d.key == "Germany (FRG"){ return "#fed87c"}
            else if
              (d.key == "Denmark"){ return "#fd9f30"}
            else {return "rgba(172, 167, 167, .5)"}          
          })
        .style("opacity", 0)

    },

    myanmarStack: function(){
      var _that = this;

      this.stack
        .offset("zero")
        .values(function(d) { return d.values; })
        .x(function(d) { return d.year; })
        .y(function(d) { return d.value; });

      var nest = d3.nest()
        .key(function(d) { return d.country; });

      this.area
        .x(function(d) { return _that.x(d.year); })
        .y0(function(d) { return _that.y(d.y0); })
        .y1(function(d) { return _that.y(d.y0 + d.y); })
        // .attr("clip-path", "url(#rectClip)");


      var layersMyanmar = this.stack(nest.entries(this.data.filter(
        function(d){return d.country !== "Total" && d.recipient == "Myanmar";}
        )));

      this.x.domain(d3.extent(this.data, function(d) { return d.year; }));
      this.y.domain([0, d3.max(this.data, function(d) { return d.y0 + d.y; })]);

      this.svg.selectAll(".layersMyanmar")
        .data(layersMyanmar)
        .enter()
        .append("path")
        .attr("class", "layers")
        .attr("class", "layersMyanmar")
        .attr("clip-path", "url(#rectClip)")
        .attr("d", function(d, i) {console.log(i); return _that.area(d.values); })
        .style("fill", 
          function(d){
            if(d.key == "Poland"){ return "#de9e02"}
            else if
              (d.key == "Russia"){ return "#fdb917"}
            else if
              (d.key == "United Kingdom"){ return "#fdc949"}
            else if
              (d.key == "Germany (FRG"){ return "#fed87c"}
            else if
              (d.key == "Denmark"){ return "#fd9f30"}
            else {return "rgba(172, 167, 167, .5)"}          
          })
        .style("opacity", 0)

    },

    koreaStack: function(){
      var _that = this;

      this.stack
        .offset("zero")
        .values(function(d) { return d.values; })
        .x(function(d) { return d.year; })
        .y(function(d) { return d.value; });

      var nest = d3.nest()
        .key(function(d) { return d.country; });

      this.area
        .x(function(d) { return _that.x(d.year); })
        .y0(function(d) { return _that.y(d.y0); })
        .y1(function(d) { return _that.y(d.y0 + d.y); })
        // .attr("clip-path", "url(#rectClip)");


      var layersKorea = this.stack(nest.entries(this.data.filter(
        function(d){return d.country !== "Total" && d.recipient == "North Korea";}
        )));

      this.x.domain(d3.extent(this.data, function(d) { return d.year; }));
      this.y.domain([0, d3.max(this.data, function(d) { return d.y0 + d.y; })]);

      this.svg.selectAll(".layersKorea")
        .data(layersKorea)
        .enter()
        .append("path")
        .attr("class", "layers")
        .attr("class", "layersKorea")
        .attr("clip-path", "url(#rectClip)")
        .attr("d", function(d, i) {console.log(i); return _that.area(d.values); })
        .style("fill", 
          function(d){
            if(d.key == "Poland"){ return "#de9e02"}
            else if
              (d.key == "Russia"){ return "#fdb917"}
            else if
              (d.key == "United Kingdom"){ return "#fdc949"}
            else if
              (d.key == "Germany (FRG"){ return "#fed87c"}
            else if
              (d.key == "Denmark"){ return "#fd9f30"}
            else {return "rgba(172, 167, 167, .5)"}          
          })
        .style("opacity", 0)

    },

    /************************
    * Show stacked area charts 
    * related functions
    ************************
    ************************
    ************************ 
    */

    showChinaStack: function(){
      var _that = this;

      this.svg.append("clipPath")
        .attr("id", "rectClip")
        .append("rect")
        .attr("width", 0)
        .attr("height", this.height);

      this.stack
        .offset("zero")
        .values(function(d) { return d.values; })
        .x(function(d) { return d.year; })
        .y(function(d) { return d.value; });

      var nest = d3.nest()
        .key(function(d) { return d.country; });

      this.area
        .x(function(d) { return _that.x(d.year); })
        .y0(function(d) { return _that.y(d.y0); })
        .y1(function(d) { return _that.y(d.y0 + d.y); })
        // .attr("clip-path", "url(#rectClip)");

      var layers = this.stack(nest.entries(this.data.filter(
        function(d){ return d.country !== "Total" && d.recipient == "China";}
        )));

      // var layersMyanmar = this.stack(nest.entries(this.data.filter(
      //   function(d){return d.country !== "Total" && d.recipient == "Myanmar";}
      //   )));

      this.x.domain(d3.extent(this.data, function(d) { return d.year; }));
      this.y.domain([0, d3.max(this.data, function(d) { return d.y0 + d.y; })]);

      this.svg.selectAll(".layer")
        // .transition()
        .data(layers)
        .enter().append("path")
        .attr("class", "layer")
        .attr("class", "layersChina")
        .attr("clip-path", "url(#rectClip)")
        .attr("d", function(d) { return _that.area(d.values); })
              // .style("fill", function(d, i) { return _that.z(i); });
              // .style("fill", function(d, i) { return _that.colorArray[i]; });
        // .style("fill", "white")
        // .transition()
        // .duration(600)
        // .ease("linear")
        .style("fill", 
          function(d){
            if(d.key == "France"){ return "#d8a7ba"}
            else if
              (d.key == "Italy"){ return "#c8839f"}
            else if
              (d.key == "United Kingdom"){ return "#be6c8d"}
            else if
              (d.key == "Russia"){ return "#cb89a3"}
            else if
              (d.key == "Germany (FRG)"){ return "#8d3f5e"}
            else {return "rgba(172, 167, 167, .5)"}          
          })
        .style("opacity",function(d){
            if(d.key == "France"){ return 1}
            else if
              (d.key == "Italy"){ return 1}
            else if
              (d.key == "United Kingdom"){ return 1}
            else if
              (d.key == "Russia"){ return 0.3}
            else if
              (d.key == "Germany (FRG)"){ return 1}
            else {return 0.3}          
          })



      // this.svg.selectAll(".layersMyanmar")
      //   .data(layersMyanmar)
      //   .enter()
      //   .append("path")
      //   .attr("class", "layers")
      //   .attr("class", "layersMyanmar")
      //   .attr("clip-path", "url(#rectClip)")
      //   .attr("d", function(d, i) {console.log(i); return _that.area(d.values); })
      //   .style("fill", function(d, i) { return _that.z(i); })
      //   .style("opacity", 0)

      //////////////////////////////////////  
      ////////////////////////////////////  
      // Clear multiple line chart in svg//
      ////////////////////////////////////
      ////////////////////////////////////
      this.svg  
        .selectAll(".line")
        .transition()
        .duration(300)
        .ease("linear")
        .style("opacity", 0);

      ////////////////////////////////////  
      // Show China Stacked Area chart //
      ////////////////////////////////////
      //////////////////////////////////// 
      d3.select("#rectClip rect")
        .transition().duration(3000)
        .attr("width", this.width);
    },

    // ShowStacked: function(){
    //   var _that = this;

    //   d3.select("#rectClip rect")
    //   .transition().duration(3000)
    //   .attr("width", this.width);
    // },

    showChinaMain: function(){
      var _that = this;

      this.svg.selectAll(".layersChina")
        .transition()
        .duration(1000)
        .style("opacity", 
          function(d){
            if(d.key == "Russia"){ return 1}

            else {return 1}          
          })


    },

    showMyanmarStack: function(){
      var _that = this;


      d3.selectAll(".layersMyanmar")
        .transition()
        .style("opacity",1)
        // .style("opacity", 
        //   function(d){
        //     if(d.key == "Poland"){ return 0.5}
        //     else if
        //       (d.key == "Russia"){ return 1}
        //     else if
        //       (d.key == "United Kingdom"){ return 0.5}
        //     else if
        //       (d.key == "Germany (FRG"){ return 0.5}
        //     else if
        //       (d.key == "Denmark"){ return 0.5}
        //     else {return 0.5}          
        //   })

      d3.selectAll(".layersChina")
        .transition()
        .style("opacity",0)

      d3.select("#rectClip rect")
        .transition().duration(3000)
        .attr("width", this.width);

      this.x.domain([new Date("1980"), new Date("2014")]).range([0, this.width]);

      var barWidth = _that.x(new Date("2014")) - _that.x(new Date("1991"));

      this.svg.append("rect")
        .attr("x", this.x(new Date("1991")))
        .attr("y", 0)
        .attr("width", barWidth)
        .attr("height", 0)
        .attr("class", "band")
        .attr("class", "embargoMyanmar")
        .style("opacity", 0.35);

      console.log("START LAST CHART NOW")

    },

    showKoreaStack: function(){
      var _that = this;


      d3.selectAll(".layersKorea")
        .transition()
        .style("opacity",1)
        // .style("opacity", 
        //   function(d){
        //     if(d.key == "Poland"){ return 0.5}
        //     else if
        //       (d.key == "Russia"){ return 1}
        //     else if
        //       (d.key == "United Kingdom"){ return 0.5}
        //     else if
        //       (d.key == "Germany (FRG"){ return 0.5}
        //     else if
        //       (d.key == "Denmark"){ return 0.5}
        //     else {return 0.5}          
        //   })

      d3.selectAll(".layersMyanmar")
        .transition()
        .style("opacity",0)

      d3.select("#rectClip rect")
        .transition().duration(3000)
        .attr("width", this.width);

       // d3.select("#rectClip rect")
       //  .transition().duration(3000)
       //  .attr("width", 0);

      this.x.domain([new Date("1980"), new Date("2014")]).range([0, this.width]);

      var barWidth = _that.x(new Date("2014")) - _that.x(new Date("2006"));

      this.svg.append("rect")
        .attr("x", this.x(new Date("2006")))
        .attr("y", this.y(2000))
        .attr("width", barWidth)
        .attr("height", 0)
        .attr("class", "band")
        .attr("class", "embargoKorea")
        .style("opacity", 0.35);

      this.svg.append("rect")
        .attr("x", this.x(new Date("2006")))
        .attr("y", 0)
        .attr("width", barWidth)
        .attr("height", 0)
        .attr("class", "band")
        .attr("class", "embargoKoreaUN")
        .style("opacity", 0.35);

    },
    showIranStack: function(){
      var _that = this;


      d3.selectAll(".layersIran")
        .transition()
        .style("opacity",1)
        // .style("opacity", 
        //   function(d){
        //     if(d.key == "Poland"){ return 0.5}
        //     else if
        //       (d.key == "Russia"){ return 1}
        //     else if
        //       (d.key == "United Kingdom"){ return 0.5}
        //     else if
        //       (d.key == "Germany (FRG"){ return 0.5}
        //     else if
        //       (d.key == "Denmark"){ return 0.5}
        //     else {return 0.5}          
        //   })

      d3.selectAll(".layersKorea")
        .transition()
        .style("opacity",0)

      d3.select("#rectClip rect")
        .transition().duration(3000)
        .attr("width", this.width);

       // d3.select("#rectClip rect")
       //  .transition().duration(3000)
       //  .attr("width", 0);

      this.x.domain([new Date("1980"), new Date("2014")]).range([0, this.width]);

      var barWidth = _that.x(new Date("2014")) - _that.x(new Date("2006"));

      this.svg.append("rect")
        .attr("x", this.x(new Date("2006")))
        .attr("y", 0)
        .attr("width", barWidth)
        .attr("height", 0)
        // .attr("class", "band")
        .attr("class", "embargoIran")
        .style("opacity", 0.35);

      // this.svg.append("rect")
      //   .attr("x", this.x(new Date("2006")))
      //   .attr("y", 0)
      //   .attr("width", barWidth)
      //   .attr("height", 0)
      //   .attr("class", "band")
      //   .attr("class", "embargoKoreaUN")
      //   .style("opacity", 0.35);

    },

    /************************
    * Clean stacked area charts 
    * related functions
    ************************
    ************************
    ************************ 
    */

    cleanChinaStacked: function(){
      var _that = this;

      d3.select("#rectClip rect")
      .transition().duration(3000)
        .attr("width", 0);

      this.svg.selectAll(".embargoChina")
        .transition()
        .duration(2000)
        .attr("height", 0);

      this.svg.selectAll(".embargoAnnotateChina")
        .transition()
        .duration(1800)
        .ease("linear")
        .style("opacity",0)
    },

    cleanMyanmarStack: function(){
      var _that = this;

      d3.select("#rectClip rect")
        .transition().duration(3000)
        .attr("width", 0);

      this.svg.selectAll(".embargoMyanmar")
        .transition()
        .duration(2000)
        .attr("height", 0);

       this.svg.selectAll(".embargoAnnotateMyanmar")
        .transition()
        .duration(2000)
        .ease("linear")
        .style("opacity",0);
    },

    cleanKorearStack: function(){
      var _that = this;

      d3.select("#rectClip rect")
        .transition().duration(3000)
        .attr("width", 0);

      this.svg.selectAll(".embargoKorea")
        .transition()
        .duration(2000)
        .attr("height", 0);

      this.svg.selectAll(".embargoKoreaUN")
        .transition()
        .duration(2000)
        .attr("height", 0);

      this.svg.selectAll(".embargoAnnotateKorea")
        .transition()
        .duration(2000)
        .ease("linear")
        .style("opacity",0);

    },

    /************************
    * Draw all embargo rects
    ************************
    ************************
    ************************ 
    */

    drawEmbargo: function(){
      var _that = this;

      this.x.domain([new Date("1980"), new Date("2014")]).range([0, this.width]);

      var barWidth = _that.x(new Date("2014")) - _that.x(new Date("1989"));

      this.svg.append("rect")
        .attr("x", this.x(new Date("1989")))
        .attr("y", 0)
        .attr("width", barWidth)
        .attr("height", 0)
        // .attr("class", "band")
        .attr("class", "embargoChina")
        .style("opacity", 0.35);

      this.svg.append("text")
        .attr("x", this.x(new Date("1989")))
        .attr("y", -10)
        .attr("width", barWidth)
        .attr("height", 0)
        .attr("class", "embargoAnnotateChina")
        .text("EU embargo starts from year 1989")
        .style("opacity",0);

       this.svg.append("text")
        .attr("x", this.x(new Date("1991")))
        .attr("y", -10)
        .attr("width", barWidth)
        .attr("height", 0)
        .attr("class", "embargoAnnotateMyanmar")
        .text("EU embargo starts from year 1991")
        .style("opacity",0);

       this.svg.append("text")
        .attr("x", this.x(new Date("2006")))
        .attr("y", this.y(2000) - 10)
        .attr("width", barWidth)
        .attr("height", 0)
        .attr("class", "embargoAnnotateKorea")
        .text("EU embargo starts from year 2006")
        .style("opacity",0);

        this.svg.append("text")
        .attr("x", this.x(new Date("2006")))
        .attr("y", -10)
        .attr("width", barWidth)
        .attr("height", 0)
        .attr("class", "embargoAnnotateKorea")
        .text("UN embargo starts from year 2006")
        .style("opacity",0);

      // this.svg.append("text")
      //   .attr("x", this.x(new Date("2013")))
      //   .attr("y", -10)
      //   .attr("width", barWidth)
      //   .attr("height", 0)
      //   .attr("class", "embargoAnnotate")
      //   .text("Year 2014")
      //   .style("opacity",0);

      // this.svg.selectAll(".band")
      //   .transition()
      //   .duration(2000)
      //   .attr("height", this.height);

      // this.svg.append("rect")
      //     .attr("x", this.x(new Date("1989")))
      //     .attr("y", 0)
      //     .attr("width", barWidth)
      //     .attr("height", this.height)
      //     .attr("class", "band")
      //     .style("opacity", 0.03);

      // this.svg.selectAll("rect")      
      //   .data(this.chinaEmbargo)
      //   .enter()
      //   .append("rect")
      //   .attr("x", function(d){
      //     return _that.x(d);
      //   })
      //   // .attr("x",function(d){
      //   //   return _that.y(d);
      //   // })
      //   .attr("y", 0)
      //   .attr("width", barWidth/(this.chinaEmbargo.length-1))
      //   // .attr("width", this.y.range())
      //   .attr("height", this.height)
      //   .style("fill","black")
      //   .style("opacity", 0.3)


    },

    /************************
    * Show embargo**********
    **related funciton******
    ************************
    ************************
    ************************ 
    */
    showChinaEmbargo: function(){
      var _that = this;

      this.svg.selectAll(".embargoChina")
        .transition()
        .duration(1500)
        // .delay(3000)
        .attr("height", this.height);

      this.svg.selectAll(".embargoAnnotateChina")
        .transition()
        .duration(1800)
        .ease("linear")
        .style("opacity",1)
    },

    showMyanmarEmbargo: function(){
      var _that = this;

      this.svg.selectAll(".embargoMyanmar")
        .transition()
        .duration(1500)
        // .delay(3000)
        .attr("height", this.height);

      this.svg.selectAll(".embargoAnnotateMyanmar")
        .transition()
        .duration(1800)
        .ease("linear")
        .style("opacity",1)

    },

    showKoreaEmbargo: function(){
      var _that = this;

      this.svg.selectAll(".embargoKorea")
        .transition()
        .duration(1500)
        // .delay(3000)
        .attr("height", this.height/1.77);

      this.svg.selectAll(".embargoKoreaUN")
        .transition()
        .duration(1500)
        .delay(500)
        .attr("height", this.height/2.29);


      this.svg.selectAll(".embargoAnnotateKorea")
        .transition()
        .duration(1800)
        .ease("linear")
        .style("opacity",1)

    },

    showIranEmbargo: function(){
      var _that = this;

      this.svg.selectAll(".embargoIran")
        .transition()
        .duration(1500)
        // .delay(3000)
        .attr("height", this.height);

      // this.svg.selectAll(".embargoKoreaUN")
      //   .transition()
      //   .duration(1500)
      //   .delay(500)
      //   .attr("height", this.height/2.29);


      this.svg.selectAll(".embargoAnnotateKorea")
        .transition()
        .duration(1800)
        .ease("linear")
        .style("opacity",1)

    },

    

    // DrawEmbargoMyanmar: function(){
    //   var _that = this;

      // this.x.domain([new Date("1980"), new Date("2014")]).range([0, this.width]);

      // var barWidth = _that.x(new Date("2014")) - _that.x(new Date("1989"));

      // this.svg.append("rect")
      //   .attr("x", this.x(new Date("1991")))
      //   .attr("y", 0)
      //   .attr("width", barWidth)
      //   .attr("height", 0)
      //   .attr("class", "band")
      //   .attr("class", "embargoMyanmar")
      //   .style("opacity", 0.35);

      // this.svg.append("text")
      //   .attr("x", this.x(new Date("1989")))
      //   .attr("y", -10)
      //   .attr("width", barWidth)
      //   .attr("height", 0)
      //   .attr("class", "embargoAnnotate")
      //   .text("EU embargo starts from year 1989")
      //   .style("opacity",0);

    // } 


  };

  Scroller.init();

