import styles from "../styles/Navegador.module.css"

export default function NavegadorLeftSideBar(props){

    return (

            <div onClick={props.onClick} id={props.id} className={styles.navegador} style={{

                backgroundColor: props.backgroundColor ?? "white",
                color: props.color ?? "black",
                fontFamily: "Nunito,sans-serif",
                fontSize: "14px",
                width: "max-content"

            }}>
                {props.children ?? ""}
            </div>  

    )


}