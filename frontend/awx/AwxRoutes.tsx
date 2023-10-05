export enum AwxRoute {
  Awx = 'awx',

  Dashboard = 'awx-dashboard',

  // Views

  Jobs = 'awx-jobs',
  JobPage = 'awx-job-page',
  JobOutput = 'awx-job-output',
  JobDetails = 'awx-job-details',

  Schedules = 'awx-schedules',
  CreateSchedule = 'awx-create-schedule',
  EditSchedule = 'awx-edit-schedule',

  ActivityStream = 'awx-activity-stream',

  WorkflowApprovals = 'awx-workflow-approvals',
  WorkflowApprovalPage = 'awx-workflow-approval-page',

  // Resources

  Templates = 'awx-templates',
  CreateJobTemplate = 'awx-create-job-template',
  CreateWorkflowJobTemplate = 'awx-create-workflow-job-template',
  EditJobTemplate = 'awx-edit-template',
  JobTemplatePage = 'awx-template-page',
  JobTemplateDetails = 'awx-template-details',
  JobTemplateScheduleDetails = 'awx-job-template-schedule-details',
  JobTemplateAccess = 'awx-job-template-access',
  JobTemplateJobs = 'awx-job-template-jobs',
  JobTemplateSurvey = 'awx-job-template-survey',
  JobTemplateNotifications = 'awx-job-template-notifications',
  JobTemplateSchedules = 'awx-job-template-schedules',
  JobTemplateSchedulePage = 'awx-template-schedule-page',
  JobTemplateScheduleCreate = 'awx-template-schedule-create',
  JobTemplateEditSchedule = 'awx-job-template-edit-schedule',
  JobTemplateScheduleRrules = 'awx-template-schedule-rrules',

  WorkflowJobTemplatePage = 'awx-workflow-job-template-page',
  WorkflowJobTemplateDetails = 'awx-workflow-job-template-details',
  WorkflowJobTemplateAccess = 'awx-workflow-job-template-access',
  WorkflowJobTemplateSchedules = 'awx-workflow-job-template-schedules',
  WorkflowJobTemplateSchedulePage = 'awx-workflow-job-template-schedule-page',
  WorkflowJobTemplateScheduleDetails = 'awx-workflow-job-template-schedule-details',
  WorkflowJobTemplateScheduleRrules = 'awx-workflow-job-template-schedule-rrules',
  WorkflowJobTemplateScheduleCreate = 'awx-workflow-job-template-schedule-create',
  WorkflowJobTemplateEditSchedule = 'awx-workflow-job-template-edit-schedule',
  WorkflowJobTemplateJobs = 'awx-workflow-job-template-jobs',
  WorkflowJobTemplateSurvey = 'awx-workflow-job-template-survey',
  WorkflowJobTemplateVisualizer = 'awx-workflow-job-template-visualizer',
  WorkflowJobTemplateNotifications = 'awx-workflow-job-template-notifications',
  EditWorkflowJobTemplate = 'awx-edit-workflow-job-template',
  WorkflowVisualizer = 'awx-workflow-visualizer',

  Credentials = 'awx-credentials',
  CreateCredential = 'awx-create-credential',
  EditCredential = 'awx-edit-credential',
  CredentialPage = 'awx-credential-page',
  CredentialDetails = 'awx-credential-details',
  CredentialAccess = 'awx-credentials-access',

  Projects = 'awx-projects',
  CreateProject = 'awx-create-project',
  ProjectPage = 'awx-project-page',
  EditProject = 'awx-edit-project',
  ProjectDetails = 'awx-project-details',
  ProjectAccess = 'awx-project-access',
  ProjectJobTemplates = 'awx-project-job-templates',
  ProjectNotifications = 'awx-project-notifications',
  ProjectScheduleCreate = 'awx-project-schedule-create',
  ProjectScheduleEdit = 'awx-project-schedule-edit',
  ProjectSchedules = 'awx-project-schedules',
  ProjectSurvey = 'awx-project-survey',

  ProjectSchedulePage = 'awx-project-schedule-page',
  ProjectScheduleDetails = 'awx-project-schedule-details',
  ProjectScheduleRrules = 'awx-project-schedule-rrules',

  Inventories = 'awx-inventories',
  CreateInventory = 'awx-create-inventory',
  CreateSmartInventory = 'awx-create-smart-inventory',
  CreateConstructedInventory = 'awx-create-constructed-inventory',
  EditInventory = 'awx-edit-inventory',
  InventoryPage = 'awx-inventory-page',
  InventoryDetails = 'awx-inventory-details',
  InventoryAccess = 'awx-inventory-access',
  InventoryGroups = 'awx-inventory-groups',
  InventoryHosts = 'awx-inventory-hosts',
  InventorySources = 'awx-inventory-sources',
  InventoryJobs = 'awx-inventory-jobs',
  InventoryJobTemplates = 'awx-inventory-job-templates',
  InventorySourceSchedules = 'awx-inventory-schedules',
  InventorySourceScheduleCreate = 'awx-inventory-schedule-create',
  InventorySourceScheduleEdit = 'awx-inventory-schedule-edit',
  InventorySourceSchedulePage = 'awx-inventory-schedule-page',
  InventorySourceScheduleDetails = 'awx-inventory-schedule-details',
  InventorySourceScheduleRrules = 'awx-inventory-schedule-rrules',

  Hosts = 'awx-hosts',
  CreateHost = 'awx-create-host',
  EditHost = 'awx-edit-host',
  HostPage = 'awx-host-page',

  // Access

  Organizations = 'awx-organizations',
  CreateOrganization = 'awx-create-organization',
  EditOrganization = 'awx-edit-organization',
  OrganizationPage = 'awx-organization-page',
  OrganizationDetails = 'awx-organization-details',
  OrganizationAccess = 'awx-organization-access',
  OrganizationTeams = 'awx-organization-teams',
  OrganizationExecutionEnvironments = 'awx-organization-execution-environments',
  OrganizationNotifications = 'awx-organization-notifications',

  Teams = 'awx-teams',
  CreateTeam = 'awx-create-team',
  EditTeam = 'awx-edit-team',
  TeamPage = 'awx-team-page',
  TeamDetails = 'awx-team-details',
  TeamAccess = 'awx-team-access',
  TeamRoles = 'awx-team-roles',
  AddRolesToTeam = 'awx-add-roles-to-team',

  Users = 'awx-users',
  CreateUser = 'awx-create-user',
  EditUser = 'awx-edit-user',
  UserPage = 'awx-user-page',
  UserDetails = 'awx-user-details',
  UserOrganizations = 'awx-user-organizations',
  UserTeams = 'awx-user-teams',
  UserRoles = 'awx-user-roles',
  AddRolesToUser = 'awx-add-roles-to-user',

  // Administration

  CredentialTypes = 'awx-credential-types',
  CredentialType = 'awx-credential-type',
  CredentialTypeDetails = 'awx-credential-type-details',

  NotificationTemplates = 'awx-notification-templates',
  NotificationTemplatePage = 'awx-notification-template-page',
  NotificationTemplateDetails = 'awx-notification-template-details',

  ManagementJobs = 'awx-management-jobs',
  ManagementJobPage = 'awx-management-job-page',
  ManagementJobSchedules = 'awx-management-job-schedules',
  ManagementJobNotifications = 'awx-management-job-notifications',

  ManagementJobSchedulePage = 'awx-management-job-schedule-page',
  ManagementJobScheduleDetails = 'awx-management-job-schedule-details',
  ManagementJobScheduleRrules = 'awx-management-job-schedule-rrules',
  ManagementJobEditSchedule = 'awx-management-job-edit-schedule',

  CreateInstanceGroup = 'awx-create-instance-group',
  EditInstanceGroup = 'awx-edit-instance-group',
  InstanceGroupPage = 'awx-instance-group-page',
  InstanceGroups = 'awx-instance-groups',

  Instances = 'awx-instances',
  EditInstance = 'awx-edit-instance',
  InstancePage = 'awx-instance-page',

  Applications = 'awx-applications',
  ApplicationPage = 'awx-application-page',

  ExecutionEnvironments = 'awx-execution-environments',

  TopologyView = 'awx-topology-view',

  // Analytics

  Analytics = 'awx-analytics',
  Reports = 'awx-reports',
  HostMetrics = 'awx-host-metrics',
  SubscriptionUsage = 'awx-subscription-usage',

  // Settings

  Settings = 'awx-settings',

  Login = 'awx-login',
}