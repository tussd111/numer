import React, { Component } from 'react';
// import ReactDOM from 'react-dom';
import { Input, Typography, Button, Table } from 'antd';
import { range, compile, evaluate, simplify, parse, abs } from 'mathjs'
import createPlotlyComponent from 'react-plotlyjs'
import Plotly from 'plotly.js/dist/plotly-cartesian'
import axios from "axios"
var dataGraph = []
const PlotlyComponent = createPlotlyComponent(Plotly)
const { Title } = Typography;

const columns = [
  {
    title: 'Iteration',
    dataIndex: 'iteration',
    key: 'iteration'
  },
  {
    title: 'XL',
    dataIndex: 'xl',
    key: 'xl'
  },
  {
    title: 'XR',
    dataIndex: 'xr',
    key: 'xr'
  },
  {
    title: 'XM',
    dataIndex: 'xm',
    key: 'xm'
  },
  {
    title: 'Error',
    dataIndex: 'error',
    key: 'error'
  },
];
var dataTable = [];

class FalsePosition extends Component {
  constructor() {
    super();
    this.state = {
      size: 'large',
      fx: "",
      xl: 0,
      xr: 0,
      showTable: false,
      apis: [],
      xlapi: "",
      xrapi: "",
      eqapi: "",
    };
    this.onInputChange = this.onInputChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  apishow=()=>{
    axios({method: "get",url:"http://localhost:5000/data/falseposition",}).then((res) => {
      const apis = res.data;
      this.setState({
        fx:apis.fx,
        xl:apis.xl,
        xr:apis.xr
      })
      this.onSubmit({ apis });
    });
  };

  Graph(xl, xr) {
    dataGraph = [
      {
        type: 'scatter',
        x: xl,
        marker: {
          color: '#a32f0f'
        },
        name: 'XL'
      },
      {
        type: 'scatter',
        x: xr,
        marker: {
          color: '#3c753c'
        },
        name: 'XR'
      }];

  }

  func(X) {
    let scope = { x: parseFloat(X) };
    var expr = compile(this.state.fx);
    return expr.evaluate(scope)
  }

  error(xo, xm) {
    return Math.abs((xm - xo) / xm);
  }


  createTable(xl, xr, xm, error) {
    dataTable = []
    var i = 0;
    for (i = 1; i < error.length; i++) {
      dataTable.push({
        iteration: i,
        xl: xl[i],
        xr: xr[i],
        xm: xm[i],
        error: error[i],
      });
    }

  }

  onInputChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
    console.log(this.state);
  }

  onSubmit() {
    // var fx = this.state.fx;
    var xl = this.state.xl;
    var xr = this.state.xr;
    var xo = 0;
    var xm = 0;
    var i = 0;
    var error = 1;
    var data = []
    data['xl'] = []
    data['xr'] = []
    data['xm'] = []
    data['error'] = []
    data['iteration'] = []

    while (error >= 0.000001) {
      xm = ((parseFloat(xl) * this.func(xr)) - (parseFloat(xr) * this.func(xl))) / (this.func(xr) - this.func(xl));
      if (this.func(xm) == 0) {
        break;
      } else if (this.func(xm) * this.func(xr) > 0) {
        xr = xm;
      } else {
        xl = xm;
      }

      error = this.error(xo, xm);

      //console.log(data['xl']+" "+data['xr']);
      data['iteration'][i] = i;
      data['xl'][i] = parseFloat(xl).toFixed(6);
      data['xr'][i] = parseFloat(xr).toFixed(6);
      data['xm'][i] = parseFloat(xm).toFixed(6);
      data['error'][i] = error.toFixed(6);
      xo = xm;
      i++;

    }
    console.log(this.state);
    this.createTable(data['xl'], data['xr'], data['xm'], data['error']);
    this.setState({ showTable: true, showGrap: true })
    this.Graph(data['xl'], data['xr'])
    // const numerdata = {
    //   equ: this.state.fx,
    //   xl: this.state.xl,
    //   xr: this.state.xr,
    // };
    // axios
    //   .post("http://localhost:8000/data/falseposition", {
    //     numerdata,
    //   })
    //   .then((res) => {
    //     console.log(res);
    //     console.log(res.data);
    //   });
  }

  render() {

    let layout = {
      title: 'FalsePosition',
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


        <Title style={{ textAlign: 'center' }}>False Position Method </Title>
        <br></br>

        <form style={{ textAlign: 'center' }}
          onSubmit={this.onInputChange}
        >
          <h1>Equation  : &nbsp;&nbsp;
                    <Input size="large" placeholder="Input your Function" name="fx" style={{ width: 500 }}
              onChange={this.onInputChange}
            />
          </h1>
          <br></br>
          <h1>XL : &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <Input size="large" placeholder="Input your Xl" name="xl" style={{ width: 500 }}
              onChange={this.onInputChange}
            />
          </h1>
          <br></br>
          <h1>XR : &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <Input size="large" placeholder="Input your Xr" name="xr" style={{ width: 500 }}
              onChange={this.onInputChange}
            />
          </h1>
          <br></br>

          <Button type="submit"  size={size}
            style={{ color: '#ffffff', background: '#A93226' }}
            onClick={this.onSubmit}
          >
            Submit
                </Button>
                <br></br>
                <br></br>
                <Button type="submit"  size={size}
            style={{ color: '#ffffff', background: '#f7c602' }}
            onClick={this.apishow}
          >
           Example
            </Button>
          <div>
            <ul>
              {this.state.apis.map((api) => (
                <li>
                  <h1>Equation = {api.fx}</h1>
                  <h1>XL = {api.xl}</h1>
                  <h1>XR = {api.xr}</h1>
                </li>
              ))}
            </ul>
          </div>
        </form>

        
        <div>
          <br></br>
          {this.state.showTable === true ?
            <div>
              <h2 style={{ textAlign: 'center' }}>Table of False Position</h2>
              <h4 style={{ textAlign: 'center' }}> fx = {this.state.fx}
                <br></br> xl = {this.state.xl} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; xr = {this.state.xr}
                <Table columns={columns} dataSource={dataTable} size="middle" /></h4></div> : ''}

          {this.state.showGrap === true ?
            <PlotlyComponent data={dataGraph} Layout={layout} config={config} /> : ''
          }

        </div>

      </div>

    );
  }
}
export default FalsePosition;