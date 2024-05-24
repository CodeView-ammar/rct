          define(function () {
  // Catalan
  return {
    errorLoading: function () {
      return 'La c�rrega ha fallat';
    },
    inputTooLong: function (args) {
      var overChars = args.input.length - args.maximum;

      var message = 'Si us plau, elimina ' + overChars + ' car';

      if (overChars == 1) {
        message += '�cter';
      } else {
        message += '�cters';
      }

      return message;
    },
    inputTooShort: function (args) {
      var remainingChars = args.minimum - args.input.length;

      var message = 'Si us plau, introdueix ' + remainingChars + ' car';

      if (remainingChars == 1) {
        message += '�cter';
      } else {
        message += '�cters';
      }

      return message;
    },
    loadingMore: function () {
      return 'Carregant m�s resultats�';
    },
    maximumSelected: function (args) {
      var message = 'Nom�s es pot seleccionar ' + args.maximum + ' element';

      if (args.maximum != 1) {
        message += 's';
      }

      return message;
    },
    noResults: function () {
      return 'No s\'han trobat resultats';
    },
    searching: function () {
      return 'Cercant�';
    }
  };
});
