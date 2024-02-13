import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faRotate,
  faUpDownLeftRight,
  faUpRightAndDownLeftFromCenter,
  faTableCells,
  faMinus,
  faFolderOpen,
  faFloppyDisk,
  faImage,
} from "@fortawesome/free-solid-svg-icons";
import Canvas from "./components/Canvas";
import { View, Screen } from "./components/Canvas";
import { useEffect, useRef, useState } from "react";
import { MoveableProps } from "react-moveable";

const App = () => {
  const [views, setViews] = useState<View[]>([]);
  const viewsRef = useRef(views);
  const [activeViewID, setActiveViewID] = useState<string | null>(null);
  const screen: Screen = {resolution: { width: 640, height: 480 }};
  const [moveableProps, setMoveableProps] = useState<MoveableProps>({
    snappable: false,
    snapGridWidth: 10,
    snapGridHeight: 10,
    target: null,
    resizable: false,
    rotatable: false,
    originDraggable: false,
    origin: false,
  });

  useEffect(() => {
    console.log("views: ", views);
  }, [views]);

  useEffect(() => {
    console.log("activeViewID: ", activeViewID);
  }, [activeViewID]);

  const handleDeleteView = () => {
    if (activeViewID) {
      setViews(views.filter((view) => view.props.id !== activeViewID));
      setActiveViewID(null);
    }
  };

  const handleAddView = (src: string) => {
    setViews([
      ...views,
      {
        content: {
          label: `View ${views.length}`,
          src,
        },
        props: {
          id: `view${views.length}`,
          style: {
            transform: "translate(0px, 0px) rotate(0deg)",
            width: "367px",
            height: "267px",
          },
        },
      },
    ]);
  };

  const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (activeViewID) {
      setViews(
        views.map((view) => {
          if (view.props.id === activeViewID) {
            return {
              ...view,
              content: {
                ...view.content,
                src: event.target.value,
              },
            };
          }
          return view;
        })
      );
    }
  };

  const handleGridResolutionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const resolution = parseInt(event.target.value);
    setMoveableProps((prevMoveableProps) => ({
      ...prevMoveableProps,
      snapGridWidth: resolution,
      snapGridHeight: resolution,
    }));
  };

  const handleGridToggle = () => {
    setMoveableProps((prevMoveableProps) => ({
      ...prevMoveableProps,
      snappable: !prevMoveableProps.snappable,
    }));
  };

  const handleJSONDownload = () => {
    console.log("targets: ", viewsRef.current);

    // Convert views to JSON
    const viewsJson = JSON.stringify(viewsRef.current);

    // Create a Blob object with the JSON data
    const blob = new Blob([viewsJson], { type: "application/json" });

    // Create a download link for the file
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "views.json";
    link.click();

    // Clean up the URL object
    URL.revokeObjectURL(url);
  };

  const handleJSONUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Get the file from the event
    const file = event.target.files?.[0];
    if (file) {
      // Create a FileReader object
      const reader = new FileReader();
      reader.onload = (e) => {
        // Get the file contents
        const contents = e.target?.result as string;
        try {
          // Parse the JSON file
          const parsedViews = JSON.parse(contents) as View[];
          setViews(parsedViews);
        } catch (error) {
          console.error("Error parsing JSON file:", error);
        }
      };
      // Read the file as text to trigger the onload event
      reader.readAsText(file);
    }
  };

  const handleChangeLabel = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (activeViewID) {
      setViews(
        views.map((view) => {
          if (view.props.id === activeViewID) {
            return {
              ...view,
              content: {
                ...view.content,
                label: event.target.value,
              },
            };
          }
          return view;
        })
      );
    }
  };

  return (
    <div className="h-screen flex flex-col text-neutral-300">
      <header
        className=" bg-neutral-800 border border-neutral-700
                        h-16 flex flex-row place-items-center p-4 gap-2"
      >
        <div>
          {`Resolution: ${screen.resolution.width}x${screen.resolution.height}`}
        </div>
        <div className="text-neutral-700">
          <FontAwesomeIcon icon={faMinus} rotation={90} />
        </div>
        <div className="p-2 hover:bg-neutral-700 active:bg-neutral-900 rounded-md">
          <label htmlFor="file-upload" className="cursor-pointer">
            <FontAwesomeIcon icon={faFolderOpen} />
          </label>
          <input
            id="file-upload"
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleJSONUpload}
          />
        </div>
        <div
          className="p-2 hover:bg-neutral-700 active:bg-neutral-900 rounded-md"
          onClick={handleJSONDownload}
        >
          <FontAwesomeIcon icon={faFloppyDisk} />
        </div>
        <button
          className="ml-auto p-2 hover:bg-neutral-700 active:bg-neutral-900 disabled:opacity-25 rounded-md"
          disabled={activeViewID === null}
          onClick={handleDeleteView}
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
        <div className="text-neutral-700">
          <FontAwesomeIcon icon={faMinus} rotation={90} />
        </div>
        <button
          disabled
          className="p-2 hover:bg-neutral-700 active:bg-neutral-900 disabled:opacity-25 rounded-md"
        >
          <FontAwesomeIcon icon={faUpDownLeftRight} />
        </button>
        <button
          disabled
          className="p-2 hover:bg-neutral-700 active:bg-neutral-900 disabled:opacity-25 rounded-md"
        >
          <FontAwesomeIcon icon={faUpRightAndDownLeftFromCenter} />
        </button>
        <button
          disabled
          className="p-2 hover:bg-neutral-700 active:bg-neutral-900 disabled:opacity-25 rounded-md"
        >
          <FontAwesomeIcon icon={faRotate} />
        </button>
        <div className="text-neutral-700">
          <FontAwesomeIcon icon={faMinus} rotation={90} />
        </div>
        <button
          className={`${
            moveableProps.snappable ? "bg-neutral-900" : ""
          } p-2 hover:bg-neutral-700 active:bg-neutral-900 rounded-md`}
          onClick={handleGridToggle}
        >
          <FontAwesomeIcon icon={faTableCells} />
        </button>
        <div className="text-center">
          {/* <label htmlFor="default-range" className="text-xs">Grid Size</label> */}
          <input
            id="default-range"
            className="bg-neutral-300 accent-neutral-500 disabled:opacity-25
              w-full h-0.5 rounded-lg
              appearance-none cursor-pointer align-middle"
            type="range"
            value={moveableProps.snapGridWidth}
            disabled={!moveableProps.snappable}
            onChange={handleGridResolutionChange}
          />
        </div>
      </header>
      <div className="flex flex-auto">
        <Canvas
          screen={screen}
          views={views}
          viewsRef={viewsRef}
          setActiveViewID={setActiveViewID}
          moveableProps={moveableProps}
          setMoveableProps={setMoveableProps}
        />
        <aside
          className="bg-neutral-800 border border-neutral-700
                          flex flex-col w-64"
        >
          <div className="h-1/2 flex flex-wrap content-start justify-evenly border border-neutral-700">
            <button
              className="m-1 p-2 m-auto hover:bg-neutral-700 active:bg-neutral-900 disabled:opacity-25 rounded-md"
              onClick={() =>
                handleAddView("https://picsum.photos/id/29/367/267")
              }
            >
              <FontAwesomeIcon className="pe-2" icon={faImage} />
              Imagem 1
            </button>
            <button
              className="m-1 p-2 m-auto hover:bg-neutral-700 active:bg-neutral-900 disabled:opacity-25 rounded-md"
              onClick={() =>
                handleAddView("https://picsum.photos/id/30/367/267")
              }
            >
              <FontAwesomeIcon className="pe-2" icon={faImage} />
              Imagem 2
            </button>
            <button
              className="m-1 p-2 m-auto hover:bg-neutral-700 active:bg-neutral-900 disabled:opacity-25 rounded-md"
              onClick={() =>
                handleAddView("https://picsum.photos/id/31/367/267")
              }
            >
              <FontAwesomeIcon className="pe-2" icon={faImage} />
              Imagem 3
            </button>
          </div>
          <div className="h-1/2 p-2 flex flex-wrap content-start border border-neutral-700">
            <label htmlFor="label-input" className="text-xs">
              Label
            </label>
            <input
              id="label-input"
              className="text-neutral-900 bg-neutral-300 accent-neutral-500 w-full h-8 disabled:opacity-25 rounded-sm"
              type="text"
              placeholder="Label"
              disabled={activeViewID === null}
              value={
                activeViewID
                  ? views.find((view) => view.props.id === activeViewID)
                      ?.content.label
                  : "-"
              }
              onChange={handleChangeLabel}
            />
            <label htmlFor="src-input" className="text-xs">
              Source
            </label>
            <input
              id="src-input"
              className="text-neutral-900 bg-neutral-300 accent-neutral-500 w-full h-8 disabled:opacity-25 rounded-sm"
              type="text"
              placeholder="Source"
              disabled={activeViewID === null}
              value={
                activeViewID
                  ? views.find((view) => view.props.id === activeViewID)
                      ?.content.src
                  : "-"
              }
              onChange={handleChangeInput}
            />
          </div>
        </aside>
      </div>
    </div>
  );
};

export default App;
