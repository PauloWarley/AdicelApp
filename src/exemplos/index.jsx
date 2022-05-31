import Navegador from "../components/Navegador"

export default function Inicio(){

  return (
  
    <div style={{

      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      flexWrap: "wrap"

    }}>

        <title>AutoMato</title>

        <div>:)</div>

        <p><Navegador texto = "Link 1" destino = "exemplo" cor= "darkred"></Navegador></p>
        <p><Navegador texto = "Link 2" destino = "jsx" cor= "darkblue"></Navegador></p>
        <p><Navegador texto = "Link 3" destino = "style" cor= "darkviolet"></Navegador></p>
        <p><Navegador texto = "Navegação Dinâmica" destino = "style" cor= "darkorange"></Navegador></p>
        <p><Navegador texto = "Calculadora" destino = "calculadora" cor = "gray"></Navegador></p>

    </div>

  )

}