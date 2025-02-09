import { isEventGroup } from '$lib/models/event-groups';
import { getLastEvent } from '$lib/models/event-groups/get-last-event';
import { capitalize } from '$lib/utilities/format-camel-case';

type SummaryAttribute = {
  key: string;
  value: string | Record<string, unknown>;
};

const emptyAttribute: SummaryAttribute = { key: '', value: '' };

const keysForPlainText: Readonly<Set<string>> = new Set([
  'activityId',
  'attempt',
  'binaryChecksum',
  'identity',
  'parentInitiatedEventId',
  'requestId',
  'scheduledEventId',
  'startedEventId',
]);

export const shouldDisplayAsPlainText = (key: string): boolean => {
  return keysForPlainText.has(key);
};

export const shouldDisplayAttribute = (
  key: string,
  value: unknown,
): boolean => {
  if (value === null) return false;
  if (value === undefined) return false;
  if (value === '') return false;
  if (value === '0s') return false;
  if (key === 'type') return false;
  return true;
};

export const shouldDisplayNestedAttribute = (value: unknown): boolean => {
  if (value === null) return false;
  if (value === undefined) return false;
  if (value === '') return false;
  if (Array.isArray(value) && !value.length) return false;

  return true;
};

export const getCodeBlockValue: Parameters<typeof JSON.stringify>[0] = (
  value: string | Record<string, unknown>,
) => {
  if (typeof value === 'string') return value;
  return value?.payloads ?? value?.indexedFields ?? value?.points ?? value;
};

const keysWithWorkflowLinks = [
  'baseRunId',
  'continuedExecutionRunId',
  'firstExecutionRunId',
  'newExecutionRunId',
  'newRunId',
  'originalExecutionRunId',
] as const;

const keysWithWorkerLinks = ['taskQueueName'] as const;

export const shouldDisplayAsWorkflowLink = (
  key: string,
): key is typeof keysWithWorkflowLinks[number] => {
  for (const workflowKey of keysWithWorkflowLinks) {
    if (key === workflowKey) return true;
  }

  return false;
};

export const shouldDisplayAsWorkersLink = (
  key: string,
): key is typeof keysWithWorkerLinks[number] => {
  for (const workerKey of keysWithWorkerLinks) {
    if (key === workerKey) return true;
  }

  return false;
};

const formatSummaryValue = (key: string, value: unknown): SummaryAttribute => {
  if (typeof value === 'object') {
    const [firstKey] = Object.keys(value);
    return { key: key + capitalize(firstKey), value: value[firstKey] };
  } else {
    return { key, value: value.toString() };
  }
};

/**
 * A list of the keys that should be shown in the summary view.
 */
const preferredSummaryKeys = [
  'failure',
  'input',
  'activityType',
  'parentInitiatedEventId',
  'workflowType',
  'taskQueue',
] as const;

/**
 * Returns that first event attribute that is eligible to be displayed.
 */
const getFirstDisplayAttribute = ({
  attributes,
}: WorkflowEvent): SummaryAttribute => {
  for (const [key, value] of Object.entries(attributes)) {
    if (shouldDisplayAttribute(key, value)) {
      return formatSummaryValue(key, value);
    }
  }
};

/**
 * Iterates through the keys of an event and compares it with the list of
 * preferred keys. If a preferred key is found, it will be returned.
 * Otherwise, it will return the first eligible event attribute.
 */
const getSummaryAttribute = (event: WorkflowEvent): SummaryAttribute => {
  const first = getFirstDisplayAttribute(event);

  for (const [key, value] of Object.entries(event.attributes)) {
    for (const preferredKey of preferredSummaryKeys) {
      if (key === preferredKey && shouldDisplayAttribute(key, value))
        return formatSummaryValue(key, value);
    }
  }

  return first;
};

export const getSummaryForEventGroup = (
  eventGroup: EventGroup,
): SummaryAttribute => {
  const event = getLastEvent(eventGroup);

  return getSummaryAttribute(event);
};

export const getSingleAttributeForEvent = (
  event: WorkflowEvent | EventGroup,
): SummaryAttribute => {
  if (!event) return emptyAttribute;

  if (isEventGroup(event)) {
    return getSummaryForEventGroup(event);
  }

  return getSummaryAttribute(event);
};
