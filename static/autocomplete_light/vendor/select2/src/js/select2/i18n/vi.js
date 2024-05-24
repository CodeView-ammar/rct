          define(function () {
  // Vietnamese
  return {
    inputTooLong: function (args) {
      var overChars = args.input.length - args.maximum;

      var message = 'Vui l�ng nh?p �t hon ' + overChars + ' k� t?';

      if (overChars != 1) {
        message += 's';
      }

      return message;
    },
    inputTooShort: function (args) {
      var remainingChars = args.minimum - args.input.length;

      var message = 'Vui l�ng nh?p nhi?u hon ' + remainingChars + ' k� t?';

      return message;
    },
    loadingMore: function () {
      return '�ang l?y th�m k?t qu?�';
    },
    maximumSelected: function (args) {
      var message = 'Ch? c� th? ch?n du?c ' + args.maximum + ' l?a ch?n';

      return message;
    },
    noResults: function () {
      return 'Kh�ng t�m th?y k?t qu?';
    },
    searching: function () {
      return '�ang t�m�';
    }
  };
});
