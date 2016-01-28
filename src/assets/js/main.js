global.jQuery = global.$ = require("jquery");
var React = require('react');
var ReactDOM = require('react-dom');

var BillManager = require('./components/BillManager'); 
var App = React.createClass({
  getInitialState: function(){
    return null;
  },
  render: function(){
    return (
      <div className="body-container">
        <BillManager />
      </div>
    );
  }
});


ReactDOM.render(
    <App />,
    document.getElementById('app')
)
