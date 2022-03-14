export const getHeaders = (solvers, t) => {
  const Headers = [
    {
      id: 'statistics',
      name: t('SOLVER.tabCompare.statistic'),
      fixed: 'left',
      minWidth: 250,
    },
  ];

  for (let i = 0; i < solvers.length; i++) {
    Headers.push({
      id: solvers[i].id,
      name: solvers[i].name,
      sticky: false,
    });
  }

  Headers.push({
    id: 'delete',
    name: '',
    width: 80,
    minWidth: 80,
    fixed: 'right',
  });

  return Headers;
};
