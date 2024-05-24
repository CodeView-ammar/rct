
define(function () {
    // Danish
    return {
      errorLoading: function () {
        return 'Resultaterne kunne ikke indl�ses.';
      },
      inputTooLong: function (args) {
        var overChars = args.input.length - args.maximum;
  
        return 'Angiv venligst ' + overChars + ' tegn mindre';
      },
      inputTooShort: function (args) {
        var remainingChars = args.minimum - args.input.length;
  
        return 'Angiv venligst ' + remainingChars + ' tegn mere';
      },
      loadingMore: function () {
        return 'Indl�ser flere resultater�';
      },
      maximumSelected: function (args) {
        var message = 'Du kan kun v�lge ' + args.maximum + ' emne';
  
        if (args.maximum != 1) {
          message += 'r';
        }
  
        return message;
      },
      noResults: function () {
        return 'Ingen resultater fundet';
      },
      searching: function () {
        return 'S�ger�';
      }
    };
  });
  