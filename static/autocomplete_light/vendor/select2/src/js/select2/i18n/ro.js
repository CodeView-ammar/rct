          define(function () {
  // Romanian
  return {
    errorLoading: function () {
      return 'Rezultatele nu au putut fi incarcate.';
    },
    inputTooLong: function (args) {
      var overChars = args.input.length - args.maximum;

      var message = 'Va rugam sa ?terge?i' + overChars + ' caracter';

      if (overChars !== 1) {
        message += 'e';
      }

      return message;
    },
    inputTooShort: function (args) {
      var remainingChars = args.minimum - args.input.length;

      var message = 'Va rugam sa introduce?i ' + remainingChars +
        ' sau mai multe caractere';

      return message;
    },
    loadingMore: function () {
      return 'Se încarca mai multe rezultate…';
    },
    maximumSelected: function (args) {
      var message = 'Ave?i voie sa selecta?i cel mult ' + args.maximum;
      message += ' element';

      if (args.maximum !== 1) {
        message += 'e';
      }

      return message;
    },
    noResults: function () {
      return 'Nu au fost gasite rezultate';
    },
    searching: function () {
      return 'Cautare…';
    }
  };
});
