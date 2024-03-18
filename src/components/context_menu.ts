// import { ContextMenu } from "../config/config";

// chrome.runtime.onInstalled.addListener(async () => {
//   chrome.contextMenus.create({
//     type: "normal",
//     id: ContextMenu[0].id,
//     contexts: ["selection"],
//     title: ContextMenu[0].title,
//   });
// });

// // Open a new search tab when the user clicks a context menu
// chrome.contextMenus.onClicked.addListener((item, tab) => {
//   // const tld = item.menuItemId;
//   // const url = new URL(`https://google.${tld}/search`);
//   // url.searchParams.set("q", item.selectionText);
//   // chrome.tabs.create({ url: url.href, index: tab.index + 1 });
//   chrome.windows.create({
//     top: 100,
//     width: 200,
//     height: 100,
//     focused: true,
//     type: "popup",
//     url: "popup.html",
//   });
// });
