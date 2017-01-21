app.directive('saveGlyph', function () {
  return {
    restrict: 'E',
    scope: {
      boolean: '='
    },
    templateUrl: 'views/directives/save-glyph.html'
  }
})
