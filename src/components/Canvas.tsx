import Moveable, { MoveableProps } from "react-moveable";
import { flushSync } from "react-dom";
import {
  MutableRefObject,
  useEffect,
  useRef,
  MouseEvent,
  Dispatch,
  SetStateAction,
} from "react";

export type View = {
  content: {
    label: string;
    src: string;
  };
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
};

export type CanvasProps = {
  screen: Screen;
  views: View[];
  viewsRef: MutableRefObject<View[]>;
  setActiveViewID: Dispatch<SetStateAction<string | null>>;
  moveableProps: MoveableProps;
  setMoveableProps: Dispatch<SetStateAction<MoveableProps>>;
};

export default function Canvas({
  screen,
  views,
  viewsRef,
  setActiveViewID,
  moveableProps,
  setMoveableProps,
}: CanvasProps) {
  const { resolution } = screen;
  // const [target, setTarget] = useState<HTMLElement | null>(null);
  const moveableRef = useRef<Moveable>(null);

  useEffect(() => {
    // update viewsRef when views change
    viewsRef.current = views;
    // disable moveable when views change
    setMoveableProps((prev) => ({ ...prev, target: null }));
  }, [setMoveableProps, views, viewsRef]);

  const handleChangeTarget = (e: MouseEvent<HTMLElement>) => {
    let target = e.target as HTMLElement;
    console.log("target: ", target.getRootNode());
    // get the first parent element that contains the class "target" or the id "screen"
    while (target && !target.classList.contains("target") && target.id !== "screen" && target.id !== "root") {
      console.log("target: ", target);
      target = target.parentElement as HTMLElement;
    }
    if (target.classList.contains("target") || target.id === "screen") {
      setMoveableProps((prev) => ({ ...prev, target }));
      setActiveViewID(target.id === "screen" ? null : target.id);
    } else {
      setMoveableProps((prev) => ({ ...prev, target: null }));
      setActiveViewID(null);
    }

    if (target.id === "screen") {
      setMoveableProps((prev) => ({
        ...prev,
        resizable: false,
        rotatable: false,
        originDraggable: false,
        origin: false,
      }));
    } else {
      setMoveableProps((prev) => ({
        ...prev,
        resizable: true,
        rotatable: true,
        originDraggable: true,
        origin: true,
      }));
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
            backgroundSize: `${moveableProps.snappable ? moveableProps.snapGridWidth : 0}px ${moveableProps.snappable ? moveableProps.snapGridHeight: 0}px`,
          }}
          // onClick={handleChangeTarget}
        >
          {views.map((target, index) => {
            return (
              <div
                key={index}
                id={target.props.id}
                className="target bg-neutral-700 border-neutral-600
                           text-center
                           border drop-shadow-md
                           absolute"
                style={{
                  ...target.props.style,
                  backgroundImage: `url(${target.content.src})`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "100% 100%",
                }}
              >
                <span className="bg-neutral-900 opacity-75 px-1">
                  {target.content.label}
                </span>
              </div>
            );
          })}
        </div>
      </main>
      <Moveable
        ref={moveableRef}
        flushSync={flushSync}
        draggable={true}
        target={moveableProps.target}
        resizable={moveableProps.resizable}
        rotatable={moveableProps.rotatable}
        originDraggable={moveableProps.originDraggable}
        origin={moveableProps.origin}
        snappable={moveableProps.snappable}
        snapGridWidth={moveableProps.snapGridWidth}
        snapGridHeight={moveableProps.snapGridHeight}
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
