          define(function () {
  // Finnish
  return {
    errorLoading: function () {
      return 'Tuloksia ei saatu ladattua.';
    },
    inputTooLong: function (args) {
      var overChars = args.input.length - args.maximum;

      return 'Ole hyv� ja anna ' + overChars + ' merkki� v�hemm�n';
    },
    inputTooShort: function (args) {
      var remainingChars = args.minimum - args.input.length;

      return 'Ole hyv� ja anna ' + remainingChars + ' merkki� lis��';
    },
    loadingMore: function () {
      return 'Ladataan lis�� tuloksia�';
    },
    maximumSelected: function (args) {
      return 'Voit valita ainoastaan ' + args.maximum + ' kpl';
    },
    noResults: function () {
      return 'Ei tuloksia';
    },
    searching: function () {
      return 'Haetaan�';
    }
  };
});
