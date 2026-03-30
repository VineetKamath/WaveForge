export function getDeterministicMigrationSteps(service, provider) {
  return {
    serviceId: service.id,
    provider: provider,
    steps: [
      {
        phase: "Pre-Migration",
        tasks: [
          `Assess ${service.name} dependencies (${service.dependencies.length} found)`,
          `Set up ${provider === 'AWS' ? 'AWS Migration Hub' : provider === 'Azure' ? 'Azure Migrate' : 'Google Cloud Migrate'}`,
          "Configure networking and IAM roles"
        ]
      },
      {
        phase: "Migration",
        tasks: [
          "Perform initial data sync",
          "Test application functionality in isolated environment",
          "Schedule cutover window"
        ]
      },
      {
        phase: "Post-Migration",
        tasks: [
          "Execute final delta sync",
          "Update DNS and routing",
          "Monitor performance and error rates",
          "Decommission legacy infrastructure"
        ]
      }
    ]
  };
}
