          define(function () {
  // Swedish
  return {
    errorLoading: function () {
      return 'Resultat kunde inte laddas.';
    },
    inputTooLong: function (args) {
      var overChars = args.input.length - args.maximum;

      var message = 'V�nligen sudda ut ' + overChars + ' tecken';

      return message;
    },
    inputTooShort: function (args) {
      var remainingChars = args.minimum - args.input.length;

      var message = 'V�nligen skriv in ' + remainingChars +
                    ' eller fler tecken';

      return message;
    },
    loadingMore: function () {
      return 'Laddar fler resultat�';
    },
    maximumSelected: function (args) {
      var message = 'Du kan max v�lja ' + args.maximum + ' element';

      return message;
    },
    noResults: function () {
      return 'Inga tr�ffar';
    },
    searching: function () {
      return 'S�ker�';
    }
  };
});
