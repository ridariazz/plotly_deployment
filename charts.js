function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultSample = samples.filter(sampleObj => sampleObj.id == sample);
    console.log(resultSample); 

    //  5. Create a variable that holds the first sample in the array.
    var resultForSample = resultSample[0];
    console.log(resultForSample);

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    // otuIDs
    var otuIds = resultForSample.otu_ids
    var otuIdsSliced = otuIds.slice(0,10).map(otuId => `OTU ${otuId}`).reverse();
    console.log(otuIdsSliced)

    //otuLabels
    var otuLables = resultForSample.otu_labels;
    var otuLablesSliced = otuLables.slice(0,10).reverse();
    console.log(otuLablesSliced);

    //otuValues
    var sampleValues = resultForSample.sample_values;
    var sampleValuesSliced = sampleValues.slice(0,10).reverse();
    console.log(sampleValuesSliced);

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = [0,1,2,3,4,5,6,7,8,9,10];
    sortedTicks = yticks.sort((a,b) => b -a);

    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: sampleValuesSliced,
      y: otuIdsSliced,
      text: otuLablesSliced,
      type: "bar",
      orientation: 'h',
      marker: {
        color: 'rgb(158,202,225)',
        opacity: 0.8,}
    }];

    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      titlefont: {"size": 25},
      xaxis: {title: "Sample Value"}
    };
    
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);
  });
}