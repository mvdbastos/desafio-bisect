import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faTrash,
  faRotate,
  faUpDownLeftRight,
  faUpRightAndDownLeftFromCenter,
  faTableCells,
  faMinus
} from '@fortawesome/free-solid-svg-icons'
import Canvas from './components/Canvas';
import { View, Resolution } from './components/Canvas';
import { useEffect, useState } from 'react';

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
  const resolution: Resolution = { width: 640, height: 480 };

  useEffect(() => {
    console.log("views: ", views);
  }, [views]);
  
  return (
    <div className='h-screen flex flex-col'>
      <header className='text-neutral-300 bg-neutral-800 border border-neutral-700
                        h-16 flex flex-row place-items-center p-4 gap-4'>
        <div className='mr-auto'>
          resolution
        </div>
        <button className='p-2 hover:bg-neutral-700 active:bg-neutral-900 rounded-md'>
          <FontAwesomeIcon icon={faTableCells} />
        </button>
        <div className='text-neutral-700'>
          <FontAwesomeIcon icon={faMinus} rotation={90} />
        </div>
        <button className='p-2 hover:bg-neutral-700 active:bg-neutral-900 rounded-md'>
          <FontAwesomeIcon icon={faTrash} />
        </button>
        <button className='p-2 hover:bg-neutral-700 active:bg-neutral-900 rounded-md'>
          <FontAwesomeIcon icon={faUpDownLeftRight} />
        </button>
        <button className='p-2 hover:bg-neutral-700 active:bg-neutral-900 rounded-md'>
          <FontAwesomeIcon icon={faUpRightAndDownLeftFromCenter} />
        </button>
        <button className='p-2 hover:bg-neutral-700 active:bg-neutral-900 rounded-md'>
         <FontAwesomeIcon icon={faRotate} />
        </button>
        <div className='text-neutral-700'>
          <FontAwesomeIcon icon={faMinus} rotation={90} />
        </div>
        <div>
          {/* <label htmlFor="default-range" className="block mb-2">Default range</label> */}
          <input id="default-range"
            type="range"
            // value="50"
            className="bg-neutral-300 accent-neutral-300
                      w-full h-0.5 rounded-lg
                      appearance-none cursor-pointer align-middle" />
        </div>
      </header>
      <div className='flex flex-auto'>
        <Canvas
          resolution={resolution}
          views={views}
          setViews={setViews}
        />
        <aside className='bg-neutral-800 border border-neutral-700
                          flex w-64'>
          <div>
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
