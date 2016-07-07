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

  function groupByDayOfWeek(data) {       
    function dayOfWeek(date) { return moment(date).day(); }
    var allDays = {};
    for (var i = 0; i < 7; ++i) {
      allDays[i] = [];
    }
    var populatedDays = _.groupBy(data, function(v) { return dayOfWeek(v.timestamp);});

    return _.extend(allDays, populatedDays);
  }

  function groupWeek(data) {       
    function dayOfWeek(date) { return moment(date).format('dd'); }
    var populatedDays = _.groupBy(data, function(v) { return dayOfWeek(v.timestamp);});

    return _.extend(allDays, populatedDays);
  }

  function mapLabelAndSumValues(data) {
    return _.map(data, function(items, key) { return {key: key, values: items};});
  }
    
  d3.json('api/days/8',function(error, data) {

    var dataGroupedByDay = mapLabelAndSumValues(groupByDay(_.reverse(data.events)));

    nv.addGraph(function() {
      var chart = nv.models.discreteBarChart()
          .x(function(d) { return d.key })
          .y(function(d) { return d.values.length })
          .showValues(true)
          .showYAxis(false)
          .valueFormat(d3.format(',1f'))
          .height(150)
          .width(320);

      chart.xAxis
        .tickFormat(function(tick) { return moment(tick).format('ddd D'); })

      function percentageOfTotal(index, items) {
        return parseInt((index + 1) / items.length * 100) + '%';
      }

      function rgbOfPointInDay(millisAtPoint, totalMillisOnDay) {
        var percentageOfDay = parseInt(millisAtPoint / totalMillisOnDay * 100);
        var stops = [
          {offset: 0, color: {r: 17, g: 17, b: 17}},
          {offset: 15, color: {r: 204, g: 85, b: 85}},
          {offset: 50, color: {r: 204, g: 204, b: 0}},
          {offset: 85, color: {r: 187, g: 90, b: 210}},
          {offset: 100, color: {r: 17, g: 17, b: 17}}
        ];
        stops.forEach(function(stop, index) {
          if (stops[index + 1]) {
            stop.next = stops[index + 1];
          }
        });

        function between(a, b, fraction) {
          var amount = Math.abs(a - b) * fraction;
          return parseInt(a < b ? a + amount : a - amount);
        }

        var from = _.reverse(stops).find(function(item) { return percentageOfDay >= item.offset});
        var fractionBetween = (percentageOfDay - from.offset) / (from.next.offset - from.offset);
        var rgb = {
          r: between(from.color.r, from.next.color.r, fractionBetween),
          g: between(from.color.g, from.next.color.g, fractionBetween),
          b: between(from.color.b, from.next.color.b, fractionBetween)
        };
        return 'rgb(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ')';
      }

      function gradientForBar(d, i) {

        function addStop(gradient, offset, rgb) {
          gradient.append('stop')
            .attr('offset', offset)
            .attr('stop-color', rgb)
            .attr('stop-opacity', 1);    
        }

        var gradientName = 'barGrad' + i;
        var defs = d3.select('svg defs')
        var gradient = defs.append('linearGradient')
          .attr('id', gradientName)
          .attr('x1', '100%')
          .attr('y1', '0%')
          .attr('x2', '100%')
          .attr('y2', '100%')
          .attr('spreadMethod', 'pad');

        var startOfDayMillis = moment(d.key).valueOf();
        var endOfDayMillis = moment(d.key).endOf('day').valueOf();
        var totalMillisOnDay = endOfDayMillis - startOfDayMillis;

        for(var i = 0; i < d.values.length; ++i) {
          var nowMillis = moment(d.values[i].timestamp).valueOf();
          addStop(gradient, 
            percentageOfTotal(i, d.values),
            rgbOfPointInDay(nowMillis - startOfDayMillis, totalMillisOnDay));
        }
        return 'url(#' + gradientName + ')';
      }

      chart.color(gradientForBar);

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
  });

  d3.json('api/days/28',function(error, data) {
    var dataGroupedByDayOfWeek = mapLabelAndSumValues(groupByDayOfWeek(_.reverse(data.events)));

    dataGroupedByDayOfWeek.forEach(function(dayOfWeek) {

      var daysOfWeekGroupedByWeek = 
        _.range(4, -1, -1)
          .map(function(minusWeeks) { return moment().subtract(minusWeeks, 'week').week();})
          .map(function(week) {
            return {
              x: week,
              y: 0
            };
          });
        dayOfWeek.values.forEach(function(a) { a.week = moment(a.timestamp).week();});
        _.forEach(_.groupBy(dayOfWeek.values, function(item) { return moment(item.timestamp).week(); }), function(items, key) {
          daysOfWeekGroupedByWeek.find(function(item) { return item.x == key;}).y = items.length;
        });

      dayOfWeek.values = daysOfWeekGroupedByWeek;
    });
    nv.addGraph(function() {
      var chart = nv.models.multiBarChart()
          .height(150)
          .width(320)
          .showLegend(false)
          .showControls(false)
          .stacked(true)
          .reduceXTicks(false);

      chart.xAxis.tickFormat(function(tick) { return 'Week of ' + moment().week(tick).format('D MMM'); })
      chart.tooltip.enabled(false);
      chart.yAxis.tickFormat(d3.format(',1f'));

      chart.color(function(d, i) {
        return '';
      });

      d3.select('.last-seven-weeks svg')
          .datum(dataGroupedByDayOfWeek)
          .call(chart);
      return chart;
    }, function(chart) {
      d3.select('g.nv-multiBarWithLegend')
        .attr('transform', 'translate(10,5)');
    });
  });
});