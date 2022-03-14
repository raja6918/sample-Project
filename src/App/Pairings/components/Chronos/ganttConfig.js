import moment from 'moment';
import { isFunction, getRelativeDay, convertTime } from './utils';
import { CARRY_IN_DAYS, CARRY_OUT_DAYS, MAX_PERIOD_DAYS } from './constants';

const timeUnitSize = {
  second: 1000,
  minute: 60000,
  hour: 3600000,
  day: 86400000,
  month: 2592000000,
  year: 31556952000,
};

let carryInStartDate;
let carryOutStartDate;
const majorLabelRenderer = data => {
  const ctx = data.drawingContext;
  if (data.majorTickLabel !== undefined) {
    const label = data.majorTickLabel.split('    ');
    ctx.font = '400 11px Roboto';
    ctx.fillStyle = '#000000';
    ctx.fillText(label[0], data.xposition, data.yposition + 2);
    if (label[1] !== undefined) {
      const dateLabel = ctx.measureText(label[0]).width;
      ctx.font = '700 11px Roboto';
      ctx.fillStyle = '#0A75C2';
      ctx.fillText(
        label[1],
        data.xposition + dateLabel + 12,
        data.yposition + 2
      );
    }
  }
};

const minorLabelRenderer = data => {
  const ctx = data.drawingContext;
  if (data.minorTickLabel !== undefined) {
    const label = data.minorTickLabel.split('\n');
    if (label.length === 1 && label[0] === '') {
      return false;
    }
    if (
      data.minorTickLength > 10 &&
      data.minorTickLength < 17 &&
      data.minorTickSize &&
      data.minorTickSize[1] === 'day'
    ) {
      if (label[1] !== '' && data.yposition > 35 && data.yposition <= 50) {
        ctx.font = '900 12px Roboto';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(label[1], data.xposition, data.yposition - 2);
      }
      if (label[2] !== '' && data.yposition > 50) {
        ctx.font = '400 11px Roboto';
        ctx.fillStyle = '#A7D1FF';
        ctx.fillText(label[2], data.xposition, data.yposition + 1);
      }
    } else {
      if (label[0] !== '' && data.yposition <= 35) {
        ctx.font = '900 12px Roboto';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(label[0], data.xposition, data.yposition + 5);
      }
      if (label[1] !== '' && data.yposition > 35 && data.yposition <= 50) {
        ctx.font = '900 12px Roboto';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(label[1], data.xposition, data.yposition + 3);
      }
      if (label[2] !== '' && data.yposition > 50) {
        ctx.font = '400 11px Roboto';
        ctx.fillStyle = '#A7D1FF';
        ctx.fillText(label[2], data.xposition, data.yposition + 5);
      }
    }
  }
};

const majorTickStyleCallbackFunction = data => {
  const ctx = data.drawingContext;
  const majorTickSize = data.axis.majorTickSize;

  const d = new Date(data.drawingTick.v);
  const lastDay = new Date(d.getFullYear(), d.getMonth(), 0).getTime();
  const endOfLastDay = lastDay + 24 * 60 * 60 * 1000;

  d.setHours(0);
  d.setMinutes(0);
  d.setSeconds(0);
  d.setMilliseconds(0);

  if (data.tickType === 'MAJOR' && data.plotOffset) {
    if (majorTickSize[1] === 'month') {
      ctx.strokeStyle = '#bae1fc';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(data.x + data.plotOffset.left, data.y);
      ctx.lineTo(data.x + data.plotOffset.left, data.yoffset);
      ctx.stroke();
      return false;
    }

    if (
      majorTickSize[1] === 'day' &&
      data.axis.majorTicks.length <= 4 &&
      data.plotOffset
    ) {
      if (endOfLastDay === d.getTime()) {
        ctx.strokeStyle = '#bae1fc';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(data.x + data.plotOffset.left, data.y);
        ctx.lineTo(data.x + data.plotOffset.left, data.yoffset);
        ctx.stroke();
        return false;
      } else if (
        data.drawingTick.v === convertTime(carryOutStartDate) ||
        data.drawingTick.v === convertTime(carryInStartDate)
      ) {
        ctx.strokeStyle = '#00000059';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(data.x + data.plotOffset.left, data.plotOffset.top);
        ctx.lineTo(
          data.x + data.plotOffset.left,
          data.yoffset + data.plotHeight
        );
        ctx.stroke();
        return false;
      }
      ctx.strokeStyle = '#747474';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(data.x + data.plotOffset.left, data.y);
      ctx.lineTo(data.x + data.plotOffset.left, data.yoffset);
      ctx.stroke();
    }
  }
  if (data.tickType === 'MINOR' && data.plotOffset) {
    if (
      endOfLastDay === d.getTime() &&
      majorTickSize[1] === 'day' &&
      data.drawingTick.label.replace(/(\r\n|\n|\r)/gm, '') === '00:00'
    ) {
      ctx.strokeStyle = '#bae1fc';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(data.x + data.plotOffset.left, data.plotOffset.top);
      ctx.lineTo(data.x + data.plotOffset.left, data.yoffset + data.plotHeight);
      ctx.stroke();
      return false;
    } else if (
      data.drawingTick.v === convertTime(carryOutStartDate) ||
      data.drawingTick.v === convertTime(carryInStartDate)
    ) {
      ctx.strokeStyle = '#00000059';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(data.x + data.plotOffset.left, data.plotOffset.top);
      ctx.lineTo(data.x + data.plotOffset.left, data.yoffset + data.plotHeight);
      ctx.stroke();
      return false;
    }
    ctx.strokeStyle = '#dedede';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(data.x + data.plotOffset.left, data.plotOffset.top);
    ctx.lineTo(data.x + data.plotOffset.left, data.yoffset + data.plotHeight);
    ctx.stroke();
  }
};

const backgroundLabelRenderer = data => {
  const ctx = data.drawingContext;
  ctx.fillStyle = '#E5E5E5';
  ctx.fillRect(data.left, data.top, data.width, data.majorTickHeight);
  ctx.fillStyle = '#0A75C2';
  ctx.fillRect(
    data.left,
    data.top + data.majorTickHeight,
    data.width,
    data.minorTickHeight
  );
};

const calendarHeaderLines = data => {
  const majorTickSize = data.axis.majorTickSize;
  const ctx = data.drawingContext;

  const d = new Date(data.drawingTick);
  const lastDay = new Date(d.getFullYear(), d.getMonth(), 0).getTime();
  const endOfLastDay = lastDay + 24 * 60 * 60 * 1000;

  d.setHours(0);
  d.setMinutes(0);
  d.setSeconds(0);
  d.setMilliseconds(0);

  if (majorTickSize[1] === 'month') {
    ctx.strokeStyle = '#bae1fc';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(data.xfrom, data.yfrom);
    ctx.lineTo(data.xto, data.yto);
    ctx.stroke();
    return false;
  }

  if (data.tickType === 'MAJOR') {
    if (majorTickSize[1] === 'day' && endOfLastDay === d.getTime()) {
      ctx.strokeStyle = '#bae1fc';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(data.xfrom, data.yfrom);
      ctx.lineTo(data.xto, data.yto);
      ctx.stroke();
      return false;
    }
    if (majorTickSize[1] === 'day' && data.axis.majorTicks.length <= 4) {
      ctx.lineWidth = 1;

      ctx.beginPath();
      ctx.strokeStyle = '#747474';
      ctx.moveTo(data.xfrom, data.yfrom);
      ctx.lineTo(data.xto, data.yfrom + 16);
      ctx.stroke();

      ctx.beginPath();
      ctx.strokeStyle = '#CCCCCC';
      ctx.moveTo(data.xfrom, data.yfrom + 16);
      ctx.lineTo(data.xto, data.yto);

      ctx.stroke();
    }
  }
};

export const getDefaultGanttOptions = (props, callbackFns) => {
  const { startDate, endDate, noOfDays } = props;
  carryInStartDate = moment(startDate).add('days', CARRY_IN_DAYS);
  carryOutStartDate = moment(endDate).subtract('days', CARRY_OUT_DAYS);
  const totalCarryDays = CARRY_IN_DAYS + CARRY_OUT_DAYS;
  const periodVisibleDays = Math.min(noOfDays, MAX_PERIOD_DAYS);
  const initialTimelineVisibleDays = periodVisibleDays + totalCarryDays;

  let max = endDate;
  if (noOfDays + totalCarryDays > initialTimelineVisibleDays) {
    const date = moment(startDate).add('days', initialTimelineVisibleDays);
    max = convertTime(date);
  }
  return {
    yAxisVisibleRange: [0, 50], // to set y-axis max and min
    xAxisVisibleRange: [startDate, endDate],
    paneOptions: {
      // chronos configuration
      plotOptions: {
        series: {
          gantt: {
            rowIdAttribute: 'rowId',
            // rowIdAttributeInTask: null,
            rowIdAttributeInTask: 'hangarId',
            barHeight: 0.6,
            minTickHeight: 76,
            startDateAttribute: () => 'startDate',
            endDateAttribute: () => 'endDate',
            wrappedRows: {
              mergeWrapRows: true,
              enabled: true,
              expandMode: true, // true (default) - all rows will be expanded initially , false otherwise
            },
            priorityLayer: true,
            taskIdProviderCallBack: eachTask =>
              `${eachTask.id}_${eachTask.ganttItemType}_${eachTask.type}`,
          },
        },
        grid: {
          labelMargin: 0,
        },
        columnHeaderHover: {
          interactive: true, // will trigger the hover callback on hover if true
        },
        yaxis: {
          defaultMarkings: {
            enable: true,
            lineColor: '#e0e0e0',
            dashedLine: false,
            alternateRowColor: ['#fafafa', '#fafafa'], //Row colour between the above markings
            sameColorForMergedRows: true,
          },
          border: {
            //common border for all headers and cell
            width: 1,
            color: '#fff',
          },
        },
        xaxis: {
          mode: 'time',
          color: '#fff',
          font: {
            size: 12,
            weight: 900,
            family: 'Roboto',
          },
          tickStyle: { tickColor: '#e0e0e0', dashedLine: false },
          min: startDate, // MANDATORY
          max: max, // MANDATORY
          showLabel: false,
          backgroundLabelRenderer: backgroundLabelRenderer,
          colorDays: {
            enable: true,
            headerOnly: false, // if false header and plot area will be colored
            colorOn: 'GRID', //HEADER,GRID OR BOTH
            colors: [
              null,
              null,
              null,
              null,
              null,
              'rgb(232,244,252,0.65)',
              'rgb(232,244,252,0.65)',
            ], // monday to sunday in order
          },
          tickFormatter(val, axis) {
            const relativeDay = getRelativeDay(val, startDate);
            const t = axis.tickSize[0] * timeUnitSize[axis.tickSize[1]]; // size * unitSize[unit]
            let fmt;
            const isMonthOrWeek =
              axis.majorTickSize[1] === 'month' ||
              axis.majorTickSize[1] === 'week'
                ? true
                : false;
            const availableSpace = isFunction(axis.p2c)
              ? axis.p2c(axis.min + axis.tickStep) - axis.p2c(axis.min)
              : 0;
            if (t < timeUnitSize.day) fmt = '\n%H:%M';
            else if (
              t >= timeUnitSize.day &&
              isMonthOrWeek &&
              this.font.size * 5 < availableSpace
            )
              //To display 3 letter string for weekday [Two digits (1+1) + One Capital letter (1) + Two small letters (0.5 + 0.5) => total font digits 4].Took 5 for readability.
              fmt = '\n%W %D \n' + relativeDay;
            else if (
              t >= timeUnitSize.day &&
              isMonthOrWeek &&
              this.font.size * 3.5 < availableSpace &&
              availableSpace <= this.font.size * 5
            )
              //To display 2 letter string for weekday [Two digits (1+1) + One Capital letter (1) + One small letter (0.5) => total font digits 3.5]
              fmt = '%t\n%D\n' + relativeDay;
            else if (
              t >= timeUnitSize.day &&
              isMonthOrWeek &&
              this.font.size * 3 < availableSpace &&
              availableSpace <= this.font.size * 3.5
            )
              //To display single letter string for weekday [Two digits (1+1) + One Capital letter (1) => total font digits 3]
              fmt = '%t\n%D\n' + relativeDay;
            else if (t >= timeUnitSize.day && isMonthOrWeek)
              fmt = '%t\n%D\n' + relativeDay;
            else fmt = '%W \n%d';

            return window.$.chronos.formatDate(new Date(val), fmt, null);
          },
          multiLineTimeHeader: {
            enable: true, // means chart will be created with a major and minor
            majorTickLabelHeight: 18,
            minorTickLabelHeight: 54,
            header: {
              minorTickLines: 'hide', //hide
              majorTickLines: 'hide', //hide
              tickRenderer: calendarHeaderLines,
            },
            minorTickLabel: {
              tickPosition: 'ontick', // ontick
              zeroHour: 'hide', //hide
            },
            drawHorizontalLine: 'hide',
            majorLabelRenderer: majorLabelRenderer,
            minorLabelRenderer: minorLabelRenderer,
            majorTickFormatter(val, axis) {
              const relativeDay = getRelativeDay(val, startDate);
              const dayName = new Date(val).toLocaleDateString('en-US', {
                weekday: 'long',
              });
              let fmt = '%0f %y';
              const t = axis.tickSize[0] * timeUnitSize[axis.tickSize[1]]; // size * unitSize[unit]
              if (t < timeUnitSize.day)
                fmt = dayName + ', %0f %D, %y    ' + relativeDay;
              return window.$.chronos.formatDate(new Date(val), fmt, null);
            },
            majorTickSizeProvider(viewAreaInTime) {
              if (
                viewAreaInTime >= 691200000 && // 86400000 * 8
                viewAreaInTime <= 2592000000
              ) {
                const tickSize = [1, 'month'];
                return tickSize;
              }
            },
            displayWeek: {
              enable: true,
            },
            majorTickStyle: {
              tickColor: '#e0e0e0',
              dashedLine: false,
              drawTickOnTop: false,
              dashedStyle: [2, 2],
              lineWidth: 2,
              majorTickLength: 'full',
              tickRenderer: majorTickStyleCallbackFunction,
            },
          },
        },
        columnHeaderDrag: {
          interactive: true,
          selectionStyle: {
            lineWidth: 1,
            lineColor: '#ffffff',
            fillColor: 'rgba(51, 51, 51, 0.5)',
            type: 'HEADER_ONLY', //COMPLETE_HEADER, HEADER_ONLY OR FULL (selection drawn full the plot height)
          },
        },
        rectangleSelect: {
          interactive: true,
        },
        pan: {
          interactive: false,
        },
        plotResize: {
          resizeCallback: callbackFns.reinitializeZoomVariables,
        },
      },
    },
    interationRestrictMap: {},
    completedItems: {
      enable: false,
      itemTypes: null,
      itemProviderCallback: null, // callback for custom checks
    },
    showPaneToolbar: true,
    customPaneToolbar: {
      isEnabled: true,
      icons: [
        {
          id: 'filter', // Unique id for tool-bar item
          title: 'filter', // title for the tool-bar item
          icon: 'paneIconSprite.svg', // icon file name
          class: 'filter', // css style class
          callback: callbackFns.toggleFilterPane, // callback scope function-name
        },
        {
          id: 'clear', // Unique id for tool-bar item
          title: 'clear', // title for the tool-bar item
          icon: 'paneIconSprite.svg', // icon file name
          class: 'clear', // css style class
          callback: callbackFns.handleClear, // callback scope function-name
        },
        {
          id: 'select-all', // Unique id for tool-bar item
          title: 'select-all', // title for the tool-bar item
          icon: 'paneIconSprite.svg', // icon file name
          class: 'select-all', // css style class
          callback: callbackFns.applySelectAll, // callback scope function-name
        },
      ],
    },
    menuHandler: {
      options: callbackFns.getMenuOptions, // menu items
      callback: callbackFns.handleMenuCallback, // callback fired on menu click
      title: {
        callback: callbackFns.getMenuTitle,
        mode: 'override', // 'selection'
      },
    },
  };
};
