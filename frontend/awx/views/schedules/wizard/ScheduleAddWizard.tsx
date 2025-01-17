import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  PageHeader,
  PageLayout,
  PageNotImplemented,
  PageWizard,
  PageWizardStep,
} from '../../../../../framework';
import { useGetPageUrl } from '../../../../../framework/PageNavigation/useGetPageUrl';
import { dateToInputDateTime } from '../../../../../framework/utils/dateTimeHelpers';
import { AwxRoute } from '../../../main/AwxRoutes';
import { ScheduleInputs } from '../components/ScheduleInputs';
import { ScheduleFormWizard } from '../types';
import { awxErrorAdapter } from '../../../common/adapters/awxErrorAdapter';
import { useGetTimezones } from '../hooks/useGetTimezones';

export function CreateSchedule() {
  const { t } = useTranslation();
  const getPageUrl = useGetPageUrl();
  const now = DateTime.now();

  const closestQuarterHour: DateTime = DateTime.fromMillis(
    Math.ceil(now.toMillis() / 900000) * 900000
  );
  const navigate = useNavigate();

  const [currentDate, time]: string[] = dateToInputDateTime(closestQuarterHour.toISO() as string);
  const handleSubmit = async (formValues: ScheduleFormWizard) => {
    const { unified_job_template_object, launch_config, prompt } = formValues;
    const promptValues = prompt;

    if (promptValues) {
      if (unified_job_template_object && 'organization' in unified_job_template_object) {
        promptValues.organization = unified_job_template_object.organization ?? null;
      }
      if (launch_config) {
        promptValues.original = {
          launch_config,
        };
      }
    }

    await Promise.resolve();
  };

  const onCancel = () => navigate(-1);

  const { timeZones, links } = useGetTimezones();

  const steps: PageWizardStep[] = [
    {
      id: 'typeStep',
      label: t('Details'),
      inputs: <ScheduleInputs onError={() => {}} zoneLinks={links} timeZones={timeZones} />,
    },
    {
      id: 'promptsStep',
      label: t('Prompts'),
      inputs: <PageNotImplemented />,
    },
    { id: 'survey', label: t('Survey'), element: <PageNotImplemented /> },
    { id: 'occurrences', label: t('Occurrences'), element: <PageNotImplemented /> },
    { id: 'exceptions', label: t('Exceptions'), element: <PageNotImplemented /> },
    { id: 'review', label: t('Review'), element: <PageNotImplemented /> },
  ];
  return (
    <PageLayout>
      <PageHeader
        title={t('Create Schedule')}
        breadcrumbs={[
          { label: t('Schedules'), to: getPageUrl(AwxRoute.Schedules) },
          { label: t('Create Schedule') },
        ]}
      />
      <PageWizard<ScheduleFormWizard>
        steps={steps}
        onCancel={onCancel}
        defaultValue={{ startDateTime: { date: currentDate, time: time } }}
        onSubmit={handleSubmit}
        errorAdapter={awxErrorAdapter}
      />
    </PageLayout>
  );
}
