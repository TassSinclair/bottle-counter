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
      return _.map(data, function(item, key) { return {label: key, value: item.length};});
    }

    d3.json('api/days/8',function(error, data) {
      var groupedByHour = mapLabelAndSumValues(groupByDay(data.events));

      nv.addGraph(function() {
        var chart = nv.models.discreteBarChart()
            .x(function(d) { return d.label })
            .y(function(d) { return d.value })
            .showValues(true)
            .showYAxis(false)
            .valueFormat(d3.format(',1f'))
            .height(130)
            .width(350)
            ;

        chart.xAxis
          .tickFormat(function(tick) { return moment(tick).format('ddd Do'); })

        chart.tooltip
          .enabled(false);

        nv.utils.windowResize(chart.update);

        d3.select('.last-seven-days svg')
          .datum([{values: groupedByHour}])
          .call(chart);

        return chart;

      }, function(chart) {
        d3.select('.nv-discreteBarWithAxes g')
          .attr('transform', null);
      });
    });
  });