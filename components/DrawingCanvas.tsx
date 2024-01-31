// SOURCE: react-sketch canvas
// LINK: https://www.npmjs.com/package/react-sketch-canvas

import * as React from "react";
import { BiExport } from "react-icons/bi";
import {
  FaDownload,
  FaEraser,
  FaPencilAlt,
  FaRedoAlt,
  FaTrashAlt,
  FaUndoAlt,
} from "react-icons/fa";
import { ReactSketchCanvas, ReactSketchCanvasRef } from "react-sketch-canvas";

const styles = {
  border: "0.0625rem solid #9c9c9c",
  borderRadius: "0.25rem",
};

export default class Canvas extends React.Component<{}, { pencil: boolean }> {
  canvas: React.RefObject<ReactSketchCanvasRef>;
  constructor(props: {} | Readonly<{}>) {
    super(props);
    this.canvas = React.createRef<ReactSketchCanvasRef>();
    this.state = {
      pencil: true,
    };
  }

  handleExport = () => {
    if (!this.canvas.current) return;

    this.canvas.current.exportImage("png").then((data) => {
      const anchor = document.createElement("a");

      anchor.href = data;

      anchor.download = "exported_image.png";

      document.body.appendChild(anchor);

      anchor.click();

      document.body.removeChild(anchor);
    });
  };

  render() {
    return (
      <div className="h-full w-full flex-col justify-center">
        <ReactSketchCanvas
          ref={this.canvas}
          strokeWidth={5}
          strokeColor="pink"
          eraserWidth={30}
          backgroundImage="/backgrounds/whiteGrayBg.png"
          exportWithBackgroundImage={true}
        />
        <div className="m-2 flex justify-center">
          <button
            className="m-2 h-fit rounded-xl bg-white p-2 text-3xl"
            onClick={() => {
              this.handleExport();
            }}
          >
            <FaDownload />
          </button>

          <button
            className={`m-2 h-fit rounded-xl ${this.state.pencil ? "bg-gray-600 " : "bg-white "}  p-2 text-3xl`}
            onClick={() => {
              if (!this.canvas.current) return;
              this.canvas.current.eraseMode(false);
              this.setState({ pencil: true });
            }}
          >
            <FaPencilAlt />
          </button>
          <button
            className={`m-2 ${this.state.pencil ? "bg-white" : "bg-gray-600"} h-fit rounded-xl p-2 text-3xl`}
            onClick={() => {
              if (!this.canvas.current) return;
              this.canvas.current.eraseMode(true);
              this.setState({ pencil: false });
            }}
          >
            <FaEraser />
          </button>
          <button
            className="m-2 h-fit rounded-xl bg-white p-2 text-3xl"
            onClick={() => {
              if (!this.canvas.current) return;
              this.canvas.current.undo();
            }}
          >
            <FaUndoAlt />
          </button>
          <button
            className="m-2 h-fit rounded-xl bg-white p-2 text-3xl"
            onClick={() => {
              if (!this.canvas.current) return;
              this.canvas.current.redo();
            }}
          >
            <FaRedoAlt />
          </button>
          <button
            className="m-2 h-fit rounded-xl bg-white p-2 text-3xl"
            onClick={() => {
              if (!this.canvas.current) return;
              this.canvas.current.clearCanvas();
            }}
          >
            <FaTrashAlt />
          </button>
        </div>
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
