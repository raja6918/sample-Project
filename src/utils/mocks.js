/*export function init(mock) {
  mock.onGet('/users').reply(200, [
    {
      id: 1001,
      firstName: 'Ruben',
      lastName: 'Flores',
      username: 'rubnsom',
      email: 'ruben.flores@kronos.com',
      role: 'Administrator'
    },
    {
      id: 1002,
      firstName: 'Ramon',
      lastName: 'Barraza',
      username: 'rbarraza',
      email: 'ramon.barraza@kronos.com',
      role: 'Administrator'
    },
    {
      id: 1003,
      firstName: 'Carlos',
      lastName: 'Perez',
      username: 'caperez',
      email: 'carlos.perez@kronos.com',
      role: 'Administrator'
    },
    {
      id: 1004,
      firstName: 'Juan',
      lastName: 'Lopéz',
      username: 'julopez',
      email: 'juan.lopez@kronos.com',
      role: 'Planner'
    },
    {
      id: 1005,
      firstName: 'Daniel',
      lastName: 'Robles',
      username: 'darobles',
      email: 'daniel.robles@kronos.com',
      role: 'Reviewer'
    }
  ]);

  mock.onGet('/scenarios').reply(200, [
    {
      id: 1001,
      name: 'Today scenario test #1',
      startDate: 1494547200,
      endDate: 1523656048,
      createdBy: 'Ruben Flores',
      creationTime: 1520977648,
      lastOpenedByMe: Math.round(new Date().getTime() / 1000)
    },
    {
      id: 999,
      name: 'April Prod - 777 Pilots Lorem ipsum dolor sit amet',
      startDate: 1494547200,
      endDate: 1523656048,
      createdBy: 'Ruben Flores',
      creationTime: 1520977648,
      lastOpenedByMe: Math.round(new Date().getTime() / 1000)
    },
    {
      id: 1000,
      name: 'Today scenario test #3',
      startDate: 1494547200,
      endDate: 1523656048,
      createdBy: 'Ruben Flores',
      creationTime: 1520977648,
      lastOpenedByMe: Math.round(new Date().getTime() / 1000)
    },
    {
      id: 1002,
      name: 'TODAY Prod - 777 Pilots',
      startDate: 1522717858,
      endDate: 1523656048,
      createdBy: 'Ruben Flores',
      creationTime: 1522717858,
      lastOpenedByMe: 1522717858
    },
    {
      id: 1003,
      name: 'April Prod - 777 Pilots',
      startDate: 1522717858,
      endDate: 1523656048,
      createdBy: 'Ruben Flores',
      creationTime: 1522717858,
      lastOpenedByMe: 1522717858
    },
    {
      id: 1004,
      name: 'April Prod - 777 Pilots',
      startDate: 1522717858,
      endDate: 1523656048,
      createdBy: 'Ruben Flores',
      creationTime: 1522717858,
      lastOpenedByMe: 1522717858
    },
    {
      id: 1005,
      name: 'April Prod - 777 Pilots',
      startDate: 1520977648,
      endDate: 1523656048,
      createdBy: 'Ruben Flores',
      creationTime: 1520977648,
      lastOpenedByMe: 1522540800
    },
    {
      id: 1006,
      name: 'April Prod - 777 Pilots',
      startDate: 1494547200,
      endDate: 1523656048,
      createdBy: 'Ruben Flores',
      creationTime: 1520977648,
      lastOpenedByMe: 1520981248
    },
    {
      id: 1007,
      name: 'April Prod - 777 Pilots',
      startDate: 1520977648,
      endDate: 1523656048,
      createdBy: 'Ruben Flores',
      creationTime: 1520977648,
      lastOpenedByMe: 1520981248
    },
    {
      id: 1008,
      name: 'April Prod - 777 Pilots',
      startDate: 1520977648,
      endDate: 1523656048,
      createdBy: 'Ruben Flores',
      creationTime: 1520977648,
      lastOpenedByMe: 1520981248
    },
    {
      id: 1009,
      name: 'April Prod - 777 Pilots',
      startDate: 1520977648,
      endDate: 1523656048,
      createdBy: 'Ruben Flores',
      creationTime: 1520977648,
      lastOpenedByMe: 1518134400
    },
    {
      id: 1010,
      name: 'April Prod - 777 Pilots',
      startDate: 1520977648,
      endDate: 1523656048,
      createdBy: 'Ruben Flores',
      creationTime: 1520977648,
      lastOpenedByMe: 1518134400
    },
    {
      id: 1011,
      name: 'April Prod - 777 Pilots',
      startDate: 1520977648,
      endDate: 1523656048,
      createdBy: 'Ruben Flores',
      creationTime: 1520977648,
      lastOpenedByMe: 1518134400
    },
    {
      id: 1012,
      name: 'April Prod - 777 Pilots',
      startDate: 1520977648,
      endDate: 1523656048,
      createdBy: 'Ruben Flores',
      creationTime: 1520977648,
      lastOpenedByMe: 1518134400
    },
    {
      id: 1013,
      name: 'April Prod - 777 Pilots',
      startDate: 1520977648,
      endDate: 1523656048,
      createdBy: 'Ruben Flores',
      creationTime: 1520977648,
      lastOpenedByMe: 1518134400
    },
    {
      id: 1014,
      name: 'April Prod - 777 Pilots',
      startDate: 1520977648,
      endDate: 1523656048,
      createdBy: 'Ruben Flores',
      creationTime: 1520977648,
      lastOpenedByMe: 1518134400
    }
  ]);
  mock.onDelete(/\/scenarios\/\w+/).reply(200);

  mock.onDelete('/users/rbarraza').reply(500);
  mock.onDelete(/\/users\/\w+/).reply(200);

  mock.onPut('/users/rbarraza').reply(500);
  mock.onPut(/\/users\/\w+/).reply(200);

  mock
    .onGet('/roles')
    .reply(200, [
      { role: 'Administrator' },
      { role: 'Planner' },
      { role: 'Reviewer' }
    ]);
  mock.onPost('/users').reply(200);
}
*/
