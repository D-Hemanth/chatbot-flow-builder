import { useState, useRef, useCallback, useMemo } from 'react'
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
} from 'reactflow'
import 'reactflow/dist/style.css'
import Sidebar from './Components/Sidebar'
import UpdateNode from './Components/UpdateNode'
import Notification from './Components/Notification'
import newNode from './Components/newNode'
import './index.css'
import Topbar from './Components/Topbar'

let id = 0

const App = () => {
  const reactFlowWrapper = useRef(null)
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [reactFlowInstance, setReactFlowInstance] = useState(null)
  const [nodeSelected, setNodeSelected] = useState(false)
  const [changeNode, setChangeNode] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null) // custom error message notification
  const [messageColor, setMessageColor] = useState(null) // custom color for error & success notification
  const [targetHandles, setTargetHandles] = useState([]) // keep track of target handles when new edges are created between nodes

  // determine when a node is selected by user
  // console.log(nodes, reactFlowInstance);
  const update = useCallback((event, node) => {
    // console.log(event, node);
    setChangeNode(node)
    setNodeSelected(true)
  }, [])

  // keep track of target handles when new edges are created between nodes to limit no. of sourceHandles & targetHanles count for saving flow
  let sourceHandles = []
  let targetHandle = []
  // onConnect is called when only making a sourceHandle connection
  const onConnect = useCallback(
    (params) => {
      // console.log(params)

      // check if sourcehandle is already connected to node via a edge if it exists then allow another connection
      if (sourceHandles.includes(params.source)) return
      sourceHandles = sourceHandles.concat(params.source)
      // console.log('source', sourceHandles)

      setEdges(
        (eds) => addEdge({ ...params, markerEnd: { type: 'arrowclosed' } }, eds) // to add arrowhead at the end of the edge connection pass additional params
      )

      // keep track of which target handles are connected
      if (targetHandle.includes(params.target)) return
      targetHandle = targetHandle.concat(params.target)
      setTargetHandles(targetHandle)
      // console.log('target', targetHandle)
    },
    [setEdges]
  )

  const onDragOver = useCallback((event) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    (event) => {
      event.preventDefault()

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect()
      const type = event.dataTransfer.getData('application/reactflow')

      // check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      })

      // creating a new node
      const newerNode = {
        id: `node_${id}`,
        type: 'node',
        position,
        data: { heading: 'Send Message', label: `text message ${id}` },
      }

      // console.log(id, newNode)
      id++
      setNodes((nds) => nds.concat(newerNode))
    },
    [reactFlowInstance, setNodes]
  )

  // to hide the react flow attribution for personal/hobby projects
  let proOptions = { hideAttribution: true }

  // use Custom new node types so that we can add a header to the nodes along with a label
  const nodeTypes = useMemo(
    () => ({
      node: newNode,
    }),
    []
  )

  // save node flow on click of save changes button using below function & validating for not more than one node target handles are unconnected
  const saveFlow = () => {
    // console.log(reactFlowInstance);
    const totalNodes = reactFlowInstance.getNodes().length
    // console.log(targetHandles)

    if (targetHandles.length !== totalNodes - 1) {
      setErrorMessage('Cannot save Flow')
      setMessageColor('redMessage')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    } else {
      setErrorMessage('Saved Flow')
      setMessageColor('greenMessage')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  return (
    <div className="appflow" style={{ width: '100vw', height: '100vh' }}>
      <ReactFlowProvider>
        <div className="reactflow-wrapper" ref={reactFlowWrapper}>
          <div className="topbar">
            <Notification
              errorMessage={errorMessage}
              messageColor={messageColor}
            />
          </div>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            fitView
            proOptions={proOptions}
            onNodeClick={update}
            nodeTypes={nodeTypes}
          >
            <Controls />
          </ReactFlow>
        </div>
        {nodeSelected ? (
          <div className="rightbar">
            <Topbar saveFlow={saveFlow} />
            <UpdateNode
              selectedNode={changeNode}
              setNodeSelected={setNodeSelected}
              setNodes={setNodes}
            />
          </div>
        ) : (
          <div className="rightbar">
            <Topbar saveFlow={saveFlow} />
            <Sidebar />
          </div>
        )}
      </ReactFlowProvider>
    </div>
  )
}

export default App
