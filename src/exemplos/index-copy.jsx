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


        <p><Navegador texto = "Link 1" destino = "exemplo" cor= "darkred">Exemplo</Navegador></p>
        <p><Navegador texto = "Link 2" destino = "jsx" cor= "darkblue">Exemplo</Navegador></p>
        <p><Navegador texto = "Link 3" destino = "style" cor= "darkviolet">Exemplo</Navegador></p>


    </div>

  )

}