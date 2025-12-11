<script lang="ts">
  type Months = {
    month: number;
    name: string;
    payments: { value: number; date: string }[];
    total: number;
  };

  let { months = [], width = 720, height = 240, maxBarWidth = 48 } = $props();

  // Config
  let gap = 8; // separación fija entre barras
  const padding = { top: 28, right: 16, bottom: 36, left: 20 };

  // Estados reactivos
  let barWidth = $state(0);
  let computedGap = $state(gap);

  // Derivados
  let n = $derived(months.length);
  let maxTotal = $derived(
    n ? Math.max(...months.map((m: Months) => m.total)) : 0
  );

  let availableW = $derived(
    Math.max(0, width - padding.left - padding.right)
  );

  // Calcular ancho de barras SIN expandir el gap
  $effect(() => {
    computedGap = gap; // gap fijo siempre

    const totalGapSpace = (n - 1) * computedGap;
    const candidate = Math.floor((availableW - totalGapSpace) / Math.max(n, 1));

    barWidth = Math.max(6, Math.min(maxBarWidth, candidate));
  });

  // Escala vertical
  let chartH = $derived(
    Math.max(20, height - padding.top - padding.bottom)
  );
  let scale = $derived(maxTotal > 0 ? chartH / maxTotal : 0);

  // Posiciones X
  let xPositions = $derived(
    months.map((_, i) => padding.left + i * (barWidth + computedGap))
  );

  // Helpers
  function fmt(v: number) {
    return v.toLocaleString();
  }

  function abbrev(name: string) {
    return name ? name.slice(0, 3) : '';
  }
</script>

{#if !months || months.length === 0}
  <div class="empty">No hay datos para graficar</div>
{:else}
  <svg
    viewBox={`0 0 ${width} ${height}`}
    width={width}
    height={height}
    role="img"
    aria-label="Barras mensuales"
    class="chart"
  >
    <defs>
      <linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stop-color="#6b46c1" stop-opacity="0.95" />
        <stop offset="1" stop-color="#6b46c1" stop-opacity="0.72" />
      </linearGradient>
    </defs>

    <!-- Línea base -->
    <line
      x1={padding.left}
      x2={width - padding.right}
      y1={padding.top + chartH}
      y2={padding.top + chartH}
      fill="none"
      stroke="currentColor"
      class="line"
      stroke-width="1"
    />

    {#each months as m, i}
      {@const barH = Math.round(m.total * scale)}
      {@const x = xPositions[i]}
      {@const y = padding.top + (chartH - barH)}

      <g transform={`translate(${x}, ${y})`}>
        <rect
          width={barWidth}
          height={barH}
          rx="6"
          ry="6"
          fill="url(#g)"
        >
          <title>{`${m.name} — ${fmt(m.total)}`}</title>
        </rect>
      </g>
    {/each}

    <!-- Etiquetas del eje X -->
    {#each months as m, i}
      {@const x = xPositions[i] + barWidth / 2}
      <text
        x={x}
        y={padding.top + chartH + 18}
        font-size="11"
        fill="#333"
        text-anchor="middle"
        style="font-family: system-ui, -apple-system, 'Segoe UI', Roboto, Arial;"
      >
        {abbrev(m.name)}
      </text>
    {/each}
  </svg>
{/if}

<style>
.line {
  color: #bfbfbf;
}
.chart { display: block; }
.empty {
  color: #666;
  font-size: 1em;
  font-family: var(--font-normal);
}

@media (max-width: 520px) {
  svg { width: 100%; height: auto; }
}
@media (min-width: 700px) {
  .empty {
    font-size: 0.8em;
  }
}
</style>

