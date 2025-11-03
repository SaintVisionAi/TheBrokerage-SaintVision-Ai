export const LENDING_PIPELINE_STAGES = {
  NEW_LEAD: 'new_lead',
  QUALIFIED: 'qualified',
  PRE_QUALIFIED: 'pre_qualified',
  DOCUMENTATION: 'documentation',
  UNDERWRITING: 'underwriting',
  APPROVED: 'approved',
  FUNDED: 'funded',
  CLOSED_LOST: 'closed_lost'
} as const;

export async function updateOpportunityStage(opportunityId: string, stageId: string, locationId: string) {
  const client = await getGHLClient();
  return client.opportunities.update(opportunityId, { pipelineStageId: stageId, locationId });
}

export async function triggerGHLWorkflow(workflowId: string, contactId: string, eventData?: Record<string, any>) {
  const client = await getGHLClient();
  return client.workflows.trigger(workflowId, { contactId, eventStarterData: eventData || {} });
}
