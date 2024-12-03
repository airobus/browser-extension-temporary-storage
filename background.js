// 创建右键菜单
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "saveToNotes",
    title: "保存到临时记事本",
    contexts: ["selection"]
  });
});

// 处理右键菜单点击事件
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "saveToNotes") {
    chrome.storage.local.get(['notes'], function(result) {
      const currentNotes = result.notes || '';
      
      // 处理选中的文本，保持格式
      let selectedText = info.selectionText
        .replace(/\r\n/g, '\n')  // 统一换行符
        .replace(/\r/g, '\n')    // 统一换行符
        .trim();  // 移除首尾多余的空格
      
      // 只添加URL作为来源
      selectedText += '\n\n' + tab.url;
      
      // 组合新的笔记内容
      let newNote = currentNotes;
      if (currentNotes) {
        newNote += '\n\n---\n\n';  // 使用 Markdown 分隔线
      }
      newNote += selectedText;
      
      // 保存更新后的笔记
      chrome.storage.local.set({
        notes: newNote
      });
    });
  }
}); 