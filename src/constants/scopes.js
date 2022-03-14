const scopes = {
  pages: {
    dashboard: ['dashboard_view', 'dashboard_manage'],
    scenario: ['scenario_view', 'scenario_manage', 'sc_v'],
    templates: ['template_view', 'template_manage', 'tm_v'],
    users: ['users_manage'],
    roles: ['user_role_manage'],
    audit: ['audit_view'],
    solver: ['solver_manage', 'solver_evaluate'],
  },
  solver: {
    solverView: ['solver_view'],
    solverEvaluate: ['solver_evaluate'],
    solverManage: ['solver_manage'],
    solverEvaluateOrManage: ['solver_evaluate', 'solver_manage'],
  },
  dataCardPage: {
    importButton: ['import_action'],
    dataScenario: ['scenario_data_manage'],
    dataTemplate: ['template_data_manage'],
  },
  users: {
    users_manage: ['users_view', 'users_manage'],
    user_roles_manage: ['user_role_manage'],
  },
  rules: {
    ruleEdit: ['scenario_rule_edit'],
    rulesetManage: ['scenario_ruleset_manage'],
  },
  scenario: {
    add: ['scenario_add'],
    manage: ['scenario_manage', 'sc_manage'],
    duplicate: ['scenario_add'],
    delete: ['scenario_delete'],
    view: ['sc_v'],
    saveAsTemplate: ['template_manage'],
    templateViewOrManage: ['template_manage', 'tm_v'],
  },
  template: {
    add: ['template_add'],
    duplicate: ['template_add'],
    delete: ['template_delete'],
    manage: ['template_manage'],
    view: ['tm_v'],
  },
};

export default scopes;
