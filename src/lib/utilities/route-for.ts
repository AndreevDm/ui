import { toURL } from './to-url';

export type EventView = 'full' | 'compact' | 'summary' | 'json';

type RouteParameters = {
  namespace: string;
  workflow: string;
  run: string;
  view?: EventView;
  eventId: string;
  queue: string;
  endpoint?: string;
  searchParams?: URLSearchParams | Record<string, string>;
};

export const isEventView = (view: string): view is EventView => {
  if (view === 'summary') return true;
  if (view === 'compact') return true;
  if (view === 'json') return true;
  return false;
};

export type NamespaceParameter = Pick<RouteParameters, 'namespace'>;
export type WorkflowsParameters = Pick<
  RouteParameters,
  'namespace' | 'endpoint' | 'searchParams'
>;
export type WorkflowParameters = Pick<
  RouteParameters,
  'namespace' | 'workflow' | 'run' | 'endpoint' | 'searchParams'
>;
export type EventHistoryParameters = Pick<
  RouteParameters,
  'namespace' | 'workflow' | 'run' | 'view' | 'endpoint' | 'searchParams'
>;
export type EventParameters = Required<
  Pick<RouteParameters, 'namespace' | 'workflow' | 'run' | 'view' | 'eventId'>
>;

const routeIfEndpoint = (
  route: string,
  endpoint?: string,
  searchParams?: URLSearchParams | Record<string, string>,
): string => {
  if (endpoint) return toURL(`${route}/${endpoint}`, searchParams);
  return route;
};

export const routeForNamespace = ({
  namespace,
}: NamespaceParameter): string => {
  return `/namespaces/${namespace}`;
};

export const routeForWorkflows = ({
  namespace,
  endpoint,
  searchParams,
}: WorkflowsParameters): string => {
  const route = `${routeForNamespace({ namespace })}/workflows`;
  return routeIfEndpoint(route, endpoint, searchParams);
};

export const routeForArchivalWorkfows = (
  parameters: NamespaceParameter,
): string => {
  return `${routeForNamespace(parameters)}/archival`;
};

export const routeForWorkflow = ({
  workflow,
  run,
  namespace,
  endpoint,
  searchParams,
}: WorkflowParameters): string => {
  const route = `${routeForWorkflows({ namespace })}/${workflow}/${run}`;
  return routeIfEndpoint(route, endpoint, searchParams);
};

export const routeForEventHistory = ({
  workflow,
  run,
  namespace,
  view,
  endpoint,
  searchParams,
}: EventHistoryParameters): string => {
  const workflowPath = `${routeForWorkflow({ workflow, run, namespace })}`;
  const eventHistoryPath = `${workflowPath}/history`;
  if (!view) return routeIfEndpoint(eventHistoryPath, endpoint, searchParams);
  if (view === 'summary') return `${eventHistoryPath}/summary`;
  if (view === 'full') return `${eventHistoryPath}/full`;
  if (view === 'compact') return `${eventHistoryPath}/compact`;
  if (view === 'json') return `${eventHistoryPath}/json`;
};

export const routeForEventHistoryItem = (
  parameters: EventParameters,
): string => {
  return `${routeForEventHistory(parameters)}/${parameters.eventId}`;
};

export const routeForWorkers = (parameters: WorkflowParameters) => {
  return `${routeForWorkflow(parameters)}/workers`;
};

export const routeForStackTrace = (parameters: WorkflowParameters) => {
  return `${routeForWorkflow(parameters)}/stack-trace`;
};

export const routeForWorkflowQuery = (parameters: WorkflowParameters) => {
  return `${routeForWorkflow(parameters)}/query`;
};

export const routeForPendingActivities = (parameters: WorkflowParameters) => {
  return `${routeForWorkflow(parameters)}/pending-activities`;
};

type RouteParameter = string | URLSearchParams | Record<string, string>;

const hasParameters =
  <T extends Record<string, RouteParameter>>(...required: string[]) =>
  (parameters: Record<string, RouteParameter>): parameters is T => {
    for (const parameter of required) {
      if (!parameters[parameter]) return false;
    }
    return true;
  };

export const isNamespaceParameter =
  hasParameters<NamespaceParameter>('namespace');

export const isWorkflowsParameters = hasParameters<WorkflowsParameters>(
  'namespace',
  'endpoint',
  'searchParams',
);

export const isWorkflowParameters = hasParameters<WorkflowParameters>(
  'namespace',
  'workflow',
  'run',
  'endpoint',
  'searchParams',
);

export const isEventHistoryParameters = hasParameters<EventHistoryParameters>(
  'namespace',
  'workflow',
  'run',
  'view',
  'endpoint',
  'searchParams',
);

export const isEventParameters = hasParameters<EventParameters>(
  'namespace',
  'workflow',
  'run',
  'view',
  'eventId',
);
