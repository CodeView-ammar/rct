          define(function () {
  // Turkmen
  return {
    errorLoading: function (){
      return 'Netije ��klenmedi.';
    },
    inputTooLong: function (args) {
      var overChars = args.input.length - args.maximum;

      var message = overChars + ' harp bozun.';

      return message;
    },
    inputTooShort: function (args) {
      var remainingChars = args.minimum - args.input.length;

      var message = '�ene-de in az ' + remainingChars + ' harp �azyn.';

      return message;
    },
    loadingMore: function () {
      return 'K�pr�k netije g�rkezil��r�';
    },
    maximumSelected: function (args) {
      var message = 'Dine ' + args.maximum + ' sanysyny sa�lan.';

      return message;
    },
    noResults: function () {
      return 'Netije tapylmady.';
    },
    searching: function () {
      return 'G�zlen��r�';
    }
  };
});
