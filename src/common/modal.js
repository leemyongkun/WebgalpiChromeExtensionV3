import Swal from "sweetalert2";

let MODAL = {
  alert(title, type, confirmBtnText, size) {
    if (title === null || title === undefined) {
      title = "처리되었습니다.";
    }

    if (type === null || type === undefined) {
      type = "success";
    }

    if (confirmBtnText === null || confirmBtnText === undefined) {
      confirmBtnText = "확인";
    }

    if (size === null || size === undefined) {
      size = "300px";
    }

    return Swal.fire({
      width: size,
      html: title || "처리되었습니다.",
      type: type || "success",
      confirmButtonText: confirmBtnText || "확인"
    });
  },
  confirm(title, type, confirmBtnText, cancelBtnText, size) {
    //, params, callback
    if (title === null || title === undefined) {
      title = "실행하시겠습니까?";
    }
    if (type === null || type === undefined) {
      type = "warning";
    }
    if (confirmBtnText === null || confirmBtnText === undefined) {
      confirmBtnText = "확인";
    }
    if (cancelBtnText === null || cancelBtnText === undefined) {
      cancelBtnText = "취소";
    }
    if (size === null || size === undefined) {
      size = "300px";
    }

    return Swal.fire({
      width: size,
      type: type,
      showCancelButton: true,
      html: title,
      confirmButtonText: confirmBtnText,
      cancelButtonText: cancelBtnText
    });
  },
  confirmWithOptions(options) {
    if (options.title === undefined) {
      options.title = "실행하시겠습니까?";
    }
    if (options.type === undefined) {
      options.type = "warning";
    }
    if (options.confirmBtnText === undefined) {
      options.confirmBtnText = "확인";
    }
    if (options.cancelBtnText === undefined) {
      options.cancelBtnText = "취소";
    }
    if (options.showCancelButton === undefined) {
      options.showCancelButton = false;
    }
    return Swal.fire({
      text: options.title,
      type: options.type,
      showCancelButton: options.showCancelButton,
      confirmButtonText: options.confirmBtnText,
      cancelButtonText: options.cancelBtnText
    });
  }
};

export default MODAL;
