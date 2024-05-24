          define(function () {
  // Hungarian
  return {
    errorLoading: function () {
      return 'Az eredm�nyek bet�lt�se nem siker�lt.';
    },
    inputTooLong: function (args) {
      var overChars = args.input.length - args.maximum;

      return 'T�l hossz�. ' + overChars + ' karakterrel t�bb, mint kellene.';
    },
    inputTooShort: function (args) {
      var remainingChars = args.minimum - args.input.length;

      return 'T�l r�vid. M�g ' + remainingChars + ' karakter hi�nyzik.';
    },
    loadingMore: function () {
      return 'T�lt�s�';
    },
    maximumSelected: function (args) {
      return 'Csak ' + args.maximum + ' elemet lehet kiv�lasztani.';
    },
    noResults: function () {
      return 'Nincs tal�lat.';
    },
    searching: function () {
      return 'Keres�s�';
    }
  };
});
