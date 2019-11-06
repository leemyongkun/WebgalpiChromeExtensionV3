import store from './store';
global.browser = require('webextension-polyfill');
import dbcon from  './database/dbcon.js';

//popup일경우에는 실행하지 않는다.
let isPopup = false;
let BackgrounEvent = {
    onInstalled: () => {
        chrome.runtime.onInstalled.addListener(details => {
            if (!!window.openDatabase) {
                console.log("현재 브라우저는 Web SQL Database를 지원합니다");
                dbcon.dropTable();
                dbcon.createTable();
            } else {
                alert("현재 브라우저는 Web SQL Database를 지원하지 않습니다")
            }

        })
    },
    onUpdated: ()=>{
        chrome.tabs.onUpdated.addListener(function (tabId, info, tab) {

            if (info.status == 'loading' && tab.status == 'loading' && tab.url != undefined) {
                if(info.status =='complete'){
                    //팝업인지 확인.
                    chrome.windows.getCurrent(function (win) {
                        if (win.type == 'popup') {
                            isPopup = true;
                        } else {
                            isPopup = false;
                        }
                    });

                }//END if

            }

        });
    }
 }

//설치 및 리로딩시
BackgrounEvent.onInstalled();

//Tab이 열릴때
BackgrounEvent.onUpdated();
