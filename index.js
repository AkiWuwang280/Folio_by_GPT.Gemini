/* 页序 · Folio
 * Independent SillyTavern extension. Styles are deliberately scoped;
 * no global stacking-context or positioning overrides are used.
 */
(() => {
    'use strict';

    const EXTENSION_NAME = '页序 · Folio';
    const SETTINGS_KEY = 'folio_theme';
    const TEMPLATE_PATH = 'third-party/PaperTheme_by_gpt';
    const DEFAULTS = {
        theme: 'night-violet',
        aiFont: '',
        userFont: '',
        fontSize: 16,
        lineHeight: 1.85,
        contentWidth: 860,
        avatarSize: 42,
        messageGap: 18,
        avatarGap: 14,
        paragraphGap: 0.85,
        backgroundUrl: '',
        backgroundOpacity: 0.18,
        borders: true,
        pageNumber: false,
        quoteStyle: true,
        sectionDivider: true
    };

    const PALETTES = {
        'night-violet': {
            label: '深紫夜刊',
            vars: {
                '--folio-ink': '#e9e5f2',
                '--folio-muted': '#a9a1b9',
                '--folio-line': 'rgba(191,174,224,.20)',
                '--folio-panel': 'rgba(35,29,49,.48)',
                '--folio-card': 'rgba(42,35,58,.46)',
                '--folio-accent': '#c4a9e8',
                '--folio-quote': 'rgba(183,155,220,.10)',
                '--folio-overlay': 'rgba(18,13,29,.82)'
            }
        },
        'night-graphite': {
            label: '深灰夜刊',
            vars: {
                '--folio-ink': '#e7e8e9',
                '--folio-muted': '#a4a8ad',
                '--folio-line': 'rgba(190,198,205,.19)',
                '--folio-panel': 'rgba(31,35,39,.50)',
                '--folio-card': 'rgba(40,45,50,.48)',
                '--folio-accent': '#b7c4cc',
                '--folio-quote': 'rgba(174,190,201,.09)',
                '--folio-overlay': 'rgba(13,17,20,.82)'
            }
        },
        'light-lilac': {
            label: '浅紫刊物',
            vars: {
                '--folio-ink': '#373343',
                '--folio-muted': '#777184',
                '--folio-line': 'rgba(105,91,133,.20)',
                '--folio-panel': 'rgba(250,247,255,.70)',
                '--folio-card': 'rgba(255,253,255,.76)',
                '--folio-accent': '#8973ad',
                '--folio-quote': 'rgba(157,133,190,.10)',
                '--folio-overlay': 'rgba(247,243,252,.78)'
            }
        },
        'warm-paper': {
            label: '暖白纸刊',
            vars: {
                '--folio-ink': '#39352f',
                '--folio-muted': '#81796e',
                '--folio-line': 'rgba(116,99,77,.20)',
                '--folio-panel': 'rgba(255,251,242,.72)',
                '--folio-card': 'rgba(255,253,248,.78)',
                '--folio-accent': '#9b8060',
                '--folio-quote': 'rgba(178,151,111,.11)',
                '--folio-overlay': 'rgba(250,245,233,.80)'
            }
        }
    };

    const ctx = window.SillyTavern?.getContext?.();
    if (!ctx) {
        console.warn(`[${EXTENSION_NAME}] SillyTavern context unavailable.`);
        return;
    }

    const settingsRoot = ctx.extensionSettings ?? (ctx.extensionSettings = {});
    if (!settingsRoot[SETTINGS_KEY]) settingsRoot[SETTINGS_KEY] = structuredClone(DEFAULTS);
    const settings = settingsRoot[SETTINGS_KEY];
    Object.keys(DEFAULTS).forEach((key) => {
        if (settings[key] === undefined) settings[key] = DEFAULTS[key];
    });

    const clamp = (value, min, max) => Math.min(max, Math.max(min, Number(value) || min));
    const safeUrl = (value) => {
        const raw = String(value || '').trim();
        if (!raw) return '';
        try {
            const url = new URL(raw);
            return ['https:', 'http:'].includes(url.protocol) ? url.href : '';
        } catch {
            return '';
        }
    };
    const cssFont = (value) => String(value || '').replace(/[<>;"{}]/g, '').trim().slice(0, 80);

    function applyTheme() {
        const root = document.documentElement;
        const palette = PALETTES[settings.theme] || PALETTES[DEFAULTS.theme];
        root.dataset.folioTheme = settings.theme;
        Object.entries(palette.vars).forEach(([key, value]) => root.style.setProperty(key, value));
        root.style.setProperty('--folio-font-size', `${clamp(settings.fontSize, 12, 24)}px`);
        root.style.setProperty('--folio-line-height', clamp(settings.lineHeight, 1.2, 2.6));
        root.style.setProperty('--folio-content-width', `${clamp(settings.contentWidth, 420, 1400)}px`);
        root.style.setProperty('--folio-avatar-size', `${clamp(settings.avatarSize, 28, 88)}px`);
        root.style.setProperty('--folio-message-gap', `${clamp(settings.messageGap, 0, 48)}px`);
        root.style.setProperty('--folio-avatar-gap', `${clamp(settings.avatarGap, 0, 36)}px`);
        root.style.setProperty('--folio-paragraph-gap', `${clamp(settings.paragraphGap, 0, 2)}em`);
        root.style.setProperty('--folio-ai-font', cssFont(settings.aiFont) ? `"${cssFont(settings.aiFont)}"` : 'inherit');
        root.style.setProperty('--folio-user-font', cssFont(settings.userFont) ? `"${cssFont(settings.userFont)}"` : 'inherit');
        const image = safeUrl(settings.backgroundUrl);
        const shade = settings.theme.startsWith('night') ? '0,0,0' : '255,255,255';
        const overlay = `rgba(${shade}, ${clamp(settings.backgroundOpacity, 0, 0.9)})`;
        root.style.setProperty('--folio-background', image ? `linear-gradient(${overlay}, ${overlay}), url("${image.replace(/["\\\\]/g, '')}")` : 'none');
        document.body.classList.toggle('folio-enabled', true);
        document.body.classList.toggle('folio-no-borders', !settings.borders);
        document.body.classList.toggle('folio-page-number', !!settings.pageNumber);
        document.body.classList.toggle('folio-quote-style', !!settings.quoteStyle);
        document.body.classList.toggle('folio-section-divider', !!settings.sectionDivider);
    }

    function persist() {
        applyTheme();
        ctx.saveSettingsDebounced?.();
    }

    async function renderSettings() {
        const $ = window.jQuery;
        if (!$) return;
        const host = $('#extensions_settings2');
        if (!host.length) return;
        if ($('#folio-settings').length) return;
        try {
            const html = await ctx.renderExtensionTemplateAsync(TEMPLATE_PATH, 'settings');
            host.append(html);
            const panel = $('#folio-settings');
            if (!panel.length) return;
            panel.find('[data-folio-setting]').each(function () {
                const key = this.dataset.folioSetting;
                const value = settings[key];
                if (this.type === 'checkbox') this.checked = Boolean(value);
                else if (value !== undefined) this.value = value;
            });
            panel.find('[data-folio-value]').each(function () {
                const key = this.dataset.folioValue;
                const output = panel.find(`[data-folio-output="${key}"]`);
                if (output.length) output.textContent = settings[key];
            });
            applyTheme();
        } catch (error) {
            console.error(`[${EXTENSION_NAME}] Settings panel failed to render.`, error);
        }
    }

    function bindSettings() {
        const $ = window.jQuery;
        if (!$) return;
        $(document).off('.folioTheme');
        $(document).on('input.folioTheme change.folioTheme', '#folio-settings [data-folio-setting]', function () {
            const key = this.dataset.folioSetting;
            if (!(key in DEFAULTS)) return;
            let value = this.type === 'checkbox' ? this.checked : this.value;
            if (['fontSize', 'contentWidth', 'avatarSize', 'messageGap', 'avatarGap'].includes(key)) value = clamp(value, 0, 2000);
            if (['lineHeight', 'paragraphGap', 'backgroundOpacity'].includes(key)) value = clamp(value, 0, 3);
            settings[key] = value;
            const output = $('#folio-settings').find(`[data-folio-output="${key}"]`);
            if (output.length) output.textContent = value;
            persist();
        });
        $(document).on('click.folioTheme', '#folio-reset', function () {
            Object.assign(settings, structuredClone(DEFAULTS));
            $('#folio-settings [data-folio-setting]').each(function () {
                const key = this.dataset.folioSetting;
                if (this.type === 'checkbox') this.checked = Boolean(settings[key]);
                else this.value = settings[key] ?? '';
            });
            $('#folio-settings [data-folio-output]').each(function () {
                this.textContent = settings[this.dataset.folioOutput];
            });
            persist();
        });
    }

    applyTheme();
    bindSettings();
    renderSettings();
    const observer = new MutationObserver(() => {
        if (!document.getElementById('folio-settings')) renderSettings();
    });
    const target = document.getElementById('extensions_settings2');
    if (target) observer.observe(target, { childList: true });
    window.FolioTheme = {
        getSettings: () => ({ ...settings }),
        reset: () => {
            Object.assign(settings, structuredClone(DEFAULTS));
            persist();
        },
        apply: applyTheme
    };
    console.info(`[${EXTENSION_NAME}] Loaded.`);
})();