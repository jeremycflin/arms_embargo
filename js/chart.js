
  // d3.select(window)
  //   .on("scroll", function(){

  //     // console.log("hey");
  //     // console.log(window.scrollY); //The scroll top of the whole page
  //     // console.log(d3.select(".text")[0][0].getBoundingClientRect());
  //     // console.log(d3.selectAll(".text")[0][1].getBoundingClientRect().top);

  //     console.log(window.innerHeight);

  //   })

  var Scroller = {

    svg         : {},
    // width     : window.innerWidth,
    // height    : window.innerHeight,
    width       : 900,
    height      : 500,
    margin      : {top: 10, right: 30, bottom: 30, left: 50},

    data        : {},

    x           : d3.time.scale(),
    y           : d3.scale.linear(),
    // z           : d3.scale.category20c(),
    // z           : d3.scale.category20(),
    xAxis       : d3.svg.axis(),
    yAxis       : d3.svg.axis(),
    parseDate   : d3.time.format("%Y").parse,
    valueline : d3.svg.line().interpolate("cardinal"),
    // valueline   : d3.svg.line(),
    area        : d3.svg.area().interpolate("cardinal"),
    stack       : d3.layout.stack(),
    // colorArray  : ["#a8a8a8", "#a8a8a8", "#a8a8a8", "#a8a8a8", "#a8a8a8", "#a8a8a8", "#a8a8a8", "#a8a8a8", "#a8a8a8", "#a8a8a8", "#a8a8a8", "#a8a8a8"],
    // chinaEmbargo: d3.range(25).map(function(d){return new Date((d+1989).toString())}),
    // chinaEmbargo: [1989, 1990, 1991, 1992, 1993, 1994, 1995, 
    //               1996, 1997, 1998, 1999, 2000, 2001, 2002,
    //               2003, 2004, 2005, 2006, 2007, 2008, 2009,
    //               2010, 2011, 2012, 2013, 2014],


    // topDistance: null,
    // bottom_of_object: null,
    // bottom_of_window: null,





    init : function(){

      var _that = this;

      this.x.range([0, this.width]);
      this.y.range([this.height, 0]);

      this.xAxis.scale(this.x);
      this.yAxis.scale(this.y);

      // this.valueline
      // .this.x(function(d) { return this.x(d.date); })
      // .this.y(function(d) { return this.y(d.value); });
      // whenever its insdie of a funciton, put _that
      

      d3.select(window).on("scroll", function(){ _that.scroll(); });

      this.makeSVG();
      // this.findPos();
      

      d3.csv("data/clean/null_adjust/data_adjusted.csv", function(error, data){ _that.processdata(data);} )
  

    },

    scroll: function(){
      // console.log(window.innerHeight);
      // console.log(d3.selectAll(".text")[0][0].getBoundingClientRect().top);
      // console.log(-(d3.selectAll(".text")[0][0].getBoundingClientRect().top));
      // console.log(d3.selectAll(".text")[0][0].getBoundingClientRect().top);
      // this.showPop();
      // this.findPos();
      this.fade();

    },

    makeSVG: function(){
      var _that = this;

      this.svg = d3.select("#graphic")
      .append("svg")
      // .attr("width", this.width + this.margin.left + this.margin.right)
      // .attr("height", this.height + this.margin.top + this.margin.bottom)
      .attr("width","100%")
      .attr("height","100%")
      .attr("viewBox", "0 0 " + (this.width + this.margin.left + this.margin.right) + " " + (this.height + this.margin.top + this.margin.bottom))
      .attr("preserveAspectRatio", "xMinYMax")
      .attr("class", "graph-svg-component")
      .append("g")
      .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");


    },

    findPos: function(){
      this.topDistance = d3.select(".text")[0][0].getBoundingClientRect().top;
      console.log(this.topDistance)
      // console.log(window.innerHeight)
    },


    fade: function(){
      var animation_height = $(window).innerHeight() * 0.4;
      // var ratio = Math.round( (1 / animation_height) * 10000 ) / 10000;
      var _that = this;

      var objectTop;
      var windowBottom;

      $(".text").each(function(){
          // var objectTop = $(this).offset().top;
          // var windowBottom = $(window).scrollTop() + $(window).innerHeight();

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

      objectTop = $("#one").offset().top;
      windowBottom = $(window).scrollTop() + $(window).innerHeight();

      if (objectTop < windowBottom - animation_height) {
        // this.lineChart()
        this.showAxis()
        this.showDot()
        this.showLine()
      };


      objectTop = $("#two").offset().top;
      windowBottom = $(window).scrollTop() + $(window).innerHeight();
      var dot = $(".dot")

      if (objectTop < windowBottom - animation_height) {
        this.CleanLine()
        this.ShowChinaLine()
        // this.ShowChinaArea()
        this.ShowStack()
        this.ShowEmbargo()
      } 

      // objectTop = $("#three").offset().top;
      // windowBottom = $(window).scrollTop() + $(window).innerHeight();

      // if (objectTop < windowBottom - animation_height) {
      //   this.ShowChinaArea()
      // };

   



     

      


    },

    processdata : function(data){
      var _that = this;

      _that.data = data;

      _that.data.forEach(function(d) {
        d.year = _that.parseDate(d.year);
        d.value = +d.value;

      });

      this.lineChart();
      this.ChinaArea();
    },


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
        .style("opacity",0);

      // this.svg.append("path")      
      //   .attr("class", "line") 
      //   .attr("id", "china") 
      //   // .attr("d", this.valueline(this.data));
      //   .attr("d", "M0," + this.height + "L0," + this.width)   
      //   ;

      this.svg.append("path")      
        .attr("class", "line")
        .attr("id", "iran") 
        .attr("d", this.valueline(this.data.filter(
          function(d){
            return d.country == "Total" && d.recipient == "Iran";
          }
        )))
        // .style("stroke","#beaed4")
        .style("opacity",0);

      this.svg.append("path")      
        .attr("class", "line")
        .attr("id", "korea")  
        .attr("d", this.valueline(this.data.filter(
          function(d){
            return d.country == "Total" && d.recipient == "North Korea";
          }
        )))
        // .style("stroke","#fdc086")
        .style("opacity",0);
       
      this.svg.append("path")      
        .attr("class", "line") 
        .attr("id", "myanmar") 
        .attr("d", this.valueline(this.data.filter(
          function(d){
            return d.country == "Total" && d.recipient == "Myanmar";
          }
        )))
        // .style("stroke","#ffff99")
        .style("opacity",0);

      this.svg.append("path")      
        .attr("class", "line") 
        .attr("id", "syria") 
        .attr("d", this.valueline(this.data.filter(
          function(d){
            return d.country == "Total" && d.recipient == "Syria";
          }
        )))
        // .style("stroke","#386cb0")
        .style("opacity",0);

      this.svg.selectAll(".dot")
        .data(this.data.filter(
          function(d){
            return d.country == "Total";
          }
        ))
        .enter().append("circle")
        .attr("class", "dot")
        .attr("cx", this.valueline.x())
        .attr("cy", this.valueline.y())
        // .attr("r", 3.5)
        .attr("r", 3)
        .style("fill", 
          function(d){
            if(d.recipient == "China"){ return "rgb(190, 108, 141)"}
            else if
              (d.recipient == "Iran"){ return "rgb(127, 164, 206)"}
            else if
              (d.recipient == "North Korea"){ return "rgb(186, 215, 46)"}
            else if
              (d.recipient == "Myanmar"){ return "rgb(253, 193, 48)"}
            else {return "rgb(157,91,48)"}          
          })
        .style("opacity",0);

      // this.svg.style("opacity",0);

        // console.log(this.x.domain)

      // this.svg.append("rect")
      //   .attr("x", this.x(this.x.domain()[0]))
      //   .attr("y", this.y(40))
      //   .attr("width", this.x(this.x.domain()[1]))
      //   .attr("height", 40)
      //   .attr("class", "band");
    },

    showDot: function(){
      var _that = this;

      this.svg
        .selectAll(".dot")
        .transition()
        .duration(100)
        .delay(1000)
        .style("opacity", 1.0);

    },

    showLine: function(){
      var _that = this;

      this.svg
        .selectAll(".line")
        .transition()
        .duration(100)
        .delay(1500)
        .style("opacity", 1.0);

      // this.svg
      //   .select("#chinaArea")
      //   .transition()
      //   .duration(100)
      //   .delay(1500)
      //   .style("opacity", 0);

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

    CleanLine: function(){
      var _that = this;

      this.svg
        .selectAll(".dot")
        .transition()
        .duration(100)
        .delay(500)
        .style("opacity", 
          function(d){
            if(d.recipient == "China"){ return 1}
            else if
              (d.recipient == "Iran"){ return 0.1}
            else if
              (d.recipient == "North Korea"){ return 0.1}
            else if
              (d.recipient == "Myanmar"){ return 0.1}
            else {return 0.1}          
          });

        this.svg
        .selectAll(".line")
        .transition()
        .duration(100)
        .delay(500)
        // .style("opacity", 
        //   function(d){
        //     if(d.recipient == "China"){ return 1}
        //     else if
        //       (d.recipient == "Iran"){ return 0.2}
        //     else if
        //       (d.recipient == "North Korea"){ return 0.2}
        //     else if
        //       (d.recipient == "Myanmar"){ return 0.2}
        //     else {return 0.2}          
        //   });
        .style("opacity",0.1)

        // console.log(this.svg)



    },

    ShowChinaLine: function(){
      var _that = this;

      this.svg  
        .select("#china")
        .transition()
        .duration(100)
        .delay(500)
        .style("opacity",1)
        .style("stroke-dasharray", "0,0")

      // this.svg  
      //   .select("#china")
      //   .transition()
      //   .attr("d", this.valueline(this.data.filter(
      //     function(d){
      //       return d.country == "Total" && d.recipient == "China";
      //     }
      //   )))
      //   .duration(2200)
      //   .delay(100)
      //   .style("opacity",1)  

    },

    ChinaArea: function(){
      var _that = this;

      this.x.domain(d3.extent(this.data, function(d) { return d.year; }));
      this.y.domain([0, d3.max(this.data, function(d) { return Math.max( d.value); })]);

      this.area
        .x(function(d) { return _that.x(d.year); })
        .y0(this.height)
        .y1(function(d) { return _that.y(d.value); });

      this.svg.append("path")
        .datum(this.data.filter(
          function(d){
            return d.country == "Total" && d.recipient == "China";
          }
        ))
        .attr("class", "area")
        .attr("id", "chinaArea")
        .attr("d", this.area)
        .style("opacity",0);

    },

    ShowChinaArea: function(){
      var _that = this;

      this.svg
        .select("#chinaArea")
        .transition()
        .duration(100)
        .delay(1500)
        .style("opacity",6);
    },

    ShowStack: function(){
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
        .y1(function(d) { return _that.y(d.y0 + d.y); });

      var layers = this.stack(nest.entries(_that.data.filter(
        function(d){return d.country !== "Total" && d.recipient == "China";}
        )));

      this.x.domain(d3.extent(this.data, function(d) { return d.year; }));
      this.y.domain([0, d3.max(this.data, function(d) { return d.y0 + d.y; })]);

      this.svg.selectAll(".layer")
        // .transition()
        .data(layers)
        .enter().append("path")
        .attr("class", "layer")
        .attr("d", function(d) { return _that.area(d.values); })
        // .style("fill", function(d, i) { return _that.z(i); });
        // .style("fill", function(d, i) { return _that.colorArray[i]; });
        .style("fill", 
          function(d){
            if(d.key == "France"){ return "rgb(190, 108, 141)"}
            else if
              (d.key == "Italy"){ return "rgb(127, 164, 206)"}
            else if
              (d.key == "United Kingdom"){ return "rgb(186, 215, 46)"}
            else if
              (d.key == "Switzerland"){ return "rgb(253, 193, 48)"}
            else if
              (d.key == "Germany (FRG)"){ return "rgb(253, 193, 48)"}
            else {return "#e9e9e9"}          
          });

        // console.log(layers)


    },

    ShowEmbargo: function(){
      var _that = this;

      // this.y.domain([this.y(1989), d3.max(this.chinaEmbargo)]).range([0, this.width], .1)
      this.x.domain([new Date("1980"), new Date("2014")]).range([0, this.width]);

      var barWidth = _that.x(new Date("2014")) - _that.x(new Date("1989"));

      // this.svg.append("rect")
      //     .attr("x", this.x(new Date("1989")))
      //     .attr("y", 0)
      //     .attr("width", barWidth)
      //     .attr("height", this.height)
      //     .attr("class", "band")
      //     .style("opacity", 0.03);

      this.svg.append("rect")
        .attr("x", this.x(new Date("1989")))
        .attr("y", 0)
        .attr("width", barWidth)
        .attr("height", 0)
        .attr("class", "band")
        .style("opacity", 0.05);

      this.svg.selectAll(".band")
        .transition()
        .duration(2000)
        .attr("height", this.height);

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


    }


 

    

    // showPop: function(){
    //   if(-(this.topDistance/window.innerHeight) > 1 ){
    //     d3.selectAll(".text")
    //     .transition()
    //     .duration(400)
    //     .style("opacity", "0");
    //   } else {
    //     d3.selectAll(".text")
    //     .transition()
    //     .duration(400)
    //     .style("opacity", "1");    
    //   }

    //    if(-(this.topDistance/window.innerHeight) < 1 ){
    //     d3.selectAll(".text")
    //     .transition()
    //     .duration(400)
    //     .style("opacity", "0");
    //   } else {
    //     d3.selectAll(".text")
    //     .transition()
    //     .duration(400)
    //     .style("opacity", "1");    
    //   }
    // }


    // .attr("d", "M0," + height + "L0," + width)
    // .transition()
    // .attr("d", function(d){return path generator})

  };

  Scroller.init();

