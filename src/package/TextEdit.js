import {
  getFontString,
  getTextElementSize,
} from "./utils";
import EventEmitter from "eventemitter3";

// 文字编辑类
export default class TextEdit extends EventEmitter {
  constructor(app) {
    super();
    this.app = app;
    this.ctx = app.ctx;
    this.editable = null;
    this.isEditing = false;
    this.onTextInput = this.onTextInput.bind(this);
    this.onTextBlur = this.onTextBlur.bind(this);
  }

  // 创建文本输入框元素
  crateTextInputEl() {
    this.editable = document.createElement("textarea");
    this.editable.dir = "auto";
    this.editable.tabIndex = 0;
    this.editable.wrap = "off";
    this.editable.className = "textInput";
    Object.assign(this.editable.style, {
      position: "fixed",
      display: "block",
      minHeight: "1em",
      backfaceVisibility: "hidden",
      margin: 0,
      padding: 0,
      border: 0,
      outline: 0,
      resize: "none",
      background: "transparent",
      overflow: "hidden",
      whiteSpace: "pre",
    });
    this.editable.addEventListener("input", this.onTextInput);
    this.editable.addEventListener("blur", this.onTextBlur);
    document.body.appendChild(this.editable);
  }

  // 根据当前文字元素的样式更新文本输入框的样式
  updateTextInputStyle() {
    let activeElement = this.app.render.activeElements[0];
    if (!activeElement) {
      return;
    }
    let {
      x,
      y,
      width,
      height,
      style,
      text,
      rotate,
    } = activeElement;
    this.editable.value = text;
    let styles = {
      font: getFontString(style.fontSize, style.fontFamily),
      lineHeight: `${style.fontSize * style.lineHeightRatio}px`,
      left: `${x}px`,
      top: `${this.app.coordinate.subScrollY(y)}px`,
      color: style.fillStyle,
      width: Math.max(width, 100) + "px",
      height: height + "px",
      transform: `rotate(${rotate}deg)`,
      opacity: style.globalAlpha,
    };
    Object.assign(this.editable.style, styles);
  }

  // 文本输入事件
  onTextInput() {
    let activeElement = this.app.render.activeElements[0];
    if (!activeElement) {
      return;
    }
    activeElement.text = this.editable.value;
    let { width, height } = getTextElementSize(activeElement);
    activeElement.width = width;
    activeElement.height = height;
    this.updateTextInputStyle();
  }

  // 文本框失焦事件
  onTextBlur() {
    this.editable.style.display = "none";
    this.editable.value = "";
    this.emit('blur');
    this.isEditing = false;
  }

  // 显示文本编辑框
  showTextEdit() {
    if (!this.editable) {
      this.crateTextInputEl();
    } else {
      this.editable.style.display = "block";
    }
    this.updateTextInputStyle();
    this.editable.focus();
    this.editable.select();
    this.isEditing = true;
  }
}