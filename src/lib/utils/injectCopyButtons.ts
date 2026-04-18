import TurndownService from 'turndown';
import copy from '$lib/assets/svg/copy.svg?raw';
import { tipbox } from '$lib/components/tipbox/tipbox.svelte';

// Configuración de Turndown
const turndownService = new TurndownService({
  headingStyle: 'atx',
  bulletListMarker: '-',
  codeBlockStyle: 'fenced'
});

// Regla para que el texto del botón no se incluya en la copia
turndownService.addRule('ignoreButtons', {
  filter: (node) => node.nodeName === 'BUTTON',
  replacement: () => ''
});

/**
 * Proceso: Convertir y Copiar
 */
const copyToClipboardAsMarkdown = async (element: HTMLElement) => {
  try {
    // Convertir el HTML del elemento a Markdown
    const markdown = turndownService.turndown(element.outerHTML);
    // Copiar al portapapeles
    await navigator.clipboard.writeText(markdown);

  } catch (err) {
    console.error('Error al intentar copiar:', err);
  }
};

export const injectCopyButtons = (): void => {
  const container = document.querySelector('.container-data');
  if (!container) return;

  // 1. Definimos etiquetas que engloban (Verdes)
  const parentTags = ['ul', 'ol', 'table', 'blockquote'];
  
  // 2. Definimos etiquetas simples (Azules)
  // Nota: No incluimos nada interno de la tabla (tr, td, th)
  const childTags = 'p, h1, h2, h3, li'; 
  
  // Selector combinado
  const selectors = `${parentTags.join(', ')}, ${childTags}`;
  const elements = container.querySelectorAll(selectors);

  elements.forEach((el) => {
    const target = el as HTMLElement;

    // EVITAR BOTONES DENTRO DE TABLAS:
    // Si el elemento actual está dentro de una tabla, pero no es la tabla en sí, lo ignoramos.
    if (target.tagName.toLowerCase() !== 'table' && target.closest('table')) {
      return;
    }

    if (target.dataset.hasButton === 'true') return;

    const tagName = target.tagName.toLowerCase();
    const isParent = parentTags.includes(tagName);

    target.style.position = 'relative';
    target.classList.add('copy-group');

    const btn = document.createElement('button');
    btn.innerHTML = copy;
    btn.className = isParent ? 'btn-copy-parent' : 'btn-copy-child';
    
    target.dataset.hasButton = 'true';
    target.appendChild(btn);

    btn.onclick = (e) => {
      e.stopPropagation();
      // Aquí llamaremos a la Fase 2 (Turndown) próximamente
      //console.log(`Copiando unidad completa: ${tagName}`);
      copyToClipboardAsMarkdown(target);
      tipbox.open("Copiado");
    };
  });
};

export const pasteFromClipboard = async (): Promise<string> => {
  try {
    // Verificamos si el navegador tiene permiso para acceder al portapapeles
    // Nota: Algunos navegadores piden permiso explícito al usuario la primera vez
    const text = await navigator.clipboard.readText();
    return text;
  } catch (err) {
    console.error('Error al intentar pegar:', err);
    return '';
  }
};
