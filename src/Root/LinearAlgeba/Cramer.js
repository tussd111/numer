import React, { Component } from 'react';
import {Card, Input, Button} from 'antd';
import 'antd/dist/antd.css';
import { det } from 'mathjs';
import axios from 'axios';

var api;
const InputStyle = { //ช่องกรอกinput
    background: "#ffffff",
    color: "black"
};

var A = [], B = [], answer = [], matrixA = [], matrixB = []
class Cramer extends Component {
    
    constructor() {
        super();
        this.state = {
            row: parseInt(0),
            column: parseInt(0),
            showDimentionForm : true,
            showDimentionButton: true,
            showMatrixForm: false,
            showMatrixButton: false,
            showOutputCard: false,
            
        }
        this.handleChange = this.handleChange.bind(this);
        this.cramer = this.cramer.bind(this);
        
    
    }
    
    
    //หาdet
    cramer() { //คุณลงเป็นบวก คุณขึ้นเป็นลบ
        this.initMatrix();
        var counter=0; 
        while (counter != this.state.row) { 
            var transformMatrix = JSON.parse(JSON.stringify(A)); 
            for (var i=0 ; i<this.state.row ; i++) {
                for (var j=0 ; j<this.state.column ; j++) {
                    if (j === counter) {
                        transformMatrix[i][j] = B[i]
                        break;
                    }
                    
                }
            
            } 
            counter++;
            console.log("counter",counter)
            //tranforMatrixเอาvectorไปใส่ในcolum
            answer.push(<h2>X<sub>{counter}</sub>=&nbsp;&nbsp;{Math.round(det(transformMatrix))/Math.round(det(A))}</h2>) 
            console.log("ans",answer)
            // answer.push(<br/>)
            console.log("det A",det(A));
        }
        
        this.setState({
            showOutputCard: true
        });

      
    }

    createMatrix(row, column) {
        for (var i=1 ; i<=row ; i++) {
            for (var j=1 ; j<=column ; j++) {
                matrixA.push(<Input style={{
                    width: "20%",
                    height: "50%", 
                    backgroundColor:"#f7fffd", 
                    marginInlineEnd: "5%", 
                    marginBlockEnd: "5%",
                    color: "black",
                    //fontSize: "18px",
                    //fontWeight: "bold"
                }}    
                id={"a"+i+""+j}  placeholder={"a"+i+""+j} 
                />)  
                //console.log(key);
            }
            matrixA.push(<br/>)
            matrixB.push(<Input style={{
                width: "18%",
                height: "50%", 
                backgroundColor:"#f7fffd",  
                marginInlineEnd: "5%", 
                marginBlockEnd: "5%",
                color: "black",
            }}
            id={"b"+i}  placeholder={"b"+i} />)
            matrixB.push(<br/>)
        }

        this.setState({
            showDimentionForm: false,   //row+colum
            showDimentionButton: false,//ปุ่มsumitm รอบคำนวณ
            showMatrixForm: true,//pattrenตารางหลังจากกรอกค่าrow,col
            showMatrixButton: true
        })
        

    }
    initMatrix() {
        for(var i=0 ; i<this.state.row ; i++) {
            A[i] = []
            for(var j=0 ; j<this.state.column ; j++) {
                A[i][j] = (parseFloat(document.getElementById("a"+(i+1)+""+(j+1)).value));
            }
            B.push(parseFloat(document.getElementById("b"+(i+1)).value));
        }
    }

    
    async apishow() {
        await axios({method: "get",url: "http://localhost:5000/data/cramer",}).then((response) => 
        {console.log("response: ", response.data);api = response.data;});
        await this.setState({
            row: api.row,
            column: api.row,
          });
          matrixA = [];
          matrixB = [];
          await this.createMatrix(api.row, api.row);
          for (let i = 1; i <= api.row; i++) {
            for (let j = 1; j <= api.row; j++) {
                document.getElementById("a" + i + "" + j).value = api.A[i - 1][j - 1];
                console.log("A",A)
            }
            document.getElementById("b" + i).value = api.B[i - 1];
            console.log("B",B)
          }
          this.cramer();
    }   
    
    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
        
          
      }
    
    
    
    render() {
        return(
            <div className="ContentSheet">
                
                <div>
                    <Card
                    title={"Cramer's Rule"}
                    bordered={true}
                    style={{ background: "fff",padding: 24 ,minHeight: 360,textAlign: 'center',fontSize: "12px"}}
                    onChange={this.handleChange}
                    >
                        {this.state.showMatrixForm && <div><h2>Matrix [A]</h2><br/>{matrixA}<h2>Vector [B]<br/></h2>{matrixB}</div>}
                        
                        {this.state.showDimentionForm && 
                            <div>
                                <h2>Row</h2><Input size="large" name="row" style={InputStyle} placeholder="Input your Row"></Input>
                                <h2>Column</h2><Input size="large" name="column" style={InputStyle} placeholder="Input your Column"></Input>
                            </div> 
                        }
                        <br></br>
                        {this.state.showDimentionButton && 
                            <Button 
                            id="dimention_button"
                             onClick= {
                                ()=>this.createMatrix(this.state.row, this.state.column)
                                }  
                                style={{background: "#A93226", color: "#ffffff",fontSize: "15px",textAlign: 'center'}}>
                                Submit<br></br>
                                </Button>
                        }
                        {this.state.showMatrixButton && 
                            <Button 
                                id="matrix_button"  
                                style={{background: "#A93226", color: "#ffffff",fontSize: "15px",textAlign: 'center'}}
                                onClick={()=>this.cramer()}
                            >
                            Submit
                            </Button>
                        }
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <Button 
                    id="submit_button" 
                    onClick= {()=>this.apishow()}  
                    style={{background: "#f7c602", color: "#ffffff",fontSize: "15px",textAlign: 'center'}}
                    >
                    Example 
                    </Button>
                    
                    {this.state.showOutputCard &&
                        <Card
                        title={"Output"}
                        bordered={true}
                        style={{ background: "fff",padding: 24 ,minHeight: 360,textAlign: 'center',fontSize: "12px"}}
                        onChange={this.handleChange}>
                        <p style={{textAlign: 'center' }}>{answer}</p>
                        </Card>
                    }
                   </Card>
                </div>
               
            </div>
        );
    }
}
export default Cramer;




