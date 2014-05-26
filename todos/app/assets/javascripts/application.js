// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require angular
//= require angular-resource
//= require angular-route
//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require_tree .

var app = angular.module('app', ['ngResource']);

app.config(function ($httpProvider) {
  // CSRF
  $httpProvider.defaults.headers.common['X-CSRF-Token'] = $('meta[name=csrf-token]').attr('content');
});

app.factory('Todo', function($resource) {
  return $resource("/todos/:id.json", {id: '@id'}, {
    update: {
      method: 'PUT'
    },
	remove:{
		method: 'DELETE'
	},
	save:{
		method: 'POST'
	}	
  })
});

app.controller('TodosCtrl', function ($scope, Todo, $resource) {
	//query for all todos in db
	$scope.todos = Todo.query();
	//add todo to scope + db
	$scope.addTodo = function(e){
		e.preventDefault();
		 var newTodo = {
			complete: false,
			title: $scope.nextTodo
		 };
		$scope.todos.push(newTodo);
		Todo.save(newTodo);
	}
	//toggle complete/incomplete status
	$scope.toggleComplete = function(todo) {
		todo.complete = !todo.complete;
		Todo.update(todo);
		console.log(todo)

	};
	//delete to do from scope + db
	$scope.deleteTodo = function(e,todo) {
		e.preventDefault();
		Todo.remove(todo);		
		$scope.todos = removeByAttr($scope.todos, 'id', todo.id)
	};


});

//helper function to remove item from array based on key value
	var removeByAttr = function(arr, attr, value){
		var i = arr.length;
		while(i--){
			if(arr[i] && arr[i].hasOwnProperty(attr) && (arguments.length > 2 && arr[i][attr] === value )){
				arr.splice(i,1);
				}
			}
			return arr;
	}	
