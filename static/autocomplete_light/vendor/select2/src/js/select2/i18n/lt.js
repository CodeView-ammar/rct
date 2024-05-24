          define(function () {
  // rules from
  // http://www.unicode.org/cldr/charts/latest/supplemental/language_plural_rules.html#lt
  function ending(count, one, few, other) {
    if (count % 10 === 1 && (count % 100 < 11 || count % 100 > 19)) {
      return one;
    } else if (
      (count % 10 >= 2 && count % 10 <= 9) &&
      (count % 100 < 11 || count % 100 > 19)) {
      return few;
    } else {
      return other;
    }
  }

  return {
    inputTooLong: function (args) {
      var overChars = args.input.length - args.maximum;

      var message = 'Pašalinkite ' + overChars + ' simbol';

      message += ending(overChars, 'i', 'ius', 'iu');

      return message;
    },
    inputTooShort: function (args) {
      var remainingChars = args.minimum - args.input.length;

      var message = 'Irašykite dar ' + remainingChars + ' simbol';

      message += ending(remainingChars, 'i', 'ius', 'iu');

      return message;
    },
    loadingMore: function () {
      return 'Kraunama daugiau rezultatu…';
    },
    maximumSelected: function (args) {
      var message = 'Jus galite pasirinkti tik ' + args.maximum + ' element';

      message += ending(args.maximum, 'a', 'us', 'u');

      return message;
    },
    noResults: function () {
      return 'Atitikmenu nerasta';
    },
    searching: function () {
      return 'Ieškoma…';
    }
  };
});
