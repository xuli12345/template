$(function () {
  const baseURL = "http://120.78.218.93:7300/mock";
  //const baseURL = !$("#baseUrl").val() ? "" : $("#baseUrl").val();
  //const activityId = $("#activityId").val(); // 活动id
  //const userId = $("#userId").val(); //用户id



  //时间选择
  $("#star").datetimepicker({
    format: "YYYY-MM-DD ",
    locale: "zh-CN"
  });

  $("#end").datetimepicker({
    format: "YYYY-MM-DD",
    locale: "zh-CN"
  });

  $("#star").blur(function () {
    //获取值
    console.log($(this).val());
  });

  //init(activityId); //初始化

  // function init(activityId) {
  sex(activityId); //奖项消耗投入性别占比
  budget(activityId); //消费者扫码地址排名
  market() //销售收入性别占比
  getArea() //销售收入地区排名
  income() //销售收入数据总览

  // }

  $("#checkActivity").change(function() { //获取活动类型
    //获取活动类型
    let options = $("#checkActivity option:selected");
    let optionValue = options.val();
   
  });


  //
  // cityDropDown(activityId); // 城市选择框
  // var cityData;
  // //城市下拉框
  // function cityDropDown(id) {
  //   $.ajax({
  //     type: "post",
  //     url: baseURL + "/meter/getProvinceList",
  //     dataType: "json",
  //     async: false,
  //     data: {
  //       activityId: id
  //     },
  //     success: function(res) {
  //       console.log(res);
  //       if (res.code === 200) {
  //         cityData = res.data;
  //       }
  //     }
  //   });
  // }

  //选择框按省份排名
  // $("#provinceRanked").hsCheckData({
  //   isShowCheckBox: false,
  //   data: cityData,
  //   minCheck: 1
  // });

  $("#provinceRanked").on("DOMNodeInserted", function () {
    let province = $(this).text();
  });
  $("#province").on("DOMNodeInserted", function () {
    let province = $(this).text();
  });
  //销售收入数据总览
  function income() {
    $.ajax({
      type: "get",
      url: baseURL + "/5d46c1bad8bdb25bfb8b6b8b/api/income",
      data: {
        activityId: 23
      },
      dataType: "json",
      success: function (res) {

        if (res.code === 200) {
          let incomeData = res.data.list;
          let timeData = res.data.time
          let incomeChart = echarts.init(document.getElementById("income-chart"));
          option = {

            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'cross',
                label: {
                  backgroundColor: '#6a7985'
                }
              }
            },
            legend: {
              data: ['产品销售收入金额', '一物一码消耗量', '奖项投入'],
              textStyle: {
                color: "#23b7e5" // 图例文字颜色
              }
            },

            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: [{
              type: 'category',
              splitLine: {
                show: false
              }, //去除网格线
              boundaryGap: false,
              data: timeData,
              // min: 0,
              // max: 17.21,
              // interval: 50,
              axisLabel: {
                //修改y轴的字体颜色
                show: true,
                textStyle: {
                  color: "#fff"
                }
              }
            }],
            yAxis: [{
              type: 'value',
              splitLine: {
                show: false
              },
              axisLabel: {
                //修改y轴的字体颜色
                show: true,
                textStyle: {
                  color: "#fff"
                }
              }

            }],
            series: incomeData,
          };
          incomeChart.setOption(option);
        }
      }
    });
  }
  //奖项消耗投入性别占比
  function sex() {
    $.ajax({
      type: "get",
      url: baseURL + "/5d46c1bad8bdb25bfb8b6b8b/api/amount",
      dataType: "json",
      success: function (res) {
        if (res.code === 200) {
          let kantarData = res.data;
          let myChart = echarts.init(document.getElementById("sex"));
          option = {
            tooltip: {
              trigger: "item",
              formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            legend: {
              orient: "vertical",
              icon: "circle", //图标,
              x: "left",
              itemWidth: 10, //图标宽
              itemHeight: 10, //图标高
              itemGap: 5, //图标间距
              data: ["未知", "女性", "男性"],
              textStyle: {
                color: "#23b7e5"
              }
            },
            series: [{
              type: "pie",
              radius: ["50%", "70%"],
              avoidLabelOverlap: false,
              label: {
                normal: {
                  show: false,
                  position: "center"
                },
                emphasis: {
                  show: true,
                  textStyle: {
                    fontSize: "30",
                    fontWeight: "bold"
                  }
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              data: kantarData
            }]
          };
          myChart.setOption(option);
          //进度条
          var html = template("kantalTpl", {
            list: kantarData
          });
          $("#kantar")[0].innerHTML = html;
          let arr = [];
          for (const key in kantarData) {
            arr.push(kantarData[key].value);
            var sum = 0;
            for (let i = 0; i < arr.length; i++) {
              sum += arr[i];
            }
          }
          var num = arr[0] / sum;
          num = Number(num.toFixed(4)) * 100;
          $("#kantar .son")[0].style.width = num + "%";

          var num1 = arr[1] / sum;
          num1 = Number(num1.toFixed(4)) * 100;
          $("#kantar .son")[1].style.width = num1 + "%";

          var num2 = arr[2] / sum;
          num2 = Number(num2.toFixed(4)) * 100;
          $("#kantar .son")[2].style.width = num2 + "%";
        }
      }
    });
  }
  //消费者扫码地区排名
  function budget(activityId, province) {
    $.ajax({
      type: "post",
      url: baseURL + "/5d46c1bad8bdb25bfb8b6b8b/api/rankings",

      dataType: "json",
      data: {
        activityId: 23,
        province: province
      },
      success: function (res) {
        if (res.code === 200) {

          let list = res.data;
          let trHtml = "";
          $.each(list, function (index, item) {
            var cityHtml = "";
            if (province) {
              cityHtml = "<td>" + item.city + "</td>";
            } else {
              let provinceStr;
              if (item.province) {
                provinceStr = item.province;
              } else {
                provinceStr = "其他";
              }
              cityHtml = "<td>" + provinceStr + "</td>";
            }
            let ranking = Number(index) + 1;
            let ratio = Number(item.ratio) * 100;
            ratio = ratio.toFixed(2) + "%";
            trHtml +=
              '<tr class="list">' +
              " <td>" +
              '   <span class="first">' +
              ranking +
              "</span>" +
              " </td>" +
              cityHtml +
              " <td>" +
              item.count +
              "</td>" +
              " <td>" +
              ratio +
              "</td>" +
              "</tr>";
          });
          $(".bottom tbody")[0].innerHTML = trHtml;
        }
      }
    });
  }

  //销售收入性别占比
  function market() {
    $.ajax({
      type: "get",
      url: baseURL + "/5d46c1bad8bdb25bfb8b6b8b/api/market",
      dataType: "json",
      success: function (res) {
        if (res.code === 200) {
          let marketData = res.data;
          let myChart = echarts.init(document.getElementById("market-sex"));
          option = {
            tooltip: {
              trigger: "item",
              formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            legend: {
              orient: "vertical",
              icon: "circle", //图标,
              x: "left",
              itemWidth: 10, //图标宽
              itemHeight: 10, //图标高
              itemGap: 5, //图标间距
              data: ["未知", "女性", "男性"],
              textStyle: {
                color: "#23b7e5"
              }
            },
            series: [{
              type: "pie",
              radius: ["50%", "70%"],
              avoidLabelOverlap: false,
              label: {
                normal: {
                  show: false,
                  position: "center"
                },
                emphasis: {
                  show: true,
                  textStyle: {
                    fontSize: "30",
                    fontWeight: "bold"
                  }
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              data: marketData
            }]
          };
          myChart.setOption(option);
          //进度条
          var html = template("marketTpl", {
            list: marketData
          });
          $("#market")[0].innerHTML = html;
          let arr = [];
          for (const key in marketData) {
            arr.push(marketData[key].value);
            var sum = 0;
            for (let i = 0; i < arr.length; i++) {
              sum += arr[i];
            }
          }
          var num = arr[0] / sum;
          num = Number(num.toFixed(4)) * 100;
          $("#market .son")[0].style.width = num + "%";

          var num1 = arr[1] / sum;
          num1 = Number(num1.toFixed(4)) * 100;
          $("#market .son")[1].style.width = num1 + "%";

          var num2 = arr[2] / sum;
          num2 = Number(num2.toFixed(4)) * 100;
          $("#market .son")[2].style.width = num2 + "%";
        }
      }
    });
  }
  //销售收入地区排名
  function getArea(activityId,province) {
    $.ajax({
      type: "post",
      url: baseURL + "/5d46c1bad8bdb25bfb8b6b8b/api/getScanAreaRankingList",
      dataType: "json",
      data: {
        activityId: 23,
        province: province
      },
      success: function (res) {
        if (res.code === 200) {

          let list = res.data;
          let trHtml = "";
          $.each(list, function (index, item) {
            var cityHtml = "";
            if (province) {
              cityHtml = "<td>" + item.city + "</td>";
            } else {
              let provinceStr;
              if (item.province) {
                provinceStr = item.province;
              } else {
                provinceStr = "其他";
              }
              cityHtml = "<td>" + provinceStr + "</td>";
            }
            let ranking = Number(index) + 1;
            let ratio = Number(item.ratio) * 100;
            ratio = ratio.toFixed(2) + "%";
            trHtml +=
              '<tr class="list">' +
              " <td>" +
              '   <span class="first">' +
              ranking +
              "</span>" +
              " </td>" +
              cityHtml +
              " <td>" +
              item.count +
              "</td>" +
              " <td>" +
              ratio +
              "</td>" +
              "</tr>";
          });
          $(".regional-rankings tbody")[0].innerHTML = trHtml;
        }
      }
    });
  }



});