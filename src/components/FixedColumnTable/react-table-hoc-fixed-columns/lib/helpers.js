'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.memoize = exports.findPrevColumnNotHidden = exports.findNextColumnNotHidden = exports.checkErrors = exports.enableStickyPosition = exports.sortColumns = exports.isNotFixed = exports.isRightFixed = exports.isLeftFixed = exports.getColumnId = void 0;

function _toConsumableArray(arr) {
  return (
    _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread()
  );
}

function _nonIterableSpread() {
  throw new TypeError('Invalid attempt to spread non-iterable instance');
}

function _iterableToArray(iter) {
  if (
    Symbol.iterator in Object(iter) ||
    Object.prototype.toString.call(iter) === '[object Arguments]'
  )
    return Array.from(iter);
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }
    return arr2;
  }
}

var getColumnId = function getColumnId(column) {
  if (column.id) return column.id;
  if (typeof column.accessor === 'string') return column.accessor;
  return null;
};

exports.getColumnId = getColumnId;

var isLeftFixed = function isLeftFixed(column) {
  return [true, 'left'].includes(column.fixed);
};

exports.isLeftFixed = isLeftFixed;

var isRightFixed = function isRightFixed(column) {
  return column.fixed === 'right';
};

exports.isRightFixed = isRightFixed;

var isNotFixed = function isNotFixed(column) {
  return !column.fixed;
};

exports.isNotFixed = isNotFixed;

var sortColumns = function sortColumns(columns) {
  return _toConsumableArray(columns.filter(isLeftFixed)).concat(
    _toConsumableArray(columns.filter(isNotFixed)),
    _toConsumableArray(columns.filter(isRightFixed))
  );
};

exports.sortColumns = sortColumns;

var enableStickyPosition = function enableStickyPosition() {
  if (typeof window === 'undefined') return true; // document is undefined in SSR

  var el = document.createElement('a');
  var mStyle = el.style;
  mStyle.cssText =
    'position:sticky;position:-webkit-sticky;position:-ms-sticky;';
  return mStyle.position.indexOf('sticky') !== -1;
};

exports.enableStickyPosition = enableStickyPosition;

var checkErrors = function checkErrors(columns) {
  var hasGroups = !!columns.find(function(column) {
    return column.columns;
  });
  var fixedColumnsWithoutGroup = columns
    .filter(function(column) {
      return column.fixed && !column.columns;
    })
    .map(function(_ref) {
      var Header = _ref.Header;
      return "'".concat(Header, "'");
    });

  if (hasGroups && fixedColumnsWithoutGroup.length) {
    throw new Error(
      'WARNING react-table-hoc-fixed-column:\n          \nYour ReactTable has group and fixed columns outside groups, and that will break UI.\n          \nYou must place '.concat(
        fixedColumnsWithoutGroup.join(' and '),
        ' columns into a group (even a group with an empty Header label)\n'
      )
    );
  }

  var bugWithUnderColumnsFixed = columns.find(function(parentCol) {
    return (
      !parentCol.fixed &&
      parentCol.columns &&
      parentCol.columns.find(function(col) {
        return col.fixed;
      })
    );
  });

  if (bugWithUnderColumnsFixed) {
    var childBugs = bugWithUnderColumnsFixed.columns.find(function(_ref2) {
      var fixed = _ref2.fixed;
      return fixed;
    });
    throw new Error(
      "WARNING react-table-hoc-fixed-column:\n          \nYour ReactTable contain columns group with at least one child columns fixed.\n          \nWhen ReactTable has columns groups, only columns groups can be fixed\n          \nYou must set fixed: 'left' | 'right' for the '"
        .concat(
          bugWithUnderColumnsFixed.Header,
          "' column, or remove the fixed property of '"
        )
        .concat(childBugs.Header, "' column.")
    );
  }
};

exports.checkErrors = checkErrors;

var findNextColumnNotHidden = function findNextColumnNotHidden(
  columns,
  currentIndex
) {
  for (var i = currentIndex + 1; i < columns.length; i += 1) {
    var column = columns[i];
    if (column.show !== false) return column;
  }

  return undefined;
};

exports.findNextColumnNotHidden = findNextColumnNotHidden;

var findPrevColumnNotHidden = function findPrevColumnNotHidden(
  columns,
  currentIndex
) {
  for (var i = currentIndex - 1; i >= 0; i -= 1) {
    var column = columns[i];
    if (column.show !== false) return column;
  }

  return undefined;
};

exports.findPrevColumnNotHidden = findPrevColumnNotHidden;

var areArgumentsEqual = function areArgumentsEqual(prevArgs, currentArgs) {
  if (!prevArgs || !currentArgs) return false;
  if (prevArgs.length !== currentArgs.length) return false;
  var prevArgSize = prevArgs.length;

  for (var index = 0; index < prevArgSize; index += 1) {
    if (prevArgs[index] !== currentArgs[index]) {
      return false;
    }
  }

  return true;
};

var memoize = function memoize(funcToMemoize) {
  var prevArgs;
  var memoizedResult;

  var getMemoizedFunction = function getMemoizedFunction() {
    for (
      var _len = arguments.length, currentArgs = new Array(_len), _key = 0;
      _key < _len;
      _key++
    ) {
      currentArgs[_key] = arguments[_key];
    }

    if (!areArgumentsEqual(prevArgs, currentArgs)) {
      memoizedResult = funcToMemoize.apply(void 0, currentArgs);
    }

    prevArgs = currentArgs;
    return memoizedResult;
  };

  return getMemoizedFunction;
};

exports.memoize = memoize;
