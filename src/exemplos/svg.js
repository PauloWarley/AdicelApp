export default function Svg(req, res) { 
  
  

  let nome = req.query.nome

  let caracteristica = req.query.caracteristica

  res.setHeader('Content-Type', 'image/svg+xml')
  res.send(`
  
  <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">

  <g>
  <title>Layer 1</title>
    <text xml:space="preserve" text-anchor="start" font-family="Noto Sans JP" font-size="24" id="svg_1" y="247" x="89" stroke-width="0" stroke="#000" fill="#000000">
    ${nome}
    </text>
    <text xml:space="preserve" text-anchor="start" font-family="Noto Sans JP" font-size="24" id="svg_2" y="354" x="70" stroke-width="0" stroke="#000" fill="#000000">
    ${caracteristica}
  </text>
  </g>
  </svg>`
  
  
)

  return(
    <svg></svg>
  )
}





// import React from 'react';

// export default class App extends React.Component {
//   render() {
//     return (
//       <svg>
//         <circle cx={50} cy={50} r={10} fill="red" />
//       </svg>
//     )
//   }
// }


// <!-- 
// /*export default function SVG_Image(){

//     return(

        

//     <svg width="628" height="211" viewBox="0 0 100% 100%" fill="none" xmlns="http://www.w3.org/2000/svg">
//             <rect x="0" y="0" width="100%" height="100%" stroke="red" stroke-width="3px" fill="white"/>

//             <text id="name" class="name" x="50%" y="40%" dominant-baseline="middle" text-anchor="middle">Jeferson Hugo</text>

//             <text id="qualities" class="qualities" x="50%" y="75%" dominant-baseline="middle" text-anchor="middle"></text>
//     </svg>
    
//     )


// } -->