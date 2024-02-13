import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faTrash,
  faRotate,
  faUpDownLeftRight,
  faUpRightAndDownLeftFromCenter,
  faTableCells,
  faMinus,
  faFolderOpen,
  faFloppyDisk
} from '@fortawesome/free-solid-svg-icons'
import Canvas from './components/Canvas';
import { View, Screen } from './components/Canvas';
import { useEffect, useRef, useState } from 'react';

const initialViews: View[] = [
  {
    content: "View 0",
    props: {
      id: "view0",
      style: {
        transform: "translate(35.8724px, 123.82px) rotate(21.6343deg)",
        width: "97px",
        height: "55px",
      },
    },
  },
  {
    content: "View 1",
    props: {
      id: "view1",
      style: {
        transform: "translate(32.1856px, 252.116px) rotate(21.6343deg)",
        width: "97px",
        height: "75px",
      },
    },
  },
];

const App = () => {
  const [views, setViews] = useState<View[]>(initialViews);
  const viewsRef = useRef(views);
  const [activeViewID, setActiveViewID] = useState<string | null>(null);
  const [screen, setScreen] = useState<Screen>({
    resolution: { width: 640, height: 480 },
    snapGrid: { active: false, resolution: 10 },
  });

  useEffect(() => {
    console.log("views: ", views);
  }, [views]);

  useEffect(() => {
    console.log("activeViewID: ", activeViewID);
  }, [activeViewID]);

  const handleGridResolutionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const resolution = parseInt(event.target.value);
    setScreen((prevScreen) => ({
      ...prevScreen,
      snapGrid: { ...prevScreen.snapGrid, resolution },
    }));
  }

  const handleGridToggle = () => {
    setScreen((prevScreen) => ({
      ...prevScreen,
      snapGrid: {
        ...prevScreen.snapGrid,
        active: !screen.snapGrid.active,
      },
    }));
  }

  const handleJSONDownload = () => {
    console.log("targets: ", viewsRef.current);
    
    // Convert views to JSON
    const viewsJson = JSON.stringify(viewsRef.current);

    // Create a Blob object with the JSON data
    const blob = new Blob([viewsJson], { type: 'application/json' });

    // Create a download link for the file
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'views.json';
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
  
  return (
    <div className='h-screen flex flex-col'>
      <header className='text-neutral-300 bg-neutral-800 border border-neutral-700
                        h-16 flex flex-row place-items-center p-4 gap-2'>
        <div className=''>
          {`Resolution: ${screen.resolution.width}x${screen.resolution.height}`}
        </div>
        <div className='text-neutral-700'>
          <FontAwesomeIcon icon={faMinus} rotation={90} />
        </div>
        <div className='p-2 hover:bg-neutral-700 active:bg-neutral-900 rounded-md'>
          <label htmlFor="file-upload" className="cursor-pointer">
            <FontAwesomeIcon icon={faFolderOpen} />
          </label>
          <input id="file-upload"
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleJSONUpload}
          />
        </div>
        <div className='p-2 hover:bg-neutral-700 active:bg-neutral-900 rounded-md'
              onClick={handleJSONDownload}
        >
          <FontAwesomeIcon icon={faFloppyDisk} />
        </div>
        <button className='ml-auto p-2 hover:bg-neutral-700 active:bg-neutral-900 disabled:opacity-25 rounded-md'
        disabled={activeViewID === null}
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
        <div className='text-neutral-700'>
          <FontAwesomeIcon icon={faMinus} rotation={90} />
        </div>
        <button disabled className='p-2 hover:bg-neutral-700 active:bg-neutral-900 disabled:opacity-25 rounded-md'>
          <FontAwesomeIcon icon={faUpDownLeftRight} />
        </button>
        <button disabled className='p-2 hover:bg-neutral-700 active:bg-neutral-900 disabled:opacity-25 rounded-md'>
          <FontAwesomeIcon icon={faUpRightAndDownLeftFromCenter} />
        </button>
        <button disabled className='p-2 hover:bg-neutral-700 active:bg-neutral-900 disabled:opacity-25 rounded-md'>
         <FontAwesomeIcon icon={faRotate} />
        </button>
        <div className='text-neutral-700'>
          <FontAwesomeIcon icon={faMinus} rotation={90} />
        </div>
        <button className={`${screen.snapGrid.active? "bg-neutral-900": ""} p-2 hover:bg-neutral-700 active:bg-neutral-900 rounded-md`}
                onClick={handleGridToggle}
        >
          <FontAwesomeIcon icon={faTableCells} />
        </button>
        <div className="text-center">
          {/* <label htmlFor="default-range" className="text-xs">Grid Size</label> */}
          <input id="default-range"
            className="bg-neutral-300 accent-neutral-500 disabled:opacity-25
              w-full h-0.5 rounded-lg
              appearance-none cursor-pointer align-middle"
            type="range"
            value={screen.snapGrid.resolution}
            disabled={!screen.snapGrid.active}
            onChange={handleGridResolutionChange}
            />
        </div>
      </header>
      <div className='flex flex-auto'>
        <Canvas
          screen={screen}
          views={views}
          viewsRef={viewsRef}
          setActiveViewID={setActiveViewID}
        />
        <aside className='bg-neutral-800 border border-neutral-700
                          flex flex-col w-64'>
          <div className='h-1/2'>
            top
          </div>
          <div>
            bottom
          </div>
        </aside>
      </div>
    </div>
  );
};

export default App;
