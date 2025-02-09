<script lang="ts">
  import { page } from '$app/stores';

  import { format } from '$lib/utilities/format-camel-case';
  import { routeForWorkflow, routeForWorkers } from '$lib/utilities/route-for';
  import {
    getCodeBlockValue,
    shouldDisplayAsWorkflowLink,
    shouldDisplayAsWorkersLink,
    shouldDisplayAsPlainText,
  } from '$lib/utilities/get-single-attribute-for-event';

  import CodeBlock from '../code-block.svelte';
  import Link from '../link.svelte';
  import Copyable from '../copyable.svelte';

  export let key: string;
  export let value: string | Record<string, unknown>;
  export let inline = false;

  const { workflow, namespace, run } = $page.params;
</script>

<article class="row flex px-4 first:pt-0 {$$props.class}">
  {#if typeof value === 'object'}
    <div class="code-block-row">
      <h2 class="text-sm">
        {format(key)}
      </h2>
      <CodeBlock
        content={getCodeBlockValue(value)}
        class="w-full text-right lg:h-auto"
        {inline}
      />
    </div>
  {:else if shouldDisplayAsWorkflowLink(key)}
    <div class="detail-row">
      <h2 class="text-sm">{format(key)}</h2>
      <div class="text-sm">
        <Copyable
          content={value}
          container-class="flex-row-reverse xl:flex-row"
          size="xs"
        >
          <Link href={routeForWorkflow({ namespace, workflow, run: value })}>
            {value}
          </Link>
        </Copyable>
      </div>
    </div>
  {:else if shouldDisplayAsWorkersLink(key)}
    <div class="detail-row">
      <h2 class="text-sm">{format(key)}</h2>
      <div class="text-sm">
        <Copyable content={value} container-class="xl:flex-row" size="xs">
          <Link href={routeForWorkers({ namespace, workflow, run })}>
            {value}
          </Link>
        </Copyable>
      </div>
    </div>
  {:else}
    <div class="detail-row">
      <h2 class="text-sm">{format(key)}</h2>
      <p class="text-sm">
        <span
          class="px-2 select-all"
          class:badge={!shouldDisplayAsPlainText(key)}>{value}</span
        >
      </p>
    </div>
  {/if}
</article>

<style lang="postcss">
  .code-block-row {
    @apply block w-full py-2 text-left border-b-2 border-gray-200;
  }
  .detail-row {
    @apply block xl:flex items-start gap-4 w-full py-2 text-left border-b-2 border-gray-200;
  }
  .row:last-of-type .detail-row {
    @apply border-b-0;
  }
  .row:last-of-type .code-block-row {
    @apply border-b-0;
  }
  .badge {
    @apply text-gray-700 bg-gray-300;
  }
</style>
