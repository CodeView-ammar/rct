          define(function () {
  // Icelandic
  return {
    inputTooLong: function (args) {
      var overChars = args.input.length - args.maximum;

      var message = 'Vinsamlegast stytti� texta um ' + overChars + ' staf';

      if (overChars <= 1) {
        return message;
      }

      return message + 'i';
    },
    inputTooShort: function (args) {
      var remainingChars = args.minimum - args.input.length;

      var message = 'Vinsamlegast skrifi� ' + remainingChars + ' staf';

      if (remainingChars > 1) {
        message += 'i';
      }

      message += ' � vi�b�t';

      return message;
    },
    loadingMore: function () {
      return 'S�ki fleiri ni�urst��ur�';
    },
    maximumSelected: function (args) {
      return '�� getur a�eins vali� ' + args.maximum + ' atri�i';
    },
    noResults: function () {
      return 'Ekkert fannst';
    },
    searching: function () {
      return 'Leita�';
    }
  };
});
