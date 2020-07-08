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
      title: null,
      width: size,
      html: title,
      icon: type,
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
