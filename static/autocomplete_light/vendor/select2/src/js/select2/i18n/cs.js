          define(function () {
  // Czech
  function small (count, masc) {
    switch(count) {
      case 2:
        return masc ? 'dva' : 'dve';
      case 3:
        return 'tri';
      case 4:
        return 'ctyri';
    }
    return '';
  }
  return {
    errorLoading: function () {
      return 'V�sledky nemohly b�t nacteny.';
    },
    inputTooLong: function (args) {
      var n = args.input.length - args.maximum;

      if (n == 1) {
        return 'Pros�m, zadejte o jeden znak m�ne.';
      } else if (n <= 4) {
        return 'Pros�m, zadejte o ' + small(n, true) + ' znaky m�ne.';
      } else {
        return 'Pros�m, zadejte o ' + n + ' znaku m�ne.';
      }
    },
    inputTooShort: function (args) {
      var n = args.minimum - args.input.length;

      if (n == 1) {
        return 'Pros�m, zadejte je�te jeden znak.';
      } else if (n <= 4) {
        return 'Pros�m, zadejte je�te dal�� ' + small(n, true) + ' znaky.';
      } else {
        return 'Pros�m, zadejte je�te dal��ch ' + n + ' znaku.';
      }
    },
    loadingMore: function () {
      return 'Nac�taj� se dal�� v�sledky�';
    },
    maximumSelected: function (args) {
      var n = args.maximum;

      if (n == 1) {
        return 'Mu�ete zvolit jen jednu polo�ku.';
      } else if (n <= 4) {
        return 'Mu�ete zvolit maxim�lne ' + small(n, false) + ' polo�ky.';
      } else {
        return 'Mu�ete zvolit maxim�lne ' + n + ' polo�ek.';
      }
    },
    noResults: function () {
      return 'Nenalezeny ��dn� polo�ky.';
    },
    searching: function () {
      return 'Vyhled�v�n�';
    }
  };
});
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