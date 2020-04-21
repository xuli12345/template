$(function () {
  const baseURL = "http://120.78.218.93:7300/mock"; //mock数据接口
  //const baseURL = !$("#baseUrl").val() ? "" : $("#baseUrl").val();
  //const activityId = $("#activityId").val(); // 活动id
  //const userId = $("#userId").val(); //用户id

  //init(activityId); //初始化
  //activityList(userId); //根据商户id获取商户活动列表

  // function init(activityId) {
  kantar(activityId); //消费者数据占比
  budget(activityId); //消费者扫码地址排名
  getCityValue(activityId); // 获取中国地图数据
  quantity(activityId); // 获取地图扫码记录总扫码量
  operator(activityId); //手机运营商占比
  mobile(activityId); //手机终端排名
  system(activityId); //手机操作系统占比
  prize(activityId); //活动奖品消耗数据
  activity(activityId); // 活动数据总览
  budgetConsume(activityId); //预算金额消耗数据
  qrcode(activityId); //二维码消耗数据
  trend(activityId); //活动数据每日走势
  activeMsg(activityId); // 活动基本信息
  time(activityId, 1); //消费者参与活动时间分布情况
  // }

  // $("#checkActivity").change(function() { //获取活动类型的值
  //   let options = $("#checkActivity option:selected");
  //   let optionValue = options.val();
  //   activityList(userId, optionValue); //根据商户id和活动类型重新获取商户活动列表
  // });

  // $("#selActivity").change(function() { //获取活动列表数据
  //   let options = $("#selActivity option:selected");
  //   let checkedValue = options.val(); 
  //   init(checkedValue);  //根据当前选中的活动列表数据重新渲染数据
  // });

  // function activityList(id, optionValue) {
  //   $.ajax({
  //     type: "get",
  //     url: baseURL + "/meter/queryByUserId",
  //     dataType: "json",
  //     data: {
  //       userId: id,
  //       type: optionValue
  //     },
  //     success: function(res) {
  //       console.log(res);
  //       if (res.code === 200) {
  //         let activityList = res.data;
  //         let activityHtml = template("actiTpl", { list: activityList });
  //         $("#selActivity")[0].innerHTML = activityHtml;
  //         $("#selActivity").val(activityId);
  //       }
  //     }
  //   });
  // }

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


  //城市选择框
  $("#cityDanXuan").hsCheckData({
    isShowCheckBox: false, //默认为false
    data: cityData,
    minCheck: 1
  });



  $("#cityDanXuan").on("DOMNodeInserted", function () {
    let city = $(this).text();
    $(".active-right .city").text(city);
    // activity(city);//活动数据总览
  });

  //选择框按省份排名
  $("#provinceRanked").hsCheckData({
    isShowCheckBox: false,
    data: cityData,
    minCheck: 1
  });

  $("#provinceRanked").on("DOMNodeInserted", function () {
    let province = $(this).text();
    budget(23, province);
  });

  //消费者数据占比
  function kantar(id) {
    $.ajax({
      type: "get",
      //   url: baseURL+"/meter/consumerSexPercentage",
      url: baseURL + "/5d46c1bad8bdb25bfb8b6b8b/api/option",
      data: {
        activityId: 23
      },
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
      // url: baseURL+"/meter/getScanAreaRankingList",
      dataType: "json",
      data: {
        activityId: 23,
        province: province
      },
      success: function (res) {
        if (res.code === 200) {
          let rankingData = res.data;
          // let budgethtml = template("budgetTpl", {
          //   list: rankingData
          // });
          // $(".bottom tbody")[0].innerHTML = budgethtml;

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

  // 获取中国地图数据
  function getCityValue(id) {
    $.ajax({
      type: "get",
      url: baseURL + "/5d46c1bad8bdb25bfb8b6b8b/api/cityVaule",
      // url:baseURL+'/meter/scanDistrictDistribution',
      dataType: "json",
      data: {
        activityId: 86
      },
      success: function (res) {
        if (res.code === 200) {
          let dataMap = res.data;
          const mapChart = echarts.init(document.getElementById("mapChart"));
          const mapChartOpt = {
            tooltip: {
              formatter: function (params, ticket, callback) {

                return (
                  params.seriesName +
                  "<br/>" +
                  params.name +
                  "：" +
                  params.value
                );
              }
            },

            toolbox: {
              show: true,
              orient: "vertical",
              left: "right",
              top: "center",
              feature: {
                dataView: {
                  readOnly: false
                },
                restore: {},
                saveAsImage: {}
              }
            },
            geo: {
              map: "china",
              roam: true, //开启鼠标缩放和漫游
              zoom: 0.5, //地图缩放级别
              selectedMode: "single",
              top: 10,
              bottom: 10,
              layoutCenter: ["50%", "50%"],
              label: {
                //字体颜色
                show: true,
                fontSize: 10,
                color: "#1d96bf"
              },
              itemStyle: {
                normal: {
                  borderWidth: 0.5, //区域边框宽度
                  borderColor: "#135294", //区域边框颜色
                  areaColor: "#061d33" //区域颜色
                },
                emphasis: {
                  //鼠标hover上去的颜色
                  borderWidth: 0.5,
                  borderColor: "#135294",
                  areaColor: "#115191" //区域颜色
                }
              }
            },
            series: [{
              name: "扫码数据",
              type: "map",
              mapType: "china",
              data: dataMap,
              geoIndex: 0
            }]
          };
          mapChart.setOption(mapChartOpt);
          mapChart.on('mouseover', echartsMapOver);//地图鼠标移入事件
        }
      }

    });

    function echartsMapOver(params) { //地图移入事件回调
      console.log(params)
      $("#totalNum").text(params.data.name + params.data.value)

    };

  }

  // 获取地图扫码记录总扫码量
  function quantity(id) {
    $.ajax({
      type: "get",
      url: baseURL + "/5d46c1bad8bdb25bfb8b6b8b/api/quantity",
      // url:baseURL+"/meter/allScanQuantity",
      dataType: "json",
      data: {
        activityId: 24
      },
      success: function (res) {
        $(".sum .num").text(res.data.totalCode);
        $(".today .num").text(res.data.todayCode);
        $(".yesterday .num").text(res.data.yesterdayCode);
        $(".seven-days .num").text(res.data.sevenCode);
        $(".month .num").text(res.data.monthCode);
      }
    });
  }

  // 手机运营商占比
  function operator(id) {
    $.ajax({
      type: "get",
      url: baseURL + "/5d46c1bad8bdb25bfb8b6b8b/api/operator",
      // url: "http://192.172.56.133:8091/meter/cellPhoneCarrier",
      dataType: "json",
      data: {
        activityId: 23
      },
      success: function (res) {
        if (res.code === 200) {
          operatorData = res.data;
          let operatorChart = echarts.init(document.getElementById("operator"));
          let operatorOption = {
            tooltip: {
              // 提示框设置
              trigger: "item",
              formatter: function (params, ticket, callback) {
                console.log(params)
              },

            },
            legend: {
              orient: "vertical",
              x: "left",
              itemWidth: 10, //图标宽
              itemHeight: 10, //图标高
              itemGap: 5, //图标间距
              data: ["电信", "联通", "移动", "未知"],
              icon: "circle", //图标,
              textStyle: {
                // 图例文字颜色
                color: "#23b7e5"
              }
            },
            title: {
              textStyle: {
                color: "#1e81c1",
                fontSize: 40
              }
            },
            series: [{
              type: "pie",
              radius: ["50%", "70%"], // 设置环形饼状图， 第一个百分数设置内圈大小，第二个百分数设置外圈大小
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
              data: [],
              // 设置值域的那指向线
              labelLine: {
                normal: {
                  show: false // show设置线是否显示，默认为true，可选值：true ¦ false
                }
              }
            }]
          };
          operatorOption.series[0].data = operatorData;
          operatorChart.setOption(operatorOption);
          //进度条
          let operatorhtml = template("operatorTpl", {
            list: operatorData
          });
          $("#operator-pro")[0].innerHTML = operatorhtml;
          let arr1 = [];
          for (const key in operatorData) {
            arr1.push(operatorData[key].value);
            var sum1 = 0;
            for (let i = 0; i < arr1.length; i++) {
              sum1 += arr1[i];
            }
          }
          var num3 = arr1[0] / sum1;
          num3 = Number(num3.toFixed(4)) * 100;
          $("#operator-pro .son")[0].style.width = num3 + "%";

          var num4 = arr1[1] / sum1;
          num4 = Number(num4.toFixed(4)) * 100;
          $("#operator-pro .son")[1].style.width = num4 + "%";

          var num5 = arr1[2] / sum1;
          num5 = Number(num5.toFixed(4)) * 100;
          $("#operator-pro .son")[2].style.width = num5 + "%";

          var num8 = arr1[3] / sum1;
          num8 = Number(num8.toFixed(4)) * 100;
          $("#operator-pro .son")[3].style.width = num8 + "%";
        }
      }
    });
  }

  //手机终端排名
  function mobile(id) {

    $.ajax({
      type: "get",
      url: baseURL + "/5d46c1bad8bdb25bfb8b6b8b/api/mobile/brand",
      dataType: "json",
      // data: {
      //   id: id
      // },
      success: function (res) {
        if (res.code === 200) {
          let mobileData = res.data.list;
          let yaxisData = res.data.brand;
          let mobileChart = echarts.init(
            document.getElementById("mobileRanking")
          );
          mobileOption = {
            title: {
              text: "手机终端排名",
              textStyle: {
                // 修改标签颜色
                color: "#c6e4ff",
                fontSize: 18,
                fontWeight: 400
              }
            },
            tooltip: {
              trigger: "axis",
              axisPointer: {
                type: "shadow"
              }
            },
            legend: {
              show: false, //去掉默认的title
              textStyle: {
                color: "#23b7e5"
              }
            },
            grid: {
              left: "2%",
              right: "4%",
              bottom: "2%",
              containLabel: true
            },
            xAxis: {
              type: "value",
              min: 0,
              max: 6000,
              axisLabel: {
                //修改x轴的字体颜色
                show: true,
                textStyle: {
                  color: "#fff"
                }
              }
            },
            yAxis: {
              type: "category",
              data: yaxisData,
              axisLabel: {
                //修改y轴的字体颜色
                show: true,
                textStyle: {
                  color: "#fff"
                }
              }
            },
            series: {
              type: "bar",
              data: mobileData,
              barWidth: 10,
              itemStyle: {
                color: "#23b7e5"
              }
            }
          };
          mobileChart.setOption(mobileOption);
        }
      }
    });
  }

  //手机终端品牌
  $(".phone-brand .brand").on("click", function () {
    mobile();
    $(this)
      .addClass("current")
      .siblings()
      .removeClass("current");
  });
  //手机终端机型
  $(".phone-brand .mobile-type").on("click", function () {
    $.ajax({
      type: "get",
      url: baseURL + "/5d46c1bad8bdb25bfb8b6b8b/api/mobile/type",
      dataType: "json",
      // data: {
      //   id: id
      // },
      success: function (res) {
        if (res.code === 200) {
          let typeData = res.data.list;
          let yaxisType = res.data.type;
          let mobileType = echarts.init(
            document.getElementById("mobileRanking")
          );
          typeOption = {
            title: {
              text: "手机终端排名",
              textStyle: {
                // 修改标签颜色
                color: "#C6E4FF"
              }
            },
            tooltip: {
              trigger: "axis",
              axisPointer: {
                type: "shadow"
              }
            },
            legend: {
              show: false, //去掉默认的title
              textStyle: {
                color: "#23b7e5"
              }
            },
            grid: {
              left: "2%",
              right: "4%",
              bottom: "2%",
              containLabel: true
            },
            xAxis: {
              type: "value",
              min: 0,
              max: 6000,
              axisLabel: {
                //修改x轴的字体颜色
                show: true,
                textStyle: {
                  color: "#fff"
                }
              }
            },
            yAxis: {
              type: "category",
              data: yaxisType,
              axisLabel: {
                //修改y轴的字体颜色
                show: true,
                textStyle: {
                  color: "#fff"
                }
              }
            },
            series: {
              type: "bar",
              data: typeData,
              barWidth: 10,
              itemStyle: {
                color: "#48b2ba"
              }
            }
          };
          mobileType.setOption(typeOption);
        }
      }
    });
    $(this)
      .addClass("current")
      .siblings()
      .removeClass("current");
  });

  //手机操作系统
  function system(id) {
    $.ajax({
      type: "get",
      url: baseURL + "/5d46c1bad8bdb25bfb8b6b8b/api/system",
      // url: baseURL + "/meter/mobileOperatingSystem",
      dataType: "json",
      data: {
        activityId: 23
      },
      success: function (res) {
        if (res.code === 200) {
          let systemData = res.data;
          let systemChart = echarts.init(document.getElementById("system"));
          systemOption = {
            tooltip: {
              // 提示框设置
              trigger: "item",
              formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            legend: {
              itemWidth: 10, //图标宽
              itemHeight: 10, //图标高
              itemGap: 5, //图标间距
              orient: "vertical",
              x: "left",

              data: ["未知", "安卓", "IOS"],
              icon: "circle", //图标,
              textStyle: {
                color: "#23b7e5"
              }
            },
            series: [{
              type: "pie",
              radius: ["50%", "70%"], // 设置环形饼状图， 第一个百分数设置内圈大小，第二个百分数设置外圈大小
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
              data: systemData,
              // 设置值域的那指向线
              labelLine: {
                normal: {
                  show: false // show设置线是否显示，默认为true，可选值：true ¦ false
                }
              }
            }]
          };
          systemChart.setOption(systemOption);

          //进度条
          let systemhtml = template("systemTpl", {
            list: systemData
          });
          $("#system-pro")[0].innerHTML = systemhtml;
          let arr2 = [];
          for (const key in systemData) {
            arr2.push(systemData[key].value);
            var sum2 = 0;
            for (let i = 0; i < arr2.length; i++) {
              sum2 += arr2[i];
            }
          }
          var num6 = arr2[0] / sum2;
          num6 = Number(num6.toFixed(4)) * 100;
          $("#system-pro .son")[0].style.width = num6 + "%";

          var num7 = arr2[1] / sum2;
          num7 = Number(num7.toFixed(4)) * 100;
          $("#system-pro .son")[1].style.width = num7 + "%";

          var num8 = arr2[2] / sum2;
          num8 = Number(num8.toFixed(4)) * 100;
          $("#system-pro .son")[2].style.width = num8 + "%";
        }
      }
    });
  }

  //活动奖品消耗数据
  function prize(id) {
    $.ajax({
      type: "get",
      url: baseURL + "/5d46c1bad8bdb25bfb8b6b8b/api/prize",
      // url:"http://192.172.56.107:8091/meter/productConsumeData",
      dataType: "json",
      data: {
        activityId: 339
      },
      success: function (res) {
        if (res.code === 200) {
          let prizeData = res.data;
          let prizehtml = template("prizeTpl", {
            list: prizeData
          });
          if (prizehtml) {
            $("#prize-pro")[0].innerHTML = prizehtml;
            for (var i = 0; i < prizeData.length; i++) {
              if (i > 2) {
                break;
              }
              $("#prize-pro .son")[i].style.width = prizeData[i].percent;
            }
          }
        }
      }
    });
  }
  // 全部
  $(".trophy-data .all").on("click", function () {
    $(this)
      .addClass("active")
      .siblings()
      .removeClass("active");
  });
  //红包奖品
  $(".trophy-data .redpack").on("click", function () {

    $(this)
      .addClass("active")
      .siblings()
      .removeClass("active");
  });
  //虚拟奖品
  $(".trophy-data .virtual").on("click", function () {
    $(this)
      .addClass("active")
      .siblings()
      .removeClass("active");
  });
  //实物奖品
  $(".trophy-data .entity").on("click", function () {
    $(this)
      .addClass("active")
      .siblings()
      .removeClass("active");
  });
  //活动数据总览
  function activity(id, provice) {
    $.ajax({
      type: "get",
      url: baseURL + "/5d46c1bad8bdb25bfb8b6b8b/api/code/list",
      // url: "http://192.172.56.107:8091/meter/overall",
      data: {
        activityId: 413
      },
      dataType: "json",
      // data:{id:id,provice:city},
      success: function (res) {
        if (res.code === 200) {
          activityData = res.data;
          var html = template("activityTpl", {
            list: activityData
          });
          $(".chart tbody")[0].innerHTML = html;
        }
      }
    });
  }

  //预算金额消耗数据
  function budgetConsume() {
    $.ajax({
      type: "get",
      url: baseURL + "/5d46c1bad8bdb25bfb8b6b8b/api/consume",
      // url:baseURL+"/meter/budgetConsumePercentage",
      dataType: "json",
      data: {
        activityId: 166
      },
      success: function (res) {
        if (res.code === 200) {
          let budgetData = res.data.list;
          var budgetArr = [];
          for (const key in budgetData) {
            budgetArr.push(budgetData[key].name);
          }
          $("#budgetNumber").text(res.data.generalBudet);
          $("#expendNum").text(res.data.expend);
          $("#expendRatio").text(res.data.expendRatio);
          $("#surplusNum").text(res.data.surplus);
          $("#surplusRatio").text(res.data.surplusRatio);
          let budgetChart = echarts.init(document.getElementById("budget"));
          budgetOption = {
            tooltip: {
              // 提示框设置
              trigger: "item",
              formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            legend: {
              orient: "vertical",
              x: "left",
              data: budgetArr,
              icon: "circle", //图标,
              itemWidth: 10, //图标宽
              itemHeight: 10, //图标高
              itemGap: 5, //图标间距
              textStyle: {
                // 图例文字颜色
                color: "#23b7e5"
              }
            },
            title: {
              textStyle: {
                color: "#1e81c1",
                fontSize: 40
              }
            },
            series: [{
              type: "pie",
              radius: ["50%", "70%"], // 设置环形饼状图， 第一个百分数设置内圈大小，第二个百分数设置外圈大小
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
              data: budgetData,
              // 设置值域的那指向线
              labelLine: {
                normal: {
                  show: false // show设置线是否显示，默认为true，可选值：true ¦ false
                }
              }
            }]
          };
          budgetChart.setOption(budgetOption);
        }
      }
    });
  }
  //二维码消耗数据
  function qrcode() {
    $.ajax({
      type: "get",
      url: baseURL + "/5d46c1bad8bdb25bfb8b6b8b/api/qrcode/data",
      // url: baseURL+"/meter/qrcodeConsumePercentage",
      dataType: "json",
      data: {
        activityId: 86
      },
      success: function (res) {
        if (res.code === 200) {
          let qrcodeData = res.data.list;
          var dataArr = [];
          for (const key in qrcodeData) {
            dataArr.push(qrcodeData[key].name);
          }
          $("#totalWrapper .number").text(res.data.codeTotal);
          $("#employWrapper .number").text(res.data.employ);
          $("#employWrapper .ratio").text(res.data.employRatio);
          $("#surplusWrapper .number").text(res.data.surplus);
          $("#surplusWrapper .ratio").text(res.data.surplusRatio);
          let qrcodeChart = echarts.init(document.getElementById("qrcode"));
          qrcodeOption = {
            tooltip: {
              trigger: "item",
              formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            legend: {
              orient: "vertical",
              x: "left",
              data: dataArr,
              icon: "circle", //图标,
              itemWidth: 10, //图标宽
              itemHeight: 10, //图标高
              itemGap: 5, //图标间距
              textStyle: {
                color: "#23b7e5"
              }
            },
            title: {
              textStyle: {
                color: "#1e81c1",
                fontSize: 40
              }
            },
            series: [{
              type: "pie",
              radius: ["50%", "70%"], // 设置环形饼状图， 第一个百分数设置内圈大小，第二个百分数设置外圈大小
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
              data: qrcodeData,
              // 设置值域的那指向线
              labelLine: {
                normal: {
                  show: false // show设置线是否显示，默认为true，
                }
              }
            }]
          };
          qrcodeChart.setOption(qrcodeOption);
        }
      }
    });
  }

  //活动数据每日走势
  function trend() {
    $.ajax({
      type: "get",
      url: baseURL + "/5d46c1bad8bdb25bfb8b6b8b/api/trend",
      // url:"http://192.172.56.107:8091/meter/trend",
      dataType: "json",
      data: {
        activityId: 86
      },
      success: function (res) {
        // console.log(res);
        if (res.code === 200) {
          let trendData = res.data.list;
          let trendTime = res.data.time;
          let trendChart = echarts.init(document.getElementById("trend-chart"));
          trendOption = {
            title: {
              text: "活动数据每日走势",
              textStyle: {
                color: "#c6e4ff",
                fontSize: 18,
                lineHeight: 32,
                fontWeight: 400
              }
            },
            tooltip: {
              trigger: "axis"
            },

            legend: {
              data: ["扫码次数", "访客人数", "中奖人数", "关注人数"],
              icon: "vertical",
              textStyle: {
                color: "#23b7e5" // 图例文字颜色
              }
            },
            grid: {
              left: "3%",
              right: "4%",
              bottom: "3%",
              containLabel: true
            },
            toolbox: {
              feature: {
                saveAsImage: {}
              }
            },
            xAxis: {
              type: "category",
              boundaryGap: false,
              data: trendTime,
              axisLabel: {
                show: true, //修改x轴的字体颜色
                textStyle: {
                  color: "#fff"
                }
              }
            },
            yAxis: {
              type: "value",
              textStyle: {
                color: "#9497ab"
              },
              axisLabel: {
                show: true,
                textStyle: {
                  color: "#fff"
                }
              },
              axisLine: {
                // y轴线
                show: true
              },
              splitLine: {
                //y轴网格
                show: true,
                lineStyle: {
                  color: ["#333"],
                  width: 1,
                  type: "solid"
                }
              },
              axisTick: {
                //y轴刻度线
                show: false
              }
            },
            series: trendData
          };
          trendChart.setOption(trendOption);
        }
      }
    });
  }
  //活动基本信息
  function activeMsg(id) {
    $.ajax({
      type: "get",
      url: baseURL + "/5d46c1bad8bdb25bfb8b6b8b/api/active/msg",
      // url:baseURL+"meter/basicActivitiesInfo",
      dataType: "json",
      data: {
        activityId: 362
      },
      success: function (res) {
        // console.log(res);
        if (res.code === 200) {
          let activeData = res.data;
          let activehtml = template("activeTpl", {
            list: activeData
          });
          $(".basic .message")[0].innerHTML = activehtml;
        }
      }
    });
  }
  //消费者参与活动时间分布
  function time(id, type) {
    $.ajax({
      type: "get",
      url: baseURL + "/5d46c1bad8bdb25bfb8b6b8b/api/time",
      // url:baseURL+"/meter/getActivityTimeChartBar",
      dataType: "json",
      data: {
        activityId: 296,
        type: type
      },
      success: function (res) {
        if (res.code === 200) {
          let timeList = res.data.list;
          let xAxisData = res.data.data;
          //活动时间分布情况
          let timeChart = echarts.init(document.getElementById("tiemChart"));
          tiemOption = {
            title: {
              text: "消费者参与活动时间分布情况",
              textStyle: {
                color: "#c6e4ff",
                fontSize: 18,
                lineHeight: 32,
                fontWeight: 400
              }
            },

            legend: {
              icon: "vertical",
              textStyle: {
                color: "#23b7e5" // 图例文字颜色
              }
            },
            tooltip: {
              trigger: "axis",
              axisPointer: {
                // 坐标轴指示器，坐标轴触发有效
                type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
              }
            },
            grid: {
              left: "3%",
              right: "4%",
              bottom: "3%",
              containLabel: true
            },
            xAxis: [{
              type: "category",
              data: xAxisData,
              axisTick: {
                alignWithLabel: true
              },
              axisLabel: {
                interval: 0,
                show: true, //修改x轴的字体颜色
                textStyle: {
                  color: "#fff"
                }
              }
            }],
            yAxis: {
              type: "value",
              textStyle: {
                color: "#9497ab"
              },
              axisLabel: {
                show: true,
                textStyle: {
                  color: "#fff"
                }
              },
              axisLine: {
                // y轴线
                show: true
              },
              splitLine: {
                //y轴网格
                show: true,
                lineStyle: {
                  color: ["#333"],
                  width: 1,
                  type: "solid"
                }
              },
              axisTick: {
                //y轴刻度线
                show: false
              }
            },
            series: [{
              type: "bar",
              barWidth: "40%", //设置柱的宽度，
              data: timeList,
              itemStyle: {
                normal: {
                  //每根柱子颜色设置
                  color: function (params) {
                    let colorList = [
                      "#c23531",
                      "#2f4554",
                      "#61a0a8",
                      "#d48265",
                      "#91c7ae",
                      "#749f83",
                      "#ca8622",
                      "#bda29a",
                      "#6e7074",
                      "#546570",
                      "#dd3fd0",
                      "#4BABDE",
                      "#FFDE76",
                      "#E43C59",
                      "#37A2DA",
                      "#3398DB",
                      "#977749",
                      "#7b3d8b",
                      "#4e6f49",
                      "#92486b",
                      "#524ea4",
                      "#259baa",
                      "#3c7aad",
                      "#2c409f",
                      "yellowgreen"
                    ];
                    return colorList[params.dataIndex];
                  }
                }
              }
            }]
          };
          timeChart.setOption(tiemOption);
        }
      }
    });
  }
  $(".button-box ").on("click", ".hours", function () {
    time(id, 1);
    $(this)
      .addClass("active")
      .siblings()
      .removeClass("active");
  });
  $(".button-box ").on("click", ".day", function () {
    time(id, 2);
    $(this)
      .addClass("active")
      .siblings()
      .removeClass("active");
  });
  $(".button-box ").on("click", ".week", function () {
    time(id, 3);
    $(this)
      .addClass("active")
      .siblings()
      .removeClass("active");
  });
});