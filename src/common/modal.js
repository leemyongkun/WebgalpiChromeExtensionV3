import Swal from "sweetalert2";
import LANG from "./language";

let MODAL = {
  alert(title, type, confirmBtnText, size) {
    if (title === null || title === undefined) {
      title = LANG.DESCRIPTION_MESSAGE("D0082");
    }

    if (type === null || type === undefined) {
      type = "success";
    }

    if (confirmBtnText === null || confirmBtnText === undefined) {
      confirmBtnText = LANG.BUTTON_MESSAGE("B0015");
    }

    if (size === null || size === undefined) {
      size = "300px";
    }

    return Swal.fire({
      title: null,
      width: size,
      html: title,
      icon: type,
      confirmButtonText: confirmBtnText || LANG.BUTTON_MESSAGE("B0015")
    });
  },
  confirm(title, type, confirmBtnText, cancelBtnText, size) {
    //, params, callback
    if (title === null || title === undefined) {
      title = LANG.CONFIRM_MESSAGE("C0011");
    }
    if (type === null || type === undefined) {
      type = "warning";
    }
    if (confirmBtnText === null || confirmBtnText === undefined) {
      confirmBtnText = LANG.BUTTON_MESSAGE("B0015");
    }
    if (cancelBtnText === null || cancelBtnText === undefined) {
      cancelBtnText = LANG.BUTTON_MESSAGE("B0010");
    }
    if (size === null || size === undefined) {
      size = "300px";
    }

    return Swal.fire({
      title: null,
      width: size,
      icon: type,
      showCancelButton: true,
      html: title,
      confirmButtonText: confirmBtnText,
      cancelButtonText: cancelBtnText
    });
  }
};
export default MODAL;
