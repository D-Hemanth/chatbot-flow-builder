import { useState, useEffect } from 'react';
import { useReactFlow } from 'reactflow';

// eslint-disable-next-line react/prop-types
const UpdateNode = ({
  selectedNode,
  setNodeSelected,
  setNodes,
  setNewNodeLabel,
}) => {
  const [nodeName, setNodeName] = useState(selectedNode.data['label']);
  // const reactFlowInstance = useReactFlow();
  // console.log(reactFlowInstance.getNodes());
  let id = selectedNode.id;

  useEffect(() => {
    // console.log(selectedNode.data['label'], setNodes);
    // const nodes = reactFlowInstance.getNodes();

    setNodeName(selectedNode.data['label']);
  }, [id]);

  // update the node on click of the save changes button
  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === selectedNode.id) {
          // it's important that you create a new object here
          // in order to notify react flow about the change
          node.data = {
            ...node.data,
            label: nodeName,
          };
        }

        return node;
      })
    );
  }, [selectedNode, nodeName, setNodes]);

  // onclick of the save changes button change from update sidebar to main node content sidebar
  const mainSidebar = () => {
    setNodeSelected(false);
  };

  return (
    // <aside>
    <>
      {/* <div style={{ width: `100%`, height: 2, background: 'grey' }}></div> */}
      <div className="update">
        <div className="back">
          <span
            className="material-symbols-outlined"
            style={{ marginRight: 10, cursor: 'pointer' }}
            onClick={mainSidebar}
          >
            arrow_back
          </span>
          <h2 style={{ paddingLeft: 50, margin: 0 }}>Message</h2>
        </div>
      </div>
      <div style={{ width: `100%`, height: 2, background: 'grey' }}></div>

      <div className="update">
        <h3>Text:</h3>
        <textarea
          rows="4"
          cols="25"
          value={nodeName}
          onChange={(evt) => {
            setNodeName(evt.target.value);
            // setNewNodeLabel(evt.target.value);
          }}
          style={{ marginBottom: 15, borderRadius: 5 }}
        />
      </div>
      <div style={{ width: `100%`, height: 2, background: 'grey' }}></div>
    </>

    // </aside>
  );
};

export default UpdateNode;
