<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';

  import { eventViewType, eventSortOrder } from '$lib/stores/event-view';
  import { routeForEventHistory } from '$lib/utilities/route-for';

  const { namespace, workflow, run } = $page.params;

  onMount(async () => {
    const queryParams = { sort: $eventSortOrder };
    goto(
      routeForEventHistory({
        view: $eventViewType,
        queryParams,
        namespace,
        workflow,
        run,
      }),
      {
        replaceState: true,
      },
    );
  });
</script>
