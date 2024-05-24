          define(function () {
  // Lower Sorbian
  var charsWords = ['znamu�ko', 'znamu�ce', 'znamu�ka','znamu�kow'];
  var itemsWords = ['zapisk', 'zapiska', 'zapiski','zapiskow'];

  var pluralWord = function pluralWord(numberOfChars, words) {
    if (numberOfChars === 1) {
        return words[0];
    } else if (numberOfChars === 2) {
      return words[1];
    }  else if (numberOfChars > 2 && numberOfChars <= 4) {
      return words[2];
    } else if (numberOfChars >= 5) {
      return words[3];
    }
  };
  
  return {
    errorLoading: function () {
      return 'Wusledki njejsu se dali zacytas.';
    },
    inputTooLong: function (args) {
      var overChars = args.input.length - args.maximum;

      return 'P�osym la�uj ' + overChars + ' ' + 
        pluralWord(overChars, charsWords);
    },
    inputTooShort: function (args) {
      var remainingChars = args.minimum - args.input.length;
      
      return 'P�osym zap�daj nanejmjenjej ' + remainingChars + ' ' +
        pluralWord(remainingChars, charsWords);
    },
    loadingMore: function () {
      return 'Dal�ne wusledki se zacytaju�';
    },
    maximumSelected: function (args) {
      return 'M�o� jano ' + args.maximum + ' ' +
        pluralWord(args.maximum, itemsWords) + 'wubras.';
    },
    noResults: function () {
      return '�edne wusledki namakane';
    },
    searching: function () {
      return 'Pyta se�';
    }
  };
});
