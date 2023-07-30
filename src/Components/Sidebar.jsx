import { useEffect, useState } from 'react'

const Sidebar = () => {
  const [showUsage, setShowUsage] = useState(true) // state to show helpful chat flow usage info

  // Tell drag & drop usage of nodes to user on first load of the application
  useEffect(() => {
    setTimeout(() => {
      setShowUsage(false)
    }, 5000)
  }, [showUsage])

  // display show node usage information on first load of the application
  const displayUsage = showUsage ? '' : 'none'

  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType)
    event.dataTransfer.effectAllowed = 'move'
  }

  // You can expand upon adding new nodes by change the type from default
  return (
    <>
      <div className="description" style={{ display: displayUsage }}>
        Drag below node to the pane on the left to add new nodes.
      </div>
      <aside>
        <div
          className="appnode"
          onDragStart={(event) => onDragStart(event, 'default')}
          draggable
        >
          <span
            className="material-symbols-outlined"
            style={{ paddingBottom: 5 }}
          >
            maps_ugc
          </span>
          Message
        </div>
      </aside>
    </>
  )
}

export default Sidebar
