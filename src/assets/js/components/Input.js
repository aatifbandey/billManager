
var React = require('react');
var allresourceConstants = require('../constants/resourceConstants');

var InputBox = React.createClass({
	render:function(){
		var disabled ='';
	if(this.props.status == 'editBill'){
		if(this.props.id == 'bill_no'){
			disabled = 'disabled';
		}
	}		
		return (<div className="form-group">
                    <label >{this.props.label}</label>
                      <input type="text" className="form-control" id={this.props.id} disabled={disabled} defaultValue={this.props.value} placeholder={this.props.placeholder} ref={this.props.reference}  />
                 </div>
		);
	}
});

module.exports = InputBox;                      