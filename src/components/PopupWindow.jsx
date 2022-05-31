import styles from "../styles/PickingV2.module.css"


export default function PopupWindow(props){


    return (

        <div style={{
            width: "100vw",
            justifyContent: "center"
        }} 
        tabIndex={props.tabIndex} id={props.id}>
            <div tabIndex={props.tabIndex +1}  id={props.id + `popup_overlay`} className={styles.overlay}></div>

            <div tabIndex={props.tabIndex +2} style={props.style} id={props.id + `popup_window`} className={props.className ?? styles.popup}>
                {/* <button id={props.id + `close_popup`} onClick={props.close}
                >x</button> */}

                {props.children}

            </div>
        </div>

    )
}