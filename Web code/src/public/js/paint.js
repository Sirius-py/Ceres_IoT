const temp = document.getElementById("tempGrafic").getContext("2d");
const soil = document.getElementById("humSoil").getContext("2d");
const environment = document.getElementById("humEnv").getContext("2d");
const water1 = document.getElementById("cylGauge1").getContext("2d");
const water2 = document.getElementById("cylGauge2").getContext("2d");
var gradientStroke = temp.createLinearGradient(0, 230, 0, 50);
gradientStroke.addColorStop(1, "rgba(66,134,121,0.15)");
gradientStroke.addColorStop(0.4, "rgba(66,134,121,0.0)"); //green colors
gradientStroke.addColorStop(0, "rgba(66,134,121,0)"); //green colors

const tankWater1 = new Chart(water1, {
  type: "bar",
  data: {
    labels: [""],
    datasets: [
      {
        label: "Nivel de agua",
        borderColor: "rgb(0, 255, 255)",
        backgroundColor: "rgba(0, 255, 255, 0.5)",
        data: [],
        borderWidth: 1,
        categoryPercentage: 1,
        barPercentage: 1,
        borderRadius: 5,
      },
    ],
  },
  options: {
    maintainAspectRatio: false,
    scaleFontColor: "#fff",
    plugins:{
      legend: {
      display: false,
    }}
    ,
    scales: {
      x: {
        display:false,
      },
      y: {
        suggestedMax: 100,
      },
    },
  },
});
const tankWater2 = new Chart(water2, {
  type: "bar",
  data: {
    labels: [""],
    datasets: [
      {
        label: "Nivel de agua",
        borderColor: "rgb(0, 255, 255)",
        backgroundColor: "rgba(0, 255, 255, 0.5)",
        data: [],
        borderWidth: 1,
        categoryPercentage: 1,
        barPercentage: 1,
        borderRadius: 5,
      },
    ],
  },
  options: {
    maintainAspectRatio: false,
    scaleFontColor: "#fff",
    plugins:{
      legend: {
      display: false,
    }}
    ,
    scales: {
      x: {
        display:false,
      },
      y: {
        suggestedMax: 100,
      },
    },
  },
});



const humiditySoil = new Chart(soil, {
  type: "doughnut",
    data:{
      labels: ["mon", "tue", "wed"],
      datasets: [
        {
          data: [20, 30, 50],
          label: "humedad %",
          backgroundColor: ["red", "yellow", "green"],
          borderColor: "#1d2636",
          borderWidth: 2,
          needleValue: 0,
          circumference: 180,
          rotation: 270,
          cutout: "90%",
          borderRadius: 2,
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          yAlign: "bottom",
          displayColors: false,
          callbacks: {
            label: function (tooltipItem, data, value) {
              const tracker = tooltipItem.dataset.needleValue;
              return `Tracker Score: ${tracker} %`;
            },
          },
        },
      },
    },
    plugins: [{
      afterDatasetDraw(chart, args, options) {
        const {
          ctx,
          config,
          chartArea: { top, bottom, left, right, width, height },
        } = chart;
        ctx.save();
        //console.log(ctx);
        const needleValue = humiditySoil.data.datasets[0].needleValue;
        const dataTotal = humiditySoil.data.datasets[0].data.reduce((a, b) => a + b, 0);
        const angle = Math.PI + (1 / dataTotal) * needleValue * Math.PI;
    
        const cx = width / 2;
        const cy = chart._metasets[0].data[0].y;
    
        // needle
        ctx.translate(cx, cy);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(0, -2);
        ctx.lineTo(width/2, 0);
        ctx.lineTo(0, 2);
        ctx.fillStyle = "#00d6b4";
        ctx.fill();
    
        // needle dot
        ctx.translate(-cx, -cy);
        ctx.beginPath();
        ctx.arc(cx, cy, 5, 0, 10);
        ctx.fill();
        ctx.restore();
    
        //needle number
        ctx.font = "20px Helvetica";
        ctx.fillStyle = "#00d6b4";
        ctx.fillText(needleValue + "%", cx, cy + 25);
        ctx.textAlign = "center";
        ctx.restore();
      },
    }]
}
);

const environmentHumedity = new Chart(environment, {
    type: "doughnut",
    data:{
      labels: ["mon", "tue", "wed"],
      datasets: [
        {
          data: [20, 30, 50],
          label: "humedad %",
          backgroundColor: ["red", "yellow", "green"],
          borderColor: "#1d2636",
          borderWidth: 2,
          needleValue: 0,
          circumference: 180,
          rotation: 270,
          cutout: "90%",
          borderRadius: 2,
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          yAlign: "bottom",
          displayColors: false,
          callbacks: {
            label: function (tooltipItem, data, value) {
              const tracker = tooltipItem.dataset.needleValue;
              return `Tracker Score: ${tracker} %`;
            },
          },
        },
      },
    },
    plugins: [{
      /* id: "gaugeNeedle1", */
      afterDatasetDraw(chart, args, options) {
        const {
          ctx,
          config,
          chartArea: { top, bottom, left, right, width, height },
        } = chart;
        ctx.save();
        //console.log(ctx);
        const needleValue = environmentHumedity.data.datasets[0].needleValue;
        const dataTotal = environmentHumedity.data.datasets[0].data.reduce((a, b) => a + b, 0);
        const angle = Math.PI + (1 / dataTotal) * needleValue * Math.PI;
    
        const cx = width / 2;
        const cy = chart._metasets[0].data[0].y;
    
        // needle
        ctx.translate(cx, cy);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(0, -2);
        ctx.lineTo(width/2, 0);
        ctx.lineTo(0, 2);
        ctx.fillStyle = "#00d6b4";
        ctx.fill();
    
        // needle dot
        ctx.translate(-cx, -cy);
        ctx.beginPath();
        ctx.arc(cx, cy, 5, 0, 10);
        ctx.fill();
        ctx.restore();
    
        //needle number
        ctx.font = "20px Helvetica";
        ctx.fillStyle = "#00d6b4";
        ctx.fillText(needleValue + "%", cx, cy + 25);
        ctx.textAlign = "center";
        ctx.restore();
      },
    }]
});

/* const environmentHumedity = new Chart(environment, {
  type: "doughnut",
  data: {
    labels: [],
    datasets: [
      {
        data: [],
        label: "humedad %",
        backgroundColor: ["green", gradientStroke],
        borderColor: "#00d6b4",
        borderWidth: 2,
        borderDash: [],
        borderDashOffset: 0.0,
      },
    ],
  },
  options: {
    legend: {
      display: true,
    },
    circumference: 180,
    rotation: -90,
    cutout: 90,
  },
}); */
const temperatureGrafic = new Chart(temp, {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        label: "Temperatura Cº",
        data: [],
        //backgroundColor: styles.color.solids[3],
        //borderColor: styles.color.solids[5],
        backgroundColor: gradientStroke,
        borderColor: "#00ab8e",
        borderWidth: 2,
        borderDash: [],
        borderDashOffset: 0.0,
        pointBackgroundColor: "#00d6b4",
        pointBorderColor: "rgba(255,255,255,0)",
        pointHoverBackgroundColor: "#00d6b4",
        pointBorderWidth: 20,
        pointHoverRadius: 4,
        pointHoverBorderWidth: 15,
        pointRadius: 4,
        fill: {
          target: "origin",
          above: gradientStroke,
          below: gradientStroke,
        },
      },
    ],
  },
  options: {
    plugins: {
      legend: {
        display: false,
      }
    },
    maintainAspectRatio: false,
    scaleFontColor: "#fff",
    scales: {
      y: {
        /* suggestedMin: 50,
        suggestedMax: 55, */
        ticks: {
          display: true,
        },
      },
      x: {
        suggestedMin: 0,
        suggestedMax: 55,
        ticks: {
          display: true,
        },
      },
    },
  },
});