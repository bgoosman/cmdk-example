import "./App.css";
import "./raycast.scss";
import React from "react";
import { Command } from "cmdk";

const CommandMenu = ({ pages }) => {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('')
  const [openPages, setOpenPages] = React.useState([])
  const page = openPages[openPages.length - 1]

  // Toggle the menu when ⌘K is pressed
  React.useEffect(() => {
    const down = (e) => {
      if (e.key === "k" && e.metaKey) {
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const onClose = () => {
    setOpenPages([]);
    setOpen(false);
  }

  const renderCmd = cmd => {
    return <Command.Item key={cmd.label} onSelect={() => {
      console.log("Selected " + cmd.label)
      if (cmd.nextPage) {
        setOpenPages([...openPages, cmd.nextPage])
      } else {
        onClose();
      }
    }}>{cmd.label}</Command.Item>
  }

  return (
    <Command.Dialog className="my-cmdk-menu" open={open} onOpenChange={setOpen} label="Global Command Menu" onKeyDown={(e) => {
      // Escape goes to previous page
      // Backspace goes to previous page when search is empty
      console.log(e.key)
      if (e.key === 'Escape' || (e.key === 'Backspace' && !search)) {
        e.preventDefault()
        if (openPages.length === 0) {
          onClose();
        } else {
          setOpenPages((openPages) => openPages.slice(0, -1))
        }
      }
    }}>
      <Command.Input value={search} onValueChange={setSearch} />
      <Command.List>
        <Command.Empty>No results found.</Command.Empty>
        {!page && <>{pages.commands.map(renderCmd)}</>}
        {page && <>{pages[page].map(renderCmd)}</>}
      </Command.List>
      <div cmdk-raycast-footer>
      <svg width="1024" height="1024" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M934.302 511.971L890.259 556.017L723.156 388.902V300.754L934.302 511.971ZM511.897 89.5373L467.854 133.583L634.957 300.698H723.099L511.897 89.5373ZM417.334 184.275L373.235 228.377L445.776 300.923H533.918L417.334 184.275ZM723.099 490.061V578.209L795.641 650.755L839.74 606.652L723.099 490.061ZM697.868 653.965L723.099 628.732H395.313V300.754L370.081 325.987L322.772 278.675L278.56 322.833L325.869 370.146L300.638 395.379V446.071L228.097 373.525L183.997 417.627L300.638 534.275V634.871L133.59 467.925L89.4912 512.027L511.897 934.461L555.996 890.359L388.892 723.244H489.875L606.516 839.892L650.615 795.79L578.074 723.244H628.762L653.994 698.011L701.303 745.323L745.402 701.221L697.868 653.965Z" fill="#FF6363"></path></svg>
      <button cmdk-raycast-open-trigger="">Open Application<kbd>↵</kbd></button>
      </div>
    </Command.Dialog>
  );
};

function App() {
  return (
    <div className="App">
      <CommandMenu pages={{
        commands: [
          { label: "Add Edge", nextPage: "AddEdgeSourceNode" },
          { label: "Add Node" },
          { label: "Extract" },
        ],
        AddEdgeSourceNode: [
          { label: "Node 1", nextPage: "AddEdgeTargetNode", },
        ],
        AddEdgeTargetNode: [
          { label: "Node 2", nextPage: "AddEdgeRelationship", },
        ],
        AddEdgeRelationship: [
          { label: "LINKS", },
        ],
      }} />
    </div>
  );
}

export default App;
