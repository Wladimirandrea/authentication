import { computed, ref, shallowRef } from 'vue';

// Estado a nivel de módulo: el evento `beforeinstallprompt` se dispara una sola vez
// y muy pronto, así que se captura aquí (importa este archivo en app.js).
const deferredPrompt = shallowRef(null); // shallowRef: el evento nativo no debe ser un Proxy reactivo
const installed = ref(false);

const isStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches ||
  window.navigator.standalone === true;

installed.value = isStandalone();

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt.value = e;
});

window.addEventListener('appinstalled', () => {
  installed.value = true;
  deferredPrompt.value = null;
});

// iOS (iPhone/iPad) no dispara beforeinstallprompt: la instalación es manual desde Safari
const isIos =
  /iphone|ipad|ipod/i.test(navigator.userAgent) ||
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

export function usePwaInstall() {
  const canInstall = computed(() => !!deferredPrompt.value && !installed.value);
  const showIosHelp = computed(() => isIos && !installed.value && !deferredPrompt.value);

  const install = async () => {
    if (!deferredPrompt.value) return null;
    deferredPrompt.value.prompt();
    const { outcome } = await deferredPrompt.value.userChoice;
    deferredPrompt.value = null;
    return outcome; // 'accepted' | 'dismissed'
  };

  return { canInstall, showIosHelp, installed, install };
}
