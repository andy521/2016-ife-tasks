/* 数据格式演示
var aqiSourceData = {
  "北京": {
    "2016-01-01": 10,
    "2016-01-02": 10,
    "2016-01-03": 10,
    "2016-01-04": 10
  }
};
*/

// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
  var y = dat.getFullYear();
  var m = dat.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  var d = dat.getDate();
  d = d < 10 ? '0' + d : d;
  return y + '-' + m + '-' + d;
}
function randomBuildData(seed) {
  var returnData = {};
  var dat = new Date("2016-01-01");
  var datStr = ''
  for (var i = 1; i < 92; i++) {
    datStr = getDateStr(dat);
    returnData[datStr] = Math.ceil(Math.random() * seed);
    dat.setDate(dat.getDate() + 1);
  }
  return returnData;
}

var aqiSourceData = {
  "北京": randomBuildData(500),
  "上海": randomBuildData(300),
  "广州": randomBuildData(200),
  "深圳": randomBuildData(100),
  "成都": randomBuildData(300),
  "西安": randomBuildData(500),
  "福州": randomBuildData(100),
  "厦门": randomBuildData(100),
  "沈阳": randomBuildData(500)
};
// 用于渲染图表的数据
var chartData = {};

// 记录当前页面的表单选项
var pageState = {
  nowSelectCity: -1,
  nowGraTime: "day"
}

// 随机颜色
function randomColor(){
  var color = "#";
  for(var i=0; i < 6; i++){
    color += "0123456789abcdef"[Math.floor(Math.random()*16)];
  }
  return color;
}
/**
 * 渲染图表
 */
var intervalId; //逐渐改变高度 的定时器
function renderChart() {
  var aqiChart = document.querySelector(".aqi-chart-wrap");
  var formGraTime = document.querySelectorAll("input[name='gra-time']");
  var citySelect = document.querySelector("#city-select");
  var aqiTitle = document.getElementById("aqi-title");
  var size = 0;
  var div = "";
  var divWidth = 0;
  var divHeight = [];
  var transf = 0; //逐渐改变高度 的计数

 
  for(var time in chartData){
    // chartData[time] = aqiSourceData[citySelect.value][time];
    size++;
    div += "<div title='日期：" + time + "&#13;数据：" + chartData[time] + "'><span>" + chartData[time] + "</span></div>";
    divHeight.push(chartData[time]);
  }
  divWidth = (aqiChart.offsetWidth / 2) / size;
  aqiChart.innerHTML = div;
  switch(pageState.nowGraTime){
    case "day":
      aqiTitle.innerHTML = citySelect.options[pageState.nowSelectCity].value + "2016-01-01~2016-03-31每日空气质量指数";
      break;
    case "week":
      aqiTitle.innerHTML = citySelect.options[pageState.nowSelectCity].innerHTML + "2016-01-01~2016-03-31每周空气质量指数";
      break;
    case "month":
      aqiTitle.innerHTML = citySelect.value + "2016-01-01~2016-03-31每月空气质量指数";
      break;
  }
  
  var aqiChartDiv = aqiChart.getElementsByTagName("div");
  setTimeout(function(){
    for(var j=0,divLen=aqiChartDiv.length; j<divLen; j++){
      aqiChartDiv[j].style.maxWidth = divWidth + "px";
      //aqiChartDiv[j].style.height = divHeight[j] + "px";
      aqiChartDiv[j].style.backgroundColor = randomColor();
    }
  },50); 
  //aqiChart.onclick = function(){clearInterval(intervalId)};
  clearInterval(intervalId);
  //逐渐改变高度
  intervalId = setInterval(function(){  
    aqiChartDiv[transf].style.height = divHeight[transf] + "px";
    aqiChartDiv[transf].style.transform = "translate(0,0)";
    transf++;
    if(transf >= size){
      clearInterval(intervalId);
    }
  },25);
}
/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange(target) {
  // 确定是否选项发生了变化 
      if(target.checked){
        if(pageState.nowGraTime != target.value){
          pageState.nowGraTime = target.value;
          initAqiChartData();
          renderChart();
        }
      }
  // 设置对应数据

  // 调用图表渲染函数
}
/**
 * select发生变化时的处理函数
 */
function citySelectChange() {
  // 确定是否选项发生了变化 
  var citySelect = document.querySelector("#city-select");
  console.log(citySelect.options[citySelect.selectedIndex].value);
  if(pageState.nowSelectCity != citySelect.selectedIndex){
    pageState.nowSelectCity = citySelect.selectedIndex;
    initAqiChartData();
    renderChart();
  }
  // 设置对应数据

  // 调用图表渲染函数
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
  var formGraTime = document.getElementById("form-gra-time");
  formGraTime.addEventListener("click",function(event){
    if(event.target.nodeName == "LABEL" || event.target.nodeName == "INPUT"){
      graTimeChange(event.target);
    }
  });
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
  // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
  var citySelect = document.querySelector("#city-select");
  var optionStr = "";
  for(var city in aqiSourceData){
    optionStr += "<option>" + city + "</option>";
  }
  citySelect.innerHTML = optionStr;
  // 给select设置事件，当选项发生变化时调用函数citySelectChange
  citySelect.addEventListener("change",function(){
    citySelectChange();
  });
}

/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
  // 将原始的源数据处理成图表需要的数据格式
  // 处理好的数据存到 chartData 中
  var citySelect = document.querySelector("#city-select");
  var weekDataArr = [];
  var weekDataRem = [];
  var weekDataRemNum = 0;
  var weekDataStr = 0;
  var weekNum = 0;

  console.log(pageState.nowGraTime);

  //日 数据
  (function(){
    if(pageState.nowGraTime == "day"){
      chartData = {};
      if(pageState.nowSelectCity != (-1)){
        for(var time in aqiSourceData[citySelect.options[pageState.nowSelectCity].value]){
          chartData[time] = aqiSourceData[citySelect.options[pageState.nowSelectCity].value][time];
        }
        console.log(chartData);
      }
    }
  })();

  //周 数据
  (function(){
    if(pageState.nowGraTime == "week"){
      chartData = {};
      if(pageState.nowSelectCity != (-1)){
        for(var time in aqiSourceData[citySelect.options[pageState.nowSelectCity].value]){
          weekDataArr.push(aqiSourceData[citySelect.options[pageState.nowSelectCity].value][time]);
          weekDataRem.push(aqiSourceData[citySelect.options[pageState.nowSelectCity].value][time]);
          if(weekDataArr.length == 7){
            for(var i=0; i < weekDataArr.length; i++){
              weekDataStr += weekDataArr[i];
            }
            weekNum++;
            chartData["第" + weekNum + "周"] = Math.round(weekDataStr/7);
            weekDataArr = [];
            weekDataStr = 0;
          }
        }
        weekDataRem.splice(0,weekDataRem.length - (weekDataRem.length % 7));
        if(weekDataRem.length != 0){
          for(var j=0; j<weekDataRem.length; j++){
            weekDataRemNum += weekDataRem[i];
          }
          chartData["第" + (weekNum+1) + "周"] = weekDataRemNum/weekDataRem.length;
        }
      }
      console.log(chartData);
      console.log(weekDataRem.length%7);
    }
  })();

  //月 数据
  (function(){
    if(pageState.nowGraTime == "month"){
      chartData = {};
      if(pageState.nowSelectCity != (-1)){
        for(var time in aqiSourceData[citySelect.options[pageState.nowSelectCity].value]){
          weekDataArr.push(aqiSourceData[citySelect.options[pageState.nowSelectCity].value][time]);
          weekDataRem.push(aqiSourceData[citySelect.options[pageState.nowSelectCity].value][time]);
          if(weekDataArr.length == 30){
            for(var i=0; i < weekDataArr.length; i++){
              weekDataStr += weekDataArr[i];
            }
            weekNum++;
            chartData["第" + weekNum + "月"] = Math.round(weekDataStr/30);
            weekDataArr = [];
            weekDataStr = 0;
          }
        }
        weekDataRem.splice(0,weekDataRem.length - (weekDataRem.length % 30));
        if(weekDataRem.length != 0){
          for(var j=0; j<weekDataRem.length; j++){
            weekDataRemNum += weekDataRem[j];
          }
          chartData["第" + (weekNum+1) + "月"] = weekDataRemNum/weekDataRem.length;
        }
      }
      console.log(chartData);
      console.log(weekDataRemNum);
    }
  })();
}

/**
 * 初始化函数
 */
function init() {
  initGraTimeForm()
  initCitySelector();
  initAqiChartData();
}

init();
