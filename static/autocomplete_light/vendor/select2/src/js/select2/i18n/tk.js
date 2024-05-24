          define(function () {
  // Turkmen
  return {
    errorLoading: function (){
      return 'Netije ýüklenmedi.';
    },
    inputTooLong: function (args) {
      var overChars = args.input.length - args.maximum;

      var message = overChars + ' harp bozun.';

      return message;
    },
    inputTooShort: function (args) {
      var remainingChars = args.minimum - args.input.length;

      var message = 'Ýene-de in az ' + remainingChars + ' harp ýazyn.';

      return message;
    },
    loadingMore: function () {
      return 'Köpräk netije görkezilýär…';
    },
    maximumSelected: function (args) {
      var message = 'Dine ' + args.maximum + ' sanysyny saýlan.';

      return message;
    },
    noResults: function () {
      return 'Netije tapylmady.';
    },
    searching: function () {
      return 'Gözlenýär…';
    }
  };
});
