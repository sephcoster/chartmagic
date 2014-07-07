var billion = 1000000000;

var appropriationTypeColors =
    ["#74C365", // light green 
    "#006600",  // dark green 
    "#007BA7"]; // blue


d3.csv("data/foreignAssistance.csv", function (data) {
    data.forEach(function (d) {
        d.amount = +d.amount; // cast to numbers
    });
    // put data in crossfilter
    var facts = crossfilter(data);
    
// STEP ONE

    // Manual Render Function (if you want to write it manually)
    // var totalGroup = facts.groupAll().reduce(
    //     function(p,v) {
    //         return p += v.amount;
    //     },
    //     function(p,v) {
    //         return p -= v.amount;
    //     },
    //     function(){ return 0 }
    // });

    // Convenient version using CrossFilter
    var totalGroup = facts.groupAll().reduceSum(dc.pluck("amount"));

// STEP TWO - Customize number return display values
    dc.numberDisplay("#dc-chart-total")
        .group(totalGroup)
        .valueAccessor(function(d){
            return d / billion;
        })
        .transitionDuration(1000)
        .formatNumber(function(d){ return "$" + Math.round(d) + " Billion"; });

    var appropriationTypeDim = facts.dimension(dc.pluck('appropriationType'));
    var appropriationTypeGroupSum = appropriationTypeDim.group().reduceSum(dc.pluck("amount"));
    
    // Console Log to inspect your data!
    console.log("Let's Inspect our Group Sum: ", appropriationTypeGroupSum.all() );

// STEP THREE - Create a pie chart object
    var pie = dc.pieChart("#dc-chart-appropriationType")
        .dimension(appropriationTypeDim)
        .group(appropriationTypeGroupSum)
        .width(200)
        .height(200)
        .radius(80)
        .ordinalColors(appropriationTypeColors);

// STEP FOUR - Set up your Fiscal Year Groups by year, and return funding types
    var fiscalYearDim = facts.dimension(dc.pluck('fiscalYear'));
    var fiscalYearGroupSum = fiscalYearDim.group().reduce(
        function(p,v){
            p[v.appropriationType] += v.amount;
            return p;
        },
        function(p,v){
            p[v.appropriationType] -= v.amount;
            return p;
        },
        function(){
            return { "Base": 0, "Supplemental": 0, "Request": 0 };
        }
    );
    console.log("Fiscal Year Group Sum: ", fiscalYearGroupSum.all() );

// STEP FIVE - Create your bar chart object and assign properties
    var bar = dc.barChart("#dc-chart-fiscalYear")
        .dimension(fiscalYearDim)
        .group(fiscalYearGroupSum, "Base").valueAccessor(function(d){ return d.value.Base; })
        .stack(fiscalYearGroupSum, "Supplemental", function(d){ return d.value.Supplemental; })
        .stack(fiscalYearGroupSum, "Request", function(d){ return d.value.Request; })
        .width(650)
        .height(200).margins({ top: 10, right: 30, bottom: 20, left: 50 })
        .legend(dc.legend().x(60).y(20))
        .gap(10)
        .centerBar(true)
        .filter([2005.5, 2015.5])
        .x(d3.scale.linear().domain([2005.5, 2015.5]))
        .elasticY(true)
        .ordinalColors(appropriationTypeColors);

    bar.yAxis().tickFormat(d3.format("d"));
    bar.yAxis().tickFormat(function(v){ return v / billion + " B"; });

// STEP SEVEN - Render your new RowChart that take dynamic attributes. Modular functions are cool!
    new RowChart(facts, "operatingUnit", 300, 100);
    new RowChart(facts, "agency", 300, 10);
    new RowChart(facts, "category", 300, 10);
    new RowChart(facts, "sector", 300, 50);
    new RowChart(facts, "account", 300, 50);
    
    // Console Log your data to see what it looks like:
    console.log("Data Debug: ", data);
    
    // draw all dc charts. w/o this nothing happens!  
    dc.renderAll();
});


// STEP SIX - Create your RowChart Prototype (you will re-use this above on lines 92-96)
var RowChart = function(facts, attribute, width, maxItems){
    this.dim = facts.dimension(dc.pluck(attribute));
    dc.rowChart("#dc-chart-" + attribute)
        .dimension(this.dim)
        .group(this.dim.group().reduceSum(dc.pluck("amount")))
        .data(function(d){ return d.top(maxItems); })
        .width(width)
        .height(maxItems * 22)
        .margins({ top: 0, right: 10, bottom: 20, left: 20 })
        .elasticX(true)
        .ordinalColors(['#9ecae1'])
        .labelOffsetX(5)
        .xAxis().ticks(4).tickFormat(d3.format(".2s"));
};




