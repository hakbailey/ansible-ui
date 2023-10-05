export enum HubRoute {
  Hub = 'hub',

  Dashboard = 'hub-dashboard',

  // Automation Content
  Namespaces = 'hub-namespaces',
  CreateNamespace = 'hub-create-namespace',
  EditNamespace = 'hub-edit-namespace',
  NamespacePage = 'hub-namespace-page',
  NamespaceDetails = 'hub-namespace-details',

  Collections = 'hub-collections',
  UploadCollection = 'hub-create-collection',
  CollectionPage = 'hub-collection-page',

  ExecutionEnvironments = 'hub-execution-environments',

  SignatureKeys = 'hub-signature-keys',

  // Administration
  Repositories = 'hub-repositories',

  RemoteRegistries = 'hub-remote-registries',

  Tasks = 'hub-tasks',
  TaskPage = 'hub-task-page',

  Approvals = 'hub-approvals',

  Remotes = 'hub-remotes',
  CreateRemote = 'hub-create-remote',
  EditRemote = 'hub-edit-remote',
  RemotePage = 'hub-remote-page',

  // Access
  APIToken = 'hub-api-token',

  Login = 'hub-login',
}