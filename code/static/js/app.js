// I divided this task in to three::
// 1. Create Demographic Info from the metadata 
// 2. Create the drop down menu from 'names' Data
// 3. Create trace from the smaples Data

const url = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json'

// 1. Create Demographic Info from the metaddata 
function demogInfo(id) {
    d3.json(url).then((data)=> {
        let metadata = data.metadata;
        let filteredDemogData = metadata.filter(object =>
            object.id == id)[0];
        let panel = d3.select('#sample-metadata');
        // clear any existing metadata
        panel.html('');
        Object.entries(filteredDemogData).forEach(([key, value]) => {
            panel.append('h6').text(`${key}: ${value}`);
        })
    })
};

// 2. Create the drop down menu from 'names' Data
function init() {
    let dropDownMenu = d3.select('#selDataset');
    d3.json(url).then((data)=> {
        let names = data.names;
        names.forEach(id => {
            dropDownMenu.append('option').text(id).property("value",id);
        })
        // refresh the dropdownmenu
        demogInfo(names[0]);
        traces(names[0])
       
    });
}
init();

// 3. Create traces from the samples Data
function traces(id) {
    d3.json(url).then((data) =>{
        let samples = data.samples;
        let filteredSampleData= samples.filter(sample => sample.id === id)[0];
        // descending order
        let sample_values = filteredSampleData.sample_values.slice(0, 10).reverse();
        let otu_ids = filteredSampleData.otu_ids.slice(0, 10).reverse();
        let otu_labels = filteredSampleData.otu_labels.slice(0, 10).reverse();
        // Plotting 
        let barTrace = {
            x: sample_values,
            y: otu_ids.map(id => 'OTU ' + id),
            name: otu_labels,
            type: 'bar',
            orientation: 'h'
        };
        let barLayout = {
            title: `Top 10 OTUs for name:${id}`,
            xaxis: { title: 'Sample Values' },
            yaxis: { title: 'OTU ID' }
        };
        Plotly.newPlot('bar', [barTrace], barLayout);

        let bubbleTrace = {
            x: filteredSampleData.otu_ids,
            y: filteredSampleData.sample_values,
            mode: 'markers',
            marker: {
                size: filteredSampleData.sample_values,
                color: filteredSampleData.otu_ids,
                colorscale: 'Mint'
            },
            text: filteredSampleData.otu_labels,
        };
        let bubbleLayout = {
            xaxis: { title: 'OTU ID' },
            yaxis: { title: 'Sample Values' }
        };
        Plotly.newPlot('bubble', [bubbleTrace], bubbleLayout);
    })
};

// Refresh the plot and the demographic info upon id change
function optionChanged(id) {
    traces(id);
    demogInfo(id);
    
};




