app.directive('glyphCheckbox', function () {
  return {
    restrict: 'E',
    scope: {
      boolean: "="
    },
    templateUrl: 'views/directives/glyph-checkbox.html'
  };
});
