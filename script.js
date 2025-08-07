// 导航栏交互
document.addEventListener('DOMContentLoaded', function() {
    // 全局变量存储滚动位置
    window.savedScrollPosition = 0;
    
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // 移动端菜单切换
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // 点击导航链接后关闭移动端菜单
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // 平滑滚动
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70; // 减去导航栏高度
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 导航栏滚动效果
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        }
    });

    // 活动导航链接高亮
    const sections = document.querySelectorAll('section');
    
    window.addEventListener('scroll', function() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });

    // 添加滚动动画
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // 观察所有卡片元素
    const cards = document.querySelectorAll('.research-card, .project-card, .contact-item, .publication-item');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    // 打字机效果（可选）
    function typeWriter(element, text, speed = 50) {
        let i = 0;
        element.innerHTML = '';
        
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        
        type();
    }

    // 为英雄区域标题添加打字机效果（可选）
    const heroTitle = document.querySelector('.hero h1');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        // typeWriter(heroTitle, originalText, 100);
    }

    // 添加页面加载动画
    window.addEventListener('load', function() {
        document.body.style.opacity = '1';
        document.body.style.transition = 'opacity 0.5s ease';
    });

    // 为外部链接添加图标
    const externalLinks = document.querySelectorAll('a[href^="http"]:not([href*="' + window.location.hostname + '"])');
    externalLinks.forEach(link => {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
    });

    // 复制邮箱地址功能
    const emailElements = document.querySelectorAll('[href^="mailto:"]');
    emailElements.forEach(element => {
        element.addEventListener('click', function(e) {
            e.preventDefault();
            const email = this.getAttribute('href').replace('mailto:', '');
            
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(email).then(() => {
                    showNotification('邮箱地址已复制到剪贴板！');
                });
            } else {
                // 回退方案
                const textArea = document.createElement('textarea');
                textArea.value = email;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                showNotification('邮箱地址已复制到剪贴板！');
            }
        });
    });

    // 显示通知
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #10b981;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 1001;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // 添加深色模式切换（可选功能）
    function toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
    }

    // 检查本地存储中的深色模式设置
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }

    // 性能优化：防抖函数
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // 优化滚动事件处理
    const handleScroll = debounce(() => {
        // 这里可以添加滚动时的处理逻辑
    }, 10);

    window.addEventListener('scroll', handleScroll);

    // 懒加载图片
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
});



// 添加CSS类用于活动导航链接
const style = document.createElement('style');
style.textContent = `
    .nav-link.active {
        color: var(--primary-color);
        font-weight: 600;
    }
    
    .hamburger.active .bar:nth-child(2) {
        opacity: 0;
    }
    
    .hamburger.active .bar:nth-child(1) {
        transform: translateY(8px) rotate(45deg);
    }
    
    .hamburger.active .bar:nth-child(3) {
        transform: translateY(-8px) rotate(-45deg);
    }
    
    body {
        opacity: 0;
    }
    
    .lazy {
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    .lazy.loaded {
        opacity: 1;
    }
`;
document.head.appendChild(style);



// GitHub API 集成
const GITHUB_USERNAME = 'lwLiang1'; // 您的GitHub用户名
const GITHUB_API_URL = `https://api.github.com/users/${GITHUB_USERNAME}`;
const GITHUB_REPOS_URL = `https://api.github.com/users/${GITHUB_USERNAME}/repos`;

// 获取GitHub用户信息和仓库数据
async function loadGitHubData() {
    try {
        // 获取用户信息
        const userResponse = await fetch(GITHUB_API_URL);
        const userData = await userResponse.json();
        
        // 获取仓库信息
        const reposResponse = await fetch(`${GITHUB_REPOS_URL}?sort=updated&per_page=6`);
        const reposData = await reposResponse.json();
        
        // 更新统计数据
        updateGitHubStats(userData, reposData);
        
        // 显示仓库
        displayRepositories(reposData);
        
    } catch (error) {
        console.error('Error loading GitHub data:', error);
        displayError();
    }
}

// 更新GitHub统计数据
function updateGitHubStats(userData, reposData) {
    document.getElementById('public-repos').textContent = userData.public_repos || 0;
    
    // 计算总stars和forks
    const totalStars = reposData.reduce((sum, repo) => sum + repo.stargazers_count, 0);
    const totalForks = reposData.reduce((sum, repo) => sum + repo.forks_count, 0);
    
    document.getElementById('total-stars').textContent = totalStars;
    document.getElementById('total-forks').textContent = totalForks;
}

// 显示仓库列表
function displayRepositories(repos) {
    const container = document.getElementById('github-repos');
    
    if (repos.length === 0) {
        container.innerHTML = '<div class="loading">暂无公开仓库</div>';
        return;
    }
    
    const reposHTML = repos.map(repo => {
        const updatedDate = new Date(repo.updated_at).toLocaleDateString('zh-CN');
        const languageColor = getLanguageColor(repo.language);
        
        return `
            <div class="repo-card">
                <div class="repo-header">
                    <h3 class="repo-title">
                        <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">
                            ${repo.name}
                        </a>
                    </h3>
                    <span class="repo-visibility">${repo.private ? 'Private' : 'Public'}</span>
                </div>
                
                <p class="repo-description">
                    ${repo.description || '暂无描述'}
                </p>
                
                <div class="repo-stats">
                    <div class="repo-stat">
                        <i class="fas fa-star"></i>
                        <span>${repo.stargazers_count}</span>
                    </div>
                    <div class="repo-stat">
                        <i class="fas fa-code-branch"></i>
                        <span>${repo.forks_count}</span>
                    </div>
                    ${repo.language ? `
                        <div class="repo-language">
                            <span class="language-dot" style="background-color: ${languageColor}"></span>
                            <span>${repo.language}</span>
                        </div>
                    ` : ''}
                </div>
                
                <div class="repo-updated">
                    更新于 ${updatedDate}
                </div>
            </div>
        `;
    }).join('');
    
    container.innerHTML = reposHTML;
}

// 获取编程语言颜色
function getLanguageColor(language) {
    const colors = {
        'JavaScript': '#f1e05a',
        'Python': '#3572A5',
        'Java': '#b07219',
        'TypeScript': '#2b7489',
        'C++': '#f34b7d',
        'C': '#555555',
        'HTML': '#e34c26',
        'CSS': '#563d7c',
        'Vue': '#2c3e50',
        'React': '#61dafb',
        'Go': '#00ADD8',
        'Rust': '#dea584',
        'Swift': '#ffac45',
        'Kotlin': '#F18E33',
        'PHP': '#4F5D95',
        'Ruby': '#701516',
        'Shell': '#89e051',
        'Dockerfile': '#384d54',
        'Jupyter Notebook': '#DA5B0B'
    };
    
    return colors[language] || '#586069';
}

// 显示错误信息
function displayError() {
    const container = document.getElementById('github-repos');
    container.innerHTML = `
        <div class="error-message">
            <i class="fas fa-exclamation-triangle"></i>
            <p>加载GitHub数据失败</p>
            <p style="font-size: 0.9rem; margin-top: 0.5rem;">请检查网络连接或稍后重试</p>
            <button class="retry-btn" onclick="loadGitHubData()">重试</button>
        </div>
    `;
}

// 页面加载时获取GitHub数据
document.addEventListener('DOMContentLoaded', function() {
    // 延迟加载GitHub数据，避免影响页面初始加载
    setTimeout(loadGitHubData, 1000);
});
