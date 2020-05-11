import Swal from "sweetalert2";

let MODAL = {
  alert(title, type, confirmBtnText) {
    //, cancelBtnText, params, callback
    // if (title == null) {
    //   title = "처리되었습니다.";
    // }
    // if (type == null) {
    //   type = "success";
    // }

    // if (confirmBtnText == null) {
    //   confirmBtnText = "확인";
    // }

    return Swal.fire({
      width: "300px",
      html: title || "처리되었습니다.",
      type: type || "success",
      confirmButtonText: confirmBtnText || "확인"
    });
  },
  confirm(title, type, confirmBtnText, cancelBtnText) {
    //, params, callback
    if (title == null) {
      title = "실행하시겠습니까?";
    }
    if (type == null) {
      type = "warning";
    }
    if (confirmBtnText == null) {
      confirmBtnText = "확인";
    }
    if (cancelBtnText == null) {
      cancelBtnText = "취소";
    }

    return Swal.fire({
      width: "300px",
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
