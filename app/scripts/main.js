// Defines the Backbone Model constructor
TaskModel = Backbone.Model.extend({
	idAttribute: '_id',
});

// Defines the Backbone Collection constructor
TaskCollection = Backbone.Collection.extend({
	model: TaskModel,
	url: 'http://tiny-pizza-server.herokuapp.com/collections/whitneytodoapp',
});

// Defines the Backbone View constructor
TaskView = Backbone.View.extend({
  listTemplate: _.template($('.taskList').text()),
  editTemplate: _.template($('.editTaskList').text()),

  events: {
    'click .edit-btn'		: 'editTask',
    'click .save-btn'		: 'saveTask',
    'click .done-btn'		: 'markTaskDone',
    'click .delete-btn'	: 'deleteTask',
    'keydown input'			: 'checkForChanges'
  },

	initialize: function(){
		this.listenTo(this.model, 'change', this.render);
 
    $('.main-container').prepend(this.el);
    this.render();
  },

	render: function(){
		var renderedTemplate = this.listTemplate(this.model.attributes);
    this.$el.html(renderedTemplate);
  },

	editTask: function(){
    var renderedTemplate = this.editTemplate(this.model.attributes);
    this.$el.html(renderedTemplate);
	},

	saveTask: function(){
		var nameVal = this.$el.find('.name input').val();
    this.model.set('name', nameVal);
    this.model.save();
	},

	markTaskDone: function(){
		this.$el.find('.task').addClass('done');
	},

	deleteTask: function(){
		this.model.destroy();
    this.remove();
	},

	checkForChanges: function(){
    if (this.model.get('name') !== this.$el.find('.name input').val()){
      this.$el.find('.name input').addClass('changed');
    } else {
      this.$el.find('.name input').removeClass('changed');
    }
  }
});

//Create a new collection instance
var taskC = new TaskCollection();

// Giving functionality to the "Create New Task" button
	//when you click the button...
$('.create-btn').click(function () {
	//give the text in the todo-input field a name so it can be used in a chain
	var inputVal = $('.todo-input').val();
	//adds the input value to the collection instance
	newestTodo = taskC.add({taskText: inputVal});
	//saves that input value to the server
	newestTodo.save();
	//clears the value of the todo-input box
		$('.todo-input').val('');
	//creates a new view instance with the above collection
	new TaskView({model: newestTodo});
});

//fetches the taskC collection instance from the server; when done...
taskC.fetch().done(function(){
	//forEaches over model instance arrays inside the taskC collection instance
  taskC.each(function(aTaskInstance){
		//creates a new task view called "taskV", which contains an array of task (model) instances
    new TaskView({model: aTaskInstance});
  });
});