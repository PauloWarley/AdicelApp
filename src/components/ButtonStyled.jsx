import styles from "../styles/Button.module.css"

export default function ButtonStyled(props){

    return (

        
        <button onClick={props.onClick} className={styles.ButtonStyled} style={{         
            backgroundColor: props.color ?? "white"
        }}>
            {props.children ?? ""}
        </button>  

    )


}