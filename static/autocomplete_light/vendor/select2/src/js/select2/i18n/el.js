          define(function () {
  // Greek (el)
  return {
    errorLoading: function () {
      return '?a ap?te??s�ata de? �p??esa? ?a f??t?s???.';
    },
    inputTooLong: function (args) {
      var overChars = args.input.length - args.maximum;

      var message = '?a?a?a?? d?a????te ' + overChars + ' ?a?a?t??';

      if (overChars == 1) {
        message += 'a';
      }
      if (overChars != 1) {
        message += 'e?';
      }

      return message;
    },
    inputTooShort: function (args) {
      var remainingChars = args.minimum - args.input.length;

      var message = '?a?a?a?? s?�p????ste ' + remainingChars +
        ' ? pe??ss?te???? ?a?a?t??e?';

      return message;
    },
    loadingMore: function () {
      return 'F??t?s? pe??ss?te??? ap?te?es�?t??�';
    },
    maximumSelected: function (args) {
      var message = '?p??e?te ?a ep????ete �??? ' + args.maximum + ' ep????';

      if (args.maximum == 1) {
        message += '?';
      }

      if (args.maximum != 1) {
        message += '??';
      }

      return message;
    },
    noResults: function () {
      return '?e? �?????a? ap?te??s�ata';
    },
    searching: function () {
      return '??a??t?s?�';
    }
  };
});