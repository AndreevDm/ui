<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import {
    pagination,
    perPageFromSearchParameter,
    perPageOptions,
  } from '$lib/stores/pagination';

  import Icon from 'svelte-fa';
  import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';

  type T = $$Generic;

  export let key = 'per-page';
  export let items: T[];
  export let floatId: string | undefined = undefined;
  export let updating = false;

  import FilterSelect from './select/filter-select.svelte';
  import { getFloatStyle } from '$lib/utilities/get-float-style';

  export let startingIndex: string | number = 0;

  $: perPage = String(
    perPageFromSearchParameter($page.url.searchParams.get(key)),
  ).toString();
  $: store = pagination(items, perPage);
  $: store.jumpToIndex(startingIndex);

  let screenWidth: number;
  let width: number | undefined;
  let height: number | undefined;

  onMount(() => {
    if (floatId) {
      width = document.getElementById(floatId)?.clientWidth;
    }
  });

  $: floatStyle = getFloatStyle({ width, height, screenWidth });
</script>

<svelte:window bind:innerWidth={screenWidth} />

<div class="pagination flex flex-col gap-4 relative mb-8">
  <div class="flex justify-between">
    <p class="text-gray-600 mr-6 items-center flex">
      {#if updating}
        Updating…
      {/if}
    </p>
    <nav
      style={floatStyle}
      bind:clientHeight={height}
      class="flex justify-end gap-8"
    >
      <div class="flex gap-2 items-center justify-center">
        <p class="w-fit text-right">Per Page</p>
        <FilterSelect
          label="Per Page"
          parameter={key}
          value={perPage}
          options={perPageOptions(perPage)}
        />
      </div>
      <div class="flex gap-6 items-center justify-center">
        <button
          class="caret"
          disabled={!$store.hasPrevious}
          on:click={() => store.previous()}
        >
          <Icon icon={faAngleLeft} />
        </button>
        <p>
          {$store.startingIndex + 1}–{$store.endingIndex + 1} of {$store.length}
        </p>
        <button
          class="caret"
          disabled={!$store.hasNext}
          on:click={() => store.next()}
        >
          <Icon icon={faAngleRight} />
        </button>
      </div>
    </nav>
  </div>
  <slot visibleItems={$store.items} initialItem={$store.initialItem} />
  <nav class="flex justify-end gap-8">
    <div class="flex gap-2 items-center justify-center">
      <p class="w-fit text-right">Per Page</p>
      <FilterSelect
        label="Per Page"
        parameter={key}
        value={String(perPage)}
        options={perPageOptions(perPage)}
      />
    </div>
    <div class="flex gap-6 items-center justify-center">
      <button
        class="caret"
        disabled={!$store.hasPrevious}
        on:click={() => store.previous()}
      >
        <Icon icon={faAngleLeft} />
      </button>
      <p>
        {$store.startingIndex + 1}–{$store.endingIndex + 1} of {$store.length}
      </p>
      <button
        class="caret"
        disabled={!$store.hasNext}
        on:click={() => store.next()}
      >
        <Icon icon={faAngleRight} />
      </button>
    </div>
  </nav>
</div>

<style lang="postcss">
  .caret {
    @apply text-gray-500;
  }

  .caret:disabled {
    @apply text-gray-300 cursor-not-allowed;
  }
</style>
