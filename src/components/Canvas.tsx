import Moveable from "react-moveable";
import { flushSync } from "react-dom";
import {
  MutableRefObject,
  useEffect,
  useRef,
  useState,
  MouseEvent,
} from "react";

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

export type Screen = {
  resolution: {
    width: number;
    height: number;
  };
  snapGrid: {
    active: boolean;
    x: number;
    y: number;
  };
};

export type CanvasProps = {
  screen: Screen;
  views: View[];
  viewsRef: MutableRefObject<View[]>;
};

export default function Canvas({ screen, views, viewsRef }: CanvasProps) {
  const { resolution, snapGrid } = screen;
  const snap = {
    active: snapGrid.active,
    x: snapGrid.active ? snapGrid.x : 0,
    y: snapGrid.active ? snapGrid.y : 0,
  }
  const [target, setTarget] = useState<HTMLElement | null>(null);
  const moveableRef = useRef<Moveable>(null);
  const [state, setState] = useState({
    resizable: false,
    rotatable: false,
    originDraggable: false,
    origin: false,
  });

  useEffect(() => {
    // update viewsRef when views change
    viewsRef.current = views;
    // disable moveable when views change
    setTarget(null);
  }, [views, viewsRef]);

  const handleChangeTarget = (e: MouseEvent<HTMLElement>) => {
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
        <div
          id="screen"
          className="bg-neutral-800 border-neutral-700
                    border drop-shadow-lg
                    relative origin-center overflow-hidden"
          style={{
            width: resolution.width,
            height: resolution.height,
            backgroundImage: `linear-gradient(to right, #444 1px, transparent 1px),
                              linear-gradient(to bottom, #444 1px, transparent 1px)`,
            backgroundSize: `${snap.x}px ${snap.y}px`,
          }}
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
        snappable={snap.active}
        snapGridWidth={snap.x}
        snapGridHeight={snap.y}
        isDisplayGridGuidelines={true}
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

          const target = viewsRef.current.find(
            (target) => target.props.id === id
          );
          if (target) {
            target.props.style = {
              ...target.props.style,
              transform: style.transform,
              width: style.width,
              height: style.height,
            };
          }
        }}
        onDragOrigin={(e) => {
          e.target.style.transformOrigin = e.transformOrigin;
          e.target.style.transform = e.drag.transform;
        }}
      />
    </>
  );
}
