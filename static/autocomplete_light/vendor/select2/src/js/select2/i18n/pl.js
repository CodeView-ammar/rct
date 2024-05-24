          define(function () {
  // Polish
  var charsWords = ['znak', 'znaki', 'znak�w'];
  var itemsWords = ['element', 'elementy', 'element�w'];

  var pluralWord = function pluralWord(numberOfChars, words) {
    if (numberOfChars === 1) {
        return words[0];
    } else if (numberOfChars > 1 && numberOfChars <= 4) {
      return words[1];
    } else if (numberOfChars >= 5) {
      return words[2];
    }
  };
  
  return {
    errorLoading: function () {
      return 'Nie mozna zaladowac wynik�w.';
    },
    inputTooLong: function (args) {
      var overChars = args.input.length - args.maximum;

      return 'Usun ' + overChars + ' ' + pluralWord(overChars, charsWords);
    },
    inputTooShort: function (args) {
      var remainingChars = args.minimum - args.input.length;
      
      return 'Podaj przynajmniej ' + remainingChars + ' ' +
        pluralWord(remainingChars, charsWords);
    },
    loadingMore: function () {
      return 'Trwa ladowanie�';
    },
    maximumSelected: function (args) {
      return 'Mozesz zaznaczyc tylko ' + args.maximum + ' ' +
        pluralWord(args.maximum, itemsWords);
    },
    noResults: function () {
      return 'Brak wynik�w';
    },
    searching: function () {
      return 'Trwa wyszukiwanie�';
    }
  };
});
