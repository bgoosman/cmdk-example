import "./App.css";
import "./raycast.scss";
import React from "react";
import { CommandMenu } from "./CommandMenu";

const taskify = (any) => () => Promise.resolve(any)
const Icon = ({ id }) => <span className={`fa fa-${id}`} />

function App() {
  return (
    <div className="App">
      <CommandMenu firstPage={{
        action: () => `Select Command`,
        placeholder: `Search for a command...`,
        items: taskify([
          {
            icon: <Icon id={'exchange'} />,
            label: "Add Edge",
            meta: "Transform",
            pages: [
              {
                placeholder: `Search for a source node...`,
                action: "Select Source Node", items: taskify([
                  { label: "Node 1", value: "MEATLOAF", },
                  { label: "Node 3", value: "!EATLOAF", },
                ]),
              },
              {
                placeholder: `Search for a target node...`,
                action: "Select Target Node", items: taskify([
                  { label: "Node 2", value: "abcdef12", },
                ]),
              },
              {
                placeholder: `Search for a relationship...`,
                action: ({ search, count }) => count > 0 ? `Create edge with selected relationship` : `Create edge with relationship "${search}"`,
                canSubmitWithNoResults: true,
                items: taskify([
                  {
                    label: "LINKS", value: "LINKS",
                  },
                  {
                    label: "HAS", value: "HAS",
                  },
                ]),
                onSelect: (values) => {
                  console.log('Add Edge with params', values)
                },
              },
            ]
          },
          { icon: <Icon id={'plus-circle'} />, label: "Add Node", meta: "Transform", onSelect: () => { console.log('Add Node') } },
          { icon: <Icon id={'mars-double'} />, label: "Extract", meta: "Transform", onSelect: () => { console.log('Extract') } },
          { icon: <Icon id={'circle-thin'} />, label: "Circle", meta: "Layout", onSelect: () => { console.log('Circle') } },
        ])
      }} />
    </div>
  );
}

export default App;
