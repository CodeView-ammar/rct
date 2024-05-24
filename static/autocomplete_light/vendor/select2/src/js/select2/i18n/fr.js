          define(function () {
  // French
  return {
    errorLoading: function () {
      return 'Les r�sultats ne peuvent pas �tre charg�s.';
    },
    inputTooLong: function (args) {
      var overChars = args.input.length - args.maximum;

      return 'Supprimez ' + overChars + ' caract�re' +
        ((overChars > 1) ? 's' : '');
    },
    inputTooShort: function (args) {
      var remainingChars = args.minimum - args.input.length;

      return 'Saisissez au moins ' + remainingChars + ' caract�re' +
        ((remainingChars > 1) ? 's' : '');
    },
    loadingMore: function () {
      return 'Chargement de r�sultats suppl�mentaires�';
    },
    maximumSelected: function (args) {
      return 'Vous pouvez seulement s�lectionner ' + args.maximum +
        ' �l�ment' + ((args.maximum > 1) ? 's' : '');
    },
    noResults: function () {
      return 'Aucun r�sultat trouv�';
    },
    searching: function () {
      return 'Recherche en cours�';
    }
  };
});
