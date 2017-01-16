app.directive('deleteGlyph', function () {
  return {
    restrict: 'E',
    scope: {
      boolean: '='
    },
    templateUrl: 'views/directives/delete-glyph.html'
  }
})
