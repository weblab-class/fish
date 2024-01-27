// SOURCE: react-sketch canvas
// LINK: https://www.npmjs.com/package/react-sketch-canvas

import * as React from "react";
import { ReactSketchCanvas, ReactSketchCanvasRef } from "react-sketch-canvas";

const styles = {
  border: "0.0625rem solid #9c9c9c",
  borderRadius: "0.25rem",
};

export default class Canvas extends React.Component {
  canvas: React.RefObject<ReactSketchCanvasRef>;
  constructor(props: {} | Readonly<{}>) {
    super(props);

    this.canvas = React.createRef();
  }

  render() {
    return (
      <div className="flex h-full w-full justify-center">
        <ReactSketchCanvas
          ref={React.createRef() as React.Ref<ReactSketchCanvasRef>}
          strokeWidth={5}
          strokeColor="black"
          backgroundImage="/backgrounds/whiteGrayBg.png"
        />
        {/* <button
          onClick={() => {
            if (!this.canvas.current) return;
            this.canvas.current.undo();
          }}
        >
          Undo
        </button>
        <button
          onClick={() => {
            if (!this.canvas.current) return;
            this.canvas.current.redo();
          }}
        >
          Redo
        </button>
        <button
          onClick={() => {
            if (!this.canvas.current) return;
            this.canvas.current.clearCanvas();
          }}
        >
          Clear All
        </button> */}
      </div>
    );
  }
}
