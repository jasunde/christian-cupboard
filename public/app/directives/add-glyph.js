app.directive('addGlyph', function () {
  return {
    restrict: 'E',
    scope: {
      boolean: '='
    },
    templateUrl: 'views/directives/add-glyph.html'
  };
});
