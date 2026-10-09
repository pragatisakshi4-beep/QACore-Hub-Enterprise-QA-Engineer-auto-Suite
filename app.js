/**
 * QA CORE HUB - Enterprise QA Engineering & Automation Suite
 * Single Page Application Logic
 */

// Initial Sample Test Cases Dataset
const DEFAULT_TEST_CASES = [
    {
        id: "TC-101",
        title: "Verify User Login with Valid Email & Password",
        module: "Authentication",
        type: "UI / Functional",
        priority: "P0 - Blocker",
        status: "PASSED",
        duration: "1.2s",
        steps: "1. Navigate to /login\n2. Enter user@qa.com and Pass123!\n3. Click Login button",
        expected: "User redirected to /dashboard with HTTP 200 and auth cookie set."
    },
    {
        id: "TC-102",
        title: "Verify Invalid Password Error Feedback",
        module: "Authentication",
        type: "UI / Functional",
        priority: "P1 - High",
        status: "PASSED",
        duration: "0.8s",
        steps: "1. Navigate to /login\n2. Enter valid email & wrong password\n3. Click Login button",
        expected: "Error banner 'Invalid Credentials' displayed. Form fields retained."
    },
    {
        id: "TC-103",
        title: "POST /api/v1/auth/jwt Token Generation",
        module: "REST API",
        type: "REST API",
        priority: "P0 - Blocker",
        status: "PASSED",
        duration: "210ms",
        steps: "1. Send POST request to /api/v1/auth/jwt with body JSON\n2. Check HTTP status code",
        expected: "Response HTTP status 200 OK. Body contains bearer token & expires_in integer."
    },
    {
        id: "TC-104",
        title: "Verify Shopping Cart Checkout Payment Processing",
        module: "Checkout & Cart",
        type: "UI / Functional",
        priority: "P0 - Blocker",
        status: "FAILED",
        duration: "3.4s",
        steps: "1. Add items to cart\n2. Fill shipping details\n3. Click Pay Now with Stripe Sandbox card",
        expected: "Order confirmation screen generated with unique Order ID."
    },
    {
        id: "TC-105",
        title: "API Rate Limiting - 429 Too Many Requests",
        module: "REST API",
        type: "Security",
        priority: "P1 - High",
        status: "PASSED",
        duration: "450ms",
        steps: "1. Send 100 rapid GET requests within 10 seconds to /api/v1/products",
        expected: "Server responds with 429 Too Many Requests and Retry-After header."
    },
    {
        id: "TC-106",
        title: "Verify Cross-Site Scripting (XSS) Sanitization on User Bio",
        module: "User Profile",
        type: "Security",
        priority: "P1 - High",
        status: "PASSED",
        duration: "1.1s",
        steps: "1. Update profile bio with `<script>alert('XSS')</script>` payload\n2. Save profile",
        expected: "Script tag is escaped/sanitized into safe HTML entities."
    },
    {
        id: "TC-107",
        title: "GET /api/v1/users Dynamic Response Latency Benchmarking",
        module: "REST API",
        type: "Performance",
        priority: "P2 - Medium",
        status: "PASSED",
        duration: "180ms",
        steps: "1. Benchmark endpoint latency under 50 concurrent requests",
        expected: "P95 latency stays under 350ms."
    },
    {
        id: "TC-108",
        title: "Verify Payment Gateway Timeout Handling",
        module: "Payment Gateway",
        type: "UI / Functional",
        priority: "P0 - Blocker",
        status: "BLOCKED",
        duration: "0ms",
        steps: "1. Simulate 30s network timeout during 3D Secure verification",
        expected: "Graceful error modal 'Payment Timeout' and cart preserved."
    },
    {
        id: "TC-109",
        title: "Verify Dynamic Cascading Role Dropdown Selection",
        module: "User Profile",
        type: "UI / Functional",
        priority: "P2 - Medium",
        status: "UNTESTED",
        duration: "0ms",
        steps: "1. Select role Administrator\n2. Check permission checkboxes dynamically update",
        expected: "All admin permission scopes checked automatically."
    }
];

// Initial Sample Defects Dataset
const DEFAULT_DEFECTS = [
    {
        id: "BUG-101",
        title: "HTTP 500 Error on Stripe Payment Checkout Submission",
        severity: "Critical",
        status: "OPEN",
        steps: "1. Add item to cart\n2. Proceed to checkout\n3. Click pay with 3D Secure test card",
        actual: "Blank white screen with uncaught NullPointerException in payment service log.",
        date: "Oct 08, 2026"
    },
    {
        id: "BUG-102",
        title: "StaleElementReferenceException on User Profile Modal Retry",
        severity: "Major",
        status: "IN_PROGRESS",
        steps: "1. Open Profile Modal\n2. Click Edit\n3. Re-open modal rapidly",
        actual: "Selenium DOM target lost due to unmounted React node.",
        date: "Oct 09, 2026"
    },
    {
        id: "BUG-103",
        title: "API /users Endpoint returns 404 on Page 2 Pagination",
        severity: "Minor",
        status: "RETEST",
        steps: "1. Call GET /api/v1/users?page=2",
        actual: "Returns 404 Not Found instead of empty array.",
        date: "Oct 07, 2026"
    }
];

// Application State
let appState = {
    testCases: JSON.parse(localStorage.getItem('qa_test_cases')) || DEFAULT_TEST_CASES,
    defects: JSON.parse(localStorage.getItem('qa_defects')) || DEFAULT_DEFECTS,
    activeTab: 'dashboard-tab',
    theme: localStorage.getItem('qa_theme') || 'dark'
};

// Chart instances
let statusChartObj = null;
let typeChartObj = null;
let trendChartObj = null;

// DOM LOADED INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initNavigation();
    initCharts();
    renderTestCases();
    renderDefectsKanban();
    updateDashboardMetrics();
    initModalHandlers();
    initApiSandbox();
    initCodeGenerator();
    initPlayground();
    initReportData();
    initEventListeners();
});

// THEME HANDLER
function initTheme() {
    document.documentElement.setAttribute('data-theme', appState.theme);
    const themeBtnIcon = document.querySelector('#theme-toggle i');
    if (themeBtnIcon) {
        themeBtnIcon.className = appState.theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    }
}

function toggleTheme() {
    appState.theme = appState.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('qa_theme', appState.theme);
    initTheme();
    showToast(`Switched to ${appState.theme} mode`, 'info');
    if (statusChartObj) initCharts(); // Redraw chart colors
}

// NAVIGATION & TAB SWITCHING
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const targetTab = item.getAttribute('data-tab');
            if (targetTab) {
                switchTab(targetTab);
            }
        });
    });

    document.getElementById('toggle-sidebar')?.addEventListener('click', () => {
        const sidebar = document.querySelector('.sidebar');
        sidebar.classList.toggle('collapsed');
    });

    document.getElementById('theme-toggle')?.addEventListener('click', toggleTheme);
}

function switchTab(tabId) {
    appState.activeTab = tabId;

    // Update Nav Active State
    document.querySelectorAll('.nav-item').forEach(btn => {
        if (btn.getAttribute('data-tab') === tabId) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Update View Pages
    document.querySelectorAll('.tab-page').forEach(page => {
        if (page.id === tabId) {
            page.classList.add('active');
        } else {
            page.classList.remove('active');
        }
    });

    if (tabId === 'dashboard-tab') {
        updateDashboardMetrics();
    } else if (tabId === 'reports-tab') {
        initReportData();
    }
}

// TOAST NOTIFICATIONS
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const iconClass = type === 'success' ? 'fa-circle-check text-success' : (type === 'danger' ? 'fa-triangle-exclamation text-danger' : 'fa-info-circle text-primary');
    
    toast.innerHTML = `
        <i class="fa-solid ${iconClass}"></i>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

// DASHBOARD & METRICS & CHARTS
function updateDashboardMetrics() {
    const total = appState.testCases.length;
    const passed = appState.testCases.filter(tc => tc.status === 'PASSED').length;
    const failed = appState.testCases.filter(tc => tc.status === 'FAILED').length;
    const blocked = appState.testCases.filter(tc => tc.status === 'BLOCKED').length;
    const untested = appState.testCases.filter(tc => tc.status === 'UNTESTED').length;

    const passRate = total > 0 ? ((passed / total) * 100).toFixed(1) : 0;
    const openBugs = appState.defects.filter(d => d.status !== 'CLOSED').length;
    const criticalBugs = appState.defects.filter(d => d.severity === 'Critical' && d.status !== 'CLOSED').length;

    // Element updates
    document.getElementById('stat-total-tests').innerText = total;
    document.getElementById('stat-pass-rate').innerText = `${passRate}%`;
    document.getElementById('stat-passed-count').innerText = `${passed} Passed`;
    document.getElementById('stat-bugs-count').innerText = openBugs;
    document.getElementById('stat-critical-bugs').innerText = `${criticalBugs} Critical`;
    document.getElementById('test-count-badge').innerText = total;
    document.getElementById('open-bugs-badge').innerText = openBugs;

    updateCharts(passed, failed, blocked, untested);
}

function initCharts() {
    const isDark = appState.theme === 'dark';
    const textColor = isDark ? '#94a3b8' : '#475569';

    // Status Doughnut Chart
    const ctxStatus = document.getElementById('statusChart')?.getContext('2d');
    if (ctxStatus) {
        if (statusChartObj) statusChartObj.destroy();
        statusChartObj = new Chart(ctxStatus, {
            type: 'doughnut',
            data: {
                labels: ['Passed', 'Failed', 'Blocked', 'Untested'],
                datasets: [{
                    data: [6, 1, 1, 1],
                    backgroundColor: ['#10b981', '#ef4444', '#f59e0b', '#64748b'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom', labels: { color: textColor, font: { family: 'Inter' } } }
                }
            }
        });
    }

    // Type Bar Chart
    const ctxType = document.getElementById('typeChart')?.getContext('2d');
    if (ctxType) {
        if (typeChartObj) typeChartObj.destroy();
        typeChartObj = new Chart(ctxType, {
            type: 'bar',
            data: {
                labels: ['UI / Functional', 'REST API', 'Security', 'Performance'],
                datasets: [{
                    label: 'Cases',
                    data: [4, 3, 2, 1],
                    backgroundColor: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'],
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { ticks: { color: textColor } },
                    y: { ticks: { color: textColor } }
                }
            }
        });
    }

    // Velocity Trend Line Chart
    const ctxTrend = document.getElementById('trendChart')?.getContext('2d');
    if (ctxTrend) {
        if (trendChartObj) trendChartObj.destroy();
        trendChartObj = new Chart(ctxTrend, {
            type: 'line',
            data: {
                labels: ['Run #1', 'Run #2', 'Run #3', 'Run #4', 'Run #5', 'Run #6', 'Run #7'],
                datasets: [
                    {
                        label: 'Pass Rate %',
                        data: [75, 80, 82, 78, 88, 90, 91.6],
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        fill: true,
                        tension: 0.3
                    },
                    {
                        label: 'Flaky Tests Detected',
                        data: [4, 3, 2, 3, 1, 1, 0],
                        borderColor: '#ef4444',
                        backgroundColor: 'transparent',
                        borderDash: [5, 5],
                        tension: 0.3
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { labels: { color: textColor } } },
                scales: {
                    x: { ticks: { color: textColor } },
                    y: { ticks: { color: textColor } }
                }
            }
        });
    }
}

function updateCharts(passed, failed, blocked, untested) {
    if (statusChartObj) {
        statusChartObj.data.datasets[0].data = [passed, failed, blocked, untested];
        statusChartObj.update();
    }
}

// TEST CASES HUB RENDERING & FILTERS
function renderTestCases() {
    const tbody = document.getElementById('test-cases-tbody');
    if (!tbody) return;

    const searchTerm = document.getElementById('test-search-input')?.value.toLowerCase() || '';
    const statusFilter = document.getElementById('filter-status')?.value || 'ALL';
    const priorityFilter = document.getElementById('filter-priority')?.value || 'ALL';
    const typeFilter = document.getElementById('filter-type')?.value || 'ALL';

    const filtered = appState.testCases.filter(tc => {
        const matchesSearch = tc.title.toLowerCase().includes(searchTerm) || tc.id.toLowerCase().includes(searchTerm) || tc.module.toLowerCase().includes(searchTerm);
        const matchesStatus = statusFilter === 'ALL' || tc.status === statusFilter;
        const matchesPriority = priorityFilter === 'ALL' || tc.priority === priorityFilter;
        const matchesType = typeFilter === 'ALL' || tc.type === typeFilter;
        return matchesSearch && matchesStatus && matchesPriority && matchesType;
    });

    tbody.innerHTML = '';

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="9" class="text-center text-muted py-4">No test cases match the selected filters.</td></tr>`;
        return;
    }

    filtered.forEach(tc => {
        const tr = document.createElement('tr');
        
        let statusBadgeClass = 'badge-neutral';
        if (tc.status === 'PASSED') statusBadgeClass = 'badge-passed';
        if (tc.status === 'FAILED') statusBadgeClass = 'badge-failed';
        if (tc.status === 'BLOCKED') statusBadgeClass = 'badge-blocked';

        tr.innerHTML = `
            <td><input type="checkbox" class="tc-select-checkbox" data-id="${tc.id}"></td>
            <td><span class="test-id-tag">${tc.id}</span></td>
            <td class="test-title-cell">${tc.title}</td>
            <td><span class="badge badge-neutral">${tc.module}</span></td>
            <td><span class="badge badge-purple">${tc.type}</span></td>
            <td><span class="badge badge-neutral">${tc.priority}</span></td>
            <td><span class="badge ${statusBadgeClass}">${tc.status}</span></td>
            <td class="font-mono text-muted">${tc.duration}</td>
            <td>
                <div class="table-actions">
                    <button class="btn btn-outline btn-sm" onclick="runSingleTest('${tc.id}')" title="Run Test Case">
                        <i class="fa-solid fa-play text-success"></i>
                    </button>
                    <button class="btn btn-outline btn-sm" onclick="editTestCase('${tc.id}')" title="Edit">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="btn btn-outline btn-sm" onclick="deleteTestCase('${tc.id}')" title="Delete">
                        <i class="fa-solid fa-trash text-danger"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });

    populateGeneratorDropdown();
}

function runSingleTest(id) {
    const tc = appState.testCases.find(t => t.id === id);
    if (!tc) return;

    showToast(`Executing ${tc.id}: ${tc.title}...`, 'info');
    tc.status = 'UNTESTED';
    renderTestCases();

    setTimeout(() => {
        // Random outcome for demonstration or success for passed
        const passed = Math.random() > 0.15;
        tc.status = passed ? 'PASSED' : 'FAILED';
        tc.duration = `${(Math.random() * 1.5 + 0.2).toFixed(2)}s`;
        saveState();
        renderTestCases();
        updateDashboardMetrics();
        showToast(`${tc.id} Execution Finished: ${tc.status}`, passed ? 'success' : 'danger');
    }, 1200);
}

function runAllTests() {
    showToast('Starting Execution of Full Automation Test Suite...', 'info');
    let count = 0;
    const interval = setInterval(() => {
        if (count >= appState.testCases.length) {
            clearInterval(interval);
            showToast('Full Test Suite Execution Completed!', 'success');
            return;
        }
        const tc = appState.testCases[count];
        tc.status = Math.random() > 0.1 ? 'PASSED' : 'FAILED';
        tc.duration = `${(Math.random() * 1.2 + 0.1).toFixed(2)}s`;
        count++;
        renderTestCases();
        updateDashboardMetrics();
    }, 300);
}

function deleteTestCase(id) {
    if (confirm(`Are you sure you want to delete Test Case ${id}?`)) {
        appState.testCases = appState.testCases.filter(tc => tc.id !== id);
        saveState();
        renderTestCases();
        updateDashboardMetrics();
        showToast(`Deleted ${id}`, 'danger');
    }
}

// BUG & DEFECT KANBAN BOARD
function renderDefectsKanban() {
    const containers = {
        'OPEN': document.getElementById('kanban-open-container'),
        'IN_PROGRESS': document.getElementById('kanban-progress-container'),
        'RETEST': document.getElementById('kanban-retest-container'),
        'CLOSED': document.getElementById('kanban-closed-container')
    };

    const counts = { 'OPEN': 0, 'IN_PROGRESS': 0, 'RETEST': 0, 'CLOSED': 0 };

    Object.keys(containers).forEach(key => {
        if (containers[key]) containers[key].innerHTML = '';
    });

    appState.defects.forEach(bug => {
        counts[bug.status] = (counts[bug.status] || 0) + 1;
        const container = containers[bug.status];
        if (!container) return;

        let sevBadgeClass = 'badge-neutral';
        if (bug.severity === 'Critical') sevBadgeClass = 'badge-danger';
        if (bug.severity === 'Major') sevBadgeClass = 'badge-warning';

        const card = document.createElement('div');
        card.className = 'kanban-card';
        card.draggable = true;
        card.setAttribute('data-id', bug.id);

        card.innerHTML = `
            <div class="flex justify-between items-center">
                <span class="bug-id">${bug.id}</span>
                <span class="badge ${sevBadgeClass}">${bug.severity}</span>
            </div>
            <h5 class="bug-title">${bug.title}</h5>
            <div class="bug-footer">
                <span class="text-muted"><i class="fa-solid fa-calendar-day"></i> ${bug.date}</span>
                <div class="kanban-actions">
                    <button class="btn btn-outline btn-sm" onclick="cycleBugStatus('${bug.id}')" title="Advance Status">
                        <i class="fa-solid fa-arrow-right"></i>
                    </button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });

    // Update Kanban Counters
    document.getElementById('count-kanban-open').innerText = counts['OPEN'] || 0;
    document.getElementById('count-kanban-progress').innerText = counts['IN_PROGRESS'] || 0;
    document.getElementById('count-kanban-retest').innerText = counts['RETEST'] || 0;
    document.getElementById('count-kanban-closed').innerText = counts['CLOSED'] || 0;
}

function cycleBugStatus(id) {
    const bug = appState.defects.find(d => d.id === id);
    if (!bug) return;

    const statusFlow = ['OPEN', 'IN_PROGRESS', 'RETEST', 'CLOSED'];
    const currentIndex = statusFlow.indexOf(bug.status);
    bug.status = statusFlow[(currentIndex + 1) % statusFlow.length];

    saveState();
    renderDefectsKanban();
    updateDashboardMetrics();
    showToast(`${bug.id} status updated to ${bug.status}`, 'info');
}

// LIVE API TESTER
function initApiSandbox() {
    // Quick API Presets Handler
    document.getElementById('api-preset-select')?.addEventListener('change', (e) => {
        const val = e.target.value;
        const methodSelect = document.getElementById('api-method');
        const urlInput = document.getElementById('api-url');
        const bodyInput = document.getElementById('api-body');

        if (val === 'get-users') {
            methodSelect.value = 'GET';
            urlInput.value = 'https://jsonplaceholder.typicode.com/users';
            bodyInput.value = '';
        } else if (val === 'post-auth') {
            methodSelect.value = 'POST';
            urlInput.value = 'https://reqres.in/api/login';
            bodyInput.value = JSON.stringify({ email: "eve.holt@reqres.in", password: "cityslicka" }, null, 2);
        } else if (val === 'get-products') {
            methodSelect.value = 'GET';
            urlInput.value = 'https://dummyjson.com/products/1';
            bodyInput.value = '';
        } else if (val === 'post-order') {
            methodSelect.value = 'POST';
            urlInput.value = 'https://jsonplaceholder.typicode.com/posts';
            bodyInput.value = JSON.stringify({ title: "Order #9921", body: "2x Wireless Headphones", userId: 101 }, null, 2);
        } else if (val === 'invalid-404') {
            methodSelect.value = 'GET';
            urlInput.value = 'https://jsonplaceholder.typicode.com/invalid_route_404';
            bodyInput.value = '';
        }
    });

    // Subtabs toggle
    document.querySelectorAll('.subtab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-subtab');
            document.querySelectorAll('.subtab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.subtab-content').forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(target)?.classList.add('active');
        });
    });

    // Send HTTP Request
    document.getElementById('btn-send-api')?.addEventListener('click', executeApiRequest);
}

async function executeApiRequest() {
    const method = document.getElementById('api-method').value;
    const url = document.getElementById('api-url').value;
    const headersText = document.getElementById('api-headers').value;
    const bodyText = document.getElementById('api-body').value;
    const resBodyCode = document.getElementById('api-response-body');
    const resStatusBadge = document.getElementById('res-status-code');
    const resTimeBadge = document.getElementById('res-time');
    const resSizeBadge = document.getElementById('res-size');
    const assertionBox = document.getElementById('assertion-results-box');

    if (!url) {
        showToast('Please enter a target API URL', 'danger');
        return;
    }

    resBodyCode.innerText = "// Sending HTTP Request...";
    const startTime = performance.now();

    try {
        let headers = {};
        if (headersText.trim()) {
            try { headers = JSON.parse(headersText); } catch(e) {}
        }

        let options = { method, headers };
        if (['POST', 'PUT', 'PATCH'].includes(method) && bodyText.trim()) {
            options.body = bodyText;
            if (!headers['Content-Type']) headers['Content-Type'] = 'application/json';
        }

        const response = await fetch(url, options);
        const endTime = performance.now();
        const duration = Math.round(endTime - startTime);

        const responseText = await response.text();
        let formattedBody = responseText;

        try {
            const json = JSON.parse(responseText);
            formattedBody = JSON.stringify(json, null, 2);
        } catch(e) {}

        const sizeBytes = new Blob([responseText]).size;

        // Update Badges
        resStatusBadge.innerText = `Status: ${response.status} ${response.statusText}`;
        resStatusBadge.className = `badge ${response.ok ? 'badge-passed' : 'badge-failed'}`;
        resTimeBadge.innerText = `Time: ${duration} ms`;
        resSizeBadge.innerText = `Size: ${sizeBytes} B`;

        resBodyCode.innerText = formattedBody;

        // Run Assertions
        evaluateApiAssertions(response.status, duration, formattedBody, assertionBox);

        showToast(`API Response received: ${response.status}`, response.ok ? 'success' : 'danger');

    } catch (error) {
        const endTime = performance.now();
        const duration = Math.round(endTime - startTime);
        resStatusBadge.innerText = `Status: Network Error`;
        resStatusBadge.className = 'badge badge-failed';
        resTimeBadge.innerText = `Time: ${duration} ms`;
        resBodyCode.innerText = `Error: ${error.message}`;

        assertionBox.innerHTML = `
            <div class="badge badge-failed"><i class="fa-solid fa-xmark"></i> Request Failed: ${error.message}</div>
        `;
    }
}

function evaluateApiAssertions(status, duration, bodyStr, container) {
    let results = [];

    // Assertion 1: Status Code
    if (document.getElementById('assert-status-check')?.checked) {
        const expectedStatus = parseInt(document.getElementById('assert-status-val').value) || 200;
        const pass = status === expectedStatus;
        results.push({ name: `Status Code equals ${expectedStatus}`, pass });
    }

    // Assertion 2: Response Time
    if (document.getElementById('assert-time-check')?.checked) {
        const maxTime = parseInt(document.getElementById('assert-time-val').value) || 1000;
        const pass = duration <= maxTime;
        results.push({ name: `Response Time < ${maxTime}ms (Actual: ${duration}ms)`, pass });
    }

    // Assertion 3: JSON Key Check
    if (document.getElementById('assert-key-check')?.checked) {
        const key = document.getElementById('assert-key-val').value.trim();
        if (key) {
            const pass = bodyStr.includes(`"${key}"`);
            results.push({ name: `JSON contains key "${key}"`, pass });
        }
    }

    container.innerHTML = results.map(r => `
        <div class="badge ${r.pass ? 'badge-passed' : 'badge-failed'}" style="margin-right:0.5rem; margin-bottom:0.4rem;">
            <i class="fa-solid ${r.pass ? 'fa-check' : 'fa-xmark'}"></i> ${r.name}
        </div>
    `).join('');
}

// AUTOMATION CODE GENERATOR
function initCodeGenerator() {
    populateGeneratorDropdown();
    document.getElementById('btn-generate-code')?.addEventListener('click', generateCodeSnippet);
    document.getElementById('btn-copy-code')?.addEventListener('click', () => {
        const code = document.getElementById('generated-code-block').innerText;
        navigator.clipboard.writeText(code);
        showToast('Code copied to clipboard!', 'success');
    });
}

function populateGeneratorDropdown() {
    const select = document.getElementById('gen-test-select');
    if (!select) return;
    select.innerHTML = appState.testCases.map(tc => `
        <option value="${tc.id}">${tc.id} - ${tc.title}</option>
    `).join('');
}

function generateCodeSnippet() {
    const framework = document.getElementById('gen-framework').value;
    const tcId = document.getElementById('gen-test-select').value;
    const url = document.getElementById('gen-target-url').value;
    const tc = appState.testCases.find(t => t.id === tcId) || appState.testCases[0];

    const codeBlock = document.getElementById('generated-code-block');
    let code = '';

    if (framework === 'cypress') {
        code = `// Cypress E2E Automation Test Script
// File: cypress/e2e/${tc.id.toLowerCase()}_spec.cy.js

describe('${tc.module} - ${tc.id}', () => {
    beforeEach(() => {
        cy.visit('${url}');
    });

    it('${tc.title}', () => {
        // Test Objective: ${tc.expected}
        cy.get('[data-cy="email-input"]').type('user@qa.com');
        cy.get('[data-cy="password-input"]').type('Pass123!');
        cy.get('[data-cy="submit-btn"]').click();

        // QA Assertions
        cy.url().should('include', '/dashboard');
        cy.get('.toast-success').should('be.visible');
    });
});`;
    } else if (framework === 'playwright-ts') {
        code = `// Playwright TypeScript Page Object Model (POM)
// File: tests/${tc.id.toLowerCase()}.spec.ts

import { test, expect } from '@playwright/test';

test.describe('${tc.module} Suite', () => {
    test('${tc.id}: ${tc.title}', async ({ page }) => {
        await page.goto('${url}');
        
        // Fill form fields
        await page.locator('#email').fill('user@qa.com');
        await page.locator('#password').fill('Pass123!');
        await page.locator('button[type="submit"]').click();

        // Assertion checks
        await expect(page).toHaveURL(/.*dashboard/);
        await expect(page.locator('.welcome-banner')).toBeVisible();
    });
});`;
    } else if (framework === 'playwright-py') {
        code = `# Playwright Python Async Automation
# File: tests/test_${tc.id.toLowerCase()}.py

import pytest
from playwright.sync_api import Page, expect

def test_${tc.id.toLowerCase().replace('-', '_')}(page: Page):
    page.goto("${url}")
    
    page.fill("#email", "user@qa.com")
    page.fill("#password", "Pass123!")
    page.click("#submit-btn")
    
    expect(page).to_have_url("${url}/dashboard")
    expect(page.locator(".profile-name")).to_be_visible()`;
    } else if (framework === 'selenium-py') {
        code = `# Selenium WebDriver Python Pytest
# File: tests/test_${tc.id.toLowerCase()}.py

import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def test_${tc.id.toLowerCase().replace('-', '_')}():
    driver = webdriver.Chrome()
    driver.implicitly_wait(10)
    
    driver.get("${url}")
    driver.find_element(By.ID, "email").send_keys("user@qa.com")
    driver.find_element(By.ID, "password").send_keys("Pass123!")
    driver.find_element(By.CSS_SELECTOR, "button.btn-submit").click()
    
    # Wait for dashboard loader
    element = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.ID, "dashboard-header"))
    )
    assert "Dashboard" in element.text
    driver.quit()`;
    } else if (framework === 'restassured-java') {
        code = `// REST Assured Java API Test Script
// File: src/test/java/com/qa/tests/ApiTest_${tc.id.replace('-', '_')}.java

package com.qa.tests;

import io.restassured.RestAssured;
import static io.restassured.RestAssured.*;
import static org.hamcrest.Matchers.*;
import org.testng.annotations.Test;

public class ApiTest_${tc.id.replace('-', '_')} {

    @Test
    public void test_${tc.id.replace('-', '_')}() {
        RestAssured.baseURI = "${url}";

        given()
            .header("Content-Type", "application/json")
            .body("{\\"email\\": \\"user@qa.com\\", \\"password\\": \\"Pass123!\\"}")
        .when()
            .post("/api/v1/auth")
        .then()
            .statusCode(200)
            .body("status", equalTo("success"))
            .body("token", notNullValue());
    }
}`;
    }

    codeBlock.innerText = code;
    showToast(`Generated ${framework.toUpperCase()} script for ${tc.id}`, 'success');
}

// QA WEB PLAYGROUND
function initPlayground() {
    const pwdInput = document.getElementById('sb-password');
    const meterBar = document.getElementById('pwd-meter-bar');

    pwdInput?.addEventListener('input', (e) => {
        const val = e.target.value;
        let score = 0;
        if (val.length >= 8) score += 33;
        if (/[A-Z]/.test(val)) score += 33;
        if (/[0-9!@#$%^&*]/.test(val)) score += 34;

        meterBar.style.width = `${score}%`;
        meterBar.style.background = score > 66 ? '#10b981' : (score > 33 ? '#f59e0b' : '#ef4444');
    });

    document.getElementById('btn-trigger-delay')?.addEventListener('click', () => {
        const out = document.getElementById('async-output-box');
        out.innerHTML = `<span class="text-warning"><i class="fa-solid fa-spinner fa-spin"></i> Loading async dynamic element (3s wait)...</span>`;
        setTimeout(() => {
            out.innerHTML = `<span class="text-success"><i class="fa-solid fa-circle-check"></i> Element Mounted! ID: #dynamic-element-qa-99</span>`;
        }, 3000);
    });

    document.getElementById('btn-trigger-stale')?.addEventListener('click', () => {
        const out = document.getElementById('async-output-box');
        out.innerHTML = `<span class="text-danger"><i class="fa-solid fa-triangle-exclamation"></i> StaleElementReferenceException simulated: Target Node Detached!</span>`;
    });
}

// EXECUTIVE REPORT DATA
function initReportData() {
    const total = appState.testCases.length;
    const passed = appState.testCases.filter(tc => tc.status === 'PASSED').length;
    const failed = appState.testCases.filter(tc => tc.status === 'FAILED').length;
    const rate = total > 0 ? ((passed / total) * 100).toFixed(1) : 0;

    document.getElementById('rep-total').innerText = total;
    document.getElementById('rep-passed').innerText = passed;
    document.getElementById('rep-failed').innerText = failed;
    document.getElementById('rep-rate').innerText = `${rate}%`;

    // Module breakdown
    const modules = {};
    appState.testCases.forEach(tc => {
        if (!modules[tc.module]) modules[tc.module] = { total: 0, passed: 0, failed: 0 };
        modules[tc.module].total++;
        if (tc.status === 'PASSED') modules[tc.module].passed++;
        if (tc.status === 'FAILED') modules[tc.module].failed++;
    });

    const tbody = document.getElementById('report-breakdown-tbody');
    if (tbody) {
        tbody.innerHTML = Object.keys(modules).map(mod => {
            const m = modules[mod];
            const modRate = ((m.passed / m.total) * 100).toFixed(1);
            return `
                <tr>
                    <td><strong>${mod}</strong></td>
                    <td>${m.total}</td>
                    <td class="text-success">${m.passed}</td>
                    <td class="text-danger">${m.failed}</td>
                    <td><strong>${modRate}%</strong></td>
                </tr>
            `;
        }).join('');
    }

    document.getElementById('btn-print-report')?.addEventListener('click', () => {
        window.print();
    });
}

// MODALS & EVENT LISTENERS
function initModalHandlers() {
    // New Test Case Modal
    document.getElementById('btn-new-test')?.addEventListener('click', () => openTestModal());
    document.getElementById('btn-add-test-modal')?.addEventListener('click', () => openTestModal());
    document.getElementById('close-modal-test')?.addEventListener('click', () => closeModal('modal-test-case'));
    document.getElementById('btn-cancel-tc')?.addEventListener('click', () => closeModal('modal-test-case'));

    document.getElementById('form-test-case')?.addEventListener('submit', (e) => {
        e.preventDefault();
        saveTestCaseFromForm();
    });

    // New Defect Modal
    document.getElementById('btn-new-defect')?.addEventListener('click', () => openDefectModal());
    document.getElementById('close-modal-defect')?.addEventListener('click', () => closeModal('modal-defect'));
    document.getElementById('btn-cancel-bug')?.addEventListener('click', () => closeModal('modal-defect'));

    document.getElementById('form-defect')?.addEventListener('submit', (e) => {
        e.preventDefault();
        saveDefectFromForm();
    });
}

function openTestModal(tcId = null) {
    const modal = document.getElementById('modal-test-case');
    document.getElementById('form-test-case').reset();
    document.getElementById('tc-id-hidden').value = '';
    
    if (tcId) {
        const tc = appState.testCases.find(t => t.id === tcId);
        if (tc) {
            document.getElementById('modal-test-title').innerText = `Edit Test Case ${tc.id}`;
            document.getElementById('tc-id-hidden').value = tc.id;
            document.getElementById('tc-title').value = tc.title;
            document.getElementById('tc-module').value = tc.module;
            document.getElementById('tc-type').value = tc.type;
            document.getElementById('tc-priority').value = tc.priority;
            document.getElementById('tc-status').value = tc.status;
            document.getElementById('tc-steps').value = tc.steps;
            document.getElementById('tc-expected').value = tc.expected;
        }
    } else {
        document.getElementById('modal-test-title').innerText = 'Create New Test Case';
    }
    modal.classList.add('show');
}

function openDefectModal() {
    document.getElementById('form-defect').reset();
    document.getElementById('modal-defect').classList.add('show');
}

function closeModal(modalId) {
    document.getElementById(modalId)?.classList.remove('show');
}

function saveTestCaseFromForm() {
    const idHidden = document.getElementById('tc-id-hidden').value;
    const title = document.getElementById('tc-title').value;
    const module = document.getElementById('tc-module').value;
    const type = document.getElementById('tc-type').value;
    const priority = document.getElementById('tc-priority').value;
    const status = document.getElementById('tc-status').value;
    const steps = document.getElementById('tc-steps').value;
    const expected = document.getElementById('tc-expected').value;

    if (idHidden) {
        const tc = appState.testCases.find(t => t.id === idHidden);
        if (tc) {
            Object.assign(tc, { title, module, type, priority, status, steps, expected });
            showToast(`Updated ${tc.id}`, 'success');
        }
    } else {
        const newId = `TC-${100 + appState.testCases.length + 1}`;
        appState.testCases.push({
            id: newId,
            title, module, type, priority, status, steps, expected,
            duration: '0s'
        });
        showToast(`Created Test Case ${newId}`, 'success');
    }

    saveState();
    closeModal('modal-test-case');
    renderTestCases();
    updateDashboardMetrics();
}

function saveDefectFromForm() {
    const title = document.getElementById('bug-title').value;
    const severity = document.getElementById('bug-severity').value;
    const status = document.getElementById('bug-status').value;
    const steps = document.getElementById('bug-steps').value;
    const actual = document.getElementById('bug-actual').value;

    const newId = `BUG-${100 + appState.defects.length + 1}`;
    appState.defects.push({
        id: newId,
        title, severity, status, steps, actual,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
    });

    saveState();
    closeModal('modal-defect');
    renderDefectsKanban();
    updateDashboardMetrics();
    showToast(`Logged Defect ${newId}`, 'danger');
}

function editTestCase(id) {
    openTestModal(id);
}

function initEventListeners() {
    // Filters & Search
    document.getElementById('test-search-input')?.addEventListener('input', renderTestCases);
    document.getElementById('filter-status')?.addEventListener('change', renderTestCases);
    document.getElementById('filter-priority')?.addEventListener('change', renderTestCases);
    document.getElementById('filter-type')?.addEventListener('change', renderTestCases);

    document.getElementById('btn-run-all-tests')?.addEventListener('click', runAllTests);
    document.getElementById('btn-run-filtered')?.addEventListener('click', runAllTests);

    document.getElementById('btn-reset-data')?.addEventListener('click', () => {
        if (confirm('Reset to default initial QA test suite?')) {
            appState.testCases = DEFAULT_TEST_CASES;
            appState.defects = DEFAULT_DEFECTS;
            saveState();
            renderTestCases();
            renderDefectsKanban();
            updateDashboardMetrics();
            showToast('Reset data to QA defaults', 'info');
        }
    });

    document.getElementById('btn-export-data')?.addEventListener('click', () => {
        const jsonStr = JSON.stringify(appState, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `qa_suite_backup_${Date.now()}.json`;
        a.click();
        showToast('Exported QA State JSON', 'success');
    });
}

function saveState() {
    localStorage.setItem('qa_test_cases', JSON.stringify(appState.testCases));
    localStorage.setItem('qa_defects', JSON.stringify(appState.defects));
}
