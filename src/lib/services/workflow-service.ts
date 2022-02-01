import type { ListWorkflowExecutionsResponse } from '$types';
import type { WorkflowExecution } from '$lib/models/workflow-execution';

import { requestFromAPI } from '$lib/utilities/request-from-api';

import type { RequestFromAPIOptions } from '$lib/utilities/request-from-api';

import {
  toWorkflowExecution,
  toWorkflowExecutions,
} from '$lib/models/workflow-execution';

import { routeForApi } from '$lib/utilities/route-for-api';
import { toListWorkflowQuery } from '$lib/utilities/list-workflow-query';

export type GetWorkflowExecutionRequest = NamespaceScopedRequest & {
  executionId: string;
  runId: string;
};

export type CombinedWorkflowExecutionsResponse = {
  workflows: WorkflowExecution[];
  nextPageToken: string;
};

export const fetchAllWorkflows = async (
  namespace: string,
  parameters: FilterParameters,
  request = fetch,
): Promise<CombinedWorkflowExecutionsResponse> => {
  const query = toListWorkflowQuery(parameters);

  const { executions, nextPageToken } =
    (await requestFromAPI<ListWorkflowExecutionsResponse>(
      routeForApi('workflows', { namespace }),
      {
        params: { query },
        request,
      },
    )) ?? { executions: [], nextPageToken: '' };

  return {
    workflows: toWorkflowExecutions({ executions }),
    nextPageToken: String(nextPageToken),
  };
};

export const fetchAllArchivedWorkflows = async (
  namespace: string,
  parameters: ArchiveFilterParameters,
  request = fetch,
): Promise<CombinedWorkflowExecutionsResponse> => {
  const query = toListWorkflowQuery(parameters);

  const { executions, nextPageToken } =
    (await requestFromAPI<ListWorkflowExecutionsResponse>(
      routeForApi('archive', { namespace }),
      {
        params: { query },
        request,
      },
    )) ?? { executions: [], nextPageToken: '' };

  return {
    workflows: toWorkflowExecutions({ executions }),
    nextPageToken: String(nextPageToken),
  };
};

export async function fetchWorkflow(
  parameters: GetWorkflowExecutionRequest,
  request = fetch,
  extraOptions: RequestFromAPIOptions,
): Promise<WorkflowExecution> {
  return requestFromAPI(routeForApi('workflow', parameters), {
    request,
    ...extraOptions,
  }).then(toWorkflowExecution);
}
