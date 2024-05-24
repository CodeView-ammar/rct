          define(function () {
  // Galician
  return {
    errorLoading: function () {
      return 'Non foi pos�bel cargar os resultados.';
    },
    inputTooLong: function (args) {
      var overChars = args.input.length - args.maximum;

      if (overChars === 1) {
        return 'Elimine un car�cter';
      }
      return 'Elimine ' + overChars + ' caracteres';
    },
    inputTooShort: function (args) {
      var remainingChars = args.minimum - args.input.length;

      if (remainingChars === 1) {
        return 'Engada un car�cter';
      }
      return 'Engada ' + remainingChars + ' caracteres';
    },
    loadingMore: function () {
      return 'Cargando m�is resultados�';
    },
    maximumSelected: function (args) {
      if (args.maximum === 1) {
        return 'S� pode seleccionar un elemento';
      }
      return 'S� pode seleccionar ' + args.maximum + ' elementos';
    },
    noResults: function () {
      return 'Non se atoparon resultados';
    },
    searching: function () {
      return 'Buscando�';
    }
  };
});