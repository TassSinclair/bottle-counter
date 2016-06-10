$(function() {

    var counter = $('.counter').FlipClock(0, {
      clockFace: 'Counter',
      minimumDigits: 4
    });

    $('.counter').addClass('main-position');
    $('.focusable').not('.main-position').addClass('secondary-position');

    var socket = io();
    socket.on('count', function(msg){
      counter.setValue(msg.currentCount);
    });

    function focusOn(item) {
      item
        .add('.main-position')
        .toggleClass('main-position')
        .toggleClass('secondary-position');
    }

    $('.focusable').on('click', function() {
      if (!$(this).hasClass('main-position')) {
        focusOn($(this));
      }
    });

    function groupByDay(data) {       
      function startOfDay(date) { return moment(date).startOf('day').toISOString(); }
      var date = new Date();
      date.setDate(date.getDate() - 8);
      var allDays = {};
      for (var i = 0; i < 8; date.setDate(date.getDate() + 1) && ++i) {
        allDays[startOfDay(date)] = [];
      }
      var populatedDays = _.groupBy(data, function(v) { return startOfDay(v.timestamp);});

      return _.extend(allDays, populatedDays);
    }

    function mapLabelAndSumValues(data) {
      return _.map(data, function(items, key) { return {label: key, items: items};});
    }

    function addSummaryByDayGraph(dataGroupedByDay) {
      nv.addGraph(function() {
        var chart = nv.models.discreteBarChart()
            .x(function(d) { return d.label })
            .y(function(d) { return d.items.length })
            .showValues(true)
            .showYAxis(false)
            .valueFormat(d3.format(',1f'))
            .height(150)
            .width(350)
            ;

        chart.xAxis
          .tickFormat(function(tick) { return moment(tick).format('ddd Do'); })

        function percentageOfTotal(index, items) {
          return parseInt(index / (items.length - 1) * 100) + '%';
        }

        function colorHexOfPointInDay(millisAtPoint, totalMillisOnDay) {
          return parseInt(millisAtPoint / totalMillisOnDay * 255).toString(16);
        }

        function addStop(gradient, offset, colourHex) {
          gradient.append('stop')
            .attr('offset', offset)
            .attr('stop-color', '#' + colourHex + colourHex + '00')
            .attr('stop-opacity', 1);    
        }

        chart.color(function (d, i) {
          var gradientName = 'barGrad' + i;
          var defs = d3.select('svg defs')
          var gradient = defs.append('linearGradient')
            .attr('id', gradientName)
            .attr('x1', '100%')
            .attr('y1', '0%')
            .attr('x2', '100%')
            .attr('y2', '100%')
            .attr('spreadMethod', 'pad');

          var startOfDayMillis = moment(d.label).valueOf();
          var endOfDayMillis = moment(d.label).endOf('day').valueOf();
          var totalMillisOnDay = endOfDayMillis - startOfDayMillis;

          for(var i = 0; i < d.items.length; ++i) {
            var nowMillis = moment(d.items[i].timestamp).valueOf();
            addStop(gradient, 
              percentageOfTotal(i, d.items),
              colorHexOfPointInDay(nowMillis - startOfDayMillis, totalMillisOnDay));
          }
          return 'url(#' + gradientName + ')';
        });

        chart.tooltip
          .enabled(false);

        nv.utils.windowResize(chart.update);

        d3.select('.last-seven-days svg')
          .datum([{values: dataGroupedByDay}])
          .call(chart);

        return chart;

      }, function(chart) {
        d3.select('.nv-discreteBarWithAxes g')
          .attr('transform', null);
      });
    }

    d3.json('api/days/8',function(error, data) {
      addSummaryByDayGraph(mapLabelAndSumValues(groupByDay(data.events)));
    });
  });