import { DropdownPosition } from '@patternfly/react-core/deprecated';
import { useTranslation, Trans } from 'react-i18next';
import { useParams } from 'react-router-dom';
import {
  LoadingPage,
  PageActions,
  PageHeader,
  PageLayout,
  useGetPageUrl,
  DateTimeCell,
} from '../../../../framework';
import { PageRoutedTabs } from '../../../../framework/PageTabs/PageRoutedTabs';
import { useGet } from '../../../common/crud/useGet';
import { HubError } from '../../common/HubError';
import { hubAPI } from '../../common/api/formatPath';
import { HubRoute } from '../../main/HubRoutes';
import { ExecutionEnvironment } from '../ExecutionEnvironment';
import { useExecutionEnvironmentPageActions } from './hooks/useExecutionEnvironmentPageActions';
import { SignStatus } from './components/SignStatus';
import { StatusLabel } from '../../../common/Status';
import { Flex, FlexItem, Stack } from '@patternfly/react-core';
import { HelperText } from '../../common/HelperText';

export function ExecutionEnvironmentPage() {
  const { t } = useTranslation();
  const params = useParams<{ id: string }>();
  const {
    data: ee,
    error,
    isLoading,
    refresh,
  } = useGet<ExecutionEnvironment>(
    hubAPI`/v3/plugin/execution-environments/repositories/${params.id ?? ''}/`,
    undefined,
    { refreshInterval: 10000 }
  );

  const getPageUrl = useGetPageUrl();
  const pageActions = useExecutionEnvironmentPageActions({ refresh });

  if (error) {
    return <HubError error={error} handleRefresh={refresh} />;
  }

  if (isLoading || !ee) {
    return <LoadingPage />;
  }

  const lastSyncTask = ee?.pulp?.repository?.remote?.last_sync_task;

  return (
    <PageLayout>
      <PageHeader
        title={ee.name}
        breadcrumbs={[
          { label: t('Execution Environments'), to: getPageUrl(HubRoute.ExecutionEnvironments) },
          { label: ee.name },
        ]}
        description={ee?.description}
        footer={
          <Stack hasGutter>
            <div>
              <SignStatus state={ee?.pulp?.repository?.sign_state} />
            </div>
            {!!lastSyncTask?.state && (
              <Flex gap={{ default: 'gapSm' }}>
                <FlexItem>
                  <Trans>
                    Last updated from registry <DateTimeCell value={lastSyncTask?.finished_at} />
                  </Trans>
                </FlexItem>
                <FlexItem>
                  <StatusLabel status={lastSyncTask?.state} />
                </FlexItem>
                {lastSyncTask?.error && (
                  <FlexItem>
                    <HelperText content={lastSyncTask?.error?.description} />
                  </FlexItem>
                )}
              </Flex>
            )}
          </Stack>
        }
        headerActions={
          <PageActions<ExecutionEnvironment>
            actions={pageActions}
            position={DropdownPosition.right}
            selectedItem={ee}
          />
        }
      />
      <PageRoutedTabs
        tabs={[
          {
            label: t('Details'),
            page: HubRoute.ExecutionEnvironmentDetails,
            dataCy: 'execution-environment-details-tab',
          },
          {
            label: t('Activity'),
            page: HubRoute.ExecutionEnvironmentActivity,
            dataCy: 'execution-environment-activity-tab',
          },
          {
            label: t('Images'),
            page: HubRoute.ExecutionEnvironmentImages,
            dataCy: 'execution-environment-images-tab',
          },
          {
            label: t('Access'),
            page: HubRoute.ExecutionEnvironmentAccess,
            dataCy: 'execution-environment-access-tab',
          },
        ]}
        params={{ id: ee.name }}
        componentParams={{ executionEnvironment: ee }}
      />
    </PageLayout>
  );
}
