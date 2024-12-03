document.addEventListener('DOMContentLoaded', function() {
    const notepad = document.getElementById('notepad');
    const saveButton = document.getElementById('saveButton');
    const clearButton = document.getElementById('clearButton');
    const sendToNotion = document.getElementById('sendToNotion');
    const toggleSettings = document.getElementById('toggleSettings');
    const settingsPanel = document.getElementById('settingsPanel');
    const notionToken = document.getElementById('notionToken');
    const notionPageId = document.getElementById('notionPageId');
    const saveSettings = document.getElementById('saveSettings');

    // 加载Notion设置
    chrome.storage.local.get(['notionToken', 'notionPageId'], function(result) {
        if (result.notionToken) notionToken.value = result.notionToken;
        if (result.notionPageId) notionPageId.value = result.notionPageId;
    });

    // 切换设置面板
    toggleSettings.addEventListener('click', function() {
        settingsPanel.style.display = settingsPanel.style.display === 'none' ? 'block' : 'none';
    });

    // 保存Notion设置
    saveSettings.addEventListener('click', function() {
        chrome.storage.local.set({
            notionToken: notionToken.value,
            notionPageId: notionPageId.value
        }, function() {
            alert('设置已保存');
            settingsPanel.style.display = 'none';
        });
    });

    // 发送到Notion
    sendToNotion.addEventListener('click', async function() {
        const content = notepad.value;
        if (!content) {
            alert('请先输入内容');
            return;
        }

        chrome.storage.local.get(['notionToken', 'notionPageId'], async function(result) {
            if (!result.notionToken || !result.notionPageId) {
                alert('请先设置Notion Token和Page ID');
                settingsPanel.style.display = 'block';
                return;
            }

            try {
                const response = await fetch('https://api.notion.com/v1/blocks/' + result.notionPageId + '/children', {
                    method: 'PATCH',
                    headers: {
                        'Authorization': 'Bearer ' + result.notionToken,
                        'Notion-Version': '2022-06-28',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        children: [{
                            object: 'block',
                            type: 'paragraph',
                            paragraph: {
                                rich_text: [{
                                    type: 'text',
                                    text: {
                                        content: content
                                    }
                                }]
                            }
                        }]
                    })
                });

                if (response.ok) {
                    alert('已成功发送到Notion');
                } else {
                    throw new Error('发送失败');
                }
            } catch (error) {
                alert('发送失败：' + error.message);
            }
        });
    });

    // 加载已保存的笔记
    chrome.storage.local.get(['notes'], function(result) {
        if (result.notes) {
            notepad.value = result.notes;
        }
    });

    // 自动保存功能
    let saveTimeout;
    notepad.addEventListener('input', function() {
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(() => {
            saveNotes(notepad.value);
        }, 500);
    });

    // 手动保存按钮
    saveButton.addEventListener('click', function() {
        saveNotes(notepad.value);
    });

    // 清除按钮 - 直接清除，不再提示
    clearButton.addEventListener('click', function() {
        notepad.value = '';
        chrome.storage.local.remove(['notes']);
    });

    // 保存笔记的函数 - 去掉alert
    function saveNotes(content) {
        chrome.storage.local.set({
            notes: content
        }, function() {
            // 在保存时显示最新数据
            chrome.storage.local.get(null, function(items) {
                console.log('最新存储数据:', items);
            });
        });
    }
}); 