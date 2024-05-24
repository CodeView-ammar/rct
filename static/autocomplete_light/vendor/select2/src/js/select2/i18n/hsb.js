          define(function () {
  // Upper Sorbian
  var charsWords = ['znamje�ko', 'znamje�ce', 'znamje�ka','znamje�kow'];
  var itemsWords = ['zapisk', 'zapiskaj', 'zapiski','zapiskow'];

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
      return 'Wusledki njedachu so zacitac.';
    },
    inputTooLong: function (args) {
      var overChars = args.input.length - args.maximum;

      return 'Pro�u zha�ej ' + overChars + ' ' + 
        pluralWord(overChars, charsWords);
    },
    inputTooShort: function (args) {
      var remainingChars = args.minimum - args.input.length;
      
      return 'Pro�u zapodaj znajmjen�a ' + remainingChars + ' ' +
        pluralWord(remainingChars, charsWords);
    },
    loadingMore: function () {
      return 'Dal�e wusledki so zacitaja�';
    },
    maximumSelected: function (args) {
      return 'M�e� jeno� ' + args.maximum + ' ' +
        pluralWord(args.maximum, itemsWords) + 'wubrac';
    },
    noResults: function () {
      return '�ane wusledki namakane';
    },
    searching: function () {
      return 'Pyta so�';
    }
  };
});
