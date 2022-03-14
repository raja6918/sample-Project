import AlertsContainer from '../../OnlineValidation';
import { getPriorityAlertType } from '../../OnlineValidation/helpers';

const getToolbarItems = props => {
  const {
    clearSelectedPairing,
    openPairingDetails,
    t,
    activityType,
    pairing,
  } = props;
  const translateKey = 'PAIRINGS.toolbar';

  const toolbarItemForPreview = [
    {
      text: t(`${translateKey}.getInfo`),
      icon: 'info',
      active: false,
      props: {
        onClick: openPairingDetails,
      },
    },
    {
      text: '',
      icon: 'close',
      active: false,
      props: {
        onClick: clearSelectedPairing,
      },
    },
  ];

  const toolbarItemsForPRG = [
    {
      text: t(`${translateKey}.getInfo`),
      icon: 'info',
      active: false,
      props: {
        onClick: openPairingDetails,
      },
    },
    {
      text: t(`${translateKey}.multiSelect`),
      icon: 'done_all',
      active: false,
    },
    {
      text: t(`${translateKey}.selectAll`),
      icon: 'select_all',
      active: false,
    },
    {
      text: t(`${translateKey}.edit`),
      icon: 'edit',
      active: false,
      items: [
        {
          text: t(`${translateKey}.editName`),
          icon: 'title',
        },
        {
          text: t(`${translateKey}.editCc`),
          icon: 'people',
        },
        {
          text: t(`${translateKey}.join`),
          icon: 'link',
        },
      ],
    },
    {
      text: t(`${translateKey}.lock`),
      icon: 'lock',
      active: false,
    },
    {
      text: t(`${translateKey}.break`),
      icon: 'link_off',
      active: false,
    },
    {
      text: '',
      icon: 'close',
      active: false,
      props: {
        onClick: clearSelectedPairing,
      },
    },
  ];

  const toolbarItemsForAlerts = [
    {
      text: t(`${translateKey}.viewAlerts`),
      icon: 'info',
      active: false,
      component: AlertsContainer,
    },
  ];

  const toolbarItemsForFLT = [
    {
      text: t(`${translateKey}.getInfo`),
      icon: 'info',
      active: false,
      props: {
        onClick: () => console.log('Get details FLT'),
      },
    },
    {
      text: t(`${translateKey}.multiSelect`),
      icon: 'done_all',
      active: false,
    },
    {
      text: t(`${translateKey}.selectAll`),
      icon: 'select_all',
      active: false,
    },
    {
      text: t(`${translateKey}.edit`),
      icon: 'edit',
      active: false,
      items: [
        {
          text: t(`${translateKey}.editName`),
          icon: 'title',
        },
        {
          text: t(`${translateKey}.editCc`),
          icon: 'people',
        },
        {
          text: t(`${translateKey}.join`),
          icon: 'link',
        },
      ],
    },
    {
      text: t(`${translateKey}.zoom`),
      icon: 'zoom_in',
      active: false,
    },
    {
      text: '',
      icon: 'close',
      active: false,
      props: {
        onClick: clearSelectedPairing,
      },
    },
  ];

  const renderAlertBtn = getPriorityAlertType(pairing.alerts);
  const toolbarConfig = {
    PRG: renderAlertBtn
      ? [...toolbarItemsForAlerts, ...toolbarItemsForPRG]
      : toolbarItemsForPRG,
    FLT: toolbarItemsForFLT,
    PRV: renderAlertBtn
      ? [...toolbarItemsForAlerts, ...toolbarItemForPreview]
      : toolbarItemForPreview,
    default: null,
  };

  return toolbarConfig[activityType] || toolbarConfig.default;
};

export { getToolbarItems };
