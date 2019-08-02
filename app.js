//type conversion
function type(d) {
    return {
       Make: d.Make,
       Fuel: d.Fuel,
       EngineCylinders: +d.EngineCylinders,
       AverageCityMPG: +d.AverageCityMPG,
       AverageHighwayMPG: +d.AverageHighwayMPG,
    };
}

function prepareBarChart2City(data){
    var dataMap = d3.nest()
        .key(function(d) {return d.Fuel})
        .rollup(function(v) { return d3.mean(v, function(d) { return d.AverageCityMPG; }); })
        .entries(data);

    console.log(dataMap)
    dataArray =  Array.from(dataMap, d => ({Fuel:d[0], cityMPG:d[1]}));

    return dataMap;    
}

function prepareBarChart2Highway(data){
    var dataMap = d3.nest()
        .key(function(d) {return d.Fuel})
        .rollup(function(v) { return d3.mean(v, function(d) { return d.AverageHighwayMPG; }); })
        .entries(data);

    console.log(dataMap)
    dataArray =  Array.from(dataMap, d => ({Fuel:d[0], cityMPG:d[1]}));

    return dataMap;    
}

function prepareBarChart3City(data){
    var dataMap = d3.nest()
        .key(function(d) {return d.EngineCylinders})
        .rollup(function(v) { return d3.mean(v, function(d) { return d.AverageCityMPG; }); })
        .entries(data);

    console.log(dataMap)
    dataArray =  Array.from(dataMap, d => ({Engine:d[0], cityMPG:d[1]}));

    return dataMap;    
}

function prepareBarChart3Highway(data){
    var dataMap = d3.nest()
        .key(function(d) {return d.EngineCylinders})
        .rollup(function(v) { return d3.mean(v, function(d) { return d.AverageHighwayMPG; }); })
        .entries(data);

    console.log(dataMap)
    dataArray =  Array.from(dataMap, d => ({Engine:d[0], cityMPG:d[1]}));

    return dataMap;    
}

function filterFuel(data, fuelType){
    return data.filter(d => {
        return d.Fuel == fuelType
    })
}

function cityHighwayBar(data){

    let highwayTotal = 0
    let cityTotal = 0

    for(i = 0; i < data.length; i++){
        highwayTotal = highwayTotal + data[i].AverageHighwayMPG
        cityTotal = cityTotal + data[i].AverageCityMPG
    }

    highwayTotal = highwayTotal/data.length;
    cityTotal = cityTotal/data.length;
    
    console.log(highwayTotal);
    console.log(cityTotal);

    var myMap = new Map()
    myMap.set("City", cityTotal)
    myMap.set("Highway", highwayTotal)
    console.log(myMap)

    dataArray =  Array.from(myMap, d => ({TYPE:d[0], MPG:d[1]}));
    
    var margin = 50;
    var width = 500-2*margin;
    var height = 500-2*margin;
    
    

    const xMax =  d3.max(dataArray, d => d.MPG)

    const xScale =  d3.scaleLinear()
                .domain([20,xMax])
                .range([0,width]);


    const yScale =  d3.scaleBand()
                .domain(dataArray.map(d => d.TYPE))
                .rangeRound([0,height])
                .paddingInner(0.25);

    console.log(xScale(30));

    //const svg = d3.select('.chart-container')
    //    .append('svg')
    //    .attr('width', width + 2*margin)
    //    .attr('height', height + 2*margin)
    //    .append('g')

     
    svg = d3.select('.chart-container')
        .selectAll('svg')
        .attr('width', width + 2*margin)
        .attr('height', height + 2*margin)
        .append('g') 

    const header = svg
        .append('g')
        .attr('class', 'bar-header')
        .attr("transform", "translate(" + margin/2 + "," + -1*margin/2 + ")")

        .append('text');

    header.append('tspan').text('MPG - City vs Highway')

    svg
       .attr("transform", "translate(" + margin + "," + margin + ")")
       .selectAll('rect')
       .data(dataArray)
       .enter()
       .append('rect')
       .attr('class', 'bar')
       .attr('y',d => yScale(d.TYPE))
       .attr('width', d => xScale(d.MPG))
       .attr('height',yScale.bandwidth())
       .style('fill', function(d,i){
        if (i%2 == 0)
         return "blue";
        else
         return "red";
    })

    const xAxis =  d3.axisTop(xScale);

    const xAxisDraw = svg
        .append('g')
        .attr('class', 'x axis')
        .call(xAxis)

    const yAxis = d3.axisLeft(yScale).tickSize(0)    
    const yAxisDraw = svg
        .append('g')
        .attr('class', 'yaxis')
        .call(yAxis)



}

function applyScatter(){
    d3.csv("https://flunky.github.io/cars2017.csv", type).then( res=> {
        scatter(res)
    });
}

function applyCityhighwayBar(){
    d3.csv("https://flunky.github.io/cars2017.csv", type).then( res=> {
        cityHighwayBar(res)
    });
}

function applyFuelTypeBar(){
    d3.csv("https://flunky.github.io/cars2017.csv", type).then( res=> {
        FuelTypeBar(res)
    });
}

function applyEngineSizeBar(){
    d3.csv("https://flunky.github.io/cars2017.csv", type).then( res=> {
        EngineSizeBar(res)
    });
}

function click() {
    console.log(this.dataset.name)
    svg.html(null)
    //svg = d3.select('.chart-container')
    //   .select('svg')
    //   .attr("width",500)
    //   .attr("height",500)
    //   .append("g")
    if (this.dataset.name == 'prev'){
        if (curChart == 'two'){
            applyScatter()
            curChart = 'one'
        } else if (curChart == 'three'){
            applyCityhighwayBar()
            curChart = 'two'
        } else if (curChart == 'four'){
            applyFuelTypeBar()
            curChart = 'three'
        } else {
            applyScatter()
            curChart = 'one'
        }

    } 
    else if (this.dataset.name == 'next') {
        if (curChart == 'one'){
            applyCityhighwayBar()
            curChart = 'two'
        } else if (curChart == 'two'){
            applyFuelTypeBar()
            curChart = 'three'
        } else {
            applyEngineSizeBar()
            curChart = 'four'
        }
    }

    //if (this.dataset.name == "one")
    //    applyScatter()
    //else if (this.dataset.name == "two")
    //    applyCityhighwayBar()
    //else if (this.dataset.name == "three")
    //    applyFuelTypeBar()
    //else if (this.dataset.name == "four")
    //    applyEngineSizeBar()

}

var curChart = 'one'

svg = d3.select('.chart-container').select('svg')
        .append("g")

d3.selectAll('button').on('click', click)       

//load data
d3.csv("https://flunky.github.io/cars2017.csv", type).then( res=> {
    scatter(res)
});



function addLabel(axis, label, x){
    axis
        .selectAll('.tick:last-of-type text')
        .clone()
        .text(label)
        .attr('x', x)
        .style('text-anchor', 'start')
        .style('font-weight', 'bold');
        
}

function scatter(data) {

    var margin = 50;
    var width = 400;
    var height = 400;
    
    
    var x = d3.scaleLog()
        .domain([10,150])
        .range([0,width]);
        
    var y = d3.scaleLog()
        .domain([10,150])
        .range([height,0]);
    
    const colorScale = d3.scaleOrdinal()
        .range(d3.schemeCategory10);

    const colorLabel = 'Fuel';
        //svg = d3.select('.chart-container')
    //   .append('svg')
    //   .attr("width",width + 2*margin)
    //   .attr("height",height + 2*margin)
    //   .append("g")

    //svg
    //.append("g")
    //.attr("transform","translate(" + 100 + "," + 100 + ")")     


    const header = svg
       .append('g')
       .attr('class', 'bar-header')
       .attr("transform", "translate(" + margin/2 + "," + -1*margin/2 + ")")

       .append('text');

   header.append('tspan').text('MPG - City vs Highway by engine size')

    svg
       .attr("transform","translate(" + margin + "," + margin + ")")
       .selectAll(".scatter")
       .data(data)
       .enter().append("circle")
       .attr("cx",function(d) { return x(d.AverageCityMPG); })
       .attr("cy",function(d) { return y(d.AverageHighwayMPG);})
       .attr('fill', d => colorScale(d.Fuel))
       .attr('fill-opacity', 0.4)
       .attr("r", function (d) { return +d.EngineCylinders+2;})

    
    xaxis = d3.axisBottom(x)
            .tickValues([10,20,50,100])
            .tickFormat(d3.format("~s"))
            
    yaxis = d3.axisLeft(y)
            .tickValues([10,20,50,100])
            .tickFormat(d3.format("~s"))
      
    //colorLegendG.append('text')
    //        .attr('class', 'legend-label')
    //        .attr('x', -30)
    //        .attr('y', -40)
    //        .text(colorLabel);

            
    svg
       .append("g")
       //.attr("transform", "translate(" + margin + "," + margin + ")")
       .call(yaxis)
       .call(addLabel, 'Highway', 10);
    
    svg
       .append("g")
       .attr("transform", "translate(" + 0 + "," + (height) + ")")
       .call(xaxis)
       .call(addLabel, 'City', 25);
    
    const annotations = [
        {
            note: {
              label: "Added connector end 'arrow', note wrap '180', and note align 'left'",
              title: "d3.annotationLabel",
              wrap: 150,
              align: "left"
            }

        }
    ].map(function(d){ d.color = "#E8336D"; return d})

    const makeAnnotations = d3.annotation()
    .type(d3.annotationLabel)
    .annotations(annotations)

    svg
          .append("g")
          .attr("class", "annotation-group")
          .call(makeAnnotations)

    svg
        .append('g')
        .attr("transform", "translate(" + 400 + "," + (200) + ")")
        .append('text')
        .attr('class', 'legend-label')
        .attr('x', -30)
        .attr('y', -40)
        .text(colorLabel)
        .call(colorLegend)
        .selectAll('.cell text')
        .attr('dy', '0.1em');
    //svg
    //   .transition()
    //   .duration(1000)
    //   .delay(5000)
    //   .remove();
 
    
    
}

function FuelTypeBar(data){

    let highwayTotal = 0
    let cityTotal = 0

    dataArrayCity =  prepareBarChart2City(data)
    dataArrayHighway = prepareBarChart2Highway(data)
    
    console.log(dataArrayCity.length)
    console.log(dataArrayCity);
    console.log(dataArrayHighway);
    
    var margin = 70;
    var width = 500-2*margin;
    var height = 500-2*margin;
    
    var myMap = new Map()
    
    myMap.set("Gasoline-City", dataArrayCity[0].value)
    myMap.set("Gasoline-Hwy", dataArrayHighway[0].value)
    myMap.set("", 0)

    myMap.set("Diesel-City", dataArrayCity[1].value)
    myMap.set("Diesel-Hwy", dataArrayHighway[1].value)
    myMap.set(" ", 0)

    myMap.set("Electricity-City", dataArrayCity[2].value)
    myMap.set("Electricity-Hwy", dataArrayHighway[2].value)

    console.log(myMap)

    dataArray =  Array.from(myMap, d => ({Fuel:d[0], MPG:d[1]}));

    const xMax =  d3.max(dataArray, d => d.MPG)

    const xScale =  d3.scaleLinear()
                .domain([10,xMax])
                .range([0,width]);


    const yScale =  d3.scaleBand()
                .domain(dataArray.map(d => d.Fuel))
                .rangeRound([0,height])
                .paddingInner(0.25);

    //const svg = d3.select('.chart-container')
    //    .append('svg')
    //    .attr('width', width + 2*margin)
    //    .attr('height', height + 2*margin)
    //    .append('g')

     
    svg = d3.select('.chart-container')
        .selectAll('svg')
        .attr('width', width + 2*margin)
        .attr('height', height + 2*margin)
        .append('g') 

    const header = svg
        .append('g')
        .attr('class', 'bar-header')
        .attr("transform", "translate(" + margin/2 + "," + -1*margin/2 + ")")

        .append('text');

    header.append('tspan').text('MPG by Fuel type')

    svg
       .attr("transform", "translate(" + margin + "," + margin + ")")
       .selectAll('rect')
       .data(dataArray)
       .enter()
       .append('rect')
       .attr('class', 'bar')
       .attr('y',d => yScale(d.Fuel))
       .attr('width', d => xScale(d.MPG))
       .attr('height',yScale.bandwidth())
       .style('fill', function(d,i){
           if (i%3 == 0)
            return "blue";
           else
            return "red";
       })

    const xAxis =  d3.axisBottom(xScale);

    const xAxisDraw = svg
        .append('g')
        .attr("transform", "translate(" + 0 + "," + (height) + ")")
        .attr('class', 'x axis')
        .call(xAxis)

    const yAxis = d3.axisLeft(yScale).tickSize(0)    
    const yAxisDraw = svg
        .append('g')
        .attr('class', 'yaxis')
        .call(yAxis)

}

function EngineSizeBar(data){

    let highwayTotal = 0
    let cityTotal = 0

    dataArrayCity =  prepareBarChart3City(data)
    dataArrayHighway = prepareBarChart3Highway(data)
    
    console.log(dataArrayCity);
    console.log(dataArrayHighway);
    
    var margin = 70;
    var width = 500-2*margin;
    var height = 500-2*margin;
    
    var myMap = new Map()

    myMap.set("0-City", dataArrayCity[5].value)
    myMap.set("0-Hwy", dataArrayHighway[5].value)
    myMap.set("    ", 0)

    myMap.set("2-City", dataArrayCity[6].value)
    myMap.set("2-Hwy", dataArrayHighway[6].value)
    myMap.set("     ", 0)

    myMap.set("3-City", dataArrayCity[7].value)
    myMap.set("3-Hwy", dataArrayHighway[7].value)
    myMap.set("      ", 0)

    myMap.set("4-City", dataArrayCity[0].value)
    myMap.set("4-Hwy", dataArrayHighway[0].value)
    myMap.set("", 0)

    myMap.set("6-City", dataArrayCity[1].value)
    myMap.set("6-Hwy", dataArrayHighway[1].value)
    myMap.set(" ", 0)

    myMap.set("8-City", dataArrayCity[3].value)
    myMap.set("8-Hwy", dataArrayHighway[3].value)
    myMap.set("   ", 0)

    myMap.set("10-City", dataArrayCity[4].value)
    myMap.set("10-Hwy", dataArrayHighway[4].value)
    myMap.set("          ", 0)

    myMap.set("12-City", dataArrayCity[2].value)
    myMap.set("12-Hwy", dataArrayHighway[2].value)

    console.log(myMap)

    dataArray =  Array.from(myMap, d => ({Fuel:d[0], MPG:d[1]}));

    const xMax =  d3.max(dataArray, d => d.MPG)

    const xScale =  d3.scaleLinear()
                .domain([10,xMax])
                .range([0,width]);


    const yScale =  d3.scaleBand()
                .domain(dataArray.map(d => d.Fuel))
                .rangeRound([0,height])
                .paddingInner(0.25);

    //const svg = d3.select('.chart-container')
    //    .append('svg')
    //    .attr('width', width + 2*margin)
    //    .attr('height', height + 2*margin)
    //    .append('g')

     
    svg = d3.select('.chart-container')
        .selectAll('svg')
        .attr('width', width + 2*margin)
        .attr('height', height + 2*margin)
        .append('g') 

    const header = svg
        .append('g')
        .attr('class', 'bar-header')
        .attr("transform", "translate(" + margin/2 + "," + -1*margin/2 + ")")

        .append('text');

    header.append('tspan').text('MPG by Engine Size (Cylinders)')

    svg
       .attr("transform", "translate(" + margin + "," + margin + ")")
       .selectAll('rect')
       .data(dataArray)
       .enter()
       .append('rect')
       .attr('class', 'bar')
       .attr('y',d => yScale(d.Fuel))
       .attr('width', d => xScale(d.MPG))
       .attr('height',yScale.bandwidth())
       .style('fill', function(d,i){
           if (i%3 == 0)
            return "blue";
           else
            return "red";
       })

    const xAxis =  d3.axisBottom(xScale);

    const xAxisDraw = svg
        .append('g')
        .attr("transform", "translate(" + 0 + "," + (height) + ")")
        .attr('class', 'x axis')
        .call(xAxis)

    const yAxis = d3.axisLeft(yScale).tickSize(0)    
    const yAxisDraw = svg
        .append('g')
        .attr('class', 'yaxis')
        .call(yAxis)

}


