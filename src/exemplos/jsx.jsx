import Link from "next/link"
import Layout from "../components/Layout"

export default function Jsx(){

    const a = 1
    const b = 3

    const obj = {nome: 'Jão', idade: '30'}

    const titulo = <h1>JSX é um conceito central</h1>

    console.log(a*b)


    function subtitulo(){

        return <h2>{"muito legal".toUpperCase()}</h2>

    }

    return (
        
        <Layout titulo = "WMS para E-Commerce">
            <div>

                {titulo}
                {subtitulo()}
                <h1>{JSON.stringify(obj)}</h1>

            </div>
        </Layout>

    )

}