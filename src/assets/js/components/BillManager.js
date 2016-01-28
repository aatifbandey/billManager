var React = require('react');
var Router = require('react-router');

var billstore = require('../stores/billstore');
var CommonActions = require('../actions/CommonActions');
var resourceConstants = require('../constants/resourceConstants');
var Input = require("./Input")

var virtualKeyBoard_login;
function getState(){
   return {
      component : billstore.getCurrentComponent(),
      billData : billstore.getBillData(),
      singleBill : billstore.singleBill()
  }
}
function editMode(Index){
  var data = {
    'index' :  Index,
    'data' : 'editBill'
  }
  CommonActions.editMode(data)
}
function deleteMode(Index, billNo){
  var data = {
    'index' :  Index,
    'billNumber' : billNo,
    'data' : 'viewBill'
  }
  CommonActions.deleteMode(data)
}
var BillManager = React.createClass({
  getInitialState: function(){
    return getState();
  },
  addFriend: function(){
    var data ={
      'data_type' : 'addFriend',
      'data' :{
        'addFriend' : document.getElementById('add_name').value
      }
    }
    document.getElementById('add_name').value = '';
    CommonActions.addData(data);
  }, 
  addBill: function(param){ 
    var index;  
    if(param == 'editBill'){
      index =  this.state.singleBill.index;
    }else{
      index = null;
    }
    var data ={
      'data_type' : param,
      'data' :{
          'billNumber' : document.getElementById('bill_no').value,
          'friend' : document.getElementById('name').value,
          'amount' : document.getElementById('amount').value,
          'description' : document.getElementById('description').value,
          'peopleCount' : 1,
          'index' : index
        }
    }
    document.getElementById('bill_no').value = '';
    document.getElementById('name').value = '';
    document.getElementById('amount').value = '';
    document.getElementById('description').value = '';
    CommonActions.addData(data)  
  }, 
  showForm: function(arg){
    if(document.getElementById('bill_no') != undefined){
      document.getElementById('bill_no').value = '';
      document.getElementById('name').value = '';
      document.getElementById('amount').value = '';
      document.getElementById('description').value = '';
    }
    if(document.getElementById('add_name') != undefined){
      document.getElementById('add_name').value = '';
    }
    CommonActions.showForm(arg)
  },
  componentDidMount: function(){
    CommonActions.setupLocalStorage();
    billstore.addChangeListener(this.onChange);  
  },
  componentWillUnmount: function(){
   billstore.addChangeListener(this.onChange); 
  },
  onChange: function(){    
    this.setState(getState());
  },
  render: function(){
    console.log(this.state.singleBill);
    var d = new Date();
    var n = d.getFullYear();   
    var seatData;
    var display = this.state.flag === true ? 'block' : 'none';
    if(this.state.component == 'addFriend'){
      var component = (<form>
                <Input label={resourceConstants.FRIEND_NAME} id={'add_name'} placeholder={'Enter name'} reference={'add_name'}/>
                  <input type="button" className="btn btn-default allButton" id="allButton" onClick={this.addFriend} value="Add Freind" />
                  <input type="button" className="btn btn-default allButton" id="allButton" onClick={this.showForm.bind(this , 'addBill')} value="Add Bill" />
                  <input type="button" className="btn btn-default allButton" id="allButton" onClick={this.showForm.bind(this , 'viewBill')} value="View Bills" />
                </form>
                 
      );
    }else if(this.state.component == 'addBill' || this.state.component == 'editBill'){
      var buttonName;
      var param;
      if(this.state.component == 'addBill'){
        buttonName = 'Add Bill';
        param = 'addBill';
      }else{
        buttonName = 'Update Bill';
        param ='editBill';
      }
       var component = (<form>
                <Input label={resourceConstants.BILL_NO} id={'bill_no'} placeholder={'Enter/Add bill Number'} status={this.state.component} ref={'bill_no'} value={this.state.singleBill.billNumber}/>
                <Input label='Link Friend' id={'name'} placeholder={'Enter name'} status={this.state.component} ref={'name'} value={this.state.singleBill.friend}/>
                <Input label={resourceConstants.TOTALBILL} id={'amount'} status={this.state.component}  placeholder={'Enter amount'} ref={'amount'} value={this.state.singleBill.amount}/>
                <Input label={resourceConstants.DESCRIPTION} id={'description'}  status={this.state.component} placeholder={'Enter description'} ref={'description'} value={this.state.singleBill.description}/>
                <input type="button" className="btn btn-default allButton" id="allButton" onClick={this.addBill.bind(this, param )} value={buttonName} />
                <input type="button" className="btn btn-default allButton" id="allButton" onClick={this.showForm.bind(this , 'viewBill')} value="View Bills" />
                </form>
                 
      );
    }
    else if(this.state.component == 'viewBill'){
      var tableStructure;
     if(this.state.billData.length > 0 && this.state.billData[0] != null){
          tableStructure = this.state.billData.map(function(data, index){ 
            var amount_to_pay = parseInt(data.amount) / parseInt(data.peopleCount);
              return(
                <tr>
                  <td>{data.friend}</td>
                  <td>{data.billNumber}</td>
                  <td>{amount_to_pay}</td>
                  <td>{data.amount}</td>
                  <td>{data.description}</td>
                  <td><input type="button" className="btn btn-default allButton editButton" id="allButton" onClick={editMode.bind(this, index)} value="Edit Bill" /></td>
                  <td><input type="button" className="btn btn-default allButton editButton" id="allButton" onClick={deleteMode.bind(this, index , data.billNumber)} value="Delete" /></td>
                </tr>
              )
          });
      }else{
       
        tableStructure ='';
        
      }
       var component = (<form>
                <table className='table'>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Bill Number</th>
                      <th>Amount to be paid</th>
                      <th>Total Amount</th>
                      <th>Description</th>
                      <th>Edit</th>
                      <th>Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableStructure}
                  </tbody>
                </table>
                <input type="button" className="btn btn-default allButton" id="allButton" onClick={this.showForm.bind(this , 'addBill')} value="Add New Bill" />
                <input type="button" className="btn btn-default allButton" id="allButton" onClick={this.showForm.bind(this, 'addFriend')} value="Add New Friend" />
                </form>
                 
      );
    }
   
        
        return (
        <div>
          <div className="headerMainPage">
                  <div className="logo">
                    <h1>Bill Manager</h1>
                  </div>
                  
          </div>
          <div className="bodyContent">
                <div className="bodyMainPage">
                
                    <div className="userFormMainPage">
                      {component}
                  </div>

                </div>
            </div>
        </div>
      );


    
  }
});

module.exports = BillManager;

