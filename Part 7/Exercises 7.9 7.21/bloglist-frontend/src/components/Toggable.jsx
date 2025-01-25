import { useState } from "react";

const Toggable = (props) => {
    const [visible, setVisible] = useState(false)
    const hideWhenVisible = { display: visible ? 'none' : '' }
    const showWhenVisible = { display: visible ? '' : 'none' }

    const ToggleVisibility = () => {
        setVisible(!visible)
    }

    return (
        <>
        
        <div>
            <div style={hideWhenVisible}>
                <button onClick={ToggleVisibility}>{props.buttonLabel}</button>
            </div>
            <div style={showWhenVisible}>
                {props.children}
                <button onClick={ToggleVisibility}>cancel</button>
            </div>
        </div>
        </>
    )
}

export default Toggable