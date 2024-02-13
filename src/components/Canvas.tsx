import * as React from "react";
import Moveable from "react-moveable";
import { flushSync } from "react-dom";

export type View = {
  content: string;
  props: {
    id: string;
    style: {
      transform: string;
      width: string;
      height: string;
    };
  };
};

export type Resolution = {
  width: number;
  height: number;
};

export type CanvasProps = {
  resolution: Resolution;
  views: View[];
  setViews: React.Dispatch<React.SetStateAction<View[]>>;
};

export default function Canvas({ resolution, views, setViews }: CanvasProps ) {
  const [target, setTarget] = React.useState<HTMLElement | null>(null);
  const moveableRef = React.useRef<Moveable>(null);
  const [state, setState] = React.useState({
    resizable: false,
    rotatable: false,
    originDraggable: false,
    origin: false,
  });

  const handleClick = () => {
    console.log("targets: ", views);
  };

  const handleChangeTarget = (e: React.MouseEvent<HTMLElement>) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains("target") || target.id === "screen") {
      setTarget(target);
    } else setTarget(null);

    if (target.id === "screen") {
      setState({
        resizable: false,
        rotatable: false,
        originDraggable: false,
        origin: false,
      });
    } else {
      setState({
        resizable: true,
        rotatable: true,
        originDraggable: true,
        origin: true,
      });
    }
  };

  return (
    <>
      <main
        id="canvas"
        className="bg-neutral-900 grid place-content-center w-full overflow-hidden"
        onClick={handleChangeTarget}
      >
        <button onClick={() => handleClick()}>click</button>
        <div
          id="screen"
          className="bg-neutral-800 border-neutral-700
                    border drop-shadow-lg
                    relative origin-center overflow-hidden"
          style={{ width: resolution.width, height: resolution.height }}
          // TODO: show grid in css
          onClick={handleChangeTarget}
        >
          {views.map((target, index) => {
            return (
              <div
                key={index}
                id={target.props.id}
                className="target bg-neutral-700 border-neutral-600
                           border drop-shadow-md
                           absolute"
                style={target.props.style}
              >
                {target.content}
              </div>
            );
          })}
        </div>
      </main>
      <Moveable
        ref={moveableRef}
        target={target}
        flushSync={flushSync}
        draggable={true}
        resizable={state.resizable}
        rotatable={state.rotatable}
        originDraggable={state.originDraggable}
        origin={state.origin}
        snappable={true}
        snapGridWidth={10}
        snapGridHeight={10}
        onRender={(e) => {
          e.target.style.cssText += e.cssText;
          // e.target.style.transform = e.style.transform;
          // e.target.style.width + e.style.width;
          // e.target.style.height + e.style.height;
          // const { transform, width, height } = e.target.style;
          // console.log("e.style: ", { transform, width, height });
        }}
        onRenderEnd={(e) => {
          const { id } = e.target;
          const { transform, width, height } = e.target.style;
          const style = { transform, width, height };
          // console.log("target: ", target);
          setViews((prevTargets) => {
            const target = prevTargets.find((target) => target.props.id === id);
            if (target) {
              target.props.style.height = style.height;
              target.props.style.width = style.width;
              target.props.style.transform = style.transform;
            }
            return prevTargets;
            // const newTargets = prevTargets.map((target) => {
            //   if (target.props.id === id) {
            //     target.props.style = style;
            //   }
            //   return target;
            // });
          });
        }}
        onDragOrigin={(e) => {
          e.target.style.transformOrigin = e.transformOrigin;
          e.target.style.transform = e.drag.transform;
        }}
      />
    </>
  );
}
