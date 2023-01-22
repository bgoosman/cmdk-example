import React, { useEffect, useState } from "react";
import { Command, useCommandState } from "cmdk";

const CommandMenuActionLabel = ({ currentPage }) => {
  const search = useCommandState(state => state.search)
  const count = useCommandState(state => state.filtered.count)
  if (typeof currentPage.action === 'string') {
    return currentPage.action;
  } else if (typeof currentPage.action === 'function') {
    return currentPage.action({ search, count })
  } else {
    return `Run Command`
  }
}

export const CommandMenu = ({ firstPage }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('')
  const [path, setPath] = useState([])
  const [loading, setLoading] = useState('')
  const [pageItems, setItems] = useState([])
  const flow = path[0];
  const flowPage = flow ? path.length - 1 : undefined;
  const flowPages = flow?.pages;
  const currentPage = flow ? flow.pages[flowPage] : firstPage;
  const noResults = currentPage?.noResults ? currentPage.noResults(search) : 'No results found.'
  const loadingMessage = loading ? currentPage?.loadingMessage ? currentPage.loadingMessage() : 'Loading items...' : null;

  // Toggle the menu when ⌘K is pressed
  useEffect(() => {
    const down = (e) => {
      if (e.key === "k" && e.metaKey) {
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // When the page changes, load the page's items
  useEffect(() => {
    async function getItems() {
      setLoading(true);
      const items = await currentPage.items();
      setItems(items);
      setLoading(false);
    }

    setItems([])
    getItems();
  }, [currentPage])

  const onClose = () => {
    setOpen(false);
    setSearch('')
    setPath([])
  }

  const goToPreviousPage = () => {
    if (currentPage === firstPage) {
      onClose();
    } else {
      setPath(path.slice(0, -1))
    }
  }

  const getValues = () => path.slice(1).map(p => p.value)

  const onSelect = (cmd) => () => {
    if (cmd.onSelect) {
      cmd.onSelect([...getValues(), cmd.value]);
      onClose();
    }

    if (currentPage.onSelect) {
      currentPage.onSelect([...getValues(), cmd.value]);
      onClose();
    }

    setSearch('')

    if ((currentPage === firstPage && cmd.pages)) {
      setPath([cmd])
    } else if (flow && flowPage + 1 < flowPages.length) {
      setPath([...path, cmd])
    } else {
      onClose();
    }
  }

  const onDialogKeyDown = e => {
    // Escape goes to previous page
    // Backspace goes to previous page when search is empty
    if (e.key === 'Escape' || (e.key === 'Backspace' && !search)) {
      e.preventDefault()
      setSearch('')
      goToPreviousPage();
    } else if (e.key === 'Enter') {
      if (currentPage && currentPage.onSelect && currentPage.canSubmitWithNoResults && search.length > 0) {
        currentPage.onSelect([...getValues(), search])
        onClose();
      }
    }
  }

  const renderCmd = cmd => {
    return <Command.Item key={cmd.label} onSelect={onSelect(cmd)}>
      {cmd.icon}
      {cmd.label}
      {cmd.meta &&
        <span cmdk-raycast-meta="">{cmd.meta}</span>
      }
    </Command.Item>
  }

  return (
    <Command.Dialog className="kineviz-cmdk-menu bg-light border m-2" loop={true} open={open} onOpenChange={setOpen} label="Global Command Menu" onKeyDown={onDialogKeyDown}>
      <Command.Input className="border-bottom p-3" value={search} onValueChange={setSearch} placeholder={currentPage.placeholder} />
      <Command.List>
        {loadingMessage && <Command.Loading>{loadingMessage}</Command.Loading>}
        <Command.Empty>
          {noResults}
        </Command.Empty>
        {pageItems.map(renderCmd)}
      </Command.List>
      <div cmdk-raycast-footer="">
        <img src="/kineviz-logo.png" alt="Kineviz Logo" />
        <button cmdk-raycast-open-trigger=""><CommandMenuActionLabel currentPage={currentPage} /><kbd>↵</kbd></button>
      </div>
    </Command.Dialog>
  );
};