import { useState } from "react"
import styles from "../styles/input.module.css"


export default function GetInput(props){

    const [title, setTitle] = useState(0)
    


    return (

            <div>

                <input style={{borderColor: props.cor ?? "white"}}
                    onChange={props.onChange}

                    className={styles.input} type="number" />
                
            </div>
    )



}

