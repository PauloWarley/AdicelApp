import Link from "next/link"
import styles from "../styles/LayoutHome.module.css"


export default function Layout(props){

    return (

        <div className={styles.layout}>
            
            <title>{props.title ?? ""}</title>

            <div className={styles.cabecalho}>

                <h1>{props.titulo ?? 'Mais um Exemplo.'}</h1>

                <Link href="/">Voltar</Link>
                <Link href="/logout">Sair</Link>

            </div>
            <div className={styles.conteudo}>

                {props.children}

            </div>

        </div>

    )

}