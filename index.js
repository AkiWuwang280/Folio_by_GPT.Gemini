const MODULE_NAME = 'paper_theme_by_gpt';
const ROOT_CLASS = 'paper-theme-enabled';

const DEFAULTS = Object.freeze({
    palette: 'deep-purple',
    fontSize: 16,
    lineHeight: 1.68,
    contentWidth: 900,
    aiFont: '',
    userFont: '',
    backgroundUrl: '',
    backgroundOpacity: 0.22,
    backgroundBlur: 0,
    texture: 0.025,
    borders: true,
});

const PALETTES = {
    'deep-purple': {
        label: '深紫夜刊',
        vars: {
            '--paper-page': '#17151e',
            '--paper-surface': '#211e2a',
            '--paper-raised': '#292535',
            '--paper-text': '#e9e3f0',
            '--paper-muted': '#aaa1b5',
            '--paper-line': '#454052',
            '--paper-accent': '#c2a5e8',
            '--paper-ai': '#e9e3f0',
            '--paper-user': '#e8dff5',
        },
    },
    'deep-gray': {
        label: '深灰夜刊',
        vars: {
            '--paper-page': '#191b1e',
            '--paper-surface': '#222529',
            '--paper-raised': '#2b3035',
            '--paper-text': '#e5e8e9',
            '--paper-muted': '#a5adb2',
            '--paper-line': '#41484e',
            '--paper-accent': '#a9c4cb',
            '--paper-ai': '#e5e8e9',
            '--paper-user': '#dce9e9',
        },
    },
    'light-lilac': {
        label: '浅紫刊物',
        vars: {
            '--paper-page': '#f2eef7',
            '--paper-surface': '#faf8fc',
            '--paper-raised': '#eae3f2',
            '--paper-text': '#393344',
            '--paper-muted': '#766d82',
            '--paper-line': '#d5cbdF',
            '--paper-accent': '#8b70ad',
            '--paper-ai': '#393344',
            '--paper-user': '#514366',
        },
    },
    'warm-paper': {
        label: '暖白纸刊',
        vars: {
            '--paper-page': '#f7f4ed',
            '--paper-surface': '#fffdf8',
            '--paper-raised': '#eee9df',
            '--paper-text': '#39362f',
            '--paper-muted': '#7c766b',
            '--paper-line': '#d9d2c5',
            '--paper-accent': '#9b8060',
            '--paper-ai': '#39362f',
            '--paper-user': '#62513e',
        },
    },
};

let context;
let settings;
let panelObserver;

function cloneDefaults() {
    return JSON.parse(JSON.stringify(DEFAULTS));
}

function getSettings() {
    const store = context.extensionSettings;
    if (!store[MODULE_NAME] || typeof store[MODULE_NAME] !== 'object') {
        store[MODULE_NAME] = cloneDefaults();
    }
    settings = store[MODULE_NAME];
    for (const [key, value] of Object.entries(DEFAULTS)) {
        if (settings[key] === undefined || settings[key] === null) {
            settings[key] = value;
        }
    }
    if (!PALETTES[settings.palette]) settings.palette = DEFAULTS.palette;
    return settings;
}

function clamp(value, min, max, fallback) {
    const number = Number(value);
    return Number.isFinite(number) ? Math.min(max, Math.max(min, number)) : fallback;
}

function safeFont(value) {
    return String(value || '').replace(/[;"'\\]/g, '').trim().slice(0, 80);
}

function safeBackgroundUrl(value) {
    const input = String(value || '').trim();
    if (!input) return '';
    try {
        const url = new URL(input);
        return ['http:', 'https:'].includes(url.protocol) ? url.href : '';
    } catch {
        return '';
    }
}

function ensureBackgroundLayer() {
    let layer = document.getElementById('paper-theme-background-layer');
    if (!layer) {
        layer = document.createElement('div');
        layer.id = 'paper-theme-background-layer';
        layer.setAttribute('aria-hidden', 'true');
        document.body.prepend(layer);
    }
    return layer;
}

function ensureTextureLayer() {
    let layer = document.getElementById('paper-theme-texture-layer');
    if (!layer) {
        layer = document.createElement('div');
        layer.id = 'paper-theme-texture-layer';
        layer.setAttribute('aria-hidden', 'true');
        document.body.append(layer);
    }
    return layer;
}

function applySettings() {
    const s = getSettings();
    const root = document.documentElement;
    const palette = PALETTES[s.palette] || PALETTES[DEFAULTS.palette];

    root.classList.add(ROOT_CLASS);
    root.dataset.paperTheme = s.palette;

    for (const [name, value] of Object.entries(palette.vars)) {
        root.style.setProperty(name, value);
    }

    const fontSize = clamp(s.fontSize, 12, 24, DEFAULTS.fontSize);
    const lineHeight = clamp(s.lineHeight, 1.2, 2.2, DEFAULTS.lineHeight);
    const contentWidth = clamp(s.contentWidth, 480, 1400, DEFAULTS.contentWidth);
    const opacity = clamp(s.backgroundOpacity, 0, 1, DEFAULTS.backgroundOpacity);
    const blur = clamp(s.backgroundBlur, 0, 20, DEFAULTS.backgroundBlur);
    const texture = clamp(s.texture, 0, 0.12, DEFAULTS.texture);
    const backgroundUrl = safeBackgroundUrl(s.backgroundUrl);

    s.fontSize = fontSize;
    s.lineHeight = lineHeight;
    s.contentWidth = contentWidth;
    s.backgroundOpacity = opacity;
    s.backgroundBlur = blur;
    s.texture = texture;
    s.backgroundUrl = backgroundUrl;
    s.aiFont = safeFont(s.aiFont);
    s.userFont = safeFont(s.userFont);

    root.style.setProperty('--paper-font-size', fontSize + 'px');
    root.style.setProperty('--paper-line-height', String(lineHeight));
    root.style.setProperty('--paper-content-width', contentWidth + 'px');
    root.style.setProperty('--paper-ai-font', s.aiFont ? '"' + s.aiFont + '"' : 'inherit');
    root.style.setProperty('--paper-user-font', s.userFont ? '"' + s.userFont + '"' : 'inherit');
    root.style.setProperty('--paper-bg-opacity', String(opacity));
    root.style.setProperty('--paper-bg-blur', blur + 'px');
    root.style.setProperty('--paper-texture-opacity', String(texture));
    root.classList.toggle('paper-theme-no-borders', !s.borders);
    root.classList.toggle('paper-theme-has-background', Boolean(backgroundUrl));

    const layer = ensureBackgroundLayer();
    layer.style.backgroundImage = backgroundUrl ? 'url("' + backgroundUrl.replace(/["\\]/g, '') + '")' : 'none';
    layer.style.opacity = String(opacity);
    layer.style.filter = blur ? 'blur(' + blur + 'px)' : 'none';
    layer.hidden = !backgroundUrl;
}

function saveAndApply() {
    applySettings();
    context.saveSettingsDebounced();
}

function syncControls(panel) {
    const s = getSettings();
    panel.querySelectorAll('[data-setting]').forEach((control) => {
        const key = control.dataset.setting;
        if (!(key in s)) return;
        if (control.type === 'checkbox') control.checked = Boolean(s[key]);
        else control.value = String(s[key]);
        const output = panel.querySelector('[data-output="' + key + '"]');
        if (output) output.textContent = String(s[key]);
    });
}

function readControl(control) {
    const key = control.dataset.setting;
    if (!key || !(key in DEFAULTS)) return;
    let value;
    if (control.type === 'checkbox') value = control.checked;
    else if (control.type === 'number' || control.type === 'range') value = Number(control.value);
    else value = control.value;

    if (key === 'backgroundUrl') value = safeBackgroundUrl(value);
    if (key === 'aiFont' || key === 'userFont') value = safeFont(value);
    settings[key] = value;

    const output = control.closest('#paper-theme-settings')?.querySelector('[data-output="' + key + '"]');
    if (output) output.textContent = String(value);
    saveAndApply();
}

function bindPanel(panel) {
    if (panel.dataset.bound === 'true') return;
    panel.dataset.bound = 'true';

    panel.addEventListener('input', (event) => {
        const control = event.target.closest('[data-setting]');
        if (!control || control.type === 'checkbox' || control.tagName === 'SELECT') return;
        readControl(control);
    });

    panel.addEventListener('change', (event) => {
        const control = event.target.closest('[data-setting]');
        if (control) readControl(control);
    });

    panel.addEventListener('click', (event) => {
        const button = event.target.closest('[data-action]');
        if (!button) return;
        if (button.dataset.action === 'reset') {
            Object.assign(settings, cloneDefaults());
            syncControls(panel);
            saveAndApply();
        }
    });

    syncControls(panel);
}

async function renderSettingsPanel() {
    const target = document.querySelector('#extensions_settings2, #extensions_settings');
    if (!target || document.getElementById('paper-theme-settings')) return;

    try {
        const html = await context.renderExtensionTemplateAsync('third-party/PaperTheme_by_gpt', 'settings');
        target.insertAdjacentHTML('beforeend', html);
        const panel = document.getElementById('paper-theme-settings');
        if (panel) bindPanel(panel);
    } catch (error) {
        console.error('[Paper Theme] Failed to render settings panel:', error);
    }
}

async function init() {
    if (!window.SillyTavern?.getContext) {
        console.error('[Paper Theme] SillyTavern context API is unavailable.');
        return;
    }

    context = window.SillyTavern.getContext();
    if (!context?.extensionSettings || !context?.saveSettingsDebounced || !context?.renderExtensionTemplateAsync) {
        console.error('[Paper Theme] Required context APIs are unavailable.');
        return;
    }

    getSettings();
    applySettings();
    await renderSettingsPanel();

    if (panelObserver) panelObserver.disconnect();
    const settingsRoot = document.getElementById('extensions_settings2') || document.getElementById('extensions_settings');
    if (settingsRoot) {
        panelObserver = new MutationObserver(() => {
            if (!document.getElementById('paper-theme-settings')) renderSettingsPanel();
        });
        panelObserver.observe(settingsRoot, { childList: true });
    }

    console.info('[Paper Theme] Loaded. Palette:', settings.palette);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => init(), { once: true });
} else {
    init();
}

window.PaperTheme = {
    set(values = {}) {
        Object.assign(getSettings(), values);
        saveAndApply();
    },
    getSettings() {
        return { ...getSettings() };
    },
    palettes: Object.keys(PALETTES),
};