let MESSAGE = {
  kr: {
    BUTTON: {
      B0001: "EDIT", //카테고리 편집 버튼명
      B0002: "로그아웃",
      B0003: "완료", //카테고리 편집창에서의 닫기 버튼
      B0004: "더 보기", //컨텐츠 리스트 더보기
      B0005: "모두삭제",
      B0006: "연습하기",
      B0007: "새탭으로 열기",
      B0008: "스크래핑 다시 시도하기",
      B0009: "백업하기",
      B0010: "취소",
      B0011: "삭제",
      B0012: "닫기",
      B0013: "저장",
      B0014: "로그인",
      B0015: "확인",
      B0016: "사용자 등록",
      B0017: "로그인",
      B0018: "구글 로그인",
      B0019: "다른계정으로 변경하기",
      B0020: "복구하기",
      B0021: "변환",
      B0022: "대쉬보드 이동하기"
    },
    ALERT: {
      A0001: "하위 카테고리를 포함하고 있어, 삭제할 수 없습니다.",
      A0002: "상위 카테고리를 지정(클릭)하셔야 합니다.",
      A0003: `모든 백업파일을 삭제할 수는 없습니다. <br>1개 이상의 백업파일은 남겨두세요.`,
      A0004: "백업이 완료 되었습니다.",
      A0005: "복구가 완료 되었습니다.",
      A0006: "백업 대상과 로그인 계정이 다릅니다.",
      A0007: "복구 할 대상이 존재하지 않습니다.",
      A0008: "백업 도중 에러가 발생하였습니다.",
      A0009: "컬러를 1개 이상은 선택해야 합니다.",
      A0010: "구글 계정 로그인 도중 에러가 발생하였습니다.",
      A0011: "계정정보가 존재 하지 않습니다.",
      A0012:
        "Google이 로그아웃 되어있습니다. <br>새창이 열리면 로그인 후 다시 시도해주세요.",
      A0013: " 계정과 다른 계정으로 로그인 하셨습니다.",
      A0014: "컨텐츠를 저장하였습니다.",
      A0015:
        "카테고리 정보를 업데이트 할 수 없습니다.\nDashboard에서 수행하십시오.",
      A0016: "카테고리 정보가 업데이트 되었습니다.",
      A0017: "LOCK이 해제되었습니다.",
      A0018:
        "WEBGALPI가 로딩되지 않았습니다.\nPOPUP을 닫고 새로고침 후 다시 시도하십시오.",
      A0020: "이미 저장 된 사이트입니다.",
      A0021: "메모가 저장되었습니다.",
      A0022: "현재 브라우저는 Web SQL Database를 지원합니다.",
      A0023: "현재 브라우저는 Web SQL Database를 지원하지 않습니다.",
      A0024: "",
      A0025:
        "WEB-GALPI가 설치 및 업데이트 되었습니다.\n해당 페이지를 Reload 합니다."
    },
    CONFIRM: {
      C0001: "카테고리를 삭제 하시겠습니까?",
      C0002: "모든 하이라이트를 삭제하시겠습니까?",
      C0003: "하이라이트를 삭제하시겠습니까?",
      C0004:
        "<b>컨텐츠를 삭제하시겠습니까?</b><br><br><u>하이라이트도 함께 삭제됩니다.</u><br />(복구되지 않음)",
      C0005: "건의 백업파일을 삭제 하시겠습니까?",
      C0006: " 를 삭제 하시겠습니까?",
      C0007: " 주의 : 마지막 백업파일입니다.",
      C0008: `로 복구 하시겠습니까?<br><br>
                        복구 시 스크래핑을 진행하며, 다소 시간이 걸릴수도 있습니다.<br><br>
                        <span style="color:red">
                        모든 데이타를 삭제한 후 복구를 진행하므로,<br>
                        절대 진행 도중 창을 닫거나, 새로고침을 하지 마세요!<br>
                         </span>`,
      C0009: `<b>계정등록을 완료 했습니다.</b><br><br>
                                  WEBGALPI 즉시 반영하기 위해서는, <br>
                                  열려있는 모든 페이지를 새로고침 해야합니다.<br>
                                  진행 하시겠습니까?<br><br>
                                  <span style="color: red;">※ 한번에 새로고침을 진행합니다.</span>
                                    `,
      C0010: "UNLOCK을 진행하시겠습니까?",
      C0011: "실행하시겠습니까?",
      C0012: ""
    },
    DESCRIPTION: {
      D0001: "카테고리 검색", //카테고리 검색 영역의 placeholder
      D0002: `<b>새로운 카테고리를 생성하여,<br/>컨텐츠를 분류해보세요.</b>`,
      D0003:
        "카테고리를 상하로 Drag&Drop으로 자유롭게 순서를 정렬할 수 있습니다.",
      D0004:
        "하위 카테고리에서 상위 카테고리로 Drag&Drop 하여 Tree 구조를 자유롭게 구성할 수 있습니다.",
      D0005: "상위 카테고리",
      D0006: "상위 카테고리명을 추가 및 수정합니다.",
      D0007: "상위 카테고리가 없습니다.",
      D0008: "하위 카테고리",
      D0009: "하위 카테고리명을 추가 및 수정합니다.",
      D0010:
        "상위 카테고리를 선택하지 않았거나, 하위 카테고리가 존재하지 않습니다.",
      D0011: "선택된 카테고리에서 컨텐츠의 제목/본문을 검색합니다.",
      D0012: "검색어 입력 후 엔터", //placeholder
      D0013: "등록순서로 정렬합니다.",
      D0014: "★ 표시 컨테츠를 필터링 합니다.",
      D0015: "스크래핑에 실패한 컨텐츠를 필터링 합니다.",
      D0016: "하이라이트를 표시합니다.",
      D0017: "잠겨있는 컨텐츠입니다.<br />스크래핑을 다시 시도해보세요.",
      D0018: "컨텐츠를 새탭으로 오픈합니다.",
      D0019: "Facebook으로 컨텐츠를 공유합니다.",
      D0020: "컨텐츠를 삭제합니다.",
      D0021: "사이트에 방문하여 원하는 컬러로 하이라이팅을 해보세요.",
      D0022: "컨텐츠 변환을 할 수 없는 사이트입니다.",
      D0023:
        "스크래핑에 실패 했을 경우, 해당 사이트에 직접 방문하여 Lock을 해제 할 수 있습니다.",
      D0024: "※ 방법 : '새탭으로 열기' > 브라우져 상단 WEBGALPI 아이콘 클릭 > ",
      D0025: "구글 드라이브로 백업을 진행하시겠습니까?",
      D0026: "간단한 Description을 입력하세요.",
      D0027: "(E) yyyy년 MM월 dd일 a/p hh시 mm분 ss초",
      D0028: "복구",
      D0029: "백업 정보",
      D0030: "카테고리 정보",
      D0031: "카테고리 사이트 포함 정보",
      D0032: `※ Progress는 크롤링에 대한 완료여부이며, 기본 데이타는 모두
                  복구 됩니다.<br />
                  ※ private service의 데이타를 외부로의 유출을 방지하기
                  위함입니다.<br />
                  ※ FAIL이 발생 하는 경우는 아래와 같으며, Contents View
                  영역에서 크롤링을 다시 시도할 수 있습니다.`,
      D0033: "사이트 정보",
      D0034: "Connection Timeout이 5초가 넘었을 경우.",
      D0035: "더 이상 Service를 하지 않는 경우.",
      D0036: "사내망(Private Service)의 경우. (외부에서 차단된 사이트)",
      D0037: "FAIL 확인은 'ALL CATEGORY' 클릭 후,",
      D0038: "을 클릭하면 확인 할 수 있습니다.",
      D0039: "하이라이팅 정보",
      D0040: "백업/복구",
      D0041: "백업",
      D0042: "구글 드라이브에 파일형태로 백업됩니다.",
      D0043: "모든 데이타는 암호화 처리됩니다.",
      D0044: "임의로 파일명/폴더명/파일내용을 변경하지 마십시오.",
      D0045: "복구 시, 기존 데이타는 모두 삭제 됩니다.",
      D0046: "현재 계정과 일치하지 않을 경우, 복구되지 않으니 주의바랍니다.",
      D0047: "삭제",
      D0048: "※ 스크래핑 실패한 건에 대해서는 저장하지 않습니다.",
      D0049: "최대 6개의 컬러를 지정할 수 있습니다.",
      D0050: "THEME 설정",
      D0051: "로그아웃",
      D0052: "로그아웃 하시겠습니까?",
      D0053: "검색키워드",
      D0054: "모아보기",
      D0055: "TAB GROUP을 삭제합니다.",
      D0056: "열려있는 모든 탭을 모아서 관리합니다.",
      D0057: `선택 한 TAB GROUP을 삭제하시겠습니까?<br>(모든 TAB 정보가 삭제됩니다.)`,
      D0058: "현재 탭을 제외한 모든 윈도우와 탭이 닫힙니다.<br>",
      D0059: `<b>상위 카테고리에는 컨텐츠를 담을 수 없습니다. 하위 카테고리를 만들어시도 해보세요.<br /><br />※ 10초 후, 자동으로 사라집니다.</b>`,
      D0060: "카테고리명 입력 후 엔터",
      D0061: "로그인",
      D0062: "Google 계정 등록을 하셨나요?",
      D0063:
        "WEBGALPI를 사용하기 위해, Google 계정으로 로그인을 하셔야 합니다.<br/>데이타 백업으로 GOOGLE DRIVE를 사용합니다.",
      D0064: `님 WEBGALPI에 오신것을 환영합니다.<br/>
                    WEBGALPI에서 사용할 PASSWORD를 입력해주세요.<br/>
                    <span style="color: red;">계정변경 및 백업/복구</span>에 사용합니다.<br/><br/>`,
      D0065: "Google 계정 인증이 정상완료 되었습니다.",
      D0066: "현재 열려있는 모든 TAB을 모아서 관리해보세요.",
      D0067: "대쉬보드의 테마설정을 LIGHT/DARK로 변경합니다.",
      D0068: "현재 상태를 구글 드라이브를 이용하여 백업/복구를 진행합니다.",
      D0069: "원하는 색상의 하이라이트 컬러를 지정하여 사용해보세요.",
      D0070: "UPDATE 이력",
      D0071: "개선 및 기능추가",
      D0072: "디버깅",
      D0073: "최근 백업한 데이타가 있습니다.<br/>복구를 진행하시겠습니까?",
      D0074:
        "하이라이팅이 안되시나요?<br>NAVER / Daum Blog의 구조는 조금 특별합니다.<br>페이지를 모바일 버전으로 변환하여 사용해보세요.",
      D0075: "사이트를 저장합니다.",
      D0076: "카테고리를 변경합니다",
      D0077: "현재 사이트에 LOCK을 해제할 수 있습니다.",
      D0078: "대쉬보드로 이동합니다.",
      D0079: "차단된 사이트",
      D0080: "이 사이트에서는 WEBGALPI를 사용할 수 없습니다.",
      D0081: "페이스북/트위터는 패치중입니다.",
      D0082: "처리되었습니다.",
      D0083: "로 업데이트 되었습니다.\n클릭하여 업데이트 내역을 확인해보세요.",
      D0084: ""
    },
    SNACK: {
      S0001: "편집 중에는, 하위 카테고리를 이동 할 수 없습니다.",
      S0002: "카테고리명을 입력하세요.",
      S0003: "STAR를 해제하였습니다.",
      S0004: "STAR로 지정하였습니다.",
      S0005: "ITEM(s)이 없습니다.",
      S0006: "마지막 ITEM 입니다.",
      S0007: "LOCK이 해제되었습니다.",
      S0008: "URL이 복사되었습니다.",
      S0009: "IMPORT 되었습니다.",
      S0010: "COLOR가 저장되었습니다.",
      S0011: "Color지정은 6개까지입니다.",
      S0012: "Color를 1개 이상 지정해야합니다.",
      S0013: "백업파일을 삭제하였습니다.",
      S0014: "카테고리에 저장되었습니다.",
      S0015: "카테고리 저장에 실패하였습니다. 다시 시도바랍니다.",
      S0016: "정확한 패스워드가 아닙니다. 다시 시도해주세요.",
      S0017: "이미 존재하는 계정입니다.",
      S0018: "로 테마가 변경되었습니다.",
      S0019: "'IMPORT BOOKMARK' 기능은 준비중입니다."
    }
  },
  en: {
    BUTTON: {
      B0001: "EDIT", //카테고리 편집 버튼명
      B0002: "Sign Out",
      B0003: "Done", //카테고리 편집창에서의 닫기 버튼
      B0004: "View more", //컨텐츠 리스트 더보기
      B0005: "Delete all",
      B0006: "Try it!",
      B0007: "Open on a new tab",
      B0008: "Retry scraping",
      B0009: "Backup",
      B0010: "Cancel",
      B0011: "Delete",
      B0012: "Close",
      B0013: "Save",
      B0014: "Sign in",
      B0015: "OK",
      B0016: "Register account",
      B0017: "Sign in",
      B0018: "Sign in with Google",
      B0019: "Switch to another account",
      B0020: "Restore",
      B0021: "변환?", // 무엇이 바뀌는것인가요?
      B0022: "Move Dashboard"
    },
    ALERT: {
      A0001: "You cannot delete a category with one or more subcategories.",
      A0002: "Please select a category.",
      A0003: `Backup files could not be deleted. <br> You must keep at least one backup.`,
      A0004: "Backup is completed.",
      A0005: "Your bookmarks have been restored.",
      A0006:
        "The account used for backup does not match account your current account.",
      A0007: "Restoration target does not exist.",
      A0008: "Something went wrong during backup process.",
      A0009: "Please select at least one color",
      A0010: "Webgalpi could not sign in with your Google account.",
      A0011: "Account information does not exist.",
      A0012:
        "You were logged out of your Google account. <br> Please sign in again on a new window.",
      A0013: " is not the account you signed in.", //이어지는 문장인것같은데 맥락을 모르겠어요
      A0014: "Your content has been saved.",
      A0015:
        "Category information could not be upadted.\n Please update on dashboard page.",
      A0016: "Category information has been updated.",
      A0017: "Unlocked.",
      A0018:
        "WEBGALPI could not load.\n Please try again after refreshing the page.",
      A0020: "This web page is already saved.",
      A0021: "Your memo has been saved.",
      A0022: "Your current browser supports Web SQL Database.",
      A0023: "Your current browser does not support Web SQL Database.",
      A0024: "",
      A0025:
        "WEB-GALPI was successfully installed and updated. \n The page will be reloaded."
    },
    CONFIRM: {
      C0001: "Delete category?",
      C0002: "Delete all highlights. Are you sure?",
      C0003: "Delete highlight. Do you want to proceed?",
      C0004:
        "<b>Delete content. Do you want to proceed?</b><br><br><u>Highlights on the content will be lost forever.</u><br />",
      C0005: " backup files will be deleted. Do you want to proceed?",
      C0006: " will be deleted. Do you want to proceed?",
      C0007: " Warning : This is your last backup file.",
      C0008: `will be used for restoration. Do you want to proceed?<br><br>
                        Contents will be scraped for restoration. This process may take a while.<br><br>
                        <span style="color:red">
                        This process will delete all data and then restore from backup.<br>
                        Do not close or refresh the browser during restore process.<br>
                         </span>`,
      C0009: `<b> Account successfully registered.</b><br><br>
                                  To use WEBGALPI, <br>
                                  WEBGALPI needs to refresh all open pages.<br>
                                  Do you want to proceed?<br><br>
                                  <span style="color: red;">※ WEBGALPI will reload all pages at once.</span>
                                    `,
      C0010: "Do you want to UNLOCK?",
      C0011: "Do you want to proceed?",
      C0012: ""
    },
    DESCRIPTION: {
      D0001: "Search categories", //카테고리 검색 영역의 placeholder
      D0002: `<b>Create new category,<br/> sort your highlights by interests.</b>`,
      D0003: "Drag & Drop to change order of your categories.",
      D0004:
        "Drag & Drop from subcategory to category to change structures as you want.",
      D0005: "Category",
      D0006: "Add and change category name.",
      D0007: "Category is missing",
      D0008: "Subcategory",
      D0009: "Add and change subcategory name.",
      D0010: "Category is not selected or subcategory is missing.",
      D0011: "Search through title/content in your selected category.",
      D0012: "Type in search term and press enter", //placeholder
      D0013: "Order by saved date.",
      D0014: "Only display contents with ★.", // 별표된 컨텐츠만 보여주는게 맞나요?
      D0015: "Only display contents which failed scraping.", // 스크래핑에 실패한 컨텐츠만 보여주는게 맞나요? 반대면 Only show -> Hide 로 바꿔주세요
      D0016: "Display highlights.",
      D0017: "Content is locked.<br /> Try scraping again.",
      D0018: "Open contents on a new tab.",
      D0019: "Share your contents on Facebook.",
      D0020: "Delete content.",
      D0021:
        "Visit a web page and highlight contents with color of your choice.",
      D0022: "This page does not allow contents transformation.",
      D0023:
        "In case scraping failed, try visiting the web directly and unlock.",
      D0024:
        "※ How-to: 'Open in new tab' > Click WEBGALPI's icon on upper-right hand on your browser >",
      D0025: "Proceed backup using Google Drive",
      D0026: "Enter a short description.",
      D0027: "(E) yyyy-MM-dd a/p hh.mm.ss", // 영어에서는 따로 단위 표시를 안해서 번역 생략합니다
      D0028: "Restore",
      D0029: "Backup information",
      D0030: "Category information",
      D0031: "Category information including web site", // 이게 맞나요?
      D0032: `※ Progress shows completion status of crawling process; base data will be restored. <br />
                  ※ This prevents data from private service from exposed.<br />
                  ※ FAIL occurs under conditions below but you may try crawling again within Contents View:
                  `, // 기본정보가 뭔지 잘 모르겠어서 base data 라고 했는데 더나은 표현이 있으면 수정해주세요!
      D0033: "Web site information",
      D0034: "Connection timed out after 5 seconds.",
      D0035: "Service is no longer available.",
      D0036: "Private Services. (Service is blocked from external access)",
      D0037:
        "You can check FAIL status by clicking 'ALL CATEGORY' then clicking",
      D0038: "", //문장이 D0037과 이어지는것같아서 한문장으로 넘겼습니다
      D0039: "Highlights information",
      D0040: "Backup/Restore",
      D0041: "Backup",
      D0042: "Store backup file on Google Drive.",
      D0043: "All data will be encrypted.",
      D0044:
        "Please do not change names and contents of the files or folders arbitrarily.",
      D0045: "Once restored, current data will be lost.",
      D0046:
        "Make sure you are signed in with account you used for backup, or the restore process will fail.",
      D0047: "delete",
      D0048: "※ Failed scraping contents will not be saved.",
      D0049: "You can choose up to 6 colors.",
      D0050: "Set THEME",
      D0051: "Sign out",
      D0052: "You are signing out. Do you want to proceed?",
      D0053: "Search term",
      D0054: "Group",
      D0055: "Delete TAB GROUP.",
      D0056: "Group and manage all open tabs.",
      D0057: `Delete selected TAB GROUP. Do you want to prceed? <br>(All TAB information will be deleted.)`,
      D0058: "All tabs and windows except current tab will be closed.<br>",
      D0059: `<b> Contents can only belong to subcategories. Try adding a subcategory.<br /><br />※ This message will automatically close in 10 seconds.</b>`,
      D0060: "Type in category name and press enter",
      D0061: "Sign in",
      D0062: "Do you have Google account registered?",
      D0063:
        "You must sign in with Google account in order to use WEBGALPI.<br/> WEBGALPI data backup will use your Google Drive storage.",
      D0064: `, thanks for using WEBGALPI!<br/>
                    Enter a password for WEBGALPI.<br/>
                    Password will be used for <span style="color: red;"> switching account, data backup and restore </span>.<br/><br/>`,
      D0065: "Your Google account has been verified.",
      D0066: "Group and manage all open TAB.",
      D0067: "Switch between LIGHT/DARK themes.",
      D0068: "Backup/restore current state using Google Drive.",
      D0069: "Use highlighter with color of your choice.",
      D0070: "UPDATE history",
      D0071: "New/improved functionalities",
      D0072: "Debug",
      D0073: "You recently created backup.<br/> Would you like to restore?",
      D0074:
        "Can't highlight a page?<br>NAVER / Daum Blog's pages has different structures.<br> Try highlighting on mobile view of the page.",
      D0075: "Save web page.",
      D0076: "Change category",
      D0077: "Current web site could not be unlocked.",
      D0078: "Go to dashboard.",
      D0079: "Web site is blocked",
      D0080: "You cannot use WEBGALPI on this page.",
      D0081: "WEBGALPI for Facebook/Twitter is under development.",
      D0082: "Completed.",
      D0083: " patch is now available!\n Click to see what's new.",
      D0084: ""
    },
    SNACK: {
      S0001: "You cannot move subcategories while editing.",
      S0002: "Please enter the category name.",
      S0003: "Favorite was removed.",
      S0004: "The post was set favorite.",
      S0005: "ITEM is missing.",
      S0006: "You reached the last ITEM.",
      S0007: "LOCK removed.",
      S0008: "URL copied.",
      S0009: "Successfully imported.",
      S0010: "COLOR was saved.",
      S0011: "You can set up to 6 colors.",
      S0012: "You must select at least 1 color.",
      S0013: "Backup has been deleted successfully.",
      S0014: "Saved to category.",
      S0015: "Category could not be saved. Please try again.",
      S0016: "Incorrect password. Please try again.",
      S0017: "The account already exists.",
      S0018: " is set as your new theme.",
      S0019: "'IMPORT BOOKMARK' function is currently not available."
    }
  },
  jp: {
    BUTTON: {
      B0001: "EDIT", //카테고리 편집 버튼명
      B0002: "ログアウト",
      B0003: "完了", //카테고리 편집창에서의 닫기 버튼
      B0004: "もっと見る", //컨텐츠 리스트 더보기
      B0005: "全部削除",
      B0006: "連勝",
      B0007: "Newタブで開く",
      B0008: "スクラッピング試る",
      B0009: "バックアップ",
      B0010: "取消",
      B0011: "削除",
      B0012: "閉じる",
      B0013: "保存",
      B0014: "ログイン",
      B0015: "確認",
      B0016: "ユザー登録",
      B0017: "ログイン",
      B0018: "Googleログイン",
      B0019: "他のアカウントに変更する",
      B0020: "ファイルリカバリー",
      B0021: "変換",
      B0022: "ダッシュボードに遷移"
    },
    ALERT: {
      A0001: "下位カテゴリーが含まれているため、削除ができません。",
      A0002: "上位カテゴリーを指定しなければいけません。",
      A0003: `全てのバックアップファイルを削除することができません。<br>１つ以上のバックアップファイルを残してください。`,
      A0004: "バックアップを完了しました。",
      A0005: "ファイルリカバリーを完了しました。",
      A0006: "バックアップ対象のログインアカウントが異なります。",
      A0007: "ファイルリカバリー対象が存在しません。",
      A0008: "バックアップ途中でエラーが発生しました。",
      A0009: "１つ以上のカラーを選択しなければいけません。",
      A0010: "Googleログイン途中でエラーが発生しました。",
      A0011: "アカウント情報が存在しません。",
      A0012:
        "Googleがログアウトされています。<br>新たなWindowが開くとログイン後、もう一回試みてください。",
      A0013: "　アカウントと異なるアカウントでログインしました。",
      A0014: "コンテンツを保存しました。",
      A0015:
        "カテゴリー情報がアップデートできません。\nダッシュボードで行ってください。",
      A0016: "カテゴリー情報をアップデートしました。",
      A0017: "LOCKを解除しました。",
      A0018:
        "WEBGALPIのロディングができません。\nパップアップを閉じ、リフレッシュをしてください。",
      A0020: "すでに保存されているコンテンツです。",
      A0021: "メモを保存しました。",
      A0022: "現在、ブラウザではWeb SQL Databaseをサーポトします。",
      A0023: "現在、ブラウザではWeb SQL Databaseをサーポトしません。",
      A0024: "",
      A0025:
        "WEBGALPIがインストール及びアップデートされました。\nこのページをリロードします。"
    },
    CONFIRM: {
      C0001: "カテゴリーを削除しますか？",
      C0002: "全てのハイライトを削除しますか？",
      C0003: "ハイライトを削除しますか？",
      C0004:
        "<b>コンテンツを削除しますか？</b><br><br><u>ハイライトも一緒に削除されます。</u><br />(復旧不可)",
      C0005: "件のバックアップファイルを削除しますか？",
      C0006: " を削除しますか？",
      C0007: " 注意：最後のバックアップファイルです。",
      C0008: `で（に）リカバリーしますか？<br><br>
                        リカバリー際にScrapingが行われ、多少の時間が掛かります。<br><br>
                        <span style="color:red">
                        全てのデータを削除した後、リカバリーを行うため、<br>
                        ラーニング途中で全体中止してはいけません。<br>
                         </span>`,
      C0009: `<b>アカウント登録完了しました。</b><br><br>
                                  WEBGALPIをすぐ反映するためには、<br>
                                  開いている全てのタブをリフレッシュします。<br>
                                  いいですか？<br><br>
                                  <span style="color: red;">※ いっぺんにリフレッシュします。</span>
                                    `,
      C0010: "UNLOCKをしますか？",
      C0011: "実行しますか？",
      C0012: ""
    },
    DESCRIPTION: {
      D0001: "カテゴリー検索", //카테고리 검색 영역의 placeholder
      D0002: `<b>新たなカテゴリーを生成し、<br/>コンテンツを分けてみてください。</b>`,
      D0003:
        "카테고리를 상하로 Drag&Drop으로 자유롭게 순서를 정렬할 수 있습니다.",
      D0004:
        "하위 카테고리에서 상위 카테고리로 Drag&Drop 하여 Tree 구조를 자유롭게 구성할 수 있습니다.",
      D0005: "상위 카테고리",
      D0006: "상위 카테고리명을 추가 및 수정합니다.",
      D0007: "상위 카테고리가 없습니다.",
      D0008: "하위 카테고리",
      D0009: "하위 카테고리명을 추가 및 수정합니다.",
      D0010:
        "상위 카테고리를 선택하지 않았거나, 하위 카테고리가 존재하지 않습니다.",
      D0011: "선택된 카테고리에서 컨텐츠의 제목/본문을 검색합니다.",
      D0012: "검색어 입력 후 엔터", //placeholder
      D0013: "등록순서로 정렬합니다.",
      D0014: "★ 표시 컨테츠를 필터링 합니다.",
      D0015: "스크래핑에 실패한 컨텐츠를 필터링 합니다.",
      D0016: "하이라이트를 표시합니다.",
      D0017: "잠겨있는 컨텐츠입니다.<br />스크래핑을 다시 시도해보세요.",
      D0018: "컨텐츠를 새탭으로 오픈합니다.",
      D0019: "Facebook으로 컨텐츠를 공유합니다.",
      D0020: "컨텐츠를 삭제합니다.",
      D0021: "사이트에 방문하여 원하는 컬러로 하이라이팅을 해보세요.",
      D0022: "컨텐츠 변환을 할 수 없는 사이트입니다.",
      D0023:
        "스크래핑에 실패 했을 경우, 해당 사이트에 직접 방문하여 Lock을 해제 할 수 있습니다.",
      D0024: "※ 방법 : '새탭으로 열기' > 브라우져 상단 WEBGALPI 아이콘 클릭 > ",
      D0025: "구글 드라이브로 백업을 진행하시겠습니까?",
      D0026: "간단한 Description을 입력하세요.",
      D0027: "(E) yyyy년 MM월 dd일 a/p hh시 mm분 ss초)",
      D0028: "복구",
      D0029: "백업 정보",
      D0030: "카테고리 정보",
      D0031: "카테고리 사이트 포함 정보",
      D0032: `※ Progress는 크롤링에 대한 완료여부이며, 기본 데이타는 모두
                  복구 됩니다.<br />
                  ※ private service의 데이타를 외부로의 유출을 방지하기
                  위함입니다.<br />
                  ※ FAIL이 발생 하는 경우는 아래와 같으며, Contents View
                  영역에서 크롤링을 다시 시도할 수 있습니다.`,
      D0033: "사이트 정보",
      D0034: "Connection Timeout이 5초가 넘었을 경우.",
      D0035: "더 이상 Service를 하지 않는 경우.",
      D0036: "사내망(Private Service)의 경우. (외부에서 차단된 사이트)",
      D0037: "FAIL 확인은 'ALL CATEGORY' 클릭 후,",
      D0038: "을 클릭하면 확인 할 수 있습니다.",
      D0039: "하이라이팅 정보",
      D0040: "백업/복구",
      D0041: "백업",
      D0042: "구글 드라이브에 파일형태로 백업됩니다.",
      D0043: "모든 데이타는 암호화 처리됩니다.",
      D0044: "임의로 파일명/폴더명/파일내용을 변경하지 마십시오.",
      D0045: "복구 시, 기존 데이타는 모두 삭제 됩니다.",
      D0046: "현재 계정과 일치하지 않을 경우, 복구되지 않으니 주의바랍니다.",
      D0047: "삭제",
      D0048: "※ 스크래핑 실패한 건에 대해서는 저장하지 않습니다.",
      D0049: "최대 6개의 컬러를 지정할 수 있습니다.",
      D0050: "THEME 설정",
      D0051: "로그아웃",
      D0052: "로그아웃 하시겠습니까?",
      D0053: "검색키워드",
      D0054: "모아보기",
      D0055: "TAB GROUP을 삭제합니다.",
      D0056: "열려있는 모든 탭을 모아서 관리합니다.",
      D0057: `선택 한 TAB GROUP을 삭제하시겠습니까?<br>(모든 TAB 정보가 삭제됩니다.)`,
      D0058: "현재 탭을 제외한 모든 윈도우와 탭이 닫힙니다.<br>",
      D0059: `<b>상위 카테고리에는 컨텐츠를 담을 수 없습니다. 하위 카테고리를 만들어시도 해보세요.<br /><br />※ 10초 후, 자동으로 사라집니다.</b>`,
      D0060: "카테고리명 입력 후 엔터",
      D0061: "로그인",
      D0062: "Google 계정 등록을 하셨나요?",
      D0063:
        "WEBGALPI를 사용하기 위해, Google 계정으로 로그인을 하셔야 합니다.<br/>데이타 백업으로 GOOGLE DRIVE를 사용합니다.",
      D0064: `님 WEBGALPI에 오신것을 환영합니다.<br/>
                    WEBGALPI에서 사용할 PASSWORD를 입력해주세요.<br/>
                    <span style="color: red;">계정변경 및 백업/복구</span>에 사용합니다.<br/><br/>`,
      D0065: "Google 계정 인증이 정상완료 되었습니다.",
      D0066: "현재 열려있는 모든 TAB을 모아서 관리해보세요.",
      D0067: "대쉬보드의 테마설정을 LIGHT/DARK로 변경합니다.",
      D0068: "현재 상태를 구글 드라이브를 이용하여 백업/복구를 진행합니다.",
      D0069: "원하는 색상의 하이라이트 컬러를 지정하여 사용해보세요.",
      D0070: "UPDATE 이력",
      D0071: "개선 및 기능추가",
      D0072: "디버깅",
      D0073: "최근 백업한 데이타가 있습니다.<br/>복구를 진행하시겠습니까?",
      D0074:
        "하이라이팅이 안되시나요?<br>NAVER / Daum Blog의 구조는 조금 특별합니다.<br>페이지를 모바일 버전으로 변환하여 사용해보세요.",
      D0075: "사이트를 저장합니다.",
      D0076: "카테고리를 변경합니다",
      D0077: "현재 사이트에 LOCK을 해제할 수 있습니다.",
      D0078: "대쉬보드로 이동합니다.",
      D0079: "차단된 사이트",
      D0080: "이 사이트에서는 WEBGALPI를 사용할 수 없습니다.",
      D0081: "페이스북/트위터는 패치중입니다.",
      D0082: "처리되었습니다.",
      D0083: "로 업데이트 되었습니다.\n클릭하여 업데이트 내역을 확인해보세요.",
      D0084: ""
    },
    SNACK: {
      S0001: "편집 중에는, 하위 카테고리를 이동 할 수 없습니다.",
      S0002: "카테고리명을 입력하세요.",
      S0003: "STAR를 해제하였습니다.",
      S0004: "STAR로 지정하였습니다.",
      S0005: "ITEM(s)이 없습니다.",
      S0006: "마지막 ITEM 입니다.",
      S0007: "LOCK이 해제되었습니다.",
      S0008: "URL이 복사되었습니다.",
      S0009: "IMPORT 되었습니다.",
      S0010: "COLOR가 저장되었습니다.",
      S0011: "Color지정은 6개까지입니다.",
      S0012: "Color를 1개 이상 지정해야합니다.",
      S0013: "백업파일을 삭제하였습니다.",
      S0014: "카테고리에 저장되었습니다.",
      S0015: "카테고리 저장에 실패하였습니다. 다시 시도바랍니다.",
      S0016: "정확한 패스워드가 아닙니다. 다시 시도해주세요.",
      S0017: "이미 존재하는 계정입니다.",
      S0018: "로 테마가 변경되었습니다.",
      S0019: "'IMPORT BOOKMARK' 기능은 준비중입니다."
    }
  }
};
let LANG = {
  lang: "en",
  BUTTON_MESSAGE: code => {
    return MESSAGE[LANG.lang].BUTTON[code];
  },
  ALERT_MESSAGE: code => {
    return MESSAGE[LANG.lang].ALERT[code];
  },
  CONFIRM_MESSAGE: code => {
    return MESSAGE[LANG.lang].CONFIRM[code];
  },
  DESCRIPTION_MESSAGE: code => {
    return MESSAGE[LANG.lang].DESCRIPTION[code];
  },
  SNACK_MESSAGE: code => {
    return MESSAGE[LANG.lang].SNACK[code];
  }
};
export default LANG;
