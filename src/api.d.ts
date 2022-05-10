type WorkflowsAPIRoutePath = 'workflows' | 'workflows.archived';

type WorkflowAPIRoutePath =
  | 'workflow'
  | 'workflow.terminate'
  | 'events'
  | 'events.reverse'
  | 'query';

type TaskQueueAPIRoutePath = 'task-queue';
type ParameterlessAPIRoutePath = 'cluster' | 'settings' | 'user' | 'namespaces';
type SchedulesAPIRoutePath = 'schedules';

type APIRoutePath =
  | WorkflowsAPIRoutePath
  | WorkflowAPIRoutePath
  | ParameterlessAPIRoutePath
  | TaskQueueAPIRoutePath
  | WorkflowsAPIArchivalRoutePath
  | SchedulesAPIRoutePath;

type APIRouteParameters = {
  namespace: string;
  workflowId: string;
  runId: string;
  queue: string;
};

type WorkflowListRouteParameters = Pick<APIRouteParameters, 'namespace'>;

type WorkflowRouteParameters = Pick<
  APIRouteParameters,
  'namespace' | 'workflowId' | 'runId'
>;
type TaskQueueRouteParameters = Pick<APIRouteParameters, 'namespace' | 'queue'>;

type ValidWorkflowEndpoints = WorkflowsAPIRoutePath;

type ValidWorkflowParameters = ArchiveFilterParameters | FilterParameters;
