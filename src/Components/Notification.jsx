// show different error/success notification based on the props recieved by the Component
const Notification = ({ errorMessage, messageColor }) => {
  if (errorMessage) {
    return <div className={messageColor}>{errorMessage}</div>
  }
  return <div className="savingChanges" style={{ padding: 19 }}></div>
}

export default Notification
