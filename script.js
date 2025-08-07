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

// PDF预览功能
function openPDFViewer(pdfFileName, event) {
    // 阻止默认行为和事件冒泡
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    // 保存当前滚动位置
    window.savedScrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    
    const modal = document.getElementById('pdfModal');
    const viewer = document.getElementById('pdfViewer');
    const title = document.getElementById('pdfTitle');
    
    // 设置PDF路径 - 直接使用传入的完整路径
    const pdfPath = pdfFileName;
    
    // 设置标题
    const paperTitles = {
        'assets/papers/paper1.pdf': 'Observer-based adaptive super-twisting fast terminal sliding mode control',
        'assets/papers/paper2.pdf': 'Bearing fault diagnosis using joint features extraction'
    };
    
    title.textContent = paperTitles[pdfFileName] || 'PDF预览';
    
    // 清除之前的内容
    const existingLoading = document.getElementById('pdfLoading');
    if (existingLoading) {
        existingLoading.remove();
    }
    
    // 显示加载状态
    viewer.style.display = 'none';
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'pdfLoading';
    loadingDiv.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: #666;">
            <i class="fas fa-spinner fa-spin" style="font-size: 3rem; margin-bottom: 1rem;"></i>
            <p>正在加载PDF文件...</p>
        </div>
    `;
    document.querySelector('.pdf-modal-body').appendChild(loadingDiv);
    
    // 设置iframe源
    viewer.src = pdfPath;
    
    // 监听加载完成
    viewer.onload = function() {
        const loading = document.getElementById('pdfLoading');
        if (loading) {
            loading.remove();
        }
        viewer.style.display = 'block';
    };
    
    // 监听加载错误
    viewer.onerror = function() {
        const loading = document.getElementById('pdfLoading');
        if (loading) {
            loading.innerHTML = `
                <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: #e74c3c;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                    <p>PDF文件加载失败</p>
                    <p style="font-size: 0.9rem; margin-top: 0.5rem;">请检查文件是否存在或稍后重试</p>
                    <div style="margin-top: 1rem;">
                        <a href="${pdfPath}" target="_blank" style="color: #2563eb; text-decoration: none;">
                            <i class="fas fa-external-link-alt"></i> 在新窗口中打开PDF
                        </a>
                    </div>
                </div>
            `;
        }
    };
    
    // 添加超时检查，如果3秒后还没加载完成，提供备用选项
    setTimeout(() => {
        const loading = document.getElementById('pdfLoading');
        if (loading && loading.innerHTML.includes('正在加载')) {
            loading.innerHTML = `
                <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: #666;">
                    <i class="fas fa-clock" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                    <p>PDF加载时间较长</p>
                    <p style="font-size: 0.9rem; margin-top: 0.5rem;">您可以选择在新窗口中打开</p>
                    <div style="margin-top: 1rem;">
                        <a href="${pdfPath}" target="_blank" style="color: #2563eb; text-decoration: none; padding: 0.5rem 1rem; border: 1px solid #2563eb; border-radius: 4px;">
                            <i class="fas fa-external-link-alt"></i> 在新窗口中打开PDF
                        </a>
                    </div>
                </div>
            `;
        }
    }, 3000);
    
    // 显示模态框
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // 确保页面不滚动
    document.body.style.position = 'fixed';
    document.body.style.top = `-${window.savedScrollPosition}px`;
    document.body.style.width = '100%';
}

function closePDFViewer() {
    const modal = document.getElementById('pdfModal');
    const viewer = document.getElementById('pdfViewer');
    const loading = document.getElementById('pdfLoading');
    
    // 隐藏模态框
    modal.style.display = 'none';
    
    // 恢复页面滚动
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.body.style.overflow = 'auto';
    
    // 恢复滚动位置
    window.scrollTo(0, window.savedScrollPosition);
    
    // 清空iframe和加载状态
    viewer.src = '';
    viewer.style.display = 'block';
    if (loading) {
        loading.remove();
    }
}

// 点击模态框外部关闭
document.addEventListener('click', function(event) {
    const modal = document.getElementById('pdfModal');
    if (event.target === modal) {
        closePDFViewer();
    }
});

// ESC键关闭模态框
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closePDFViewer();
    }
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

// 引用数据
const citationData = {
    paper1: {
        gb: "Han S, Zhang S, Li J, Zhao Z. Observer-based adaptive super-twisting fast terminal sliding mode control for attitude of quadrotor with mismatched disturbances[J]. Proceedings of the Institution of Mechanical Engineers, Part I: Journal of Systems and Control Engineering, 2025, 239(5): 881-891.",
        bibtex: `@article{Han2025Observer,
  title={Observer-based adaptive super-twisting fast terminal sliding mode control for attitude of quadrotor with mismatched disturbances},
  author={Han, Shuzhen and Zhang, Shanshan and Li, Jianfei and Zhao, Zhanshan},
  journal={Proceedings of the Institution of Mechanical Engineers, Part I: Journal of Systems and Control Engineering},
  volume={239},
  number={5},
  pages={881--891},
  year={2025},
  publisher={SAGE Publications Sage UK: London, England},
  doi={10.1177/09596518241300676}
}`,
        apa: "Han, S., Zhang, S., Li, J., & Zhao, Z. (2025). Observer-based adaptive super-twisting fast terminal sliding mode control for attitude of quadrotor with mismatched disturbances. Proceedings of the Institution of Mechanical Engineers, Part I: Journal of Systems and Control Engineering, 239(5), 881-891. https://doi.org/10.1177/09596518241300676"
    },
    paper2: {
        gb: "Han S, Li J, Pang K, Zhen D, Feng G, Tian F, Niu P. Bearing fault diagnosis using joint features extraction with multi-scale residual convolutional neural network and transformer[J]. Measurement Science and Technology, 2025, 36(5): 056108.",
        bibtex: `@article{Han_2025,
  doi = {10.1088/1361-6501/adc761},
  url = {https://dx.doi.org/10.1088/1361-6501/adc761},
  year = {2025},
  month = {apr},
  publisher = {IOP Publishing},
  volume = {36},
  number = {5},
  pages = {056108},
  author = {Han, Shuzhen and Li, Jianfei and Pang, Ke and Zhen, Dong and Feng, Guojin and Tian, Fujun and Niu, Pingjuan},
  title = {Bearing fault diagnosis using joint features extraction with multi-scale residual convolutional neural network and transformer},
  journal = {Measurement Science and Technology},
  abstract = {In recent years, deep learning has shown significant potential in bearing fault diagnosis. However, challenges remain, including suboptimal signal quality under intricate conditions and the impact of network architecture on model performance. This study proposes a joint feature extraction method that combines a multi-scale residual convolutional neural network with a position-encoded transformer and integrating a transfer learning (TL) strategy to address the aforementioned issues. First, multi-scale convolutional layers are utilized to capture the details and local features from raw signals. To complement this, a transformer with embedded positional encoding learns global dependencies while retaining position information, effectively compensating the position shift issue. To further enhance the model's generalization capability, a data augmentation strategy is designed and implemented, diversifying the training data. Furthermore, a TL strategy predicated on model fine-tuning is applied to mitigate the reliance on a substantial quantity of labeled data. Experiments conducted on two datasets, including Case Western Reserve University (CWRU) dataset and Self-Collected two-stage gear drive test bench dataset, that featuring diverse working conditions and bearing types. The proposed model achieved 99.92% accuracy on the CWRU dataset and demonstrated strong robustness across different operating conditions. With a model size of approximately 1.45MB, it maintains high diagnostic performance while ensuring computational efficiency. This intelligent diagnosis technique can also be applied to other rotating machinery, such as wind power, locomotive and various other fields owing to its robust feature extraction abilities.}
}`,
        apa: "Han, S., Li, J., Pang, K., Zhen, D., Feng, G., Tian, F., & Niu, P. (2025). Bearing fault diagnosis using joint features extraction with multi-scale residual convolutional neural network and transformer. Measurement Science and Technology, 36(5), 056108. https://doi.org/10.1088/1361-6501/adc761"
    }
};

// 显示引用模态框
function showCitation(paperId) {
    const modal = document.getElementById('citationModal');
    const citation = citationData[paperId];
    
    if (!citation) {
        console.error('Citation data not found for paper:', paperId);
        return;
    }
    
    // 设置引用文本
    document.getElementById('gbText').textContent = citation.gb;
    document.getElementById('bibtexText').textContent = citation.bibtex;
    document.getElementById('apaText').textContent = citation.apa;
    
    // 显示模态框
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // 添加点击背景关闭功能
    modal.onclick = function(event) {
        if (event.target === modal) {
            closeCitationModal();
        }
    };
}

// 关闭引用模态框
function closeCitationModal() {
    const modal = document.getElementById('citationModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// 复制引用文本
function copyCitation(elementId) {
    const element = document.getElementById(elementId);
    const text = element.textContent || element.innerText;
    
    // 创建临时textarea元素
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
        document.execCommand('copy');
        showCopySuccess();
    } catch (err) {
        console.error('无法复制文本:', err);
        // 尝试使用现代API
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                showCopySuccess();
            }).catch(err => {
                console.error('复制失败:', err);
            });
        }
    }
    
    document.body.removeChild(textarea);
}

// 显示复制成功提示
function showCopySuccess() {
    // 移除已存在的提示
    const existingToast = document.querySelector('.copy-success');
    if (existingToast) {
        existingToast.remove();
    }
    
    // 创建新的提示
    const toast = document.createElement('div');
    toast.className = 'copy-success';
    toast.textContent = '复制成功！ | Copied!';
    document.body.appendChild(toast);
    
    // 3秒后自动移除
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 3000);
}

// 添加键盘事件监听（ESC关闭模态框）
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeCitationModal();
        closePDFViewer();
    }
});

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