var AppDispatcher = require('../dispatchers/AppDispatcher');
var appConstants = require('../constants/appConstants');
var objectAssign = require('react/lib/Object.assign');
var EventEmitter = require('events').EventEmitter;
var CommonActions = require('../actions/CommonActions');


var CHANGE_EVENT = 'change';
var _errMsg = null;
var _component = 'addFriend';
var friendArray = [];
var billArray = [];
var singleBill ={};



var billstore = objectAssign({}, EventEmitter.prototype, {
  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },
  addChangeListener: function(cb){
    this.on(CHANGE_EVENT, cb);
  },
  removeChangeListener: function(cb){
    this.removeListener(CHANGE_EVENT, cb);
  },
  getSingleBill : function(data){
    var billArray = JSON.parse(sessionStorage.getItem('billData'));
    singleBill = {
      'billNumber' : billArray[data.index].billNumber,
      'friend' : billArray[data.index].friend,
      'amount' : billArray[data.index].amount,
      'description' : billArray[data.index].description,
      'index' : data.index
    };
   

  },
  deletBill: function(data){
    var data2 = data;
    var billArray = JSON.parse(sessionStorage.getItem('billData'));
    billArray.splice(data.index, 1);
    billArray.map(function(data, index){
      if(data.billNumber === data2.billNumber){
        billArray[index].peopleCount = parseInt(billArray[index].peopleCount) - 1;
      }
      sessionStorage.setItem('billData', JSON.stringify(billArray));
    });
    this.getBillData(); 
    _component = 'viewBill';
    console.log(billArray);
  },
  singleBill : function(){
    return singleBill;
  },
  setComponent : function(data){
    _component = data;
  },
  getCurrentComponent : function(){
    return _component;
  },
  setupStorage : function(){
     var sessionFriend = JSON.parse(sessionStorage.getItem('friendData'));
     var sessionBill = JSON.parse(sessionStorage.getItem('billData'));
    if(sessionFriend == null){
      friendArray.push(JSON.parse(sessionStorage.getItem('friendData')));
      sessionStorage.setItem('friendData', JSON.stringify(friendArray));
    }else{
      
    }
    if(sessionBill == null){
      billArray.push(JSON.parse(sessionStorage.getItem('billData')));
      sessionStorage.setItem('billData', JSON.stringify(billArray));
    }else{

    }
    

  },
  viewData : function(){
    var friendData = JSON.parse(sessionStorage.getItem('friendData'));
    var billData = JSON.parse(sessionStorage.getItem('billData'));
    console.log(billData);
    console.log(friendData);
    
  },
  addData : function(data){
    if(data.data_type == 'addFriend'){
      friendArray = JSON.parse(sessionStorage.getItem('friendData'));
      if(friendArray[0] == null){
        friendArray = [];
      }
      friendArray.push(data.data);     
      sessionStorage.setItem('friendData', JSON.stringify(friendArray));
      _component = 'addBill';
    }else if(data.data_type == 'addBill'){
      friendArray = JSON.parse(sessionStorage.getItem('friendData'));
      var friend_exists = false;
      var data1 = data;
      friendArray.map(function(data, index){
        if(data.addFriend == data1.data.friend){
          friend_exists = true;
        }
      });
      if(friend_exists == true){
        billArray = JSON.parse(sessionStorage.getItem('billData'));
        var sameAmount = false;
        if(billArray[0] == null){
          billArray = [];
        }
         var count = 0;
          billArray.map(function(data, index){
            if(data.billNumber == data1.data.billNumber ){
              if(data.amount == data1.data.amount){
                sameAmount = true;
              }else{

              }
              count = count + 1;
            } 
          });
        if(sameAmount == false && count != 0){
          alert('For the Bill Number :'+data1.data.billNumber + ' total amount doesnt match. Please add the same amount as added at the time registering new bill.')
          _component = 'addBill';
        }else{ 
          billArray.push(data.data);
          billArray.map(function(data, index){
              if(data.billNumber == data1.data.billNumber){
                billArray[index].peopleCount = parseInt(count) + 1;
                sessionStorage.setItem('billData', JSON.stringify(billArray));
              }else{
                sessionStorage.setItem('billData', JSON.stringify(billArray));
              } 
          });
          this.getBillData(); 
          _component = 'viewBill';
        }
        
       
      }else{
        _component = 'addFriend';
        alert('The friend name doesnt exist in our local storage');
      }
    }
   else if(data.data_type == 'editBill'){
      friendArray = JSON.parse(sessionStorage.getItem('friendData'));
      var friend_exists = false;
      var data1 = data;
      friendArray.map(function(data, index){
        if(data.addFriend == data1.data.friend){
          friend_exists = true;
        }
      });
      if(friend_exists == true){
        billArray = JSON.parse(sessionStorage.getItem('billData'));
        var sameAmount = false;
        if(billArray[0] == null){
          billArray = [];
        }
        
          billArray.map(function(data, index){
            if(data.billNumber == data1.data.billNumber ){
                billArray[index].amount = data1.data.amount;
            } 
          });

          billArray[data1.data.index].friend = data1.data.friend;
          billArray[data1.data.index].description = data1.data.description;
          sessionStorage.setItem('billData', JSON.stringify(billArray));
           this.getBillData(); 
          _component = 'viewBill';    
       
      }else{
        _component = 'addFriend';
        alert('The friend name doesnt exist in our local storage');
      }
    }
  },
  getBillData : function(){
    return  JSON.parse(sessionStorage.getItem('billData'));
  }
});


AppDispatcher.register(function(payload){
  var action = payload.action;
  switch(action.actionType){
    case appConstants.SETUP_LOCAL_STORAGE:
      billstore.setupStorage();
      break;
    case appConstants.ADD_DATA:
      billstore.addData(action.data);
      billstore.viewData();
      billstore.emitChange(CHANGE_EVENT);
      break;
    case appConstants.SHOW_FORM:
      billstore.setComponent(action.data);
      billstore.emitChange(CHANGE_EVENT);
      break;
    case appConstants.EDIT_MODE:
      billstore.getSingleBill(action.data);
      billstore.setComponent(action.data.data);
      billstore.emitChange(CHANGE_EVENT);
      break; 
    case appConstants.DELETE_MODE:
      billstore.deletBill(action.data);
      billstore.setComponent(action.data.data);
      billstore.emitChange(CHANGE_EVENT);
      break;        
    default:
      return true;
  }
});

module.exports = billstore;