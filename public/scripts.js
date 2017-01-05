var chart;
var scoreChart;
var data = {
    labels: [
        "Negative",
        "Positive",
        "Neutral"
    ],
    datasets: [
        {
            data: [0, 0, 0],
            backgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#f9f9f9"
            ],
            hoverBackgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#f9f9f9"
            ]
    }]
};
var scoreData = {
    labels: [
        "Negative Score",
        "Positive Score"
    ],
    datasets: [
        {
            data: [0, 0],
            backgroundColor: [
                "#FF6384",
                "#36A2EB"
            ],
            hoverBackgroundColor: [
                "#FF6384",
                "#36A2EB"
            ]
    }]
};

//connect to the server
var socket = io.connect();

socket.on('update', function (data) {
    console.log(data);
    chart.data.datasets[0].data[0] = data.negative;
    chart.data.datasets[0].data[1] = data.positive;
    chart.data.datasets[0].data[2] = data.neutral;
    scoreChart.data.datasets[0].data[0] = data.scoreNeg;
    scoreChart.data.datasets[0].data[1] = data.scorePos;
    document.getElementById("chartPos").innerHTML= data.positive + " positive tweets (" + data.posPercent + "%)";
    document.getElementById("chartNeg").innerHTML= data.negative + " negative tweets (" + data.negPercent + "%)";
    document.getElementById("chartNeu").innerHTML= data.neutral + " neutral tweets (" + data.neuPercent + "%)";
    document.getElementById("scoreChartPos").innerHTML="Positive Points: " + data.scorePos +" (" + data.scorePosPercent + "%)";
    document.getElementById("scoreChartNeg").innerHTML="Negative Points: " + data.scoreNeg + " (" + data.scoreNegPercent + "%)";
    var currentKeywords = document.getElementById("tracking").innerHTML;
    	document.getElementById("resultText").style.color = 'white';
    if(data.scorePosPercent >= 85){
    	document.getElementById("resultText").innerHTML = "Twitter is overwhelmingly positive about " + currentKeywords;
    	document.getElementById("resultbox").style.backgroundColor = '#36A2EB';
    } else if (85 > data.scorePosPercent && data.scorePosPercent >= 75 ){
    	document.getElementById("resultText").innerHTML = "Twitter is very positive about " + currentKeywords;
    	document.getElementById("resultbox").style.backgroundColor = '#36A2EB';
    } else if (75 > data.scorePosPercent && data.scorePosPercent >= 60 ){
    	document.getElementById("resultText").innerHTML = "Twitter is positive about " + currentKeywords;
    	document.getElementById("resultbox").style.backgroundColor = '#36A2EB';
    } else if (60 > data.scorePosPercent && data.scorePosPercent >= 55 ){
    	document.getElementById("resultText").innerHTML = "Twitter is slightly positive about " + currentKeywords;
    	document.getElementById("resultbox").style.backgroundColor = '#36A2EB';
    } else if (55 > data.scorePosPercent && data.scorePosPercent >= 45 ){
    	document.getElementById("resultText").innerHTML = "Twitter is mixed about " + currentKeywords;
    	document.getElementById("resultbox").style.backgroundColor = '#F8C72C';
    } else if (45 > data.scorePosPercent && data.scorePosPercent >= 40 ){
    	document.getElementById("resultText").innerHTML = "Twitter is slightly negative about " + currentKeywords;
    	document.getElementById("resultbox").style.backgroundColor = '#FF6384';
    } else if (40 > data.scorePosPercent && data.scorePosPercent >= 25 ){
    	document.getElementById("resultText").innerHTML = "Twitter is negative about " + currentKeywords;
    	document.getElementById("resultbox").style.backgroundColor = '#FF6384';
    } else if (25 > data.scorePosPercent && data.scorePosPercent >= 15 ){
    	document.getElementById("resultText").innerHTML = "Twitter is very negative about " + currentKeywords;
    	document.getElementById("resultbox").style.backgroundColor = '#FF6384';
    } else if (15 > data.scorePosPercent){
    	document.getElementById("resultText").innerHTML = "Twitter is overwhelmingly negative about " + currentKeywords;
    	document.getElementById("resultbox").style.backgroundColor = '#FF6384';
    }
    chart.update();
    scoreChart.update();
    socket.emit('my other event', { my: 'data' });
});

socket.on('currently tracking', function (data) {
    console.log(data);
    document.getElementById("tracking").innerHTML= data.keywords;
    chart.update();
    scoreChart.update();
});

function changeKeywords(){
	var keywords =  document.getElementById('change-keyword').value;
	socket.emit('change tracking', { keywords: keywords });
}



var ctx = document.getElementById('chart');

//initiatize tasty chart
chart = new Chart(ctx, {
    type: 'doughnut',
    data: data
});

var ctx = document.getElementById('scoreChart');

//initiatize tastier chart
	scoreChart = new Chart(ctx, {
    type: 'doughnut',
    data: scoreData
});