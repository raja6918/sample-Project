'use strict';
/**
 * Generic iFlight Gantt Data Structure definition
 *
 * Following data are covered in this definition:
 * 1. Global:
 *      ganttConfiguration
 *      pagesconfig.activepage.id/getActiveTabId
 *      ganttPanes[customOptions.moduleName][customOptions.plotLabel]
 *      ganttPopupConfiguration -- not required for now
 *
 * 2. Page specific:
 *      module
 *      pageid
 *      hScrollBar
 *      scrollOptions
 *
 * 3. Pane specific:
 *      ganttOptions
 *      ngModel
 *
 */

/**
 * Main datastore initialization function - should be called once for an application
 */
function initializeDS() {
  /**
   * Class for base data structures class
   */
  class baseDS {
    constructor(id, components) {
      this.id = id;
      this.components = components || {};
    }

    /*get id() {
            return this.id;
        }

        set id(id) {
            if (id) {
                this.id = id;
            }
        }

        get components() {
            return this.components;
        }

        set components(newComponents) {
            this.components = Object.values(newComponents).reduce((map, component) => (map[component.id] = component, map), {});
            return this.components;
        }*/

    addComponent(component) {
      this.components[component.id] = component;
      return this.components;
    }

    getComponent(id) {
      return this.components[id];
    }

    removeComponent(component) {
      delete this.components[component.id];
      return this.components;
    }
  }

  var applicationDS = new baseDS(0);
  var panePageMap = {};

  /**
   * Returns global ganttData initialized once
   *
   * @returns {Object} Gantt application data
   */
  function data() {
    return applicationDS;
  }

  /**
   * Adds data under a given property to a scope level.
   * Scope is level at which data is kept, namely app, page and pane.
   * 1. For adding a page call as addData("app", "page", null, {id})
   * 2. For adding data to app call as addData("app", <property>, null, data)
   * 3. For adding a pane call as addData("page", "pane", null, {id})
   * 4. For adding data to pane call as addData("page", <property>, id, data)
   * 5. For adding data to pane call as addData("pane", <property>, id, data)
   *
   * @param {string} scope - possible values - page, pane, app
   * @param {string} property - possible values - page, pane or any
   * @param {Object} id - unique identifier
   * @param {Object} data - data to add
   * @returns {Object} updated object at scope level
   */
  function addData(scope, property, id, data) {
    if (!scope || !property) {
      return;
    }

    if ((scope == 'page' || scope == 'pane') && !id) {
      return;
    }

    let _data;
    if (scope == 'app') {
      if (property == 'page') {
        let pageDS = new baseDS(data.id);
        Object.assign(pageDS, data);
        applicationDS.addComponent(pageDS);
      } else {
        applicationDS[property] = data;
      }
      _data = applicationDS;
    } else if (scope == 'page') {
      let pageDS = applicationDS.getComponent(id);
      if (property == 'pane') {
        let paneDS = new baseDS(data.id);
        Object.assign(paneDS, data);
        pageDS.addComponent(paneDS);
        panePageMap[paneDS.id] = pageDS.id;
      } else {
        pageDS[property] = data;
      }
      _data = pageDS;
    } else if (scope == 'pane') {
      let pageDS = applicationDS.getComponent(panePageMap[id]);
      let paneDS = pageDS.getComponent(id);
      paneDS[property] = data;
      _data = paneDS;
    }

    return _data;
  }

  /**
   * Gets data under a scope, optional data parameter added to update and return latest data.
   * Scope is level at which data is kept, namely app, page and pane.
   * 1. To get page data at app level scope call getData("app", "page", null, {id})
   * 2. To get a property value at app level scope call getData("app", <property>)
   * 3. To get pane data at page level scope call getData("page", "pane", pageid, paneid)
   * 4. To get a property value at page level scope call getData("page", <property>)
   * 5. To get a property value at pane level scope call getData("pane", <property>)
   *
   * @param {string} scope - possible values - page, pane, app
   * @param {string} property - possible values - page, pane or any
   * @param {Object} id - unique identifier
   * @param {Object} data - data to set
   * @returns {Object} updated object at scope level
   */
  function getData(scope, property, id, data) {
    if (!scope || !property) {
      return;
    }

    if ((scope == 'page' || scope == 'pane') && !id) {
      return;
    }

    let _data;
    if (scope == 'app') {
      if (property == 'page') {
        _data = applicationDS.getComponent(data.id);
      } else {
        _data = applicationDS[property];
      }
    } else if (scope == 'page') {
      let pageDS = applicationDS.getComponent(id);
      if (property == 'pane') {
        _data = pageDS.getComponent(data.id);
      } else {
        _data = pageDS[property];
      }
    } else if (scope == 'pane') {
      let pageDS = applicationDS.getComponent(panePageMap[data.id]);
      let paneDS = pageDS.getComponent(data.id);
      _data = paneDS[property];
    }

    return _data;
  }

  /**
   * Removes data under a scope, optional data parameter added which may have id.
   * Scope is level at which data is kept, namely app, page and pane.
   * 1. To remove page data at app level scope call removeData("app", "page", pageid)
   * 2. To remove a property value at app level scope call removeData("app", <property>)
   * 3. To remove pane data at page level scope call removeData("page", "pane", paneid)
   * 4. To remove a property value at page level scope call removeData("page", <property>)
   * 5. To remove a property value at pane level scope call removeData("pane", <property>)
   *
   * @param {string} scope - possible values - page, pane, app
   * @param {string} property - possible values - page, pane or any
   * @param {Object} id - unique identifier
   * @param {Object} data - data to add
   * @returns {Object} updated object at scope level
   */
  function removeData(scope, property, id, data) {
    if (!scope || !property || !id || !data) {
      return;
    }

    if (scope == 'app') {
      if (property == 'page') {
        applicationDS.removeComponent({ id: id });
        let paneIds = Object.keys(panePageMap).filter(
          paneId => panePageMap[paneId] == value
        );
        paneIds.forEach(paneId => {
          delete panePageMap[paneId];
        });
      } else {
        delete applicationDS[property];
      }
    } else if (scope == 'page') {
      let pageDS = applicationDS.getComponent(id);
      if (property == 'pane') {
        pageDS.removeComponent({ id: data.id });
        delete panePageMap[data.id];
      } else {
        delete pageDS[property];
      }
    } else if (scope == 'pane') {
      let pageDS = applicationDS.getComponent(panePageMap[id]);
      let paneDS = pageDS.getComponent(id);
      delete paneDS[property];
    }
  }

  return {
    data,
    addData,
    getData,
    removeData,
  };
}

export const ds = initializeDS();
