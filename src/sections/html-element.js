import React from "react";
// polotno is made with mobx library
// we will need its tools to make reactive components
import { observer } from "mobx-react-lite";
import { Html } from "react-konva-utils";
// import Konva components
import { Group, Rect, Star, Text } from "react-konva";

// import toolbar components
import { NumericInput, Navbar, Alignment } from "@blueprintjs/core";
import ColorPicker from "polotno/toolbar/color-picker";

// import Polotno API methods
import { unstable_registerShapeComponent } from "polotno/config";
import { unstable_registerToolbarComponent } from "polotno/config";
import { unstable_registerShapeModel } from "polotno/config";
import { unstable_registerTransformerAttrs } from "polotno/config";

// define our model
// we need to provide all default values
unstable_registerShapeModel({
  type: "html",
  html: "",
  width: 100,
  height: 100,
});

const Inner = ({ htmlZIndex, html, ...props }) => {
  const iframeRef = React.useRef();

  React.useLayoutEffect(() => {
    const child = iframeRef.current.parentElement;
    const parent = child.parentElement;
    parent.removeChild(child);
    // Get the reference element (the element before which the new element will be inserted)
    var referenceElement = parent.children[htmlZIndex];

    // Insert the new element before the reference element
    parent.insertBefore(child, referenceElement);
  }, [htmlZIndex]);

  return (
    <div
      ref={iframeRef}
      {...props}
      dangerouslySetInnerHTML={{
        __html: html,
      }}
    />
  );
};

// now we need to define how elements looks on canvas
export const HtmlElement = observer(({ element, store }) => {
  const ref = React.useRef(null);

  const handleChange = (e) => {
    const node = e.currentTarget;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    // Konva.Transformer is changing scale by default
    // we don't need that, so we reset it back to 1.
    node.scaleX(1);
    node.scaleY(1);
    // and then save all changes back to the model
    element.set({
      x: node.x(),
      y: node.y(),
      rotation: e.target.rotation(),
      width: element.width * scaleX,
      height: element.height * scaleY,
    });
  };

  const PADDING = 1;
  const otherHtmlElements = element.page.children.filter(
    (el) => el.type === "html"
  );
  const htmlZIndex = otherHtmlElements.indexOf(element);

  // VERY IMPORTANT note!
  // element.x and element.y - must define top-left corner of the shape
  // so all position attributes are consistent across all elements
  return (
    <Group
      ref={ref}
      // remember to use "element" name. Polotno will use it internally to find correct node
      name="element"
      // also it is important to pass id
      // so polotno can automatically do selection
      id={element.id}
      x={element.x}
      y={element.y}
      fill={element.fill}
      rotation={element.rotation}
      opacity={element.opacity}
      draggable={!element.locked}
      onDragMove={handleChange}
      onTransform={handleChange}
      width={element.width}
      height={element.height}
    >
      <Rect
        width={element.width}
        height={element.height}
        fill="rgba(99,102,241,1)"
        cornerRadius={8}
        shadowBlur={10}
      />

      <Rect
        x={PADDING}
        y={PADDING}
        width={element.width - PADDING * 2}
        height={element.height - PADDING * 2}
        fill="red"
        globalCompositeOperation="destination-out"
        preventDefault={false}
        cornerRadius={5}
        listening={false}
        visible={!element.page._exporting}
      />
      <Text
        text="I am a frame"
        x={PADDING}
        y={PADDING}
        visible={element.page._exporting}
      />
      <Html
        divProps={{
          style: {
            zIndex: 0,
            height: element.height,
            width: element.width,
            backgroundColor: "white",
          },
        }}
      >
        <Inner
          style={{
            height: element.height,
            width: element.width,
            padding: PADDING + "px",
          }}
          htmlZIndex={htmlZIndex}
          src="https://polotno.com"
          html={element.html}
        />
      </Html>
    </Group>
  );
});

// now we can register canvas component
unstable_registerShapeComponent("html", HtmlElement);
// and change default transformer a bit
unstable_registerTransformerAttrs("html", {
  enabledAnchors: ["top-left", "top-right", "bottom-left", "bottom-right"],
});

// now we can define custom toolbar
const HtmlToolbar = observer(({ store }) => {
  const element = store.selectedElements[0];

  return (
    <Navbar.Group align={Alignment.LEFT}>
      {/* <ColorPicker
        value={element.fill}
        onChange={(fill) =>
          element.set({
            fill,
          })
        }
        store={store}
      />
      <NumericInput
        onValueChange={(val) => {
          element.set({ radius: val });
        }}
        value={element.radius}
        style={{ width: "50px", marginLeft: "10px" }}
        min={1}
        max={500}
      /> */}
    </Navbar.Group>
  );
});

unstable_registerToolbarComponent("html", HtmlToolbar);
