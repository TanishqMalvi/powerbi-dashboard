// ============================================================
// AdventureWorks Power BI Dashboard - Main Application
// ============================================================

// ============================================================
// GLOBAL STATE
// ============================================================
const state = {
    currentPage: 'page-executive',
    filters: {
        years: [2020, 2021, 2022],
        continents: ["Europe", "North America", "Pacific"]
    },
    financialYear: 2017,
    financialView: "Actuals",
    selectedMetrics: ["Order", "Profit", "Revenue"],
    whatIfValue: 0,
    currentFinancialSubpage: null,
    activeMapRegion: 'all',
    riFilters: {
        dateIndex: 30
    }
};

// ============================================================
// CHART INSTANCES (keep references for updates)
// ============================================================
const charts = {};

// ============================================================
// DOM HELPERS
// ============================================================
const $ = (id) => document.getElementById(id);

// ============================================================
// INITIALIZATION
// ============================================================
function init() {
    setupNavigation();
    setupFilterPanel();
    setupFinancialNavigation();
    setupSliders();
    renderAllPages();
}

document.addEventListener('DOMContentLoaded', init);

// ============================================================
// NAVIGATION: Sidebar & Page Switching
// ============================================================
function setupNavigation() {
    // Sidebar icon click handlers
    const sidebarIcons = document.querySelectorAll('.sidebar-icon[data-page]');
    sidebarIcons.forEach(icon => {
        icon.addEventListener('click', () => {
            const pageId = icon.dataset.page;
            switchPage(pageId);
        });
    });

    // Back-to-home button
    const backBtn = document.getElementById('back-home');
    backBtn.addEventListener('click', () => {
        // If in financial subpage, go back to financial nav
        if (state.currentFinancialSubpage) {
            switchFinancialSubpage(null);
            state.currentFinancialSubpage = null;
        } else {
            switchPage('page-executive');
        }
    });
}

function switchPage(pageId) {
    // Hide all page sections
    document.querySelectorAll('.page-section').forEach(section => {
        section.classList.remove('active');
    });

    // Hide financial subpages
    document.querySelectorAll('.financial-subpage').forEach(sub => {
        sub.classList.remove('active');
    });
    state.currentFinancialSubpage = null;

    // Show target page
    const target = document.getElementById(pageId);
    if (target) {
        target.classList.add('active');
    }

    // Update sidebar active state
    document.querySelectorAll('.sidebar-icon[data-page]').forEach(icon => {
        icon.classList.toggle('active', icon.dataset.page === pageId);
    });

    state.currentPage = pageId;
    syncFilterPanelToPage();
}

function switchFinancialSubpage(subpageId) {
    // Hide all financial subpages and nav
    document.querySelectorAll('.financial-subpage').forEach(sub => {
        sub.classList.remove('active');
        sub.style.display = 'none';
    });
    const nav = document.getElementById('page-financial-nav');
    if (nav) nav.style.display = 'none';

    if (!subpageId) {
        // Back to navigation
        if (nav) {
            nav.style.display = 'block';
            nav.classList.add('active');
        }
        state.currentFinancialSubpage = null;
        return;
    }

    // Show target subpage
    const target = document.getElementById(subpageId);
    if (target) {
        target.style.display = 'block';
        target.classList.add('active');
        target.classList.add('active');
    }
    state.currentFinancialSubpage = subpageId;
}

// ============================================================
// FILTER OPTION SOURCES (derived from each page's own data)
// ============================================================
// A page only offers years/continents its dataset actually contains,
// so a page never presents a filter value that yields no data.
function availableYearsForPage(pageId) {
    switch (pageId) {
        case 'page-executive':
            return [...new Set(EXECUTIVE_DATA.revenueTrending.years.map(Number))].sort((a, b) => a - b);
        case 'page-product':
            return [...new Set(PRODUCT_DATA.profitData.weeks.map(w => Number(w.week.split('-')[0])))].sort((a, b) => a - b);
        case 'page-customer':
            return [...new Set(CUSTOMER_DATA.revenuePerCustomer.years.map(Number))].sort((a, b) => a - b);
        default:
            return [];
    }
}

function availableContinentsForPage(pageId) {
    return pageId === 'page-map' ? Object.keys(MAP_DATA.regions) : [];
}

// Union across all pages, used by the Clear button
const ALL_FILTER_YEARS = ['page-executive', 'page-product', 'page-customer']
    .flatMap(availableYearsForPage)
    .filter((v, i, a) => a.indexOf(v) === i)
    .sort((a, b) => a - b);
const ALL_FILTER_CONTINENTS = availableContinentsForPage('page-map');

// ============================================================
// FILTER PANEL
// ============================================================
function setupFilterPanel() {
    const toggle = document.getElementById('filter-toggle');
    const overlay = document.getElementById('filter-overlay');
    const panel = document.getElementById('filter-panel');
    const closeBtn = document.getElementById('filter-close');
    const applyBtn = document.getElementById('filter-apply');
    const clearBtn = document.getElementById('filter-clear');

    toggle.addEventListener('click', () => {
        overlay.classList.add('active');
        panel.classList.add('active');
    });

    overlay.addEventListener('click', () => {
        overlay.classList.remove('active');
        panel.classList.remove('active');
    });

    closeBtn.addEventListener('click', () => {
        overlay.classList.remove('active');
        panel.classList.remove('active');
    });

    syncFilterPanelToPage();

    applyBtn.addEventListener('click', () => {
        overlay.classList.remove('active');
        panel.classList.remove('active');
        updateAllCharts();
    });

    clearBtn.addEventListener('click', () => {
        state.filters.years = [...ALL_FILTER_YEARS];
        state.filters.continents = [...ALL_FILTER_CONTINENTS];
        syncFilterPanelToPage();
    });
}

// Rebuild one filter group from the current page's available values.
// Checked state is derived from state.filters, so the selection persists
// across page switches; toggling only ever affects the values shown here.
function renderFilterCheckboxGroup(sectionId, className, values, selected, coerce) {
    const section = document.getElementById(sectionId);
    if (!section) return;
    const list = section.querySelector('.checkbox-list');
    if (!list) return;

    if (!values.length) {
        section.style.display = 'none';
        list.innerHTML = '';
        return;
    }
    section.style.display = '';

    const key = className === 'filter-year' ? 'years' : 'continents';
    list.innerHTML = '';

    const selectAll = document.createElement('label');
    selectAll.className = 'checkbox-item';
    const selectAllInput = document.createElement('input');
    selectAllInput.type = 'checkbox';
    selectAllInput.className = className;
    selectAllInput.value = 'all';
    selectAllInput.checked = values.every(v => selected.includes(v));
    selectAll.appendChild(selectAllInput);
    selectAll.appendChild(document.createTextNode(' Select all'));
    list.appendChild(selectAll);

    const inputs = values.map(v => {
        const label = document.createElement('label');
        label.className = 'checkbox-item';
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.className = className;
        input.value = String(v);
        input.checked = selected.includes(v);
        label.appendChild(input);
        label.appendChild(document.createTextNode(' ' + v));
        list.appendChild(label);
        return input;
    });

    selectAllInput.addEventListener('change', () => {
        const checked = selectAllInput.checked;
        const set = new Set(state.filters[key]);
        values.forEach(v => { if (checked) set.add(v); else set.delete(v); });
        state.filters[key] = [...set];
        inputs.forEach(i => { i.checked = checked; });
    });

    inputs.forEach(input => {
        input.addEventListener('change', () => {
            selectAllInput.checked = inputs.every(i => i.checked);
            const set = new Set(state.filters[key]);
            const v = coerce(input.value);
            if (input.checked) set.add(v); else set.delete(v);
            state.filters[key] = [...set];
        });
    });
}

function syncFilterPanelToPage() {
    const years = availableYearsForPage(state.currentPage);
    const continents = availableContinentsForPage(state.currentPage);
    renderFilterCheckboxGroup('filter-year-section', 'filter-year', years, state.filters.years, Number);
    renderFilterCheckboxGroup('filter-continent-section', 'filter-continent', continents, state.filters.continents, String);
    const note = document.getElementById('filter-empty-note');
    if (note) note.style.display = (!years.length && !continents.length) ? '' : 'none';
}

function updateAllCharts() {
    // Re-render charts on the visible page that depend on filters
    switch (state.currentPage) {
        case 'page-executive':
            renderRevenueTrending();
            renderCategoryOrders();
            break;
        case 'page-map':
            renderMap();
            break;
        case 'page-product':
            renderProfitChart();
            renderOrdersChart();
            break;
        case 'page-customer':
            renderRevenuePerCustomer();
            break;
        case 'page-tooltip':
            renderSubcategoryChart();
            break;
        case 'page-financial-nav':
            if (state.currentFinancialSubpage === 'financial-revenue-insights') {
                updateRevenueInsights();
            }
            break;
    }
}

// ============================================================
// FINANCIAL NAVIGATION
// ============================================================
function setupFinancialNavigation() {
    // Tile click handlers (event delegation)
    const tilesContainer = document.getElementById('financial-tiles');
    if (tilesContainer) {
        tilesContainer.addEventListener('click', (e) => {
            const tile = e.target.closest('.financial-tile');
            if (!tile) return;
            const sp = tile.dataset.subpage;
            const subpageId = document.getElementById(sp)
                ? sp : (document.getElementById('financial-' + sp) ? 'financial-' + sp : sp);
            switchFinancialSubpage(subpageId);
        });
    }

    // Back buttons
    document.querySelectorAll('[id^="back-to-nav"]').forEach(btn => {
        btn.addEventListener('click', () => {
            switchFinancialSubpage(null);
        });
    });

    // Render all financial sub-page content
    renderIncomeStatement();
    renderFinancialDetails();
    renderBalanceSheet();
    renderCashFlow();
    renderAgedTrial();
    renderRevenueInsights();
    setupRevenueInsightsInteractions();
}

// ============================================================
// YEAR BUTTONS (Financial)
// ============================================================
function renderYearButtons(containerId, years, onYearChange) {
    const container = $(containerId);
    if (!container) return;
    container.innerHTML = '';
    years.forEach(y => {
        const btn = document.createElement('button');
        btn.className = 'year-btn';
        btn.textContent = y;
        btn.dataset.year = y;
        btn.classList.toggle('active', y === state.financialYear);
        btn.addEventListener('click', () => {
            document.querySelectorAll(`#${containerId} .year-btn`).forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            onYearChange(y);
        });
        container.appendChild(btn);
    });
}

function renderToggleButtons(containerId, views, onViewChange) {
    const container = $(containerId);
    if (!container) return;
    container.innerHTML = '';
    views.forEach(v => {
        const btn = document.createElement('button');
        btn.className = 'toggle-btn';
        btn.textContent = v;
        btn.dataset.view = v;
        btn.classList.toggle('active', v === state.financialView);
        btn.addEventListener('click', () => {
            document.querySelectorAll(`#${containerId} .toggle-btn`).forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            onViewChange(v);
        });
        container.appendChild(btn);
    });
}

// ============================================================
// RENDER ALL PAGES
// ============================================================
function renderAllPages() {
    renderExecutive();
    renderMap();
    renderProduct();
    renderCustomer();
    renderTooltip();
    renderFinancialNav();
}

// Financial sub-pages are rendered by setupFinancialNavigation()

// ============================================================
// PAGE 1: EXECUTIVE DASHBOARD
// ============================================================
function renderExecutive() {
    renderExecutiveKPIs();
    renderRevenueTrending();
    renderCategoryOrders();
    renderMonthlyKpiCards();
    renderTop10Products();
}

function renderExecutiveKPIs() {
    const container = $('executive-header-kpis');
    if (!container) return;
    const k = EXECUTIVE_DATA.kpis;
    container.innerHTML = `
        <div class="kpi-card"><div class="kpi-value">${k.revenue.display}</div><div class="kpi-label">${k.revenue.label}</div></div>
        <div class="kpi-card"><div class="kpi-value">${k.profits.display}</div><div class="kpi-label">${k.profits.label}</div></div>
        <div class="kpi-card"><div class="kpi-value">${k.orders.display}</div><div class="kpi-label">${k.orders.label}</div></div>
        <div class="kpi-card"><div class="kpi-value">${k.returnRate.display}</div><div class="kpi-label">${k.returnRate.label}</div></div>
    `;
}

function renderRevenueTrending() {
    const ctx = $('revenueTrendingChart');
    if (!ctx) return;

    // Apply year filter
    const data = EXECUTIVE_DATA.revenueTrending;
    let labels = data.months.map((m, i) => `${m} ${data.years[i]}`);
    let values = [...data.values];

    // Filter by selected years
    const filtered = data.months.map((m, i) => ({ month: m, year: data.years[i], value: data.values[i] }))
        .filter(d => state.filters.years.includes(parseInt(d.year)));
    labels = filtered.map(d => `${d.month} ${d.year}`);
    values = filtered.map(d => d.value);

    const trendValues = linearRegression(values);

    if (charts.revenueTrending) charts.revenueTrending.destroy();
    charts.revenueTrending = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Revenue',
                    data: values,
                    borderColor: '#4a4a4a',
                    backgroundColor: 'rgba(74,74,74,0.1)',
                    borderWidth: 2,
                    tension: 0.3,
                    fill: true,
                    pointRadius: 0,
                    pointHoverRadius: 5
                },
                {
                    label: 'Trend',
                    data: trendValues,
                    borderColor: '#5bbcc4',
                    borderWidth: 2,
                    borderDash: [8, 4],
                    pointRadius: 0,
                    fill: false,
                    tension: 0.3
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: '#666', font: { size: 12 } }
                },
                tooltip: {
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    titleColor: '#fff',
                    bodyColor: '#ccc',
                    borderColor: '#555',
                    padding: 8,
                    cornerRadius: 6
                }
            },
            scales: {
                x: {
                    grid: { color: '#e0e0e0', drawBorder: false },
                    ticks: { color: '#666', font: { size: 10 }, maxRotation: 0, autoSkip: true, maxTicksLimit: 8 }
                },
                y: {
                    max: 2000000,
                    min: 0,
                    grid: { color: '#e0e0e0', drawBorder: false },
                    ticks: {
                        color: '#666', font: { size: 10 },
                        callback: (v) => '$' + (v / 1000000).toFixed(1) + 'M'
                    }
                }
            }
        }
    });
    ctx.style.height = '300px';
}

function renderCategoryOrders() {
    const ctx = $('categoryOrdersChart');
    if (!ctx) return;
    const data = EXECUTIVE_DATA.categoryOrders.data;

    if (charts.categoryOrders) charts.categoryOrders.destroy();
    charts.categoryOrders = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map(d => d.category),
            datasets: [{
                label: 'Orders',
                data: data.map(d => d.orders),
                backgroundColor: data.map(d => d.color),
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    titleColor: '#fff', bodyColor: '#ccc',
                    borderColor: '#555', padding: 8, cornerRadius: 6
                }
            },
            scales: {
                x: {
                    grid: { color: '#e0e0e0', drawBorder: false },
                    ticks: { color: '#666', font: { size: 11 } }
                },
                y: {
                    grid: { display: false },
                    ticks: { color: '#666', font: { size: 11 } }
                }
            }
        }
    });
    ctx.style.height = '200px';
}

function renderMonthlyKpiCards() {
    const container = $('chart-monthly-kpis');
    if (!container) return;
    const cards = EXECUTIVE_DATA.monthlyKpiCards.cards;
    container.innerHTML = '';
    cards.forEach((card, i) => {
        const cardEl = document.createElement('div');
        cardEl.className = 'kpi-spark-card';
        cardEl.innerHTML = `
            <div style="display:flex; align-items:center; gap:8px; flex:1;">
                <div class="spark-content">
                    <div class="spark-title">${card.title}</div>
                    <div class="spark-value">${card.value}</div>
                    <div class="spark-prev">vs ${card.prevValue} ${card.change}</div>
                </div>
                <canvas id="spark-${i}" style="width:60px;height:30px;"></canvas>
            </div>
        `;
        container.appendChild(cardEl);
    });

    // Destroy old charts
    for (let i = 0; i < 3; i++) {
        const key = `sparkline-${i}`;
        if (charts[key]) charts[key].destroy();
    }

    // Create sparkline charts
    cards.forEach((card, i) => {
        const ctx = $(`spark-${i}`);
        if (!ctx) return;
        charts[`sparkline-${i}`] = new Chart(ctx, {
            type: 'line',
            data: {
                labels: card.sparkline.map((_, i) => i),
                datasets: [{
                    data: card.sparkline,
                    borderColor: card.sparklineColor,
                    borderWidth: 2,
                    fill: false,
                    pointRadius: 0,
                    tension: 0.3
                }]
            },
            options: {
                responsive: false,
                maintainAspectRatio: false,
                plugins: { legend: { display: false }, tooltip: { enabled: false } },
                scales: { x: { display: false }, y: { display: false } },
                elements: { point: { radius: 0 } }
            }
        });
    });
}

function renderTop10Products() {
    const tbody = $('top-products-body');
    if (!tbody) return;
    const maxOrders = Math.max(...EXECUTIVE_DATA.top10Products.data.map(p => p.orders));

    tbody.innerHTML = '';
    EXECUTIVE_DATA.top10Products.data.forEach(p => {
        const barWidth = (p.orders / maxOrders) * 100;
        let heatClass = 'heatmap-low';
        if (p.returnPct > 2.5) heatClass = 'heatmap-high';
        else if (p.returnPct > 1.8) heatClass = 'heatmap-mid';

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${p.product}</td>
            <td>
                <div class="data-bar-container" style="width:120px;">
                    <div class="data-bar teal" style="width:${barWidth}%;">
                        ${p.orders.toLocaleString()}
                    </div>
                </div>
            </td>
            <td>${formatCurrencyShort(p.revenue)}</td>
            <td><span class="return-heatmap ${heatClass}">${p.returnPct}%</span></td>
        `;
        tbody.appendChild(tr);
    });
}

// ============================================================
// PAGE 2: MAP VISUALIZATION
// ============================================================
function renderMap() {
    const container = $('world-map');
    if (!container) return;

    // Clear previous content
    container.innerHTML = '';

    // Create SVG world map
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('viewBox', '0 0 1000 500');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '500');

    // Background
    const bg = document.createElementNS(svgNS, 'rect');
    bg.setAttribute('x', '0'); bg.setAttribute('y', '0');
    bg.setAttribute('width', '1000'); bg.setAttribute('height', '500');
    bg.setAttribute('fill', '#2a2a2a');
    svg.appendChild(bg);

    // Graticule (grid lines)
    const graticuleGroup = document.createElementNS(svgNS, 'g');
    graticuleGroup.setAttribute('stroke', '#3a3a3a');
    graticuleGroup.setAttribute('stroke-width', '0.5');
    for (let lng = -180; lng <= 180; lng += 30) {
        const x = (lng + 180) * 1000 / 360;
        const line = document.createElementNS(svgNS, 'line');
        line.setAttribute('x1', x); line.setAttribute('y1', '0');
        line.setAttribute('x2', x); line.setAttribute('y2', '500');
        graticuleGroup.appendChild(line);
    }
    for (let lat = -90; lat <= 90; lat += 30) {
        const y = (90 - lat) * 500 / 180;
        const line = document.createElementNS(svgNS, 'line');
        line.setAttribute('x1', '0'); line.setAttribute('y1', y);
        line.setAttribute('x2', '1000'); line.setAttribute('y2', y);
        graticuleGroup.appendChild(line);
    }
    svg.appendChild(graticuleGroup);

    // Simplified continent paths (equirectangular projection, 1000x500)
    const continents = [
        // North America
        "M 80,230 Q 120,200 180,180 Q 240,160 300,190 Q 330,220 310,280 Q 280,320 240,330 Q 200,340 160,320 Q 120,290 80,250 Z",
        // South America
        "M 500,330 Q 520,310 540,320 Q 560,350 540,380 Q 510,390 490,370 Q 500,350 500,330 Z",
        // Europe
        "M 510,150 L 530,140 L 550,160 L 540,170 L 520,180 L 505,170 Z",
        // Africa
        "M 560,230 Q 580,220 600,240 Q 610,280 590,320 Q 570,340 550,320 Q 560,280 560,230 Z",
        // Asia
        "M 650,100 Q 850,80 920,200 Q 880,240 820,280 Q 760,300 700,310 Q 660,300 650,260 Q 640,180 650,100 Z",
        // Australia / Oceania
        "M 840,370 Q 870,365 880,380 Q 860,400 820,395 Q 830,380 840,370 Z",
        // Greenland (optional)
        "M 280,80 Q 310,70 330,90 Q 320,100 300,100 Q 285,95 280,80 Z"
    ];

    const landGroup = document.createElementNS(svgNS, 'g');
    landGroup.setAttribute('fill', '#3a5a3a');
    landGroup.setAttribute('stroke', '#4a6a4a');
    landGroup.setAttribute('stroke-width', '0.5');
    continents.forEach(path => {
        const p = document.createElementNS(svgNS, 'path');
        p.setAttribute('d', path);
        landGroup.appendChild(p);
    });
    svg.appendChild(landGroup);

    // Ocean labels
    const oceanLabels = [
        { text: "ATLANTIC", x: 350, y: 260 },
        { text: "PACIFIC", x: 800, y: 280 },
        { text: "INDIAN", x: 750, y: 340 }
    ];
    oceanLabels.forEach(ol => {
        const text = document.createElementNS(svgNS, 'text');
        text.setAttribute('x', ol.x);
        text.setAttribute('y', ol.y);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('fill', 'rgba(160,160,160,0.5)');
        text.setAttribute('font-size', '14');
        text.setAttribute('font-family', 'Segoe UI');
        text.textContent = ol.text;
        svg.appendChild(text);
    });

    // Country bubbles
    const validContinents = state.filters.continents;
    const allContinents = MAP_DATA.regions;

    let countriesToShow = MAP_DATA.countries;
    if (state.activeMapRegion !== 'all') {
        countriesToShow = MAP_DATA.countries.filter(c =>
            allContinents[state.activeMapRegion]?.includes(c.name)
        );
    }

    // Filter by global continent filter
    countriesToShow = countriesToShow.filter(c =>
        validContinents.includes(c.continent)
    );

    countriesToShow.forEach(country => {
        const x = (country.lng + 180) * 1000 / 360;
        const y = (90 - country.lat) * 500 / 180;

        const bubble = document.createElementNS(svgNS, 'circle');
        bubble.setAttribute('cx', x);
        bubble.setAttribute('cy', y);
        bubble.setAttribute('r', country.size / 2);
        bubble.setAttribute('fill', 'rgba(91, 188, 196, 0.6)');
        bubble.setAttribute('stroke', 'rgba(255,255,255,0.3)');
        bubble.setAttribute('stroke-width', '2');
        svg.appendChild(bubble);

        const label = document.createElementNS(svgNS, 'text');
        label.setAttribute('x', x);
        label.setAttribute('y', y + country.size / 2 + 20);
        label.setAttribute('text-anchor', 'middle');
        label.setAttribute('fill', '#fff');
        label.setAttribute('font-size', Math.max(10, country.size / 2.5));
        label.setAttribute('font-family', 'Segoe UI');
        label.setAttribute('font-weight', '600');
        label.textContent = country.name;
        svg.appendChild(label);

        const value = document.createElementNS(svgNS, 'text');
        value.setAttribute('x', x);
        value.setAttribute('y', y + country.size / 2 + 36);
        value.setAttribute('text-anchor', 'middle');
        value.setAttribute('fill', 'rgba(160,160,160,0.8)');
        value.setAttribute('font-size', Math.max(9, country.size / 3));
        value.setAttribute('font-family', 'Segoe UI');
        value.textContent = formatCurrencyShort(country.revenue);
        svg.appendChild(value);

        // Interactive hover effect
        bubble.addEventListener('mouseenter', () => {
            bubble.setAttribute('r', country.size / 2 + 3);
            bubble.setAttribute('fill', 'rgba(91, 188, 196, 0.9)');
        });
        bubble.addEventListener('mouseleave', () => {
            bubble.setAttribute('r', country.size / 2);
            bubble.setAttribute('fill', 'rgba(91, 188, 196, 0.6)');
        });
    });

    container.appendChild(svg);

    // Update map filter buttons
    const mapBtns = document.querySelectorAll('.map-btn');
    mapBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.region === state.activeMapRegion || btn.textContent === 'Select all');
    });
}

function setupMapFilters() {
    const btns = document.querySelectorAll('.map-btn');
    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            state.activeMapRegion = btn.dataset.region;
            btns.forEach(b => b.classList.toggle('active', b === btn));
            renderMap();
        });
    });
}

// ============================================================
// PAGE 3: PRODUCT DASHBOARD
// ============================================================
function renderProduct() {
    renderProductKPIs();
    renderGauges();
    renderProfitChart();
    renderOrdersChart();
}

function renderProductKPIs() {
    const container = $('product-header-kpis');
    if (!container) return;
    container.innerHTML = `
        <div class="kpi-card"><div class="kpi-value">$1.23M</div><div class="kpi-label">Monthly Revenue</div></div>
        <div class="kpi-card"><div class="kpi-value">2,146</div><div class="kpi-label">Monthly Orders</div></div>
        <div class="kpi-card"><div class="kpi-value">166</div><div class="kpi-label">Monthly Returns</div></div>
    `;
}

function renderGauges() {
    const gaugeIds = [
        { label: "order", progress: "gauge-order-progress", valueEl: "gauge-order-value" },
        { label: "revenue", progress: "gauge-revenue-progress", valueEl: "gauge-revenue-value" },
        { label: "profit", progress: "gauge-profit-progress", valueEl: "gauge-profit-value" }
    ];

    PRODUCT_DATA.gauges.forEach((gauge, i) => {
        const ids = gaugeIds[i];
        if (!ids) return;
        const progress = $(ids.progress);
        const valueEl = $(ids.valueEl);
        if (!progress || !valueEl) return;

        const pct = (gauge.value / gauge.max) * 100;
        progress.style.background = `conic-gradient(from 180deg, var(--accent-cyan), var(--accent-teal) ${pct}%, var(--bg-secondary) ${pct}%)`;
        valueEl.textContent = gauge.unit === '$' ? `$${gauge.value}` : gauge.value.toString();
    });
}

const METRIC_META = {
    'Profit': { line: '#5bbcc4', light: '#1fd1c8', fill: 'rgba(91,188,196,0.1)' },
    'Revenue': { line: '#38a174', light: '#2ea848', fill: 'rgba(56,161,116,0.1)' },
    'Returns': { line: '#f78da7', light: '#f46c76', fill: 'rgba(247,141,167,0.1)' },
    'Return Rate': { line: '#ffd93d', light: '#ffc107', fill: 'rgba(255,217,61,0.1)' }
};

function getProfitWeekData() {
    const pd = PRODUCT_DATA.profitData;
    const od = PRODUCT_DATA.ordersData;
    const weeks = pd.weeks.slice(0, 45);
    const orders = od.weeks.slice(0, 45);
    const whatIfFactor = 1 + state.whatIfValue;
    const yearStrs = state.filters.years.map(y => String(y));

    return weeks.map((w, i) => {
        const wkYear = w.week.split('-')[0];
        if (!yearStrs.includes(wkYear)) return null;
        const orderCount = orders[i] ? orders[i].orders : 50;
        const returnsCount = Math.round(orderCount * 0.02);
        const returnRatePct = orderCount > 0 ? ((returnsCount / orderCount) * 100) : 0;
        return {
            week: w.week,
            totalProfit: w.totalProfit,
            adjustedProfit: Math.round(w.adjustedProfit * whatIfFactor),
            revenue: Math.round(w.totalProfit * 2.5),
            returns: returnsCount,
            returnRate: returnRatePct
        };
    }).filter(d => d !== null);
}

function buildProfitDatasets() {
    const weekData = getProfitWeekData();
    const datasets = [];
    const metricOrder = ['Profit', 'Revenue', 'Returns', 'Return Rate'];
    const colors = { Profit: METRIC_META.Profit, Revenue: METRIC_META.Revenue, Returns: METRIC_META.Returns, 'Return Rate': METRIC_META['Return Rate'] };

    metricOrder.forEach(metric => {
        if (state.selectedMetrics.includes(metric)) {
            if (metric === 'Profit') {
                datasets.push({
                    label: 'Total Profit',
                    data: weekData.map(w => w.totalProfit),
                    borderColor: colors.Profit.line,
                    backgroundColor: colors.Profit.fill,
                    borderWidth: 2, fill: false, tension: 0.3, pointRadius: 3
                });
                datasets.push({
                    label: 'Adjusted Profit',
                    data: weekData.map(w => w.adjustedProfit),
                    borderColor: colors.Profit.light,
                    borderWidth: 2, borderDash: [5, 5], fill: false, tension: 0.3, pointRadius: 3
                });
            } else if (metric === 'Revenue') {
                datasets.push({
                    label: 'Revenue',
                    data: weekData.map(w => w.revenue),
                    borderColor: colors.Revenue.line,
                    backgroundColor: colors.Revenue.fill,
                    borderWidth: 2, fill: false, tension: 0.3, pointRadius: 3
                });
            } else if (metric === 'Returns') {
                datasets.push({
                    label: 'Returns',
                    data: weekData.map(w => w.returns),
                    borderColor: colors.Returns.line,
                    backgroundColor: colors.Returns.fill,
                    borderWidth: 2, fill: false, tension: 0.3, pointRadius: 3
                });
            } else if (metric === 'Return Rate') {
                datasets.push({
                    label: 'Return Rate (%)',
                    data: weekData.map(w => w.returnRate.toFixed(2)),
                    borderColor: colors['Return Rate'].line,
                    backgroundColor: colors['Return Rate'].fill,
                    borderWidth: 2, fill: false, tension: 0.3, pointRadius: 3
                });
            }
        }
    });
    return datasets;
}

function renderProfitChart() {
    const ctx = $('profitChart');
    if (!ctx) return;
    const weekData = getProfitWeekData();
    const labels = weekData.map(w => w.week);

    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { labels: { color: '#ccc', font: { size: 11 } } },
            tooltip: {
                backgroundColor: 'rgba(0,0,0,0.8)', titleColor: '#fff', bodyColor: '#ccc',
                borderColor: '#555', padding: 8, cornerRadius: 6
            }
        },
        scales: {
            x: { grid: { color: '#3d3d3d', drawBorder: false }, ticks: { color: '#999', font: { size: 9 } } },
            y: { grid: { color: '#3d3d3d', drawBorder: false }, ticks: { color: '#999', font: { size: 9 } } }
        }
    };

    if (!charts.profit) {
        charts.profit = new Chart(ctx, {
            type: 'line',
            data: { labels: labels, datasets: buildProfitDatasets() },
            options: commonOptions
        });
    } else {
        charts.profit.data.labels = labels;
        charts.profit.data.datasets = buildProfitDatasets();
        charts.profit.update();
    }
    ctx.style.height = '250px';
}

function renderOrdersChart() {
    const ctx = $('ordersAreaChart');
    if (!ctx) return;
    const data = PRODUCT_DATA.ordersData;
    let weeks = data.weeks.slice(0, 45);

    const yearStrs = state.filters.years.map(y => String(y));
    weeks = weeks.filter(w => yearStrs.includes((w.week || w.month || '').split('-')[0]));

    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(0,0,0,0.8)', titleColor: '#fff', bodyColor: '#ccc',
                borderColor: '#555', padding: 8, cornerRadius: 6
            }
        },
        scales: {
            x: { grid: { color: '#3d3d3d', drawBorder: false }, ticks: { color: '#999', font: { size: 9 } } },
            y: { grid: { color: '#3d3d3d', drawBorder: false }, ticks: { color: '#999', font: { size: 9 } } }
        }
    };

    const showOrder = state.selectedMetrics.includes('Order');
    const datasets = [{
        label: 'Orders',
        data: weeks.map(w => w.orders),
        backgroundColor: 'rgba(91,188,196,0.7)',
        borderColor: 'rgba(91,188,196,0.5)',
        borderWidth: 1,
        hidden: !showOrder
    }];

    if (!charts.orders) {
        charts.orders = new Chart(ctx, {
            type: 'bar',
            data: { labels: weeks.map(w => w.week || w.month), datasets },
            options: commonOptions
        });
    } else {
        charts.orders.data.labels = weeks.map(w => w.week || w.month);
        charts.orders.data.datasets = datasets;
        charts.orders.update();
    }
    ctx.style.height = '250px';
}

function updateProductCharts() {
    renderProfitChart();
    renderOrdersChart();
}

function setupProductSliders() {
    const whatIfSlider = $('whatIfSlider');
    const whatIfValue = $('whatif-value');
    if (whatIfSlider) {
        whatIfSlider.addEventListener('input', (e) => {
            state.whatIfValue = parseInt(e.target.value) / 100;
            if (whatIfValue) whatIfValue.textContent = state.whatIfValue.toFixed(2);
            renderProfitChart();
        });
    }

    const profitSlider = $('profitSlider');
    if (profitSlider) {
        profitSlider.addEventListener('input', () => {
            renderProfitChart();
        });
    }

    const ordersSlider = $('ordersSlider');
    if (ordersSlider) {
        ordersSlider.addEventListener('input', () => {
            renderOrdersChart();
        });
    }

    // Metric checkbox event listeners
    document.querySelectorAll('.metric-check').forEach(cb => {
        cb.addEventListener('change', () => {
            const metric = cb.value;
            if (cb.checked) {
                if (!state.selectedMetrics.includes(metric)) {
                    state.selectedMetrics.push(metric);
                }
            } else {
                state.selectedMetrics = state.selectedMetrics.filter(m => m !== metric);
            }
            updateProductCharts();
        });
    });
}

// ============================================================
// PAGE 4: CUSTOMER DASHBOARD
// ============================================================
function renderCustomer() {
    renderCustomerKPIs();
    renderDonutCharts();
    renderRevenuePerCustomer();
    renderCustomerTable();
}

function renderCustomerKPIs() {
    const container = $('customer-kpis');
    if (!container) return;
    container.innerHTML = '';
    CUSTOMER_DATA.kpis.forEach(kpi => {
        const card = document.createElement('div');
        card.className = 'kpi-card';
        card.innerHTML = `<div class="kpi-value">${kpi.value}</div><div class="kpi-label">${kpi.label}</div>`;
        container.appendChild(card);
    });
}

function renderDonutCharts() {
    const incomeCtx = $('incomeDonutChart');
    const occupationCtx = $('occupationDonutChart');

    if (incomeCtx) {
        const d = CUSTOMER_DATA.incomeDonut;
        if (charts.incomeDonut) charts.incomeDonut.destroy();
        charts.incomeDonut = new Chart(incomeCtx, {
            type: 'doughnut',
            data: {
                labels: d.data.map(i => i.label),
                datasets: [{
                    data: d.data.map(i => i.value),
                    backgroundColor: d.colors,
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '60%',
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        titleColor: '#fff', bodyColor: '#ccc',
                        borderColor: '#555', padding: 8, cornerRadius: 6
                    }
                }
            }
        });
    }

    if (occupationCtx) {
        const d = CUSTOMER_DATA.occupationDonut;
        if (charts.occupationDonut) charts.occupationDonut.destroy();
        charts.occupationDonut = new Chart(occupationCtx, {
            type: 'doughnut',
            data: {
                labels: d.data.map(i => i.label),
                datasets: [{
                    data: d.data.map(i => i.value),
                    backgroundColor: d.colors,
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '60%',
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        titleColor: '#fff', bodyColor: '#ccc',
                        borderColor: '#555', padding: 8, cornerRadius: 6
                    }
                }
            }
        });
    }

    // Render legends
    ['income-legend', 'occupation-legend'].forEach((legendId, di) => {
        const legend = $(legendId);
        if (!legend) return;
        const d = di === 0 ? CUSTOMER_DATA.incomeDonut : CUSTOMER_DATA.occupationDonut;
        legend.innerHTML = '';
        d.data.forEach((item, i) => {
            const itemEl = document.createElement('div');
            itemEl.className = 'donut-legend-item';
            itemEl.innerHTML = `<div class="donut-legend-swatch" style="background:${d.colors[i]};border-radius:3px;"></div>${item.label} ${item.value.toLocaleString()}`;
            legend.appendChild(itemEl);
        });
    });
}

function renderRevenuePerCustomer() {
    const ctx = $('revenuePerCustomerChart');
    if (!ctx) return;
    const d = CUSTOMER_DATA.revenuePerCustomer;

    const yearStrs = state.filters.years.map(y => String(y));

    let filtered = [];
    for (let i = 0; i < d.months.length; i++) {
        if (!yearStrs.includes(String(d.years[i]))) continue;
        filtered.push({ month: d.months[i], year: d.years[i], value: d.values[i] });
    }

    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { labels: { color: '#ccc', font: { size: 11 } } },
            tooltip: {
                backgroundColor: 'rgba(0,0,0,0.8)', titleColor: '#fff', bodyColor: '#ccc',
                borderColor: '#555', padding: 8, cornerRadius: 6
            }
        },
        scales: {
            x: { grid: { color: '#3d3d3d', drawBorder: false }, ticks: { color: '#999', font: { size: 10 } } },
            y: { grid: { color: '#3d3d3d', drawBorder: false }, ticks: { color: '#999', font: { size: 10 } } }
        }
    };

    if (!charts.revenuePerCustomer) {
        charts.revenuePerCustomer = new Chart(ctx, {
            type: 'line',
            data: {
                labels: filtered.map(d => `${d.month} ${d.year}`),
                datasets: [{
                    label: 'Revenue Per Customer',
                    data: filtered.map(d => d.value),
                    borderColor: '#5bbcc4',
                    backgroundColor: 'rgba(91,188,196,0.1)',
                    borderWidth: 2, tension: 0.3, fill: true,
                    pointRadius: 3, pointHoverRadius: 5
                }]
            },
            options: commonOptions
        });
    } else {
        charts.revenuePerCustomer.data.labels = filtered.map(d => `${d.month} ${d.year}`);
        charts.revenuePerCustomer.data.datasets[0].data = filtered.map(d => d.value);
        charts.revenuePerCustomer.update();
    }
}

function renderCustomerTable() {
    const tbody = $('top-customers-body');
    if (!tbody) return;
    const maxRev = Math.max(...CUSTOMER_TABLE_DATA.map(c => c.revenue));
    tbody.innerHTML = '';
    CUSTOMER_TABLE_DATA.forEach((c, i) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${i + 1}</td>
            <td>${c.key}</td>
            <td>
                <div class="customer-name-col">
                    <div class="customer-rank">${i + 1}</div>
                    <span>${c.name}</span>
                </div>
            </td>
            <td>${c.orders}</td>
            <td>
                <div class="data-bar-container" style="width:100px;">
                    <div class="data-bar blue" style="width:${(c.revenue / maxRev) * 100}%;">$${c.revenue.toLocaleString()}</div>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function setupCustomerSlider() {
    const slider = $('yearRangeSlider');
    const display = $('year-display');
    if (slider && display) {
        slider.addEventListener('input', (e) => {
            const val = parseInt(e.target.value);
            display.textContent = `2021 - ${val}`;
        });
    }
}

// ============================================================
// PAGE 5: MANUAL TOOLTIP
// ============================================================
function renderTooltip() {
    renderSubcategoryChart();
}

function renderSubcategoryChart() {
    const ctx = $('subcategoryBarChart');
    if (!ctx) return;
    const d = TOOLTIP_DATA.subcategoryOrders.data;

    if (charts.subcategory) charts.subcategory.destroy();
    charts.subcategory = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: d.map(i => i.label),
            datasets: [{
                data: d.map(i => i.value),
                backgroundColor: d.map(i => i.color),
                borderColor: d.map(i => i.color.replace('0.7', '1')),
                borderWidth: 1,
                barPercentage: 0.6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
           plugins: {
                legend: { display: false },
                tooltip: { enabled: false }
            },
            scales: {
                x: { grid: { color: '#3d3d3d', display: false }, ticks: { display: false } },
                y: { grid: { display: false }, ticks: { color: '#999', font: { size: 12 } } }
            },
            onHover: function(evt, elements, chart) {
                if (!chart || !elements || !elements.length) return;
                const idx = elements[0].index;
                const item = d[idx];
                showManualTooltip(chart, evt, item);
            }
        }
    });
    ctx.style.height = '250px';
}

function showManualTooltip(chart, evt, item) {
    const tooltip = $('manual-tooltip');
    const canvas = chart && chart.canvas;
    if (!tooltip || !canvas || !evt) return;
    const rect = canvas.getBoundingClientRect();
    const pointer = evt.native || evt;
    const mouseX = pointer.clientX != null ? pointer.clientX : evt.x;
    const mouseY = pointer.clientY != null ? pointer.clientY : evt.y;
    tooltip.style.left = (mouseX + 16) + 'px';
    tooltip.style.top = (mouseY + 16) + 'px';
    tooltip.classList.add('show');
}

function setupTooltipHover() {
    const chartEl = document.getElementById('subcategoryBarChart');
    if (!chartEl) return;
    chartEl.addEventListener('mousemove', (evt) => {
        const tooltip = $('manual-tooltip');
        if (!tooltip) return;
        tooltip.style.left = (evt.clientX + 16) + 'px';
        tooltip.style.top = (evt.clientY + 16) + 'px';
    });
    chartEl.addEventListener('mouseleave', () => {
        const tooltip = $('manual-tooltip');
        if (tooltip) tooltip.classList.remove('show');
    });
}

// ============================================================
// PAGE 6: FINANCIAL REPORT
// ============================================================
function renderFinancialNav() {
    const container = $('financial-tiles');
    if (!container) return;
    container.innerHTML = '';
    FINANCIAL_DATA.navigationTiles.forEach(tile => {
        const tileEl = document.createElement('div');
        tileEl.className = 'financial-tile';
        tileEl.dataset.subpage = tile.id;
        tileEl.style.display = 'flex';
        tileEl.style.flexDirection = 'column';
        tileEl.innerHTML = `
            <div class="tile-icon" style="font-size:48px; margin-bottom:12px;">${tile.icon}</div>
            <div class="tile-title">${tile.title}</div>
        `;
        container.appendChild(tileEl);
    });
}

function renderIncomeStatement() {
    renderYearButtons('is-year-buttons', FINANCIAL_DATA.years, (year) => {
        state.financialYear = year;
        updateFinancialPages();
    });
    renderIncomeStatementTable();
    renderWaterfallChart('is-waterfall', FINANCIAL_DATA.incomeStatement.waterfall.bars);
    renderTyVsPyChart();
    renderMonthlyRevenueChart();
}

function renderTyVsPyChart() {
    const ctx = $('is-tyvsbar');
    if (!ctx) return;
    const d = FINANCIAL_DATA.incomeStatement.tyVsPyBar;
    if (charts.tyVsPy) charts.tyVsPy.destroy();
    charts.tyVsPy = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: d.labels,
            datasets: [{
                data: d.data,
                backgroundColor: d.color,
                barPercentage: 0.6
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: { legend: { display: false }, tooltip: { backgroundColor: 'rgba(0,0,0,0.8)', titleColor: '#fff', bodyColor: '#ccc', borderColor: '#555', padding: 6, cornerRadius: 4 } },
            scales: {
                x: { grid: { color: 'rgba(255,255,255,0.1)', drawBorder: false }, ticks: { color: '#999', font: { size: 10 } } },
                y: { grid: { display: false }, ticks: { color: '#ccc', font: { size: 11 } } }
            }
        }
    });
    ctx.style.height = '180px';
}

function renderMonthlyRevenueChart() {
    const ctx = $('is-monthly-revenue');
    if (!ctx) return;
    const d = FINANCIAL_DATA.incomeStatement.monthlyRevenue;
    if (charts.monthlyRevenue) charts.monthlyRevenue.destroy();
    charts.monthlyRevenue = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: d.months,
            datasets: d.channels.map(c => ({
                label: c.label, data: c.data, backgroundColor: c.color, borderColor: c.color, borderWidth: 1
            }))
        },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { color: '#ccc', font: { size: 10 } } },
                    tooltip: { backgroundColor: 'rgba(0,0,0,0.8)', titleColor: '#fff', bodyColor: '#ccc', borderColor: '#555', padding: 6, cornerRadius: 4 }
                },
                scales: {
                    x: { stacked: true, grid: { color: 'rgba(255,255,255,0.1)', drawBorder: false }, ticks: { color: '#999', font: { size: 10 } } },
                    y: { stacked: true, grid: { color: 'rgba(255,255,255,0.1)', drawBorder: false }, ticks: { color: '#999', font: { size: 10 } } }
                }
            }
    });
    ctx.style.height = '200px';
}

function renderIncomeStatementTable() {
    const table = $('is-table');
    if (!table) return;
    const yearData = FINANCIAL_DATA.incomeStatement.years[state.financialYear];
    if (!yearData) return;

    const prevYear = state.financialYear - 1;
    const prevData = FINANCIAL_DATA.incomeStatement.years[prevYear] || yearData;

    table.innerHTML = '';
    table.innerHTML += '<thead><tr><th style="text-align:left;">Summary</th><th>Selected Year Actuals</th><th>Previous Year Actuals</th><th>TY vs PY Actuals</th><th>TY vs PY %(</th></tr></thead>';

    const allRows = [
        ...yearData.revenues.map(r => ({ ...r, type: 'revenue' })),
        { label: "Total Revenues", value: yearData.totalRevenues, type: 'total-revenue' },
        ...yearData.cogs.map(r => ({ ...r, type: 'cogs' })),
        { label: "Total COGS", value: yearData.totalCOGS, type: 'total-cogs' },
        { label: "Total Gross Profit", value: yearData.grossProfit, type: 'gross-profit' },
        { label: "Gross Profit %", value: yearData.grossProfitPct, type: 'pct' },
        ...yearData.expenses.map(r => ({ ...r, type: 'expense' })),
        { label: "Total Expenses", value: yearData.totalExpenses, type: 'total-expenses' },
        { label: "Net Income", value: yearData.netIncome, type: 'net-income' }
    ];

    allRows.forEach(row => {
        const pyValue = getPYValue(prevData, row);
        const tyValue = row.value;
        const diff = pyValue !== null ? tyValue - pyValue : 0;
        const pctDiff = pyValue && pyValue !== 0 ? ((tyValue - pyValue) / pyValue) * 100 : 0;
        const isPositive = diff >= 0;
        const rowClass = row.type.includes('total') || row.type === 'net-income' ? 'row-total' :
                         row.type === 'gross-profit' ? 'row-section' :
                         row.type.includes('cogs') || row.type === 'total-expenses' ? '' : '';
        const sectionClass = row.type === 'gross-profit' || row.type === 'net-income' || row.type === 'total-revenue' || row.type === 'total-cogs' || row.type === 'total-expenses' ? 'row-section' : '';

        const formatVal = row.type === 'pct' ? `${tyValue}%` : formatCurrencyFull(tyValue);
        const formatPy = row.type === 'pct' ? `${pyValue !== null ? pyValue : '-'}%` : pyValue !== null ? formatCurrencyFull(pyValue) : '-';
        const formatDiff = formatCurrencyFull(diff);
        const formatPct = `${pctDiff.toFixed(1)}%`;

        // Build diverging bar
        const maxValue = Math.max(Math.abs(tyValue), Math.abs(pyValue), Math.abs(diff));
        const barWidth = maxValue > 0 ? (Math.abs(diff) / maxValue) * 80 : 0;
        const barColor = isPositive ? 'rgba(56,161,116,0.6)' : 'rgba(231,76,60,0.6)';

        let divergingBar = '';
        if (row.type !== 'pct' && row.label !== 'Gross Profit %') {
            if (diff !== 0) {
                divergingBar = `<div style="display:flex;align-items:center;gap:4px;">
                    <span style="min-width:100px;text-align:right;font-size:11px;color:var(--accent-cyan);">
                        ${formatDiff}
                    </span>
                    <div class="diverging-bar-container" style="flex:1;height:12px;">
                        <div class="diverging-bar ${isPositive ? 'diverging-positive' : 'diverging-negative'}" style="width:${barWidth}%;margin-left:${isPositive ? '0' : 'auto'};"></div>
                    </div>
                </div>`;
            } else {
                divergingBar = formatDiff;
            }
        } else {
            divergingBar = '-';
        }

        table.innerHTML += `<tr class="${sectionClass}">
            <td class="row-label" style="text-align:left;">${row.label}</td>
            <td>${formatVal}</td>
            <td>${formatPy}</td>
            <td>${row.type === 'pct' ? '-' : divergingBar}</td>
            <td class="${pctDiff >= 0 ? 'pct-positive' : 'pct-negative'}">${pctDiff.toFixed(2)}%</td>
        </tr>`;
    });
}

function getPYValue(data, row) {
    // Find matching row in previous year data
    const allPrev = [
        ...data.revenues, ...data.cogs, ...data.expenses,
        { label: "Total Revenues", value: data.totalRevenues },
        { label: "Total COGS", value: data.totalCOGS },
        { label: "Total Gross Profit", value: data.grossProfit },
        { label: "Total Expenses", value: data.totalExpenses },
        { label: "Net Income", value: data.netIncome }
    ];
    const match = allPrev.find(r => r.label === row.label);
    return match ? match.value : null;
}

function renderFinancialDetails() {
    renderToggleButtons('fd-toggles', FINANCIAL_DATA.financialDetails.views, (view) => {
        state.financialView = view;
        renderFdMatrix();
    });
    renderYearButtons('fd-year-buttons', FINANCIAL_DATA.years, (year) => {
        state.financialYear = year;
        updateFinancialPages();
    });
    renderFdMatrix();
    renderFdCharts();
}

function formatCellParen(value, isPercent) {
    if (isPercent) return value.toFixed(2) + '%';
    if (value < 0) return '(' + formatCurrencyFull(Math.abs(value)) + ')';
    return formatCurrencyFull(value);
}

// Growth rates for "vs Last Year" computation (per-row)
const FD_GROWTH_RATES = {
    'Distributor': 0.05, 'Export': 0.05, 'Wholesale': 0.05, 'Total Revenues': 0.05,
    'Commissions': 0.08, 'Materials': 0.06, 'Labor Burden': 0.05, 'Total COGS': 0.06,
    'Total Gross Profit': 0.05, 'Advertising': 0.10, 'Salaries & Wages': 0.04,
    'Depreciation': -0.03, 'Total Expenses': 0.05, 'Net Income': 0.06
};

function renderFdMatrix() {
    const table = $('fd-matrix');
    if (!table) return;
    const rows = FINANCIAL_DATA.financialDetails.matrixRows;
    const view = state.financialView;

    // Total Revenues annual value (for % to Revenue)
    const totalRevRow = rows.find(r => r.label === 'Total Revenues');
    const totalRevAnnual = totalRevRow ? totalRevRow.q1 + totalRevRow.q2 + totalRevRow.q3 + totalRevRow.q4 : 1;

    table.innerHTML = '<thead><tr><th style="text-align:left;">Summary</th>' +
        FINANCIAL_DATA.financialDetails.quarters.map(q => `<th>${q}</th>`).join('') +
        '</tr></thead><tbody>';

    rows.forEach(row => {
        const tyValues = [row.q1, row.q2, row.q3, row.q4, row.q1 + row.q2 + row.q3 + row.q4];
        const growth = FD_GROWTH_RATES[row.label] || 0.05;

        let displayValues;
        if (view === 'Actuals') {
            displayValues = [...tyValues];
        } else if (view === 'vs Last Year') {
            // TY - PY where PY = TY / (1 + growth)
            displayValues = tyValues.map(v => {
                const py = v / (1 + growth);
                return v - py;
            });
        } else { // % to Revenue
            displayValues = tyValues.map(v => (v / totalRevAnnual) * 100);
        }

        const isPct = view === '% to Revenue';
        table.innerHTML += `<tr>
            <td class="row-label" style="text-align:left;">${row.label}</td>
            ${displayValues.map(v => `<td>${formatCellParen(v, isPct)}</td>`).join('')}
        </tr>`;
    });
    table.innerHTML += '</tbody>';
}

function renderFdCharts() {
    const chartsData = FINANCIAL_DATA.financialDetails.monthlyCharts;
    const ctxs = ['fd-chart1', 'fd-chart2', 'fd-chart3'];
    chartsData.forEach((cd, i) => {
        const ctx = $(ctxs[i]);
        if (!ctx) return;
        if (charts[`fd-${i}`]) charts[`fd-${i}`].destroy();
        charts[`fd-${i}`] = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: cd.months,
                datasets: cd.series.map(s => ({
                    label: s.label, data: s.data, backgroundColor: s.color, borderColor: s.color,
                    borderWidth: 1, barPercentage: 0.7
                }))
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { color: '#ccc', font: { size: 10 } } },
                    tooltip: { backgroundColor: 'rgba(0,0,0,0.8)', titleColor: '#fff', bodyColor: '#ccc', borderColor: '#555', padding: 6, cornerRadius: 4 }
                },
                scales: {
                    x: { grid: { color: 'rgba(255,255,255,0.1)', drawBorder: false }, ticks: { color: '#999', font: { size: 9 } } },
                    y: { grid: { color: 'rgba(255,255,255,0.1)', drawBorder: false }, ticks: { color: '#999', font: { size: 9 } } }
                }
            }
        });
        ctx.style.height = '160px';
    });
}

function renderBalanceSheet() {
    renderYearButtons('bs-year-buttons', FINANCIAL_DATA.years, (year) => {
        state.financialYear = year;
        updateFinancialPages();
    });
    renderBsTable();
    renderBsRatios();
    renderWaterfallChart('bs-waterfall-assets', FINANCIAL_DATA.balanceSheet.waterfalls[0].bars);
    renderWaterfallChart('bs-waterfall-equity', FINANCIAL_DATA.balanceSheet.waterfalls[1].bars);
}

function renderBsTable() {
    const table = $('bs-table');
    if (!table) return;
    const yr = state.financialYear;
    const cols = [2015, 2016, 2017, 2018];
    table.innerHTML = '<thead><tr><th style="text-align:left;">Category</th>' +
        cols.map(y => `<th>${y}</th>`).join('') + '</tr></thead><tbody>';

    table.innerHTML += '<tr class="row-section"><td>ASSETS</td><td></td><td></td><td></td><td></td></tr>';
    FINANCIAL_DATA.balanceSheet.assetRows.forEach(row => {
        const indent = row.label.includes("Total") || row.label === "Total Assets" ? '' : '';
        table.innerHTML += `<tr class="${row.label.includes("Total") ? 'row-total' : ''}">
            <td class="row-label" style="text-align:left;">${indent}${row.label}</td>
            <td>${formatCurrencyFull(row.v2015)}</td><td>${formatCurrencyFull(row.v2016)}</td>
            <td>${formatCurrencyFull(row.v2017)}</td><td>${formatCurrencyFull(row.v2018)}</td>
        </tr>`;
    });

    table.innerHTML += '<tr class="row-section"><td>LIABILITIES AND EQUITY</td><td></td><td></td><td></td><td></td></tr>';
    FINANCIAL_DATA.balanceSheet.liabilityEquityRows.forEach(row => {
        table.innerHTML += `<tr class="${row.label === 'Total Liabilities' || row.label === 'Total Shareholders Equity' || row.label === 'Total Liabilities & Equity' ? 'row-total' : ''}">
            <td class="row-label" style="text-align:left;">${row.label}</td>
            <td>${formatCurrencyFull(row.v2015)}</td><td>${formatCurrencyFull(row.v2016)}</td>
            <td>${formatCurrencyFull(row.v2017)}</td><td>${formatCurrencyFull(row.v2018)}</td>
        </tr>`;
    });

    table.innerHTML += '</tbody>';
}

function renderBsRatios() {
    const table = $('bs-ratios');
    if (!table) return;
    const yrs = FINANCIAL_DATA.years;
    table.innerHTML = '<thead><tr><th>Ratio</th>' + yrs.map(y => `<th>${y}</th>`).join('') + '</tr></thead><tbody>';
    FINANCIAL_DATA.balanceSheet.ratios.forEach(row => {
        table.innerHTML += `<tr><td style="text-align:left;">${row.label}</td>
            <td>${row.v2015.toFixed(2)}</td><td>${row.v2016.toFixed(2)}</td>
            <td>${row.v2017.toFixed(2)}</td><td>${row.v2018.toFixed(2)}</td></tr>`;
    });
    table.innerHTML += '</tbody>';
}

function renderCashFlow() {
    renderYearButtons('cf-year-buttons', FINANCIAL_DATA.years, (year) => {
        state.financialYear = year;
        updateFinancialPages();
    });
    renderCfTables();
    renderSummaryCard();
    renderDonutPairs();
}

function renderCfTables() {
    const sections = FINANCIAL_DATA.cashFlow.sections;
    const containers = ['cf-ops-table', 'cf-inv-table', 'cf-fin-table'];
    const yr = state.financialYear;

    containers.forEach((id, i) => {
        const table = $(id);
        if (!table) return;
        const data = sections[i];
        table.innerHTML = '<thead><tr><th style="text-align:left;">Activity</th><th>' +
            FINANCIAL_DATA.years.map(y => `<th>${y}</th>`).join('') + '</tr></thead><tbody>';
        table.innerHTML += `<tr><td class="row-label">${data.title}</td>
            ${FINANCIAL_DATA.years.map(y => `<td>${formatCurrencyFull(data.years[y])}</td>`).join('')}
        </tr>`;
        table.innerHTML += '</tbody>';
    });
}

function renderSummaryCard() {
    const row = $('cf-summary-row');
    if (!row) return;
    row.innerHTML = '';
    const summaryCard = document.createElement('div');
    summaryCard.className = 'chart-card';
    summaryCard.style.backgroundColor = 'var(--financial-navy)';
    summaryCard.style.borderColor = 'rgba(255,255,255,0.1)';
    summaryCard.style.flex = '0 0 100%';
    let html = '<div class="chart-title" style="color:#fff;">Cash Flow Summary</div><div class="chart-wrapper">';
    html += '<table class="financial-table" style="margin:0;">';
    html += '<thead><tr><th style="text-align:left;">Metric</th>' + FINANCIAL_DATA.years.map(y => `<th>${y}</th>`).join('') + '</tr></thead><tbody>';
    FINANCIAL_DATA.cashFlow.summary.forEach(s => {
        html += `<tr><td class="row-label">${s.label}</td>${FINANCIAL_DATA.years.map(y => `<td style="color:${s.color};">${formatCurrencyFull(s['v'+y])}</td>`).join('')}</tr>`;
    });
    html += '</tbody></table></div></div>';
    row.appendChild(summaryCard);
}

function renderDonutPairs() {
    const container = $('cf-donuts');
    if (!container) return;
    container.innerHTML = '';
    FINANCIAL_DATA.cashFlow.donutPairs.forEach((pair, i) => {
        const card = document.createElement('div');
        card.className = 'chart-card';
        card.style.backgroundColor = 'var(--financial-navy)';
        card.style.borderColor = 'rgba(255,255,255,0.1)';
        card.style.flex = '0 0 300px';
        card.innerHTML = `<div class="chart-title" style="color:#fff;font-size:13px;">${pair.title}</div>
            <div class="chart-wrapper">
                <div style="display:flex;gap:20px;align-items:center;justify-content:center;">
                    <div style="text-align:center;">
                        <div style="width:80px;height:80px;border-radius:50%;background:${pair.inVal.color};display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:600;">${pair.inVal.label}<br>${formatCurrencyFull(pair.inVal.value)}</div>
                    </div>
                    <div style="text-align:center;">
                        <div style="width:80px;height:80px;border-radius:50%;background:${pair.outVal.color};display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:600;">${pair.outVal.label}<br>${formatCurrencyFull(pair.outVal.value)}</div>
                    </div>
                </div>
            </div>`;
        container.appendChild(card);
    });
}

function renderAgedTrial() {
    renderAtbFilters();
    renderAtbSummaryTable();
    renderAtbDonut();
    renderAtbSummaryCards();
    renderAtbMatrix();
}

function renderAtbFilters() {
    // Already in HTML, just handle events
}

function renderAtbSummaryTable() {
    const table = $('atb-summary-table');
    if (!table) return;
    const buckets = FINANCIAL_DATA.agedTrial.buckets;
    table.innerHTML = '<thead><tr><th style="text-align:left;">Bucket</th><th style="text-align:left;">Amount</th></tr></thead><tbody>';
    let total = 0;
    buckets.forEach(b => {
        total += b.value;
        table.innerHTML += `<tr><td class="row-label">${b.label}</td><td>${formatCurrencyFull(b.value)}</td></tr>`;
    });
    table.innerHTML += `<tr class="row-total"><td class="row-label">Total</td><td>${formatCurrencyFull(total)}</td></tr>`;
    table.innerHTML += '</tbody>';
}

function renderAtbDonut() {
    const ctx = $('atb-donut');
    if (!ctx) return;
    const b = FINANCIAL_DATA.agedTrial.buckets;

    if (charts.atbDonut) charts.atbDonut.destroy();
    charts.atbDonut = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: b.map(i => i.label),
            datasets: [{
                data: b.map(i => i.value),
                backgroundColor: b.map(i => i.color),
                borderWidth: 0
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false, center: true,
            cutout: '60%',
            plugins: {
                legend: { display: false },
                tooltip: { backgroundColor: 'rgba(0,0,0,0.8)', titleColor: '#fff', bodyColor: '#ccc', borderColor: '#555', padding: 6, cornerRadius: 4 }
            }
        }
    });
    ctx.style.height = '180px';
}

function renderAtbSummaryCards() {
    const container = $('atb-summary-cards');
    if (!container) return;
    const summary = FINANCIAL_DATA.agedTrial.summary;
    container.innerHTML = '';
    summary.forEach(s => {
        const card = document.createElement('div');
        card.className = 'summary-card';
        if (s.value >= 1000) {
            card.innerHTML = `<div class="value">${formatCurrencyFull(s.value)}</div><div class="label">${s.label}</div>`;
        } else {
            card.innerHTML = `<div class="value">${s.value}</div><div class="label">${s.label}</div>`;
        }
        container.appendChild(card);
    });
}

function renderAtbMatrix() {
    const container = $('atb-matrix');
    if (!container) return;
    const customers = FINANCIAL_DATA.agedTrial.customers;
    let html = '<table class="financial-table" style="margin:0;"><thead><tr><th style="text-align:left;">Customer</th>';
    html += '<th>Total</th><th>1-30</th><th>31-60</th><th>61-90</th><th>90+</th></tr></thead><tbody>';
    customers.forEach(c => {
        html += `<tr><td class="row-label">${c.name}</td>
            <td>${formatCurrencyFull(c.total)}</td>
            <td>${formatCurrencyFull(c.b1_30)}</td>
            <td>${formatCurrencyFull(c.b31_60)}</td>
            <td>${formatCurrencyFull(c.b61_90)}</td>
            <td>${formatCurrencyFull(c.b90)}</td></tr>`;
    });
    html += '</tbody></table>';
    container.innerHTML = html;
}

state.riSelected = {
    territory: ['All'],
    channel: ['All'],
    product: ['All']
};

const RI_ALL_TERRITORIES = ["All", "Northwest", "Northeast", "Southeast", "Southwest", "International"];
const RI_ALL_CHANNELS = ["All", "Online", "Reseller", "Direct", "Partner"];
const RI_ALL_PRODUCTS = ["All", "Bikes", "Components", "Clothing", "Accessories"];

const RI_DATE_START = new Date(2016, 11, 23); // 12/23/2016
const RI_DATE_END = new Date(2018, 1, 17);   // 2/17/2018

function parseRiDate(value) {
    const m = /^(\d+)\/(\d+)\/(\d+)$/.exec(String(value));
    return m ? new Date(Number(m[3]), Number(m[1]) - 1, Number(m[2])) : null;
}

// The leftmost slider position still includes the earliest transaction, so the
// table is only ever empty when the slicers themselves match nothing.
const RI_EARLIEST_TX = FINANCIAL_DATA.revenueInsights.transactions.reduce((min, t) => {
    const d = parseRiDate(t.date);
    return d && d < min ? d : min;
}, RI_DATE_END);

// The date slider acts as an "up to" cutoff across its label range.
function riDateCutoff() {
    const span = RI_DATE_END - RI_DATE_START;
    const cutoff = new Date(RI_DATE_START.getTime() + span * (state.riFilters.dateIndex / 30));
    return cutoff < RI_EARLIEST_TX ? RI_EARLIEST_TX : cutoff;
}

function riSlicersAreAll() {
    return state.riSelected.territory.includes('All')
        && state.riSelected.channel.includes('All')
        && state.riSelected.product.includes('All');
}

// Single source of truth for Territory / Channel / Product Group / date filtering.
function getFilteredRiTransactions() {
    const cutoff = riDateCutoff();
    return FINANCIAL_DATA.revenueInsights.transactions.filter(t => {
        if (!state.riSelected.territory.includes('All') && !state.riSelected.territory.includes(t.territory)) return false;
        if (!state.riSelected.channel.includes('All') && !state.riSelected.channel.includes(t.channel)) return false;
        if (!state.riSelected.product.includes('All') && !state.riSelected.product.includes(t.productGroup)) return false;
        const d = parseRiDate(t.date);
        return d ? d <= cutoff : false;
    });
}

// Share of a measure ('sales' / 'profits') that survives the current filters.
function riFilteredShare(key) {
    const all = FINANCIAL_DATA.revenueInsights.transactions;
    const total = all.reduce((sum, t) => sum + t[key], 0);
    if (!total) return 0;
    return getFilteredRiTransactions().reduce((sum, t) => sum + t[key], 0) / total;
}

function computeRiScaleFactor() {
    return riFilteredShare('sales');
}

// Profits are scaled by their own share so the margin KPI can actually move.
function computeRiProfitFactor() {
    return riFilteredShare('profits');
}

const RI_TOP5_COLORS = ["#5bbcc4", "#1fd1c8", "#94a3b8", "#5bbcc4", "#1fd1c8"];

// Top 5 by summed sales for a given row field (city, customers).
function aggregateRiTop(rows, key) {
    const totals = {};
    rows.forEach(t => { totals[t[key]] = (totals[t[key]] || 0) + t.sales; });
    return Object.entries(totals)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([label, value], i) => ({ label, value: Math.round(value), color: RI_TOP5_COLORS[i % RI_TOP5_COLORS.length] }));
}

// Labels as well as values must be refreshed: the aggregated top 5 changes.
function applyRiTopBar(canvasId, rows) {
    const existing = charts[canvasId];
    if (existing) {
        existing.data.labels = rows.map(r => r.label);
        existing.data.datasets[0].data = rows.map(r => r.value);
        existing.data.datasets[0].backgroundColor = rows.map(r => r.color);
        existing.update();
    } else if (rows.length) {
        renderTopBarChart(canvasId, rows);
    }
}

function renderRevenueInsights() {
    // KPIs (persistent)
    const kpiContainer = $('ri-kpis');
    if (kpiContainer) {
        kpiContainer.innerHTML = '';
        FINANCIAL_DATA.revenueInsights.kpis.forEach(kpi => {
            const card = document.createElement('div');
            card.className = 'chart-card ri-kpi-card';
            card.style.backgroundColor = 'var(--financial-navy)';
            card.style.borderColor = 'rgba(255,255,255,0.1)';
            card.style.minWidth = '180px';
            const valStr = kpi.format === 'currency' ? '$' + (kpi.value / 1000000).toFixed(1) + 'M' :
                          kpi.format === 'percent' ? kpi.value + kpi.suffix : kpi.value.toLocaleString();
            card.innerHTML = `<div class="chart-title" style="color:#fff;font-size:13px;">${kpi.label}</div>
                <div class="kpi-value ri-kpi-value" style="font-size:28px; font-weight:700; color:#5bbcc4;">${valStr}</div>`;
            kpiContainer.appendChild(card);
        });
    }

    // Line chart (persistent)
    const lineCtx = $('ri-line-chart');
    if (lineCtx) {
        const d = FINANCIAL_DATA.revenueInsights.lineChart;
        const commonOptions = {
            responsive: true, maintainAspectRatio: false,
            plugins: {
                legend: { labels: { color: '#ccc', font: { size: 10 } } },
                tooltip: { backgroundColor: 'rgba(0,0,0,0.8)', titleColor: '#fff', bodyColor: '#ccc', borderColor: '#555', padding: 6, cornerRadius: 4 }
            },
            scales: {
                x: { grid: { color: 'rgba(255,255,255,0.1)', drawBorder: false }, ticks: { color: '#999', font: { size: 9 } } },
                y: { grid: { color: 'rgba(255,255,255,0.1)', drawBorder: false }, ticks: { color: '#999', font: { size: 9 } } }
            }
        };
        if (!charts.riLine) {
            charts.riLine = new Chart(lineCtx, {
                type: 'line',
                data: {
                    labels: d.months,
                    datasets: d.series.map(s => ({
                        label: s.label, data: s.data, borderColor: s.color,
                        borderWidth: 2, fill: false, tension: 0.3, pointRadius: 3
                    }))
                },
                options: commonOptions
            });
        } else {
            charts.riLine.options = commonOptions;
            charts.riLine.update();
        }
        lineCtx.style.height = '250px';
    }

    // Top 5 charts (persistent)
    renderTopBarChart('ri-top5-customers', FINANCIAL_DATA.revenueInsights.top5Customers);
    renderTopBarChart('ri-top5-cities', FINANCIAL_DATA.revenueInsights.top5Cities);

    // Transactions table
    renderRiTransactions();

    // Initial update
    updateRevenueInsights();
}

// Event wiring is attached once, not on every re-render, so repeated
// financial year switches don't stack duplicate handlers.
function setupRevenueInsightsInteractions() {
    // Date slider
    const slider = $('ri-date-slider');
    const dateLabel = $('ri-date-label');
    if (slider) {
        slider.addEventListener('input', () => {
            state.riFilters.dateIndex = parseInt(slider.value);
            const labels = ['12/23/2016','1/15/2017','3/1/2017','4/15/2017','5/30/2017','7/15/2017','8/20/2017','10/5/2017','11/20/2017','1/10/2018','2/17/2018'];
            const idx = Math.floor((parseInt(slider.value) / 30) * (labels.length - 1));
            if (dateLabel) dateLabel.textContent = labels[idx] || '2/17/2018';
            updateRevenueInsights();
        });
    }

    // Reset button
    const resetBtn = $('ri-reset');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            state.riSelected = { territory: ['All'], channel: ['All'], product: ['All'] };
            state.riFilters.dateIndex = 30;
            // Reset checkboxes
            document.querySelectorAll('.dropdown-slicer').forEach(dd => {
                const checkboxes = dd.querySelectorAll('input[type="checkbox"]');
                checkboxes.forEach(cb => {
                    cb.checked = cb.value === 'All';
                });
                const btn = dd.querySelector('.slicer-btn');
                if (btn) btn.textContent = 'All';
            });
            if (slider) slider.value = 30;
            if (dateLabel) dateLabel.textContent = '2/17/2018';
            updateRevenueInsights();
        });
    }

    // Dropdown slicer setup
    setupRiDropdowns();
}

function setupRiDropdowns() {
    document.querySelectorAll('.dropdown-slicer').forEach(dd => {
        const slicerName = dd.dataset.slicer;
        const btn = dd.querySelector('.slicer-btn');
        const dropdown = dd.querySelector('.slicer-dropdown');
        const checkboxes = dd.querySelectorAll('input[type="checkbox"]');
        const allCheckbox = dd.querySelector('input[value="All"]');

        if (!btn || !dropdown) return;

        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('show');
        });

        // Handle checkbox changes
        checkboxes.forEach(cb => {
            cb.addEventListener('change', () => {
                if (cb.value === 'All') {
                    // "All" selected -> check everything
                    if (cb.checked) checkboxes.forEach(c => c.checked = true);
                } else if (cb.checked) {
                    // Picking a specific value while "All" is on -> switch to that value only
                    if (allCheckbox && allCheckbox.checked) {
                        checkboxes.forEach(c => c.checked = false);
                        cb.checked = true;
                    }
                } else if (allCheckbox) {
                    allCheckbox.checked = false;
                }

                // Unchecking the last specific value falls back to "All"
                if (cb.value !== 'All' && !Array.from(checkboxes).some(c => c.value !== 'All' && c.checked)) {
                    checkboxes.forEach(c => c.checked = true);
                }

                const selected = Array.from(checkboxes).filter(c => c.checked).map(c => c.value);
                const specific = selected.filter(s => s !== 'All');

                // Update button label
                if (selected.includes('All')) {
                    btn.textContent = 'All';
                } else if (specific.length === 0) {
                    btn.textContent = 'None selected';
                } else if (specific.length === 1) {
                    btn.textContent = specific[0];
                } else {
                    btn.textContent = 'Multiple selections';
                }

                // Update state
                const allOptions = slicerName === 'territory' ? RI_ALL_TERRITORIES :
                                 slicerName === 'channel' ? RI_ALL_CHANNELS : RI_ALL_PRODUCTS;
                state.riSelected[slicerName] = selected.includes('All') ? allOptions
                    : (specific.length ? specific : allOptions);

                updateRevenueInsights();
            });
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!dd.contains(e.target)) {
                dropdown.classList.remove('show');
            }
        });
    });
}

function updateRevenueInsights() {
    const factor = computeRiScaleFactor();
    const filteredRows = getFilteredRiTransactions();

    // Update KPI cards
    const kpiValues = document.querySelectorAll('.ri-kpi-value');
    if (kpiValues.length >= 3) {
        const baseSales = FINANCIAL_DATA.revenueInsights.kpis[0].value;
        const baseProfits = FINANCIAL_DATA.revenueInsights.kpis[1].value;
        const filteredSales = Math.round(baseSales * factor);
        const filteredProfits = Math.round(baseProfits * computeRiProfitFactor());
        const margins = filteredSales > 0 ? (filteredProfits / filteredSales) * 100 : 0;

        kpiValues[0].textContent = '$' + (filteredSales / 1000000).toFixed(1) + 'M';
        kpiValues[1].textContent = '$' + (filteredProfits / 1000000).toFixed(1) + 'M';
        kpiValues[2].textContent = margins.toFixed(0) + '%';
    }

    // Update line chart
    const lineChart = charts.riLine;
    if (lineChart) {
        const origSeries = FINANCIAL_DATA.revenueInsights.lineChart.series;
        lineChart.data.datasets = origSeries.map(s => ({
            label: s.label,
            data: s.data.map(v => Math.round(v * factor)),
            borderColor: s.color,
            borderWidth: 2, fill: false, tension: 0.3, pointRadius: 3
        }));
        lineChart.update();
    }

    // Update waterfall
    const wfBars = JSON.parse(JSON.stringify(FINANCIAL_DATA.revenueInsights.waterfall.bars));
    wfBars.forEach(b => b.value = Math.round(b.value * factor));
    renderWaterfallChart('ri-waterfall', wfBars);

    // Update Top 5 charts. With no filter active keep the original static
    // ranking; otherwise aggregate the surviving transactions.
    const pristine = riSlicersAreAll() && state.riFilters.dateIndex >= 30;
    applyRiTopBar('ri-top5-customers', pristine
        ? FINANCIAL_DATA.revenueInsights.top5Customers
        : aggregateRiTop(filteredRows, 'customers'));
    applyRiTopBar('ri-top5-cities', pristine
        ? FINANCIAL_DATA.revenueInsights.top5Cities
        : aggregateRiTop(filteredRows, 'city'));

    // Update transactions table
    renderRiTransactions();
}

function renderRiTransactions() {
    const txTable = $('ri-transactions');
    if (!txTable) return;
    const filtered = getFilteredRiTransactions();

    let bodyHtml;
    if (!filtered.length) {
        bodyHtml = '<tr><td colspan="9" style="text-align:center;padding:24px;color:#8a8a8a;">No transactions match the selected filters</td></tr>';
    } else {
        bodyHtml = filtered.map(t => `<tr>
            <td>${t.date}</td><td>${t.city}</td><td>${t.territory}</td>
            <td>${t.product}</td><td>${t.productGroup}</td><td>${t.customers}</td>
            <td style="text-align:right">${formatCurrencyFull(t.sales)}</td>
            <td style="text-align:right">${formatCurrencyFull(t.profits)}</td>
            <td>${t.margin}</td>
        </tr>`).join('');
    }

    // Single assignment: appending to an unclosed <tbody> would create a second one.
    txTable.innerHTML = '<thead><tr><th>Date</th><th>City</th><th>Territory</th><th>Product Name</th><th>Product Group</th><th>Customers</th><th style="text-align:right">Sales</th><th style="text-align:right">Profits</th><th>Margin</th></tr></thead><tbody>'
        + bodyHtml + '</tbody>';
}

// ============================================================
// CHART RENDERING HELPERS
// ============================================================
// Waterfall palette: Increase / Decrease / Total
const WF_INCREASE_COLOR = '#5bbcc4'; // teal
const WF_DECREASE_COLOR = '#6b7280'; // grey
const WF_TOTAL_COLOR = '#4a90d9';    // blue

// The trailing "Total" bar restarts at zero; every other bar floats on the
// running total. Detected from the data (the total bar is last and green).
function isWaterfallTotalBar(bar, index, bars) {
    return index === bars.length - 1 && bar.color === '#38a174';
}

// One floating [start, end] range per label, in a single dataset.
function waterfallRanges(bars) {
    let run = 0;
    return bars.map((b, i) => {
        if (isWaterfallTotalBar(b, i, bars)) return [0, b.value];
        const start = run;
        run += b.value;
        return [start, run];
    });
}

function waterfallBarColor(bar, index, bars) {
    if (isWaterfallTotalBar(bar, index, bars)) return WF_TOTAL_COLOR;
    return bar.value < 0 ? WF_DECREASE_COLOR : WF_INCREASE_COLOR;
}

function renderWaterfallLegend(canvas) {
    const host = canvas.parentElement;
    if (!host) return;
    let legend = document.getElementById(canvas.id + '-legend');
    if (!legend) {
        legend = document.createElement('div');
        legend.id = canvas.id + '-legend';
        legend.className = 'donut-legend';
        host.insertBefore(legend, canvas);
    }
    legend.innerHTML = [
        ['Increase', WF_INCREASE_COLOR],
        ['Decrease', WF_DECREASE_COLOR],
        ['Total', WF_TOTAL_COLOR]
    ].map(([label, color]) =>
        `<div class="donut-legend-item"><span class="donut-legend-swatch" style="background:${color};"></span>${label}</div>`
    ).join('');
}

function renderWaterfallChart(canvasId, bars) {
    const canvas = $(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    if (charts[canvasId]) charts[canvasId].destroy();
    charts[canvasId] = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: bars.map(b => b.label),
            datasets: [{
                label: 'Amount',
                data: waterfallRanges(bars),
                backgroundColor: bars.map((b, i) => waterfallBarColor(b, i, bars)),
                borderColor: bars.map((b, i) => waterfallBarColor(b, i, bars)),
                borderWidth: 1,
                borderRadius: 3,
                barPercentage: 0.6,
                categoryPercentage: 0.8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: {
                    stacked: false,
                    grid: { display: false },
                    ticks: { color: '#999', font: { size: 10 }, maxRotation: 45, autoSkip: true }
                },
                y: {
                    stacked: false,
                    grid: { color: 'rgba(255,255,255,0.05)' },
                    ticks: { color: '#999', font: { size: 10 }, callback: v => formatCurrencyShort(v) }
                }
            }
        }
    });
    canvas.style.height = '250px';
    renderWaterfallLegend(canvas);
}

function renderTopBarChart(canvasId, rows) {
    const ctx = $(canvasId);
    if (!ctx) return;
    const list = Array.isArray(rows) ? rows : (rows && Array.isArray(rows.data) ? rows.data : []);
    if (!list.length) return;
    if (charts[canvasId]) charts[canvasId].destroy();
    charts[canvasId] = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: list.map(d => d.label),
            datasets: [{
                data: list.map(d => d.value),
                backgroundColor: list.map(d => d.color),
                barPercentage: 0.6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: { legend: { display: false }, tooltip: {
                backgroundColor: 'rgba(0,0,0,0.8)', titleColor: '#fff', bodyColor: '#ccc', borderColor: '#555', padding: 6, cornerRadius: 4
            }},
            scales: {
                x: { grid: { color: 'rgba(255,255,255,0.1)', drawBorder: false }, ticks: { color: '#999', font: { size: 10 } } },
                y: { grid: { display: false }, ticks: { color: '#ccc', font: { size: 11 } } }
            }
        }
    });
    ctx.style.height = '200px';
}

// ============================================================
// UTILITY FUNCTIONS
// ============================================================
function formatCurrencyShort(v) {
    if (v >= 1000000) return '$' + (v / 1000000).toFixed(1) + 'M';
    if (v >= 1000) return '$' + (v / 1000).toFixed(1) + 'K';
    return '$' + v.toLocaleString();
}

function formatCurrencyFull(v) {
    if (v >= 1000000) return '$' + (v / 1000000).toFixed(2) + 'M';
    if (v >= 1000) return '$' + (v / 1000).toFixed(2) + 'K';
    return '$' + v.toFixed(2);
}

function linearRegression(values) {
    const n = values.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
    for (let i = 0; i < n; i++) {
        sumX += i; sumY += values[i];
        sumXY += i * values[i]; sumXX += i * i;
    }
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    return values.map((_, i) => slope * i + intercept);
}

// ============================================================
// SLIDER SETUP
// ============================================================
function setupSliders() {
    setupProductSliders();
    setupMapFilters();
    setupCustomerSlider();
    setupTooltipHover();

    // Revenue slider
    const revStart = $('revenueStart');
    const revEnd = $('revenueEnd');
    const revSlider = $('revenueSlider');
    if (revStart && revEnd && revSlider) {
        function updateRev() {
            const start = parseInt(revStart.value);
            const end = parseInt(revEnd.value);
            const minVal = Math.min(start, end);
            const maxVal = Math.max(start, end);
            revSlider.value = end;
            revStart.max = maxVal;
            revEnd.min = minVal;
        }
        revStart.addEventListener('input', updateRev);
        revEnd.addEventListener('input', updateRev);
    }

    // Customer date slider
    const custSlider = $('customerSlider');
    if (custSlider) {
        custSlider.addEventListener('input', () => {
            renderRevenuePerCustomer();
        });
    }

    // Aged Trial Balance date slider
    const atbSlider = $('atb-date-slider');
    if (atbSlider) {
        atbSlider.addEventListener('input', () => {
            // Would filter the aging matrix by date
        });
    }

    // Revenue Insights date slider
    const riSlider = $('ri-date-slider');
    if (riSlider) {
        riSlider.addEventListener('input', () => {
            // Would filter the revenue insights charts
        });
    }
}

// ============================================================
// YEAR BUTTONS (Financial) - updates all financial subpages on year change
// ============================================================
function updateFinancialPages() {
    renderIncomeStatement();
    renderFinancialDetails();
    renderBalanceSheet();
    renderCashFlow();
    renderAgedTrial();
    renderRevenueInsights();
}
