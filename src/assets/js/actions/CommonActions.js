var AppDispatcher = require('../dispatchers/AppDispatcher');
var appConstants = require('../constants/appConstants');

var commonActions = {
  addData : function(data){
    AppDispatcher.handleAction({
      actionType: appConstants.ADD_DATA, 
      data: data
    });
  },
  setupLocalStorage : function(){
     AppDispatcher.handleAction({
      actionType: appConstants.SETUP_LOCAL_STORAGE,
    });
  },
  showForm : function(data){
    AppDispatcher.handleAction({
      actionType: appConstants.SHOW_FORM, 
      data: data
    });
  },
  editMode : function(data){
    AppDispatcher.handleAction({
      actionType: appConstants.EDIT_MODE, 
      data: data
    }); 
  },
  deleteMode: function(data){
    AppDispatcher.handleAction({
      actionType: appConstants.DELETE_MODE, 
      data: data
    });
  }

};

module.exports = commonActions;