// 百度贴吧交互式原型 - JavaScript功能实现

// 全局状态管理
const appState = {
    currentUser: null,
    currentPage: 'home',
    tiebas: [
        { id: 1, name: '游戏', description: '游戏爱好者的聚集地', members: 12345, posts: 56789, avatar: '游' },
        { id: 2, name: '动漫', description: '动漫讨论与分享', members: 9876, posts: 43210, avatar: '动' },
        { id: 3, name: '音乐', description: '音乐分享与交流', members: 6543, posts: 21098, avatar: '音' },
        { id: 4, name: '电影', description: '电影评论与推荐', members: 5432, posts: 10987, avatar: '电' },
        { id: 5, name: '科技', description: '科技前沿与讨论', members: 4321, posts: 8765, avatar: '科' },
        { id: 6, name: '体育', description: '体育赛事与讨论', members: 3210, posts: 7654, avatar: '体' }
    ],
    posts: [
        { id: 1, title: '最新游戏发布讨论', content: '大家对新发布的游戏有什么看法？', author: '游戏玩家', tiebaId: 1, time: '2小时前', views: 123, replies: 45, likes: 89 },
        { id: 2, title: '热门动漫推荐', content: '最近有什么好看的动漫推荐吗？', author: '动漫迷', tiebaId: 2, time: '3小时前', views: 456, replies: 78, likes: 156 },
        { id: 3, title: '音乐分享会', content: '分享你最近在听的音乐吧！', author: '音乐爱好者', tiebaId: 3, time: '4小时前', views: 789, replies: 23, likes: 67 },
        { id: 4, title: '电影推荐', content: '有什么值得一看的电影推荐？', author: '电影达人', tiebaId: 4, time: '5小时前', views: 234, replies: 12, likes: 34 },
        { id: 5, title: '科技前沿讨论', content: '最新科技发展动态', author: '科技爱好者', tiebaId: 5, time: '6小时前', views: 567, replies: 34, likes: 78 },
        { id: 6, title: '体育赛事预告', content: '本周重要体育赛事预告', author: '体育迷', tiebaId: 6, time: '7小时前', views: 890, replies: 56, likes: 123 }
    ],
    currentTieba: null,
    joinedTiebas: new Set(),
    searchHistory: []
};

// 页面切换功能
function showPage(pageId) {
    // 隐藏所有页面
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // 显示目标页面
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        appState.currentPage = pageId;
        
        // 更新导航栏激活状态
        updateNavActiveState(pageId);
        
        // 根据页面加载相应内容
        loadPageContent(pageId);
    }
}

// 更新导航栏激活状态
function updateNavActiveState(pageId) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    const activeLink = document.querySelector(`.nav-link[onclick*="'${pageId}'"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

// 加载页面内容
function loadPageContent(pageId) {
    switch (pageId) {
        case 'home':
            loadHomePage();
            break;
        case 'tieba-list':
            loadTiebaListPage();
            break;
        case 'tieba-detail':
            loadTiebaDetailPage();
            break;
        case 'search':
            loadSearchPage();
            break;
        case 'profile':
            loadProfilePage();
            break;
    }
}

// 加载首页内容
function loadHomePage() {
    // 加载热门贴吧
    const hotTiebasContainer = document.getElementById('hot-tiebas');
    if (hotTiebasContainer) {
        hotTiebasContainer.innerHTML = appState.tiebas.slice(0, 6).map(tieba => `
            <div class="tieba-item" onclick="showTiebaDetail(${tieba.id})">
                <div class="tieba-avatar">${tieba.avatar}</div>
                <div class="tieba-name">${tieba.name}</div>
                <div class="tieba-members">${formatNumber(tieba.members)}成员</div>
            </div>
        `).join('');
    }
    
    // 加载热门帖子
    const hotPostsContainer = document.getElementById('hot-posts');
    if (hotPostsContainer) {
        hotPostsContainer.innerHTML = appState.posts.slice(0, 5).map(post => `
            <div class="post-item" onclick="showPostDetail(${post.id})">
                <div class="post-header">
                    <div class="post-avatar">${post.author.charAt(0)}</div>
                    <div class="post-meta">
                        <div class="post-author">${post.author}</div>
                        <div class="post-time">${post.time}</div>
                    </div>
                </div>
                <div class="post-title">${post.title}</div>
                <div class="post-content">${post.content}</div>
                <div class="post-stats">
                    <span class="post-stat">👁️ ${formatNumber(post.views)}</span>
                    <span class="post-stat">💬 ${formatNumber(post.replies)}</span>
                    <span class="post-stat">👍 ${formatNumber(post.likes)}</span>
                </div>
            </div>
        `).join('');
    }
}

// 加载贴吧列表页
function loadTiebaListPage() {
    const allTiebasContainer = document.getElementById('all-tiebas');
    if (allTiebasContainer) {
        allTiebasContainer.innerHTML = appState.tiebas.map(tieba => `
            <div class="tieba-item" onclick="showTiebaDetail(${tieba.id})">
                <div class="tieba-avatar">${tieba.avatar}</div>
                <div class="tieba-name">${tieba.name}</div>
                <div class="tieba-members">${formatNumber(tieba.members)}成员</div>
                <div class="tieba-description">${tieba.description}</div>
            </div>
        `).join('');
    }
}

// 显示贴吧详情
function showTiebaDetail(tiebaId) {
    const tieba = appState.tiebas.find(t => t.id === tiebaId);
    if (tieba) {
        appState.currentTieba = tieba;
        
        // 更新页面显示
        document.getElementById('tieba-avatar').textContent = tieba.avatar;
        document.getElementById('tieba-name').textContent = tieba.name;
        document.getElementById('tieba-description').textContent = tieba.description;
        document.getElementById('member-count').textContent = formatNumber(tieba.members);
        document.getElementById('post-count').textContent = formatNumber(tieba.posts);
        
        // 更新加入按钮状态
        const joinBtn = document.getElementById('join-btn');
        if (joinBtn) {
            joinBtn.textContent = appState.joinedTiebas.has(tiebaId) ? '退出贴吧' : '加入贴吧';
        }
        
        // 加载贴吧帖子
        loadTiebaPosts(tiebaId);
        
        // 切换到贴吧详情页
        showPage('tieba-detail');
    }
}

// 加载贴吧帖子
function loadTiebaPosts(tiebaId) {
    const tiebaPostsContainer = document.getElementById('tieba-posts');
    if (tiebaPostsContainer) {
        const tiebaPosts = appState.posts.filter(post => post.tiebaId === tiebaId);
        tiebaPostsContainer.innerHTML = tiebaPosts.map(post => `
            <div class="post-item" onclick="showPostDetail(${post.id})">
                <div class="post-header">
                    <div class="post-avatar">${post.author.charAt(0)}</div>
                    <div class="post-meta">
                        <div class="post-author">${post.author}</div>
                        <div class="post-time">${post.time}</div>
                    </div>
                </div>
                <div class="post-title">${post.title}</div>
                <div class="post-content">${post.content}</div>
                <div class="post-stats">
                    <span class="post-stat">👁️ ${formatNumber(post.views)}</span>
                    <span class="post-stat">💬 ${formatNumber(post.replies)}</span>
                    <span class="post-stat">👍 ${formatNumber(post.likes)}</span>
                </div>
            </div>
        `).join('');
    }
}

// 加入/退出贴吧
function toggleJoin() {
    if (!appState.currentTieba) return;
    
    const tiebaId = appState.currentTieba.id;
    if (appState.joinedTiebas.has(tiebaId)) {
        appState.joinedTiebas.delete(tiebaId);
        appState.currentTieba.members = Math.max(0, appState.currentTieba.members - 1);
        showToast('已退出贴吧', 'success');
    } else {
        appState.joinedTiebas.add(tiebaId);
        appState.currentTieba.members += 1;
        showToast('已加入贴吧', 'success');
    }
    
    // 更新显示
    document.getElementById('member-count').textContent = formatNumber(appState.currentTieba.members);
    document.getElementById('join-btn').textContent = appState.joinedTiebas.has(tiebaId) ? '退出贴吧' : '加入贴吧';
}

// 加载搜索页
function loadSearchPage() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.focus();
    }
    
    // 显示搜索历史
    showSearchHistory();
}

// 执行搜索
function performSearch() {
    const searchInput = document.getElementById('main-search') || document.getElementById('search-input');
    const query = searchInput ? searchInput.value.trim() : '';
    
    if (!query) {
        showToast('请输入搜索关键词', 'warning');
        return;
    }
    
    // 添加到搜索历史
    if (!appState.searchHistory.includes(query)) {
        appState.searchHistory.unshift(query);
        if (appState.searchHistory.length > 10) {
            appState.searchHistory.pop();
        }
    }
    
    // 执行搜索逻辑
    const results = searchContent(query);
    displaySearchResults(results, query);
    
    // 切换到搜索页
    showPage('search');
}

// 搜索内容
function searchContent(query) {
    const lowerQuery = query.toLowerCase();
    
    const tiebaResults = appState.tiebas.filter(tieba => 
        tieba.name.toLowerCase().includes(lowerQuery) || 
        tieba.description.toLowerCase().includes(lowerQuery)
    );
    
    const postResults = appState.posts.filter(post => 
        post.title.toLowerCase().includes(lowerQuery) || 
        post.content.toLowerCase().includes(lowerQuery) ||
        post.author.toLowerCase().includes(lowerQuery)
    );
    
    return {
        tiebas: tiebaResults,
        posts: postResults,
        query: query
    };
}

// 显示搜索结果
function displaySearchResults(results, query) {
    const resultsContainer = document.getElementById('search-results');
    if (!resultsContainer) return;
    
    let html = `<h3>搜索 "${query}" 的结果</h3>`;
    
    if (results.tiebas.length > 0) {
        html += `<h4>相关贴吧 (${results.tiebas.length})</h4>`;
        html += '<div class="tieba-grid">';
        html += results.tiebas.map(tieba => `
            <div class="tieba-item" onclick="showTiebaDetail(${tieba.id})">
                <div class="tieba-avatar">${tieba.avatar}</div>
                <div class="tieba-name">${tieba.name}</div>
                <div class="tieba-members">${formatNumber(tieba.members)}成员</div>
            </div>
        `).join('');
        html += '</div>';
    }
    
    if (results.posts.length > 0) {
        html += `<h4>相关帖子 (${results.posts.length})</h4>`;
        html += '<div class="post-list">';
        html += results.posts.map(post => `
            <div class="post-item" onclick="showPostDetail(${post.id})">
                <div class="post-header">
                    <div class="post-avatar">${post.author.charAt(0)}</div>
                    <div class="post-meta">
                        <div class="post-author">${post.author}</div>
                        <div class="post-time">${post.time}</div>
                    </div>
                </div>
                <div class="post-title">${post.title}</div>
                <div class="post-content">${post.content}</div>
                <div class="post-stats">
                    <span class="post-stat">👁️ ${formatNumber(post.views)}</span>
                    <span class="post-stat">💬 ${formatNumber(post.replies)}</span>
                    <span class="post-stat">👍 ${formatNumber(post.likes)}</span>
                </div>
            </div>
        `).join('');
        html += '</div>';
    }
    
    if (results.tiebas.length === 0 && results.posts.length === 0) {
        html += '<p>没有找到相关结果，请尝试其他关键词。</p>';
    }
    
    resultsContainer.innerHTML = html;
}

// 显示搜索历史
function showSearchHistory() {
    const resultsContainer = document.getElementById('search-results');
    if (!resultsContainer || appState.searchHistory.length === 0) return;
    
    let html = '<h4>搜索历史</h4><div class="search-history">';
    html += appState.searchHistory.map(query => `
        <div class="search-history-item" onclick="fillSearchInput('${query}')">
            🔍 ${query}
        </div>
    `).join('');
    html += '</div>';
    
    resultsContainer.innerHTML = html;
}

// 填充搜索输入框
function fillSearchInput(query) {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.value = query;
        searchInput.focus();
    }
}

// 加载个人中心页
function loadProfilePage() {
    const profileContainer = document.getElementById('profile-content');
    if (!profileContainer) return;
    
    if (appState.currentUser) {
        profileContainer.innerHTML = `
            <div class="profile-info">
                <div class="profile-avatar">${appState.currentUser.username.charAt(0)}</div>
                <h3>${appState.currentUser.username}</h3>
                <p>邮箱: ${appState.currentUser.email}</p>
            </div>
            <div class="profile-stats">
                <div class="stat-item">加入贴吧: ${appState.joinedTiebas.size}</div>
                <div class="stat-item">发帖数量: 0</div>
                <div class="stat-item">收到点赞: 0</div>
            </div>
        `;
    } else {
        profileContainer.innerHTML = `
            <p>请先登录查看个人中心</p>
            <button class="btn btn-primary" onclick="showModal('login-modal')">立即登录</button>
        `;
    }
}

// 显示帖子详情（模拟）
function showPostDetail(postId) {
    const post = appState.posts.find(p => p.id === postId);
    if (post) {
        showToast(`查看帖子: ${post.title}`, 'success');
        // 在实际应用中，这里会跳转到帖子详情页
        // 现在模拟增加浏览量
        post.views += 1;
    }
}

// 模态框功能
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// 关闭所有模态框
function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
    document.body.style.overflow = '';
}

// 表单处理函数
function handleLogin(event) {
    event.preventDefault();
    // 模拟登录
    appState.currentUser = {
        username: '演示用户',
        email: 'demo@example.com'
    };
    closeModal('login-modal');
    showToast('登录成功！', 'success');
    loadProfilePage();
}

function handleRegister(event) {
    event.preventDefault();
    closeModal('register-modal');
    showToast('注册成功！请登录', 'success');
    setTimeout(() => showModal('login-modal'), 1000);
}

function handleCreateTieba(event) {
    event.preventDefault();
    const form = event.target;
    const name = form.querySelector('input[type="text"]').value;
    const description = form.querySelector('textarea').value;
    
    // 创建新贴吧
    const newTieba = {
        id: appState.tiebas.length + 1,
        name: name,
        description: description,
        members: 1,
        posts: 0,
        avatar: name.charAt(0)
    };
    
    appState.tiebas.unshift(newTieba);
    appState.joinedTiebas.add(newTieba.id);
    
    closeModal('create-tieba-modal');
    showToast('贴吧创建成功！', 'success');
    showTiebaDetail(newTieba.id);
    
    // 重置表单
    form.reset();
}

function handleCreatePost(event) {
    event.preventDefault();
    if (!appState.currentTieba) {
        showToast('请先选择贴吧', 'warning');
        return;
    }
    
    const form = event.target;
    const title = form.querySelector('input[type="text"]').value;
    const content = form.querySelector('textarea').value;
    
    // 创建新帖子
    const newPost = {
        id: appState.posts.length + 1,
        title: title,
        content: content,
        author: appState.currentUser ? appState.currentUser.username : '匿名用户',
        tiebaId: appState.currentTieba.id,
        time: '刚刚',
        views: 0,
        replies: 0,
        likes: 0
    };
    
    appState.posts.unshift(newPost);
    appState.currentTieba.posts += 1;
    
    closeModal('create-post-modal');
    showToast('帖子发布成功！', 'success');
    loadTiebaPosts(appState.currentTieba.id);
    
    // 重置表单
    form.reset();
}

// 富文本编辑器功能（模拟）
function formatText(format) {
    showToast(`格式设置: ${format}`, 'success');
    // 在实际应用中，这里会实现富文本编辑功能
}

// 消息提示功能
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    toast.textContent = message;
    toast.className = 'toast';
    toast.classList.add(type);
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// 工具函数
function formatNumber(num) {
    if (num >= 10000) {
        return (num / 10000).toFixed(1) + '万';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + '千';
    }
    return num.toString();
}

// 键盘事件监听
document.addEventListener('keydown', function(event) {
    // ESC键关闭模态框
    if (event.key === 'Escape') {
        closeAllModals();
    }
    
    // 回车键搜索
    if (event.key === 'Enter' && (event.target.id === 'main-search' || event.target.id === 'search-input')) {
        performSearch();
    }
});

// 点击模态框外部关闭
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
        closeAllModals();
    }
});

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 初始化首页内容
    loadHomePage();
    
    // 初始化搜索历史
    showSearchHistory();
    
    console.log('百度贴吧交互式原型已加载完成！');
});