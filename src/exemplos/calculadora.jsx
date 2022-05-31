import { useState } from "react";
import GetInput from "../components/Get_Input";
import Navegador from "../components/Navegador";



export default function calculadora(){

    const [soma, setSoma] = useState("")
    const [value1, setValue1] = useState("")
    const [value2, setValue2] = useState("")
    const [op, setOp] = useState("+")

    function changeOperation(){

        if (op == "+"){
            setOp("-")
        }
        else if (op == "-"){
            setOp("x")
        }
        else if (op == "x"){
            setOp(":")
        }
        else if (op == ":"){
            setOp("+")
        }

    }

    function somaValues(){
        if (op == "+"){
            setSoma(parseInt({value1}.value1) + parseInt({value2}.value2))
        }
        else if (op == "-"){
            setSoma(parseInt({value1}.value1) - parseInt({value2}.value2))
        }
        else if (op == "x"){
            setSoma(parseInt({value1}.value1) * parseInt({value2}.value2))
        }
        else if (op == ":"){
            if (parseInt({value2}.value2) != 0){
              setSoma(parseInt({value1}.value1) / parseInt({value2}.value2))
              //setSoma("C ta é com saudade xD")
            }
            else{

                setSoma("Divisão por ZERO!")

            }
        }
        
    }

    return(

        <div style={{
            
            display: "flex",
            justifyContent: "center",
            width: "100vw",
            height: "100vh",
            alignItems: "center"

        }}>
            <GetInput onChange={e => setValue1(e.target.value)} cor="#b731fe"></GetInput>
            <div style={{
                
                display: "flex",
                justifyContent: "center",
                alignItems: "center", 
                padding: "0px",
                color:"#fff",
                backgroundColor:"black",
                //border: "5px solid black",
                borderRadius: "50%",
                width: "30px",
                height: "30px",
                margin: "16px",

            }}><button style={{
                
                borderRadius: "50%",
                background: "black",
                border: "0px",
                color: "white",
                cursor: "pointer", 


           }}
        
           onChange={e => setOp(e.target.value)}

           onClick={changeOperation}>

            {op}</button></div>

            <GetInput onChange={e => setValue2(e.target.value)} cor="blue"></GetInput>
            <div 
                style={{
                    
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center", 
                    padding: "0px",
                    color:"#fff",
                    backgroundColor:"black",
                    //border: "5px solid black",
                    borderRadius: "50%",
                    width: "30px",
                    height: "30px",
                    margin: "16px",
                    alignSelf: "center"

            }}>

            <button 
                style={{
                    borderRadius: "50%",
                    background: "black",
                    border: "0px",
                    color: "white",
                    cursor: "pointer", 
                }} 

                onClick={somaValues}>=</button> 
               
               </div>

               <label style={{margin:"16px"}} onChange={e => setSoma(e.target.value)} >{soma}</label>
                
               <Navegador texto = "login" destino = "automate/login" cor = "pink"></Navegador>
            
        </div>
    )


}