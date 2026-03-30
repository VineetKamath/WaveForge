export function migrationPrompt(service, provider) {
  return `Generate a step-by-step migration playbook for this service to ${provider}.
Service: ${JSON.stringify(service)}

Return JSON matching this schema:
{
  "serviceId": "${service.id}",
  "provider": "${provider}",
  "steps": [
    {
      "phase": "Pre-Migration",
      "tasks": ["Task 1", "Task 2"]
    },
    {
      "phase": "Migration",
      "tasks": ["Task 1", "Task 2"]
    },
    {
      "phase": "Post-Migration",
      "tasks": ["Task 1", "Task 2"]
    }
  ]
}`;
}
