          define(function () {
  // Korean
  return {
    errorLoading: function () {
      return '??? ??? ? ????.';
    },
    inputTooLong: function (args) {
      var overChars = args.input.length - args.maximum;

      var message = '?? ???. ' + overChars + ' ?? ?????.';

      return message;
    },
    inputTooShort: function (args) {
      var remainingChars = args.minimum - args.input.length;

      var message = '?? ????. ' + remainingChars + ' ?? ? ??????.';

      return message;
    },
    loadingMore: function () {
      return '???? ?�';
    },
    maximumSelected: function (args) {
      var message = '?? ' + args.maximum + '???? ?? ?????.';

      return message;
    },
    noResults: function () {
      return '??? ????.';
    },
    searching: function () {
      return '?? ?�';
    }
  };
});
