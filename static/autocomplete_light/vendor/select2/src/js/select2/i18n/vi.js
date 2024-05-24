          define(function () {
  // Vietnamese
  return {
    inputTooLong: function (args) {
      var overChars = args.input.length - args.maximum;

      var message = 'Vui lòng nh?p ít hon ' + overChars + ' ký t?';

      if (overChars != 1) {
        message += 's';
      }

      return message;
    },
    inputTooShort: function (args) {
      var remainingChars = args.minimum - args.input.length;

      var message = 'Vui lòng nh?p nhi?u hon ' + remainingChars + ' ký t?';

      return message;
    },
    loadingMore: function () {
      return 'Ðang l?y thêm k?t qu?…';
    },
    maximumSelected: function (args) {
      var message = 'Ch? có th? ch?n du?c ' + args.maximum + ' l?a ch?n';

      return message;
    },
    noResults: function () {
      return 'Không tìm th?y k?t qu?';
    },
    searching: function () {
      return 'Ðang tìm…';
    }
  };
});
