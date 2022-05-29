import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Input ,Typography , Button,Table } from 'antd';
import {range, compile,evaluate,simplify,parse,abs,derivative} from 'mathjs'
import createPlotlyComponent from 'react-plotlyjs'
import Plotly from 'plotly.js/dist/plotly-cartesian'
import axios from "axios"
//import Title from 'antd/lib/skeleton/Title';
var dataGraph = []
const PlotlyComponent = createPlotlyComponent(Plotly)
const { Title } = Typography;

const columns = [
  {
    title: 'Iteration',
    dataIndex: 'iteration',
    key : 'iteration'
  },
  {
    title: 'X0',
    dataIndex: 'x1',
    key : 'x1'
  },
  {
    title: 'X',
    dataIndex: 'x2',
    key: 'x2'
  },
  {
    title: 'Error',
    dataIndex: 'error',
    key : 'error'
  },
];
var dataTable = [];

class NewtonRaph extends Component
{
  constructor() {
    super();
    this.state = {
      size: 'large',
    fx : "",
    x1: 0,
    x2 : 0 ,
    x0 : 0,
    showTable:false,
    apis: [],
          xlapi: "",
          xrapi: "",
          eqapi: "",
    };
    this.onInputChange = this.onInputChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  apishow = () => {
    axios.get("http://localhost:5000/data/newtonraphson").then((res) => {
      const apis = res.data;
      this.setState({
        fx: apis.fx,
        x1: apis.x0,
      })
      this.onSubmit({ apis });
    });
  };
  
  Graph(x1)
  {
        dataGraph = [
        {
          type: 'scatter',  
          x: x1,        
          marker: {         
            color: '#3c753c'
          },
          name:'X1'
        },
        ];
      
    }

    func(x) {  
      let scope = {x : parseFloat(x)};
      var expr = compile(this.state.fx);
      return expr.evaluate(scope)
  }

  error(xm,x0){
    return Math.abs(xm-x0);
  }

  
  createTable(x1,x2,error){
    dataTable =[]
    var i = 0;
    for (i=1;i<error.length;i++){
      dataTable.push({
        iteration: i ,
        x1: x1[i],
        x2: x2[i],
        error: error[i],
    });
    }
    console.log(x1)
  }

  onInputChange = (event) =>{
    this.setState({
      [event.target.name]:event.target.value
    })
    console.log(this.state);
  }
  Diff = (X) => {
    let scope = {x : X};
    console.log("scope",scope)
    var expr = derivative(this.state.fx,'x');
    console.log("epx",expr)
    return expr.evaluate(scope)
  }
  


  onSubmit (){
    var fx = this.state.fx;
    var x1 = this.state.x1;
    var x2 =0;
    var xm =0;
    var check = 0;
    var x0 =0;
    var i =0;
    var error = 1;
    var data = []
        data['x1'] = []
        data['x2'] = []
        data['error'] = []
        data['iteration'] = []

    check = this.func(x1)/this.Diff(x1);
    console.log("diff"+" "+this.Diff(x1))
    while(abs(check)>=0.000001){
      check = this.func(x1)/this.Diff(x1);
      x2 = x2 - check;
      error = this.error(x2,x1);
      data['iteration'][i] = i;
      data['x1'][i] = parseFloat(x1).toFixed(6);
      data['x2'][i] = parseFloat(x2).toFixed(6);
      data['error'][i] = error.toFixed(6);
      
      x1 = x2;
      i++;
    }

    console.log(this.state);
    this.createTable(data['x1'], data['x2'], data['error']);
    this.setState({showTable:true,showGrap:true})
    this.Graph(data['x1'])
        // const numerdata = {
        //   equ: this.state.fx,
        //   xl: this.state.x1
        // };
        // axios
        //   .post("http://localhost:7000/postdata", {
        //     numerdata,
        //   })
        //   .then((res) => {
        //     console.log(res);
        //     console.log(res.data);
        //   });
  }
 
    render(){

      let layout = {                     
        title: 'NewtonRaph',  
        xaxis: {                  
          title: 'X'         
        }
      };
      let config = {
        showLink: false,
        displayModeBar: true
      };

      const { size } = this.state;
        return (
          <div id="content" style={{ padding: 24, background: '#fff', minHeight: 360 }}>
          
          
            <Title style = {{textAlign: 'center'}}>Newton Raphson Method </Title>
            <br></br>
            
            <form style = {{textAlign: 'center'}}
              onSubmit={this.onInputChange}
            >
              <h1>Equation  : &nbsp;&nbsp;               
                <Input size="large" placeholder="Input your Function" name = "fx"style={{ width: 500 }}
                onChange={this.onInputChange}
                />
              </h1>
              <br></br>
              <h1>Xi-1 : &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <Input size="large" placeholder="Input your Xi" name = "x1"style={{ width: 500 }}
                onChange={this.onInputChange}
                />
              </h1>
              <br></br>
              
              <Button type="submit"   size={size}
              style={{ color:'#ffffff',background:'#A93226'}}
              onClick={this.onSubmit}
              >
                Submit
              </Button>
              <br></br>
              <br></br>
              <Button type="submit"   size={size}
              style={{ color:'#ffffff',background:'#f7c602'}}
              onClick={this.apishow}
              >
              Example
              </Button>
              <div>
              <ul>
                {this.state.apis.map((api) => (
                  <li>
                    <h1>Equation = {api.fx}</h1>
                    <h1>XL = {api.x1}</h1>
                  </li>
                ))}
              </ul>
          </div>
            </form>

            <div>
              <br></br>
              {this.state.showTable === true ?
    <div>
    <h2 style = {{textAlign: 'center'}}>Table of Newton Raphson</h2>
    <h4 style = {{textAlign: 'center'}}> fx = {this.state.fx}
    <br></br> x = {this.state.x1} 
    <Table columns={columns} dataSource={dataTable} size="middle" /></h4></div>:''}
    {this.state.showGrap === true ? 
        <PlotlyComponent  data={dataGraph} Layout={layout} config={config} /> : ''
    }
    
    </div>
            
            </div>
            
          );
    }
}

export default NewtonRaph; 