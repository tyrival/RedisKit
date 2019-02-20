<template>
	<div class="dashboard" v-show="config.dashboard.show">
		<el-row>
			<el-col :span="8">
				<div class="chart-block" id="chart-cpu"></div>
			</el-col>
			<el-col :span="8">
				<div class="chart-block" id="chart-ram"></div>
			</el-col>
			<el-col :span="8">
				<div class="chart-block" id="chart-network"></div>
			</el-col>
		</el-row>
	</div>
</template>

<script>
  import '../../assets/styles/viewport/dashboard.scss'
  import echarts from 'echarts'

  export default {
    name: 'Dashboard',
    props: ['config'],
    data () {
      return {
        chart: {
          cpu: null,
          ram: null,
          network: null
        },
        option: {
          cpu: {
            animation: false,
            title: {
              show: true,
              text: 'CPU',
              align: 'left',
              left: 5,
              textStyle: {
                color: '#ababab',
                fontSize: 12
              }
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                lineStyle: {
                  color: '#ababab'
                }
              },
              textStyle: {
                fontSize: 10
              }
            },
            legend: {
              icon: 'rect',
              itemWidth: 8,
              itemHeight: 2,
              itemGap: 3,
              right: 5,
              data: ['总量', '后台'],
              textStyle: {
                fontSize: 10,
                color: '#ababab'
              }
            },
            grid: {
              top: '18%',
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: [{
              type: 'category',
              boundaryGap: false,
              axisLabel: {
                textStyle: {
                  fontSize: 10,
                  color: '#bababa'
                }
              },
              axisTick: {
                show: false
              },
              axisLine: {
                lineStyle: {
                  color: '#545454'
                }
              },
              data: this.config.dashboard.state.time
            }],
            yAxis: [{
              type: 'value',
              splitNumber: 4,
              axisTick: {
                show: false
              },
              axisLine: {
                lineStyle: {
                  color: '#545454'
                }
              },
              axisLabel: {
                margin: 10,
                textStyle: {
                  fontSize: 10,
                  color: '#bababa'
                }
              },
              splitLine: {
                lineStyle: {
                  color: '#545454'
                }
              }
            }],
            series: [{
              name: '总量',
              type: 'line',
              smooth: true,
              symbol: 'circle',
              symbolSize: 5,
              showSymbol: false,
              lineStyle: {
                normal: {
                  width: 1
                }
              },
              areaStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: 'rgba(137, 189, 27, 0.3)'
                  }, {
                    offset: 0.8,
                    color: 'rgba(137, 189, 27, 0)'
                  }], false),
                  shadowColor: 'rgba(0, 0, 0, 0.1)',
                  shadowBlur: 10
                }
              },
              itemStyle: {
                normal: {
                  color: 'rgb(137,189,27)',
                  borderColor: 'rgba(137,189,2,0.27)',
                  borderWidth: 12

                }
              },
              data: this.config.dashboard.state.used_cpu_sys
            }, {
              name: '后台',
              type: 'line',
              smooth: true,
              symbol: 'circle',
              symbolSize: 5,
              showSymbol: false,
              lineStyle: {
                normal: {
                  width: 1
                }
              },
              areaStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: 'rgba(219, 50, 51, 0.3)'
                  }, {
                    offset: 0.8,
                    color: 'rgba(219, 50, 51, 0)'
                  }], false),
                  shadowColor: 'rgba(0, 0, 0, 0.1)',
                  shadowBlur: 10
                }
              },
              itemStyle: {
                normal: {

                  color: 'rgb(219,50,51)',
                  borderColor: 'rgba(219,50,51,0.2)',
                  borderWidth: 12
                }
              },
              data: this.config.dashboard.state.used_cpu_sys_children
            }]
          },
          ram: {
            animation: false,
            title: {
              show: true,
              text: '内存',
              align: 'left',
              left: 15,
              textStyle: {
                color: '#ababab',
                fontSize: 12
              }
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                lineStyle: {
                  color: '#ababab'
                }
              },
              textStyle: {
                fontSize: 10
              }
            },
            legend: {
              icon: 'rect',
              itemWidth: 8,
              itemHeight: 2,
              itemGap: 3,
              right: 5,
              data: ['总量', '分配器', 'Lua引擎'],
              textStyle: {
                fontSize: 10,
                color: '#ababab'
              }
            },
            grid: {
              top: '18%',
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: [{
              type: 'category',
              boundaryGap: false,
              axisLabel: {
                textStyle: {
                  fontSize: 10,
                  color: '#bababa'
                }
              },
              axisTick: {
                show: false
              },
              axisLine: {
                lineStyle: {
                  color: '#545454'
                }
              },
              data: this.config.dashboard.state.time
            }],
            yAxis: [{
              type: 'value',
              splitNumber: 4,
              axisTick: {
                show: false
              },
              axisLine: {
                lineStyle: {
                  color: '#545454'
                }
              },
              axisLabel: {
                margin: 10,
                textStyle: {
                  fontSize: 10,
                  color: '#bababa'
                }
              },
              splitLine: {
                lineStyle: {
                  color: '#545454'
                }
              }
            }],
            series: [{
              name: '总量',
              type: 'line',
              smooth: true,
              symbol: 'circle',
              symbolSize: 5,
              showSymbol: false,
              lineStyle: {
                normal: {
                  width: 1
                }
              },
              areaStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: 'rgba(137, 189, 27, 0.3)'
                  }, {
                    offset: 0.8,
                    color: 'rgba(137, 189, 27, 0)'
                  }], false),
                  shadowColor: 'rgba(0, 0, 0, 0.1)',
                  shadowBlur: 10
                }
              },
              itemStyle: {
                normal: {
                  color: 'rgb(137,189,27)',
                  borderColor: 'rgba(137,189,2,0.27)',
                  borderWidth: 12

                }
              },
              data: this.config.dashboard.state.used_memory_rss
            }, {
              name: '分配器',
              type: 'line',
              smooth: true,
              symbol: 'circle',
              symbolSize: 5,
              showSymbol: false,
              lineStyle: {
                normal: {
                  width: 1
                }
              },
              areaStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: 'rgba(0, 136, 212, 0.3)'
                  }, {
                    offset: 0.8,
                    color: 'rgba(0, 136, 212, 0)'
                  }], false),
                  shadowColor: 'rgba(0, 0, 0, 0.1)',
                  shadowBlur: 10
                }
              },
              itemStyle: {
                normal: {
                  color: 'rgb(0,136,212)',
                  borderColor: 'rgba(0,136,212,0.2)',
                  borderWidth: 12
                }
              },
              data: this.config.dashboard.state.used_memory
            }, {
              name: 'Lua引擎',
              type: 'line',
              smooth: true,
              symbol: 'circle',
              symbolSize: 5,
              showSymbol: false,
              lineStyle: {
                normal: {
                  width: 1
                }
              },
              areaStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: 'rgba(219, 50, 51, 0.3)'
                  }, {
                    offset: 0.8,
                    color: 'rgba(219, 50, 51, 0)'
                  }], false),
                  shadowColor: 'rgba(0, 0, 0, 0.1)',
                  shadowBlur: 10
                }
              },
              itemStyle: {
                normal: {
                  color: 'rgb(219,50,51)',
                  borderColor: 'rgba(219,50,51,0.2)',
                  borderWidth: 12
                }
              },
              data: this.config.dashboard.state.used_memory_lua
            }]
          },
          network: {
            animation: false,
            title: {
              show: true,
              text: '网络',
              align: 'left',
              left: 5,
              textStyle: {
                color: '#ababab',
                fontSize: 12
              }
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                lineStyle: {
                  color: '#ababab'
                }
              },
              textStyle: {
                fontSize: 10
              }
            },
            legend: {
              icon: 'rect',
              itemWidth: 8,
              itemHeight: 2,
              itemGap: 3,
              right: 5,
              data: ['接收', '发送'],
              textStyle: {
                fontSize: 10,
                color: '#ababab'
              }
            },
            grid: {
              top: '18%',
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: [{
              type: 'category',
              boundaryGap: false,
              axisLabel: {
                textStyle: {
                  fontSize: 10,
                  color: '#bababa'
                }
              },
              axisTick: {
                show: false
              },
              axisLine: {
                lineStyle: {
                  color: '#545454'
                }
              },
              data: this.config.dashboard.state.time
            }],
            yAxis: [{
              type: 'value',
              splitNumber: 4,
              axisTick: {
                show: false
              },
              axisLine: {
                lineStyle: {
                  color: '#545454'
                }
              },
              axisLabel: {
                margin: 10,
                textStyle: {
                  fontSize: 10,
                  color: '#bababa'
                }
              },
              splitLine: {
                lineStyle: {
                  color: '#545454'
                }
              }
            }],
            series: [{
              name: '接收',
              type: 'line',
              smooth: true,
              symbol: 'circle',
              symbolSize: 5,
              showSymbol: false,
              lineStyle: {
                normal: {
                  width: 1
                }
              },
              areaStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: 'rgba(137, 189, 27, 0.3)'
                  }, {
                    offset: 0.8,
                    color: 'rgba(137, 189, 27, 0)'
                  }], false),
                  shadowColor: 'rgba(0, 0, 0, 0.1)',
                  shadowBlur: 10
                }
              },
              itemStyle: {
                normal: {
                  color: 'rgb(137,189,27)',
                  borderColor: 'rgba(137,189,2,0.27)',
                  borderWidth: 12

                }
              },
              data: this.config.dashboard.state.instantaneous_input_kbps
            }, {
              name: '发送',
              type: 'line',
              smooth: true,
              symbol: 'circle',
              symbolSize: 5,
              showSymbol: false,
              lineStyle: {
                normal: {
                  width: 1
                }
              },
              areaStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: 'rgba(0, 136, 212, 0.3)'
                  }, {
                    offset: 0.8,
                    color: 'rgba(0, 136, 212, 0)'
                  }], false),
                  shadowColor: 'rgba(0, 0, 0, 0.1)',
                  shadowBlur: 10
                }
              },
              itemStyle: {
                normal: {
                  color: 'rgb(0,136,212)',
                  borderColor: 'rgba(0,136,212,0.2)',
                  borderWidth: 12
                }
              },
              data: this.config.dashboard.state.instantaneous_output_kbps
            }]
          }
        }
      }
    },
    methods: {
      loadChart (name) {
        if (!this.chart[name]) {
          let id = 'chart-' + name
          this.chart[name] = echarts.init(document.getElementById(id))
        }
        this.loadOption(name)
      },
      loadOption (name) {
        this.chart[name].resize()
        this.chart[name].setOption(this.option[name])
      }
    },
    watch: {
      'config.dashboard.state': {
        deep: true,
        handler: function () {
          this.loadChart('cpu')
          this.loadChart('ram')
          this.loadChart('network')
        }
      }
    }
  }
</script>

<style scoped>

</style>
