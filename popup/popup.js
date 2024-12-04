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

    // 切换设置面板和帮助说明
    toggleSettings.addEventListener('click', function() {
        const helpPanel = document.getElementById('settingsHelp');
        const settingsPanel = document.getElementById('settingsPanel');
        
        if (helpPanel.style.display === 'none') {
            helpPanel.style.display = 'block';
            settingsPanel.style.display = 'block';
        } else {
            helpPanel.style.display = 'none';
            settingsPanel.style.display = 'none';
        }
    });

    // 保存Notion设置
    saveSettings.addEventListener('click', function() {
        chrome.storage.local.set({
            notionToken: notionToken.value,
            notionPageId: notionPageId.value
        }, function() {
            // 添加保存成功的视觉反馈
            saveSettings.textContent = '✓ 已保存';
            saveSettings.classList.add('saved');
            
            // 2秒后恢复原样
            setTimeout(() => {
                saveSettings.textContent = '保存设置';
                saveSettings.classList.remove('saved');
                settingsPanel.style.display = 'none';
            }, 2000);
        });
    });

    // 发送到Notion
    sendToNotion.addEventListener('click', async function() {
        const content = notepad.value;
        if (!content) {
            sendToNotion.textContent = '请先输入内容';
            setTimeout(() => {
                sendToNotion.textContent = '发送到Notion';
            }, 2000);
            return;
        }

        chrome.storage.local.get(['notionToken', 'notionPageId'], async function(result) {
            if (!result.notionToken || !result.notionPageId) {
                document.getElementById('settingsHelp').style.display = 'block';
                document.getElementById('settingsPanel').style.display = 'block';
                return;
            }

            sendToNotion.textContent = '发送中...';
            sendToNotion.disabled = true;

            const cleanPageId = result.notionPageId.replace(/-/g, '');

            try {
                const response = await fetch('https://api.notion.com/v1/blocks/' + cleanPageId + '/children', {
                    method: 'PATCH',
                    headers: {
                        'Authorization': 'Bearer ' + result.notionToken,
                        'Notion-Version': '2022-06-28',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        children: [
                            {
                                object: 'block',
                                type: 'heading_1',
                                heading_1: {
                                    rich_text: [{
                                        type: 'text',
                                        text: {
                                            content: new Date().toLocaleString()
                                        },
                                        annotations: {
                                            color: 'default',
                                            bold: true
                                        }
                                    }]
                                }
                            },
                            ...content.split('\n').map(line => {
                                if (line.startsWith('http')) {
                                    return [
                                        {
                                            object: 'block',
                                            type: 'heading_2',
                                            heading_2: {
                                                rich_text: [{
                                                    type: 'text',
                                                    text: {
                                                        content: '来源：'
                                                    }
                                                }]
                                            }
                                        },
                                        {
                                            object: 'block',
                                            type: 'paragraph',
                                            paragraph: {
                                                rich_text: [{
                                                    type: 'text',
                                                    text: {
                                                        content: line
                                                    }
                                                }]
                                            }
                                        }
                                    ];
                                }
                                return {
                                    object: 'block',
                                    type: 'paragraph',
                                    paragraph: {
                                        rich_text: [{
                                            type: 'text',
                                            text: {
                                                content: line
                                            }
                                        }]
                                    }
                                };
                            }).flat(),
                            {
                                object: 'block',
                                type: 'divider',
                                divider: {}
                            }
                        ]
                    })
                });

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.message || '发送失败');
                }

                sendToNotion.textContent = '✓ 已发送';
                setTimeout(() => {
                    sendToNotion.textContent = '发送到Notion';
                    sendToNotion.disabled = false;
                }, 2000);

            } catch (error) {
                console.error('Error details:', error);
                sendToNotion.textContent = '× 发送失败';
                setTimeout(() => {
                    sendToNotion.textContent = '发送到Notion';
                    sendToNotion.disabled = false;
                }, 2000);
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