app.controller('CategoryController', ['$scope', 'Auth', 'CategoryFactory', function ($scope, Auth, CategoryFactory) {
  console.log('Category Controller Running');
  
  var self = this;

  self.categories = CategoryFactory.categories;

  self.update = function (category) {
    category.saving = true;

    CategoryFactory.updateCategory(category)
      .then(function (result) {
        category.saving = false;
      });
  }

  self.toggleEditable = function (category) {
    if(category.editable) {
      category.editable = false;
    } else {
      category.editable = true;
    }
  }

  // TODO: connect to category delete once it's made
  self.delete = function () {
    console.log("Call delete category. Haven't made that yet");
  }

}]);
