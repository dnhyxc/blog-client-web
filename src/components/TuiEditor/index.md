### api

```
https://nhn.github.io/tui.editor/latest/tutorial-example12-editor-with-all-plugins

https://nhn.github.io/tui.editor/latest/ToastUIEditorCore#getHTML

```

### latex.js

```
https://latex.js.org/usage.html#cli
```

### insertBar

```js
function createLastButton() {
  const button = document.createElement("button");

  button.className = "toastui-editor-toolbar-icons last";
  button.style.backgroundImage = "none";
  button.style.margin = "0";
  button.innerHTML = `<i>B</i>`;
  button.addEventListener("click", () => {
    editor.exec("bold");
  });

  return button;
}

const editor = new toastui.Editor({
  el: document.querySelector("#editor"),
  previewStyle: "vertical",
  height: "500px",
  initialValue: "The first and last buttons are customized.",
  toolbarItems: [
    ["heading", "bold", "italic", "strike"],
    ["hr", "quote"],
    ["ul", "ol", "task", "indent", "outdent"],
    ["table", "image", "link"],
    ["code", "codeblock"],
    // Using Option: Customize the last button
    [
      {
        el: createLastButton(),
        command: "bold",
        tooltip: "Custom Bold",
      },
    ],
  ],
});

editor.insertToolbarItem(
  { groupIndex: 0, itemIndex: 0 },
  {
    name: "myItem",
    tooltip: "Custom Button",
    command: "bold",
    text: "@",
    className: "toastui-editor-toolbar-icons first",
    style: { backgroundImage: "none" },
  }
);
```

#### code

```js
console.log("foo");
```

```javascript
console.log("bar");
```

```html
<div id="editor"><span>baz</span></div>
```

```wrong
[1 2 3]
```

```clojure
[1 2 3]
```
