// 创建右键菜单
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "saveToNotes",
    title: "保存到临时记事本",
    contexts: ["selection"]  // 只在选中文本时显示
  });
});

// 处理右键菜单点击事件
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "saveToNotes") {
    // 获取当前笔记内容
    chrome.storage.local.get(['notes'], function(result) {
      const currentNotes = result.notes || '';
      const selectedText = info.selectionText;
      const newNote = currentNotes + '\n' + selectedText;
      
      // 保存更新后的笔记
      chrome.storage.local.set({
        notes: newNote
      });
    });
  }
}); 