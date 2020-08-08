//Selecting the dropdown option for later
let dropMenu = d3.select("#selDataset");

//Filling in the dropdown section with all availble Test Subject IDs
d3.json("static/data/samples.json").then((data)=>{
    data.names.forEach((testSubject)=>{
        dropMenu.append("option").text(testSubject)
    })
    //start up the page on subject 940
    demographicUpdate(940)
    subjectCharts(940)
});

//Updating with intial dashboard on dropdown update
function optionChanged(testSubject){
        demographicUpdate(testSubject)
        subjectCharts(testSubject)
};

let demographicUpdate = function(testSubject){
    d3.json("static/data/samples.json").then((data)=>{
        subjectData = data.metadata.filter(sampleid => sampleid.id == testSubject);
        selectedSubject = subjectData[0] 
        console.log(selectedSubject)
        let subjectDemo = d3.select("#sample-metadata")

        //Clears section for new data
        subjectDemo.html("")
        for (const [key, value] of Object.entries(selectedSubject)){
            dataEntry =  key + ': ' + value;
            subjectDemo.append("p").text(dataEntry)
            // console.log(dataEntry)
        }
    });
};
//Function for generating bar chart and bubble chart
let subjectCharts = function(testSubject){
    d3.json("static/data/samples.json").then((data)=>{
        sampleData = data.samples.filter(sampleid => sampleid.id == testSubject);
        //Gathering data points for charts
        let sampleValues = sampleData[0].sample_values;
        let otuIds = sampleData[0].otu_ids;
        let otuLabels = sampleData[0].otu_labels;

        //Placing data points into an object for the bar chart and the bubble chart
        let barDataset = [{
            type: 'bar',
            x: sampleValues.slice(0,10).reverse(),
            y: otuIds.slice(0,10).map(otuID => `OTU ${otuID}`).reverse(),
            text: otuLabels.slice(0,10).reverse(),
            orientation: 'h'
        }];
        let bubbleDataset = [{
            x: otuIds,
            y: sampleValues,
            text: otuLabels,
            mode: 'markers',
            marker: {
                color: otuIds,
                size:sampleValues
            }
        }]
        let layout = {
            showlegend: false
        }

        console.log(otuIds)
        console.log(sampleValues)

        //Making the barchart
        Plotly.newPlot('bar', barDataset);
        //Making the bubble chart
        Plotly.newPlot('bubble', bubbleDataset, layout)


    });
}