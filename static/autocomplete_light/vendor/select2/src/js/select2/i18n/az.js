          define(function () {
  // Azerbaijani
  return {
    inputTooLong: function (args) {
      var overChars = args.input.length - args.maximum;

      return overChars + ' simvol silin';
    },
    inputTooShort: function (args) {
      var remainingChars = args.minimum - args.input.length;

      return remainingChars + ' simvol daxil edin';
    },
    loadingMore: function () {
      return 'Daha çox n?tic? yükl?nir…';
    },
    maximumSelected: function (args) {
      return 'Sad?c? ' + args.maximum + ' element seç? bil?rsiniz';
    },
    noResults: function () {
      return 'N?tic? tapilmadi';
    },
    searching: function () {
      return 'Axtarilir…';
    }
  };
});
