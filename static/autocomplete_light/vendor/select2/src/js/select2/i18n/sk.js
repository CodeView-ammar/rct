          define(function () {
  // Slovak

  // use text for the numbers 2 through 4
  var smallNumbers = {
    2: function (masc) { return (masc ? 'dva' : 'dve'); },
    3: function () { return 'tri'; },
    4: function () { return '�tyri'; }
  };

  return {
    errorLoading: function () {
      return 'V�sledky sa nepodarilo nac�tat.';
    },
    inputTooLong: function (args) {
      var overChars = args.input.length - args.maximum;

      if (overChars == 1) {
        return 'Pros�m, zadajte o jeden znak menej';
      } else if (overChars >= 2 && overChars <= 4) {
        return 'Pros�m, zadajte o ' + smallNumbers[overChars](true) +
          ' znaky menej';
      } else {
        return 'Pros�m, zadajte o ' + overChars + ' znakov menej';
      }
    },
    inputTooShort: function (args) {
      var remainingChars = args.minimum - args.input.length;

      if (remainingChars == 1) {
        return 'Pros�m, zadajte e�te jeden znak';
      } else if (remainingChars <= 4) {
        return 'Pros�m, zadajte e�te dal�ie ' +
          smallNumbers[remainingChars](true) + ' znaky';
      } else {
        return 'Pros�m, zadajte e�te dal��ch ' + remainingChars + ' znakov';
      }
    },
    loadingMore: function () {
      return 'Nac�tanie dal��ch v�sledkov�';
    },
    maximumSelected: function (args) {
      if (args.maximum == 1) {
        return 'M��ete zvolit len jednu polo�ku';
      } else if (args.maximum >= 2 && args.maximum <= 4) {
        return 'M��ete zvolit najviac ' + smallNumbers[args.maximum](false) +
          ' polo�ky';
      } else {
        return 'M��ete zvolit najviac ' + args.maximum + ' polo�iek';
      }
    },
    noResults: function () {
      return 'Nena�li sa �iadne polo�ky';
    },
    searching: function () {
      return 'Vyhlad�vanie�';
    }
  };
});
