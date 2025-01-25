
const Notification = ({message,styleViaProps}) =>{
    return(
        <div style={styleViaProps}>
            <strong><p>{message}</p></strong>
        </div>
        
    )
}

export default Notification;

