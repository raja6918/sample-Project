import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';
import { query, queryAll } from './utils';
import { ds } from './core';

// Temporary fixing iflight depencency
const iflight = {};

/**
 * Assigning alias to libraries
 */
const { $ } = window;

let barsize = 8; // size of the bar
let itemPos;
let wrpperHeight;
let defHeight;
const flag = [];
let topPane;
let bottomPane;
let cls;
let number;
let bottomPaneBot;
let topPaneTop;
let bottomPaneTop;
let topPaneBot;
let bottomPaneBottom;
let topBarTopVal;
let botBarTopVal;
let paneMinHeight = 4;
let arrItems = [];
let arrBars = [];
let xcls;
let xnumber;
let xfl;
let j;
let i;
let numItems;
let minNum;
const onDragCallbacks = {};
const cusList = []; // 'aircraftPaneWidgetui-gantt_holderclose','unassigned_unassignedPaneWidgetui-gantt_holderclose'];
const labelHeights = [];
let hideMaxPaneLabel = null;
let paneStatus = {};
const resetPages = [];
let maxPaneHeight = 0;
const customKeyMap = {};
const containerDiv = 'h_pane_wrapper';
const bar = 'bar_horiz';
let hiddenPaneClass = ':not(.pane_h_hidden)';
let iconContainer = 'gantt_pane_icons_wrap';

/**
 * Need description
 *
 * @param {string} pageID
 */
function getContainer(pageID) {
  const container = query(`#${pageID} .${containerDiv}`);
  if (container) {
    return container;
  }
}

/**
 * Need description
 *
 * @param {string} pageID
 */
function getVisiblePanes(pageID) {
  const panes = queryAll(`#${pageID} .pane_h`);
  if (panes) {
    return panes;
  }
}

/**
 * Need description
 *
 * @param {string} pageID
 */
function savePos(pageID) {
  arrItems = [];
  arrBars = [];
  for (i = 1; i <= numItems; i++) {
    arrItems.push(query(`#${pageID} .horiz_${i}`).getAttribute('style'));
  }
  for (i = 1; i < numItems; i++) {
    arrBars.push(query(`#${pageID} .bar_horiz_${i}`).getAttribute('style'));
  }
}

/**
 * @description
 *
 * By getting the pageID from initLayout it will dispaly or remove the particular pane from the visible area.
 * initLayout in the service file will invoke this function
 * This function is also part of multiple pane support
 * It is required in both Sierra and iFlight
 * if needed where are we going to call it?
 *
 * @param {string} pageID - It is a string value which is passing from initLayout, eg - "W1"
 */
function setAllPanesStatus(pageID) {
  if (!paneStatus) {
    paneStatus = {};
    paneStatus[pageID] = [];
  } else if (!paneStatus[pageID]) {
    paneStatus[pageID] = [];
  }
  getVisiblePanes(pageID).forEach((element, index) => {
    const elementID = element
      .querySelector('.layout_wrapper')
      .getAttribute('id');
    if (elementID) {
      let paneIndex = paneStatus[pageID].findIndex(function(element) {
        if (element && element.id === elementID) {
          return true;
        }
        return null;
      });
      if (paneIndex === -1) {
        paneIndex = index + 1;
      }
      paneStatus[pageID][paneIndex] = {
        id: elementID,
        hidden: false,
      };
    }
  });
}

/**
 * Need description
 *
 * @param {string} pageID
 * @returns {*} paneStatus[pageID]
 */
function getAllPanesStatus(pageID) {
  if (paneStatus[pageID]) {
    return paneStatus[pageID];
  }
  return null;
}

/**
 * Need description
 *
 * @param {string} pageID
 * @param {string} paneID
 * @returns {number} position
 */
function getPanePosition(pageID, paneID) {
  if (paneStatus[pageID]) {
    for (const position in paneStatus[pageID]) {
      if (paneStatus[pageID][position].id === paneID) {
        return parseInt(position, 10);
      }
    }
  }
  return -1;
}

/**
 * Need description
 *
 * @param {string} pageID
 * @param {string} paneID
 * @returns {*} paneStatus[pageID][pos]
 */
function getPaneStatus(pageID, paneID) {
  if (pageID && paneID) {
    const stringIndex = paneID.search('_split');
    if (stringIndex !== -1) {
      paneID = paneID.substring(0, stringIndex);
    }
    if (paneStatus && paneStatus[pageID]) {
      for (const pos in paneStatus[pageID]) {
        if (paneStatus[pageID][pos].id === paneID) {
          return paneStatus[pageID][pos];
        }
      }
    }
  }
  return null;
}

/**
 * Need description
 *
 * @param {boolean} newValue
 * @param {string} pageID
 * @param {string} paneID
 */
function setPaneStatus(newValue, pageID, paneID) {
  const paneIndex = getAllPanesStatus(pageID).length;
  const panePosition = getPanePosition(pageID, paneID);
  if (panePosition === -1 && paneStatus && paneStatus[pageID]) {
    paneStatus[pageID][paneIndex] = {
      id: paneID,
      hidden: newValue,
    };
  }
}

/**
 * Need description
 *
 * @param {string} pageID
 */
function clearPaneStatus(pageID) {
  if (paneStatus[pageID]) {
    paneStatus[pageID] = null;
  }
  if (flag[pageID]) {
    flag[pageID] = null;
  }
}

/**
 * Need description
 *
 * @param {string} pageid
 * @param {*} doNotResizeGantt
 */
function executePaneCallbacks(pageid, doNotResizeGantt) {
  if (onDragCallbacks && !isEmpty(onDragCallbacks)) {
    const callBkForPg = onDragCallbacks[pageid];
    for (const names in callBkForPg) {
      if (callBkForPg[names]) {
        callBkForPg[names](pageid, doNotResizeGantt);
      }
    }
  }
}

/**
 * @description
 *
 * Function that responsible for many UI rendering for Eg - the pink color horizontal bar between two pane is displayed baed on this function.
 * initLayout will invoke this function
 * It is required in both iFlight and Sierra
 *
 * @param {string} pageID - It is string eg - "W1"
 * @param {Function} callback - It is callback function
 * @param {boolean} isResetPage - default is null
 * @param {boolean} isCustomClose - It is boolean and based on the configurations it diply or remove the pane form visible area.
 */
function horizLayoutGen(pageID, callback, isResetPage, isCustomClose) {
  if (isResetPage) {
    const pageIndex = resetPages.indexOf(pageID);
    if (pageIndex === -1) {
      return;
    }
    resetPages.splice(pageIndex, 1);
  }
  paneMinHeight = 4;
  numItems = getVisiblePanes(pageID).length;
  const allPanesContainer = getContainer(pageID);
  if (allPanesContainer) {
    wrpperHeight = allPanesContainer.clientHeight - 2; // 2 is to avoid v-scroll bar
  }
  wrpperHeight -= (numItems - 1) * barsize;
  defHeight = Math.round(wrpperHeight / numItems);

  if (wrpperHeight <= 0 && resetPages.indexOf(pageID) === -1) {
    resetPages.push(pageID);
  }

  function setPanes() {
    //numItems = queryAll(`#${pageID} .pane_h`).length;
    const labelHeight = labelHeights[pageID] ? labelHeights[pageID] : 0;
    let columnHeaderAsSeparatePane = false;
    if (allPanesContainer) {
      wrpperHeight = allPanesContainer.clientHeight - 2 - labelHeight; // 2 is to avoid v-scroll bar
    }
    wrpperHeight -= (numItems - 1) * barsize;
    defHeight = Math.round(wrpperHeight / numItems);
    let visiblePanes = getVisiblePanes(pageID);
    let paneSeparators = queryAll(`#${pageID} .bar_x`);
    const elementTop =
      `${defHeight * (numItems + 1) + barsize * (numItems + 1)}` + 'px';

    paneSeparators.forEach(element => {
      if (columnHeaderAsSeparatePane == false) {
        if (element.id.includes('columnHeader')) {
          columnHeaderAsSeparatePane = true;
        }
      }
      element.style.top = elementTop;
    }); /* QFIMPL-1214, JETCREW-1039 */
    /**/
    paneSeparators.forEach(element => {
      element.style.top = elementTop;
    });
    /**/
    let preDefHeight = 0;
    let sumPaneHeight = 0;
    for (i = 1; i <= numItems; i++) {
      const horzID = `#${pageID} .horiz_`;
      let pane = query(`${horzID + i}.pane_h`);
      let paneHeight;
      if (pane != null && pane != undefined) {
        paneHeight = parseInt(
          query(`${horzID + i}.pane_h`)
            .querySelector(`iflight-gantt, iflight-grid`)
            .getAttribute('pane-height')
        );
      }
      pane = null;
      if (isNaN(paneHeight) || paneHeight == null || paneHeight == undefined) {
        paneHeight = 0;
      }
      sumPaneHeight += paneHeight;
    }
    for (i = 1; i <= numItems; i++) {
      let paneBarTop;

      const horzID = `#${pageID} .horiz_`;
      let visiblePane = query(`${horzID}${i}${hiddenPaneClass}`);
      let paneSplitBar = query(`#${pageID} .${bar}_${i}`);

      let pane = query(`${horzID + i}.pane_h`);
      let paneHeight;
      if (pane != null && pane != undefined) {
        paneHeight = parseInt(
          query(`${horzID + i}.pane_h`)
            .querySelector(`iflight-gantt, iflight-grid`)
            .getAttribute('pane-height')
        );
      }
      pane = null;
      if (isNaN(paneHeight) || paneHeight == null || paneHeight == undefined) {
        paneHeight = 0;
      }
      if (isCustomClose === true && sumPaneHeight === 100) {
        // paneHeight is saved in percentage,therefore sum of  PaneHeights will be 100.

        defHeight = Math.round((paneHeight / 100) * wrpperHeight);
        paneBarTop = defHeight * i + barsize * (i - 1);
        if (visiblePane) {
          if (i === numItems && i !== 1) {
            visiblePane.style.cssText = `display: block;
			top: ${preDefHeight}px;
			bottom:0px`;
          }
          if (i === 1) {
            visiblePane.style.cssText = `display: block;
				top: ${preDefHeight + labelHeight}px;
				bottom:0px;`;
          }
          if (i > 1) {
            visiblePane.style.cssText = `height: ${defHeight}px;
				top: ${preDefHeight + labelHeight}px;
				display:block;`;
          }
        }
        if (paneSplitBar) {
          const paneSplitBarTop = paneBarTop;
          paneSplitBar.style.top = `${paneSplitBarTop}px`;
          if (paneSplitBarTop >= wrpperHeight) {
            paneSplitBar.style.display = 'none';
          } else {
            paneSplitBar.style.display = 'block';
          }
        }
        preDefHeight = defHeight + preDefHeight + barsize;
      } else if (columnHeaderAsSeparatePane == true) {
        let labelOffset = 5;
        let timeBarHeight = labelHeight + 2 * labelOffset;
        if (i === 1) {
          defHeight = timeBarHeight;
          paneBarTop = defHeight * i + barsize * (i - 1);
          if (visiblePane) {
            visiblePane.style.cssText = `display: block;
					top: ${defHeight * (i - 1) + barsize * (i - 1)}px`;
          }
        } else {
          defHeight = Math.round(wrpperHeight / (numItems - 1));
        }
        if (visiblePane) visiblePane.style.height = `${defHeight}px`;

        if (i === numItems && i !== 1) {
          if (visiblePane) {
            /*
				visiblePane.style.cssText = 
				`display: block;
				top: ${defHeight * (i - 1) + barsize * (i - 1) + labelHeight}px;
				bottom: 0px;`
				*/
            visiblePane.style.display = 'block';
            visiblePane.style.top = `${defHeight * (i - 2) +
              barsize * (i - 1) +
              timeBarHeight}px`;
            visiblePane.style.bottom = '0px';
          }
        }
        if (i > 1) {
          if (i - 1 == 1) {
            if (visiblePane) {
              /*
					visiblePane.style.cssText = 
					`display: block;
					top:${defHeight * (i - 1) + barsize * (i - 1) + labelHeight}px;`
					*/
              visiblePane.style.display = 'block';
              visiblePane.style.top = `${timeBarHeight}px`;
            }
            if (paneSplitBar) {
              const paneSplitBarTop = paneBarTop + labelHeight;
              paneSplitBar.style.top = `${defHeight * (i - 1) +
                barsize * (i - 2) +
                timeBarHeight}px`;
              if (paneSplitBarTop >= wrpperHeight) {
                paneSplitBar.style.display = 'none';
              } else {
                paneSplitBar.style.display = 'block';
              }
            }
          } else {
            if (visiblePane) {
              /*
					visiblePane.style.cssText = 
					`display: block;
					top:${defHeight * (i - 1) + barsize * (i - 1) + labelHeight}px;`
					*/
              visiblePane.style.display = 'block';
              visiblePane.style.top = `${defHeight * (i - 2) +
                barsize * (i - 2) +
                timeBarHeight}px`;
            }
            if (paneSplitBar) {
              const paneSplitBarTop = paneBarTop + labelHeight;
              paneSplitBar.style.top = `${defHeight * (i - 1) +
                barsize * (i - 2) +
                timeBarHeight}px`;
              if (paneSplitBarTop >= wrpperHeight) {
                paneSplitBar.style.display = 'none';
              } else {
                paneSplitBar.style.display = 'block';
              }
            }
          }
        }
      } else {
        defHeight = Math.round(wrpperHeight / numItems);
        paneBarTop = defHeight * i + barsize * (i - 1);
        if (i === 1) {
          defHeight += labelHeight;

          if (visiblePane) {
            visiblePane.style.cssText = `display: block;
					top: ${defHeight * (i - 1) + barsize * (i - 1)}px`;
          }
          if (paneSplitBar) {
            const paneSplitBarTop = paneBarTop;
            paneSplitBar.style.top = `${paneSplitBarTop}px`;
            if (paneSplitBarTop >= wrpperHeight) {
              paneSplitBar.style.display = 'none';
            } else {
              paneSplitBar.style.display = 'block';
            }
          }
        }
        if (visiblePane) visiblePane.style.height = `${defHeight}px`;

        if (i === numItems && i !== 1) {
          if (visiblePane) {
            /*
					visiblePane.style.cssText = 
					`display: block;
					top: ${defHeight * (i - 1) + barsize * (i - 1) + labelHeight}px;
					bottom: 0px;`
					*/
            visiblePane.style.display = 'block';
            visiblePane.style.top = `${defHeight * (i - 1) +
              barsize * (i - 1) +
              labelHeight}px`;
            visiblePane.style.bottom = '0px';
          }
        }
        if (i > 1) {
          if (visiblePane) {
            /*
					visiblePane.style.cssText = 
					`display: block;
					top:${defHeight * (i - 1) + barsize * (i - 1) + labelHeight}px;`
					*/
            visiblePane.style.display = 'block';
            visiblePane.style.top = `${defHeight * (i - 1) +
              barsize * (i - 1) +
              labelHeight}px`;
          }
          if (paneSplitBar) {
            const paneSplitBarTop = paneBarTop + labelHeight;
            paneSplitBar.style.top = `${paneSplitBarTop}px`;
            if (paneSplitBarTop >= wrpperHeight) {
              paneSplitBar.style.display = 'none';
            } else {
              paneSplitBar.style.display = 'block';
            }
          }
        }
      }
      if (visiblePane != null && visiblePane.childNodes[0] != null) {
        function getIcon(classes) {
          let icn = visiblePane.childNodes[0].shadowRoot.querySelector(classes);
          return icn;
        }
        var restoreIcon = getIcon('.icon_sprite.restore');
        var minimizeIcon = getIcon('.icon_sprite.min');
        var maximizeIcon = getIcon('.icon_sprite.max');

        if (restoreIcon) restoreIcon.style.display = 'none'; /* NEO2-12951 */
        if (minimizeIcon) minimizeIcon.style.display = 'block'; /* NEO2-12951 */
        if (maximizeIcon) maximizeIcon.style.display = 'block'; /* NEO2-12951 */
      }
    }
    paneSeparators.forEach(element => {
      element.style.opacity = 1;
      element.style.transition = 'opacity 0.2s ease-in-out';
    });
    visiblePanes.forEach(element => {
      element.style.opacity = 1;
      element.style.transition = 'opacity 0.2s ease-in-out';
    }); /* NEOBPM-792 */
    executePaneCallbacks(pageID);
  }

  const selectMatchingNextSiblings = (selector, siblingSelector) => {
    const result = [];
    let currentElement = selector.nextElementSibling;

    while (currentElement) {
      if (currentElement.matches(siblingSelector)) {
        result.push(currentElement);
      }

      currentElement = currentElement.nextElementSibling;
    }

    return result;
  };

  //appending div template

  function appendElement(vnode, containr) {
    const el = (vnode.el = document.createElement(vnode.tag));
    // props
    if (vnode.props) {
      for (const key in vnode.props) {
        const value = vnode.props[key];
        el.setAttribute(key, value);
      }
    }
    containr.appendChild(el);
  }

  // Dynamically creates bar
  function createBars(barsize) {
    const panes = getAllPanesStatus(pageID);
    let topPaneId;
    let bottomPaneId;
    if (panes) {
      // eslint-disable-next-line guard-for-in
      for (const position in panes) {
        const { id } = panes[position];
        if (parseInt(position, 10) === numItems) {
          break;
        }
        /* QFIMPL-1214, JETCREW-1039 */

        var paneSplitLine = {
          tag: 'div',
          props: {
            class: `bar_horiz_${position} bar_horiz bar_x`,
            style: `position:absolute; top:0; right:0; left:0; height:${barsize}px`,
            id: `bar_${id}`,
          },
        };
        var wholeContainer = getContainer(pageID);
        appendElement(paneSplitLine, wholeContainer);

        var paneSplitBar = query(`#${pageID} .bar_horiz_${position}`);
        let spanElement = `<span class=\"handle\"> </span>`;
        paneSplitBar.innerHTML = spanElement;

        $(`#${pageID} .bar_horiz_${position}`).draggable({
          axis: 'y',
          containment: `#${pageID} .h_pane_wrapper`,
          scroll: false,
          // eslint-disable-next-line no-loop-func
          start(e, ui) {
            // cls = $(this).attr('class').split(' ')[0];
            // eslint-disable-next-line prefer-destructuring
            cls = this.getAttribute('class').match(/\bbar_horiz_(\d+)\b/)[1];
            // number = parseInt(cls.substr(cls.lastIndexOf("_") + 1));
            number = parseInt(cls, 10);

            topPane = query(`#${pageID} .horiz_${number}.pane_h`);
            topPaneId = topPane
              .querySelector(`iflight-gantt, iflight-grid`)
              .getAttribute('id');
            bottomPane = query(`#${pageID} .horiz_${number + 1}.pane_h`);
            bottomPaneId = bottomPane
              .querySelector(`iflight-gantt, iflight-grid`)
              .getAttribute('id');

            topPaneTop = topPane.offsetTop;
            bottomPaneBot =
              bottomPane.parentElement.clientHeight -
              (bottomPane.offsetTop + bottomPane.offsetHeight);

            if (topPane.style.display === 'none') {
              topPaneTop = this.offsetTop;
            }

            topPane.style.top = topPaneTop;
            bottomPane.style.bottom = bottomPaneBot;

            const topBarNum = number - 1;
            if (topBarNum !== 0) {
              const topValue = query(`#${pageID} .bar_horiz_${topBarNum}`).style
                .top;
              topBarTopVal = parseInt(
                topValue.substring(0, topValue.length - 2),
                10
              );
            } else {
              topBarTopVal = -barsize;
            }

            const botBarNum = number + 1;
            // console.log("bot "+botBarNum+" num "+ numItems)

            if (botBarNum !== numItems) {
              // botBarTopVal = $("#"+ pageID +' .bar_horiz_'+botBarNum+'').position().top;
              let paneBar = query(
                `#${pageID} .bar_horiz_${botBarNum}.bar_horiz`
              );
              if (paneBar) {
                if (paneBar.style.top) {
                  const topValue = paneBar.style.top;
                  botBarTopVal = parseInt(
                    topValue.substring(0, topValue.length - 2),
                    10
                  );
                }
              }
            } else {
              botBarTopVal = getContainer(pageID).clientHeight;
            }
            // eslint-disable-next-line no-use-before-define
            savePos(pageID);
          },
          // eslint-disable-next-line no-loop-func
          drag(e, ui) {
            this.style.opacity = '.5';
            let topPaneMinHeight = 0;
            const labelHeight = labelHeights[pageID];

            let visiblePanes = getVisiblePanes(pageID);
            let paneIconsContainer = visiblePanes[0].childNodes[0].shadowRoot.querySelector(
              `.${iconContainer}`
            );

            var paneMinHt = paneIconsContainer.clientHeight;
            const bottomPaneMinHeight = paneMinHt;

            if (number === 1) {
              topPaneMinHeight = labelHeight + 5;
            } else {
              topPaneMinHeight = paneMinHt;
            }
            //	if(!xfl){
            if (ui.position.top <= topBarTopVal + barsize + topPaneMinHeight) {
              ui.position.top = topBarTopVal + barsize + topPaneMinHeight;
              getPaneStatus(pageID, topPaneId).isMinimized = true;
            } else {
              getPaneStatus(pageID, topPaneId).isMinimized = false;
            }
            if (
              ui.position.top >=
              botBarTopVal - bottomPaneMinHeight - barsize
            ) {
              // alert("sss")
              ui.position.top = botBarTopVal - bottomPaneMinHeight - barsize;
              getPaneStatus(pageID, bottomPaneId).isMinimized = true;
            } else {
              getPaneStatus(pageID, bottomPaneId).isMinimized = false;
            }
            // }

            topPaneBot = this.parentElement.offsetHeight - this.offsetTop;
            topPane.style.height = 'auto';
            topPane.style.display = 'block';
            topPane.style.bottom = `${topPaneBot}px`;

            bottomPaneTop = this.offsetTop + this.offsetHeight;
            var nextBar = selectMatchingNextSiblings(
              this.closest('div'),
              '.bar_horiz'
            );
            if (nextBar && nextBar.length > 0 && nextBar[0].offsetTop) {
              bottomPaneBottom =
                this.parentElement.offsetHeight - nextBar[0].offsetTop;
            } else {
              bottomPaneBottom = 2;
            }
            bottomPane.style.height = 'auto';
            bottomPane.style.display = 'block';
            bottomPane.style.top = `${bottomPaneTop}px`;
            bottomPane.style.bottom = `${bottomPaneBottom}px`;

            if (bottomPane.classList.contains('minimized')) {
              bottomPane.classList.remove('minimized');
            }
            if (topPane.classList.contains('minimized')) {
              topPane.classList.remove('minimized');
            }

            // Pane icons show/hide

            visiblePanes.forEach(element => {
              var restoreIcon = element.childNodes[0].shadowRoot.querySelector(
                `.icon_sprite.restore`
              );
              var maximizeIcon = element.childNodes[0].shadowRoot.querySelector(
                `.icon_sprite.max`
              );

              if (restoreIcon) restoreIcon.style.display = 'block';
              if (maximizeIcon) maximizeIcon.style.display = 'block';
            });

            let bottomPaneMinimizeBtn = bottomPane.childNodes[0].shadowRoot.querySelector(
              `.icon_sprite.min`
            );
            let topPaneMinimizeBtn = topPane.childNodes[0].shadowRoot.querySelector(
              `.icon_sprite.min`
            );
            if (bottomPaneMinimizeBtn) {
              bottomPaneMinimizeBtn.style.display = 'block';
            }
            if (topPaneMinimizeBtn) {
              topPaneMinimizeBtn.style.display = 'block';
            }
          },
          // eslint-disable-next-line no-loop-func
          stop(e, ui) {
            this.style.opacity = 1;
            topPaneBot = this.parentElement.offsetHeight - this.offsetTop;
            topPane.style.height = 'auto';
            topPane.style.display = 'block';
            topPane.style.bottom = topPaneBot + 'px';

            bottomPaneTop = this.offsetTop + this.offsetHeight;
            const nextBar = selectMatchingNextSiblings(
              this.closest('div'),
              '.bar_horiz'
            );
            if (nextBar && nextBar.length > 0 && nextBar[0].offsetTop) {
              bottomPaneBottom =
                this.parentElement.offsetHeight - nextBar[0].offsetTop;
            } else {
              bottomPaneBottom = 2;
            }
            bottomPane.style.height = 'auto';
            bottomPane.style.display = 'block';
            bottomPane.style.top = bottomPaneTop + 'px';
            bottomPane.style.bottom = bottomPaneBottom + 'px';

            executePaneCallbacks(pageID);
            const labelHeight = labelHeights[pageID];
            if (this.offsetTop > labelHeight) {
              if (hideMaxPaneLabel) hideMaxPaneLabel();
            }
            const barObject = {
              number,
              topPaneBot: Math.round((topPaneBot / wrpperHeight) * 100),
              bottomPaneTop: Math.round((bottomPaneTop / wrpperHeight) * 100),
              bottomPaneBottom: Math.round(
                (bottomPaneBottom / wrpperHeight) * 100
              ),
            };
            const currKey = customKeyMap[pageID];
            const barObj = {};
            barObj[currKey] = barObject;
            $.putInLocalStore('barObj', barObj, true);
          },
        });
      }
    }
  }
  function savePos() {
    arrItems = [];
    arrBars = [];
    for (i = 1; i <= numItems; i++) {
      // alert($(".horiz_"+i+"").attr('style'));
      arrItems.push(query(`.horiz_${i}`).getAttribute('style'));
    }
    for (i = 1; i < numItems; i++) {
      arrBars.push(query(`.bar_horiz_${i}`).getAttribute('style'));
    }
    // console.log("saved out "+arrItems);
  }
  function setStaticName() {
    let paneSplitBars = queryAll(`#${pageID} .bar_horiz`);
    if (paneSplitBars != undefined && paneSplitBars.length > 0) {
      paneSplitBars.forEach((element, index) => {
        element.classList.add(`static_bar_name_${index + 1}`);
      });
    }
  }
  function setPaneClass(pageID) {
    let visiblePaneList = queryAll(`#${pageID} .pane_h`);
    if (visiblePaneList != undefined && visiblePaneList.length > 0) {
      visiblePaneList.forEach((element, index) => {
        var clsList = element.classList;
        element.classList.add(`horiz_${index + 1}`);
      });
    }
  }

  if (!flag[pageID]) {
    setPaneClass(pageID);
    createBars(barsize);
    setStaticName();
    flag[pageID] = 1;
    // eslint-disable-next-line no-use-before-define
    closeCustompanes(pageID, cusList, isCustomClose);
    cusList[pageID] = [];
    /* setTimeout(function(){
      if (callback){
        callback(pageID);
      }
    }, 100); */
  }
  setPanes();
}

/**
 * @description
 *
 * Function that is mapped with ganttLayout which will initialize the layout structure.
 * ganttLayout form gantt service file.
 * It is required in both iFlight and Sierra
 *
 * @param {string} pageID - It is a string value eg - "W1"
 * @param {Function} callback - It is a callback function
 * @param {boolean} isCustomClose - It is a boolean and based on the configurations it diply or remove the pane form visible area.
 */
function initLayout(pageID, callback, isCustomClose) {
  setAllPanesStatus(pageID);
  horizLayoutGen(pageID, callback, null, isCustomClose);
}

/**
 * Need description
 *
 * @param {string} pageID
 * @param {Array} cusList
 * @param {boolean} isCustomClose
 */
function closeCustompanes(pageID, cusList, isCustomClose) {
  if (cusList[pageID]) {
    cusList[pageID].forEach(function(placeHolderId) {
      const ganttRefs = queryAll(`#${pageID} iflight-gantt`);
      for (const ganttRef of ganttRefs) {
        const element = ganttRef.shadowRoot.querySelector(`#${placeHolderId}`);
        if (placeHolderId.indexOf(pageID) != -1 && element) {
          element.click(isCustomClose);
        }
      }
    });
  } else {
    executePaneCallbacks(pageID);
  }
  if (!window.ganttLayoutComplete) {
    window.ganttLayoutComplete = {};
  }
  window.ganttLayoutComplete[pageID] = true;
}

/**
 * Need description
 *
 * @param {string} closeButtonID
 * @param {string} pageid
 */
function addToCusList(closeButtonID, pageid) {
  if (!cusList[pageid]) {
    cusList[pageid] = [];
  }

  if (cusList[pageid].indexOf(closeButtonID) === -1) {
    cusList[pageid].push(closeButtonID);
  }
}

/**
 * Need description
 *
 * @param {Object} thisObj
 * @param {string} pageID
 */
function maximizePane(thisObj, pageID) {
  var visiblePaneList = getVisiblePanes(pageID);
  visiblePaneList.forEach(item => {
    item.classList.remove('minimized');
  });

  getPaneStatus(pageID, thisObj.getAttribute('id')).isMinimized = false;

  var numItems = visiblePaneList.length;

  var innerElem = thisObj._shadowRoot;
  var paneIconsWrapper = innerElem.activeElement;
  paneMinHeight = paneIconsWrapper.offsetHeight;

  j = 1;
  savePos(pageID);

  var divClasses = thisObj
    .closest(`#${pageID} .pane_h`)
    .getAttribute('class')
    .split(' ');

  xcls = _.find(divClasses, function(divClass) {
    return divClass.search('horiz_') >= 0;
  });
  xnumber = parseInt(xcls.substr(xcls.lastIndexOf('_') + 1));

  visiblePaneList.forEach(element => {
    element.style.height = `${paneMinHeight}px`;
  });

  for (i = 1; i < xnumber; i++) {
    var visiblePane = queryAll(`#${pageID} .horiz_${i}`);
    var paneSplitBar = queryAll(`#${pageID} .${bar}_${i}`);
    if (visiblePane.length == undefined) {
      visiblePane.style.top =
        barsize * (i - 1) + paneMinHeight * (i - 1) + 'px';
    } else if (visiblePane.length > 0) {
      visiblePane.forEach(element => {
        element.style.top = barsize * (i - 1) + paneMinHeight * (i - 1) + 'px';
      });
    }
    if (paneSplitBar.length == undefined) {
      paneSplitBar.style.top =
        barsize * (i - 1) + paneMinHeight * (i - 1) + 'px';
    } else if (paneSplitBar.length > 0) {
      paneSplitBar.forEach(element => {
        element.style.top = barsize * (i - 1) + paneMinHeight * i + 'px';
      });
    }
  }

  for (i = numItems; i > xnumber; i--) {
    var paneSplitBar = queryAll(`#${pageID} .${bar}_${i - 1}`);
    var visiblePane = queryAll(`#${pageID} .horiz_${i}`);
    if (paneSplitBar.length == undefined) {
      paneSplitBar.style.top = 'auto';
      paneSplitBar.style.bottom = barsize * (j - 1) + paneMinHeight * j + 'px';
    } else if (paneSplitBar.length > 0) {
      paneSplitBar.forEach(element => {
        element.style.top = 'auto';
        element.style.bottom = barsize * (j - 1) + paneMinHeight * j + 'px';
      });
    }
    if (visiblePane.length == undefined) {
      visiblePane.style.top = 'auto';
      visiblePane.style.bottom =
        barsize * (j - 1) + paneMinHeight * (j - 1) + 'px';
    } else if (visiblePane.length > 0) {
      visiblePane.forEach(element => {
        element.style.top = 'auto';
        element.style.bottom =
          barsize * (j - 1) + paneMinHeight * (j - 1) + 'px';
      });
    }
    j++;
  }

  var paneTop =
    '' +
    parseInt(
      parseInt(barsize) * (xnumber - 1) +
        parseInt(paneMinHeight) * (xnumber - 1)
    ) +
    'px';
  var paneBtm =
    '' +
    (barsize * (numItems - xnumber) + paneMinHeight * (numItems - xnumber)) +
    'px';

  var closest = thisObj.closest('#' + pageID + ' .pane_h');
  closest.style.top =
    '' +
    parseInt(
      parseInt(barsize) * (xnumber - 1) +
        parseInt(paneMinHeight) * (xnumber - 1)
    ) +
    'px';
  closest.style.bottom =
    '' +
    (barsize * (numItems - xnumber) + paneMinHeight * (numItems - xnumber)) +
    'px';
  closest.style.height = 'auto';
  closest.style.display = 'block';

  //Pane icons show/hide
  visiblePaneList.forEach(element => {
    let restoreIcon = element.childNodes[0].shadowRoot.querySelector(
      `.icon_sprite.restore`
    );
    if (restoreIcon) restoreIcon.style.display = 'block';
  });

  var hiddenMinList = innerElem.querySelectorAll('.min');
  hiddenMinList.forEach(element => {
    element.style.display = 'block';
  });
  var visibleMaxList = innerElem.querySelectorAll('.max');
  visibleMaxList.forEach(element => {
    element.style.display = 'none';
  });

  visiblePaneList.forEach(element => {
    var paneId = element
      .querySelector(`iflight-gantt, iflight-grid`)
      .getAttribute('id');
    if (paneId != thisObj.getAttribute('id')) {
      getPaneStatus(pageID, paneId).isMinimized = true;
    }
  });

  var panes = getAllPanesStatus(pageID);
  var minHeightTotal,
    minNum = 0,
    minHeight = 1;
  for (var i = 1; i < panes.length; i++) {
    if (panes[i].hidden == false && panes[i].isMinimized == true) {
      minNum = minNum + 1;
    }
  }

  var numItems = visiblePaneList.length;

  if (xnumber == 1) {
    minHeight = labelHeights[pageID] + 5;
  } else {
    minHeight = paneIconsWrapper.offsetHeight;
  }
  if (minNum) {
    minHeightTotal = minHeight * minNum;
  }
  maxPaneHeight = Math.round(wrpperHeight - minHeightTotal);
}

/**
 * Need description
 *
 * @param {Object} thisObj
 * @param {string} pageID
 */
function restorePane(thisObj, pageID) {
  var visiblePane = getVisiblePanes(pageID);
  visiblePane.forEach(function(item) {
    var paneId = item
      .querySelector(`iflight-gantt, iflight-grid`)
      .getAttribute('id');
    getPaneStatus(pageID, paneId).isMinimized = false;
    var classList = item.classList;
    if (classList.contains('minimized')) {
      classList.remove('minimized');
    }
  });
  maxPaneHeight = 0;
  visiblePane.forEach(element => {
    let innerElem = element.childNodes[0].shadowRoot;
    let restoreIcon = innerElem.querySelector('.restore');
    let minimizeIcon = innerElem.querySelector('.min');
    let maximizeIcon = innerElem.querySelector('.max');

    if (restoreIcon) restoreIcon.style.display = 'none';
    if (minimizeIcon) minimizeIcon.style.display = 'block';
    if (maximizeIcon) maximizeIcon.style.display = 'block';
  });
  horizLayoutGen(pageID);
}

/**
 * Need description
 *
 * @param {Object} thisObj
 * @param {String} pageID
 * @param {String} paneID
 */
function minimizePane(thisObj, pageID, paneID) {
  var paneStatusId = '#' + pageID;
  var visiblePane = getVisiblePanes(pageID);
  var innerElem = thisObj._shadowRoot;
  var minHeightTotal;
  getPaneStatus(pageID, thisObj.getAttribute('id')).isMinimized = true;
  var closestElement = thisObj.closest('#' + pageID + ' .pane_h');
  if (!closestElement.classList.contains('minimized')) {
    closestElement.classList += ' ' + 'minimized';
    var minimizedList = queryAll(paneStatusId + ' .minimized');

    minNum = minimizedList.length;
    numItems = visiblePane.length;

    var nonMinItems;
    var minHeight = 1; // global variable paneMinHeight is not used. changing the value inside minimizePane will cause varied heights in pane drag.
    j = 1;
    savePos(pageID);
    var divClasses = thisObj
      .closest(`#${pageID} .pane_h`)
      .getAttribute('class')
      .split(' ');

    xcls = _.find(divClasses, function(divClass) {
      return divClass.search('horiz_') >= 0;
    });
    xnumber = parseInt(xcls.substr(xcls.lastIndexOf('_') + 1));
    if (xnumber == 1) {
      minHeight = labelHeights[pageID] + 5;
    } else {
      var paneIconsWrapper = innerElem.querySelectorAll(
        '.gantt_pane_icons_wrap'
      );
      var arr = [];
      paneIconsWrapper.forEach(element => {
        var ab = element.offsetHeight;
        arr.push(ab);
      });
      var minHt = arr.reduce(function(a, b) {
        return Math.max(a, b);
      });
      minHeight = minHt;
    }

    var closetVisiblePane = thisObj.closest(`#${pageID} .pane_h`);
    if (closetVisiblePane.length != undefined && closetVisiblePane.length > 1) {
      closetVisiblePane.forEach(element => {
        element.style.height = `${minHeight}px`;
      });
    } else {
      closetVisiblePane.style.height = `${minHeight}px`;
    }

    if (minNum) {
      minHeightTotal = minHeight * minNum;
    }
    nonMinItems = numItems - minNum;
    var paneHeight = Math.round(
      (wrpperHeight + labelHeights[pageID] - minHeightTotal) / nonMinItems
    );

    queryAll(`#${pageID} .pane_h.minimized`).forEach(function(item) {
      item.style.height = `${minHeight}px`;
    });

    queryAll(`#${pageID} .pane_h:not(.minimized)`).forEach(function(item) {
      item.style.height = `${paneHeight}px`;
    });

    for (i = 1; i <= numItems; i++) {
      var visibleHoriz_iPane = queryAll(`#${pageID} .horiz_${i}`);
      var visiblePanesList = queryAll(
        `#${pageID} .horiz_${i}:not(.pane_h_hidden)`
      );

      if (i == 1) {
        visiblePanesList.forEach(element => {
          element.style.top = '0px';
        });

        let paneOffsetHeight = query(
          `#${pageID} .horiz_${i}:not(.pane_h_hidden)`
        ).offsetHeight;

        var visibleBar = query(
          `#${pageID} .bar_horiz_${i}:not(.bar_horiz_hidden)`
        );
        visibleBar.style.top = `${paneOffsetHeight}px`;
      } else {
        visiblePanesList.forEach((element, index) => {
          element.style.top =
            parseInt(getPrevVisible(pageID, i).offsetTop) +
            parseInt(getPrevVisible(pageID, i).offsetHeight) +
            barsize +
            'px';
        });
        let paneOffsetHeight = query(
          `#${pageID} .horiz_${i}:not(.pane_h_hidden)`
        ).offsetHeight;

        var cssTop = query(`#${pageID} .horiz_${i}:not(.pane_h_hidden)`)
          .offsetTop;

        var barhrz_BhHiddenList = queryAll(
          `#${pageID} .bar_horiz_${i}:not(.bar_horiz_hidden)`
        );
        if (barhrz_BhHiddenList.length > 0) {
          barhrz_BhHiddenList[0].style.top = `${paneOffsetHeight + cssTop}px`;
        }
      }
    }
    //Pane icons show/hide
    visiblePane.forEach(element => {
      var visibleIcon = element.childNodes[0].shadowRoot.querySelector(
        `.icon_sprite.restore`
      );
      if (visibleIcon) visibleIcon.style.display = 'block';
    });
    //alert(thisObj.closest('.h_pane_wrapper').find('.icon_sprite + .min').attr('id'));
    //thisObj.closest('.h_pane_wrapper').find('.icon_sprite.min').show();
    //thisObj.closest('.h_pane_wrapper').find('.icon_sprite + .min').show();

    var hiddenMinList = innerElem.querySelectorAll('.min');
    hiddenMinList.forEach(element => {
      element.style.display = 'none';
    });

    var visibleMaxList = innerElem.querySelectorAll('.max');
    visibleMaxList.forEach(element => {
      element.style.display = 'block';
    });

    let minimizedPaneCount = queryAll(`#${pageID} .minimized`).length;
    if (minimizedPaneCount == numItems - 1) {
      visiblePane.forEach(element => {
        var minimizeIcon = element.childNodes[0].shadowRoot.querySelector(
          `.icon_sprite.min`
        );
        if (minimizeIcon) minimizeIcon.style.display = 'none';
      });
    }
  }
}

/**
 * Need description
 *
 * @param {String} pageID
 * @param {Integer} i
 * @returns {String}
 */
function getPrevVisible(pageID, i) {
  return query(`#${pageID} .horiz_${i - 1}:not(.pane_h_hidden)`);
}

/**
 * Need description
 *
 * @param {Object} thisObj
 * @param {Integer} pageID
 * @param {Integer} paneID
 * @param {Boolean} isCustomClose
 */

function closePane(thisObj, pageID, paneID, isCustomClose) {
  var closestElement = thisObj.closest(`#${pageID} .pane_h`);
  if (closestElement.classList.contains('minimized')) {
    closestElement.classList.remove('minimized');
  }

  numItems = getVisiblePanes(pageID).length;
  var pane = getPaneStatus(pageID, paneID);
  pane.hidden = true;
  for (var i = 1; i < getAllPanesStatus(pageID).length; i++) {
    getAllPanesStatus(pageID)[i].isMinimized = false;
  }
  const divClasses = thisObj
    .closest(`#${pageID} .pane_h`)
    .getAttribute('class')
    .split(' ');
  xcls = _.find(divClasses, function(divClass) {
    return divClass.search('horiz_') >= 0;
  });
  //alert("xcls "+xcls)
  xnumber = parseInt(xcls.substr(xcls.lastIndexOf('_') + 1));

  if (xnumber == numItems) {
    var closestElem2 = thisObj.closest('#' + pageID + ' .pane_h');
    if (closestElem2.classList.contains('pane_h')) {
      closestElem2.classList.remove('pane_h');
    }
    closestElem2.classList.add('pane_h_hidden');
    horizLayoutGen(pageID, null, null, isCustomClose);
  } else {
    queryAll(`#${pageID} .horiz_${xnumber}`).forEach(pane => {
      pane.classList.remove('pane_h');
      pane.classList.add('pane_h_hidden');
    });

    queryAll(`#${pageID} .bar_horiz_${xnumber}`).forEach(pane => {
      pane.classList.remove('bar_horiz_');
      pane.classList.add('bar_horiz_hidden');
    });

    queryAll(`#${pageID} .pane_h`).forEach(function(item, index) {
      let obj1 = item
        .getAttribute('class')
        .replace(/\bhoriz.*?\b/g, 'horiz_' + (index + 1) + '');
      item.setAttribute('class', obj1);
    });

    queryAll(`#${pageID} .bar_horiz`).forEach(function(item, index) {
      let obj2 = item
        .getAttribute('class')
        .replace(/\bbar_horiz_.*?\b/g, 'bar_horiz_' + (index + 1) + '');
      item.setAttribute('class', obj2);
    });

    horizLayoutGen(pageID, null, null, isCustomClose);
  }
  var panes = getVisiblePanes(pageID);
  numItems = panes.length;
  if (numItems == 1) {
    var pageIde = '#' + pageID + '';
    var paneIconsContainer = panes[0]
      .getElementsByTagName('iflight-gantt')[0]
      .shadowRoot.querySelector('.gantt_pane_icons_containter');
    /**/
    if (paneIconsContainer) {
      if (paneIconsContainer.length > 0) {
        for (var i = 0; i < paneIconsContainer.length; i++) {
          paneIconsContainer[i].style.display = 'none';
        }
      } else {
        paneIconsContainer.style.display = 'none';
      }
    }
  }
  hideMaxPaneLabel = null;
}

/**
 * Need description
 *
 * @param {Object} thisObj
 * @param {String} pageID
 * @param {String} paneID
 */
function openPane(thisObj, pageID, paneID) {
  var pane = getPaneStatus(pageID, paneID);
  pane.hidden = false;

  var hiddenPaneElement = thisObj[0].closest('#' + pageID + ' .pane_h_hidden');
  if (hiddenPaneElement) {
    hiddenPaneElement.classList.remove('pane_h_hidden');
  }
  hiddenPaneElement.classList.add('pane_h');
  hiddenPaneElement.classList.add('horiz_' + paneID);

  var panePosition = getPanePosition(pageID, paneID);
  var paneDivider = queryAll(`#${pageID} .static_bar_name_${panePosition} `);
  var nextPaneDivider = queryAll(
    `#${pageID} .static_bar_name_${panePosition - 1} `
  );
  var nextPaneDivider2 = queryAll(
    `#${pageID} .static_bar_name_${panePosition - 2} `
  );
  var paneSplitBar = queryAll(`#${pageID} .bar_horiz`);
  var visiblePane = queryAll(`#${pageID} .pane_h`);

  visiblePane.forEach(function(item, index) {
    var obj2 = item
      .getAttribute('class')
      .replace(/\bhoriz.*?\b/g, 'horiz_' + (index + 1) + '');
    item.setAttribute('class', obj2);
  });

  if (
    parseInt(queryAll(`#${pageID} .h_pane_wrapper > div`).length / 2) + 1 ==
    panePosition
  ) {
    if (nextPaneDivider.length > 0) {
      if (nextPaneDivider[0].classList.contains('bar_horiz_hidden')) {
        nextPaneDivider[0].classList.remove('bar_horiz_hidden');
        nextPaneDivider[0].classList.add('bar_horiz');
        nextPaneDivider[0].classList.add('bar_horiz_' + (panePosition - 1));

        paneSplitBar.forEach(function(item, index) {
          var barHorizClass = item
            .getAttribute('class')
            .replace(/\bbar_horiz_.*?\b/g, 'bar_horiz_' + (index + 1) + '');
          item.setAttribute('class', barHorizClass);
        });
      } else {
        if (nextPaneDivider2.length > 0) {
          if (nextPaneDivider2[0].classList.contains('bar_horiz_hidden')) {
            nextPaneDivider2[0].classList.remove('bar_horiz_hidden');
          }
          nextPaneDivider2[0].classList.add('bar_horiz');
          nextPaneDivider2[0].classList.add('bar_horiz_' + (panePosition - 2));
        }
        paneSplitBar.forEach(function(item, index) {
          var barHorizClass1 = item
            .getAttribute('class')
            .replace(/\bbar_horiz_.*?\b/g, 'bar_horiz_' + (index + 1) + '');
          item.setAttribute('class', barHorizClass1);
        });
      }
    }
  } else if (panePosition == 1) {
    if (paneDivider.length > 0) {
      if (paneDivider[0].classList.contains('bar_horiz_hidden')) {
        paneDivider[0].classList.remove('bar_horiz_hidden');
      }
      if (paneDivider[0].classList.contains('bar_horiz_' + panePosition)) {
        paneDivider[0].classList.remove('bar_horiz_' + panePosition);
      }
      paneDivider[0].classList.add('bar_horiz');
      paneDivider[0].classList.add('bar_horiz_' + panePosition);
    }
    paneSplitBar.forEach(function(item, index) {
      var barHorizListClass = item
        .getAttribute('class')
        .replace(/\bbar_horiz_.*?\b/g, 'bar_horiz_' + (index + 1) + '');
      item.setAttribute('class', barHorizListClass);
    });
  } else {
    if (
      $('#' + pageID + ' .static_bar_name_' + panePosition + '').hasClass(
        'bar_horiz_hidden'
      )
    ) {
      if (paneDivider) {
        if (paneDivider[0].classList.contains('bar_horiz_hidden')) {
          paneDivider[0].classList.remove('bar_horiz_hidden');
        }
        if (paneDivider[0].classList.contains('bar_horiz_' + panePosition)) {
          paneDivider[0].classList.remove('bar_horiz_' + panePosition);
        }
        paneDivider[0].classList.add('bar_horiz');
        paneDivider[0].classList.add('bar_horiz_' + panePosition);
      }
    } else {
      if (nextPaneDivider.length > 0) {
        if (nextPaneDivider[0].classList.contains('bar_horiz_hidden')) {
          nextPaneDivider[0].classList.remove('bar_horiz_hidden');
        }
        if (
          nextPaneDivider[0].classList.contains(
            'bar_horiz_' + (panePosition - 1)
          )
        ) {
          nextPaneDivider[0].classList.remove(
            'bar_horiz_' + (panePosition - 1)
          );
        }
        nextPaneDivider[0].classList.add('bar_horiz');
        nextPaneDivider[0].classList.add('bar_horiz_' + (panePosition - 1));
      }
    }

    paneSplitBar.forEach(function(item, index) {
      var barHorizClass2 = item
        .getAttribute('class')
        .replace(/\bbar_horiz_.*?\b/g, 'bar_horiz_' + (index + 1) + '');
      item.setAttribute('class', barHorizClass2);
    });
  }

  removeDuplicates(paneSplitBar);
  removeDuplicates(visiblePane);

  if (visiblePane.length > 1) {
    visiblePane.forEach(function(element) {
      var paneIconContainer = element.childNodes[0].shadowRoot.querySelector(
        `.gantt_pane_icons_containter`
      );
      if (paneIconContainer) {
        paneIconContainer.style.display = 'block';
      }
    });
  }
  horizLayoutGen(pageID);
  setTimeout(() => {
    window.dispatchEvent(new Event('resize'));
  });
}

/**
 * Need description
 *
 * @param {Object} thisObj
 * @param {String} pageID
 */
function disableBarDrag(thisObj, pageID) {
  numItems = queryAll(`#${pageID} .pane_h`).length;
  for (i = 1; i < numItems; i++) {
    let paneSeparator = query(`#${pageID} .bar_horiz_${i}`);
    let drag = document.createAttribute('draggable');
    drag.value = 'false';
    paneSeparator.setAttributeNode(drag);
  }
}

/**
 * Need description
 *
 * @param {Object} thisObj
 * @param {String} pageID
 */
function enableBarDrag(pageID) {
  numItems = queryAll(`#${pageID} .pane_h`).length;
  for (i = 1; i < numItems; i++) {
    let paneSeparator = query(`#${pageID} .bar_horiz_${i}`);
    let drag = document.createAttribute('draggable');
    drag.value = 'true';
    paneSeparator.setAttributeNode(drag);
  }
}

/**
 * Need description
 *
 * @param {Object} callback
 * @param {String} pageId
 * @param {String} component
 */
function callOnDrag(callback, pageId, component) {
  const funcName = `${callback.name}_${component}`;
  if (!onDragCallbacks[pageId]) {
    onDragCallbacks[pageId] = {};
  }
  onDragCallbacks[pageId][funcName] = callback;
}

/**
 * Need description
 *
 * @param {Object} callback
 * @param {String} pageId
 * @param {String} component
 */
function deRegisterDragCallback(callback, pageId, component) {
  const funcName = `${callback.name}_${component}`;
  if (onDragCallbacks[pageId] && onDragCallbacks[pageId][funcName]) {
    onDragCallbacks[pageId][funcName] = null;
  }
}

/**
 * Need description
 *
 * @param {String} pageId
 * @param {Integer} labelHeight
 */
function setTimebarHeight(pageId, labelHeight) {
  labelHeights[pageId] = labelHeight;
}

/**
 * Need description
 *
 * @param {Object} callback
 */
function hideMaxPaneLabelCallBack(callback) {
  hideMaxPaneLabel = callback;
}

/**
 * Need description
 *
 * @param {String} pageid
 */
function resetBars(pageid) {
  var barObject = $.getFromLocalStore('barObj')[customKeyMap[pageid]];
  var horiz_paneh_HiddenElement = query(
    `#${pageid} .horiz_${barObject.number}:not(.pane_h_hidden)`
  );
  var barHoriz_hiddenElement = query(
    `#${pageid} .bar_horiz_${barObject.number}:not(.bar_horiz_hidden)`
  );

  var topPaneBot = Math.round((barObject.topPaneBot / 100) * wrpperHeight);
  var bottomPaneTop = Math.round(
    (barObject.bottomPaneTop / 100) * wrpperHeight
  );
  var bottomPaneBottom = Math.round(
    (barObject.bottomPaneBottom / 100) * wrpperHeight
  );
  var topPane = queryAll(`#${pageid} .horiz_${barObject.number}.pane_h`);
  var bottomPane = queryAll(`#${pageid} .horiz_${barObject.number + 1}.pane_h`);
  if (topPane.length != undefined || topPane.length > 0) {
    topPane[0].style.height = 'auto';
    topPane[0].style.display = 'block';
    topPane[0].style.bottom = topPaneBot + 'px';
  }
  if (bottomPane.length != undefined || bottomPane.length > 0) {
    bottomPane[0].style.height = 'auto';
    bottomPane[0].style.display = 'block';
    bottomPane[0].style.bottom = bottomPaneBottom + 'px';
    bottomPane[0].style.top = bottomPaneTop + 'px';
  }
  if (barObject.number == 1) {
    horiz_paneh_HiddenElement.style.top = '0px';
    let paneOffsetHeight = horiz_paneh_HiddenElement.offsetHeight;
    barHoriz_hiddenElement.style.top = paneOffsetHeight + 'px';
  } else {
    horiz_paneh_HiddenElement.style.top =
      parseInt(getPrevVisible(pageid, barObject.number).offsetTop) +
      parseInt(getPrevVisible(pageid, barObject.number).offsetHeight) +
      barsize;
    let paneOffsetHeight = horiz_paneh_HiddenElement.offsetHeight;
    let cssTop = horiz_paneh_HiddenElement.offsetTop;
    barHoriz_hiddenElement.style.top = paneOffsetHeight + cssTop + 'px';
  }
  executePaneCallbacks(pageid);
}

/**
 * Need description
 *
 * @param {Integer} pageid
 */
function setDisplay(pageid) {
  /* IFNBAIMPL-3100 */

  var itemTW = 1;
  var buttonContainer = queryAll(`#${pageid} div.button_container > div`);
  var iconsToolbar = queryAll(`#${pageid} .toolbar_top .icon_set`);
  var icon_On_Toolbar = queryAll(`#${pageid} .toolbar_top .icon_set > div`);

  buttonContainer.forEach((element, index) => {
    iconsToolbar[0].appendChild(element);
    if (buttonContainer.length < 1) {
      query('.more_btn').style.display = 'none';
    }
  });
  var fullW = iconsToolbar[0].offsetWidth;
  icon_On_Toolbar.forEach((element, index) => {
    itemTW += element.offsetWidth;
    if (itemTW > fullW) {
      queryAll(`#${pageid} div.button_container`).forEach(el => {
        el.appendChild(element);
      });
    }
  });

  var more_Button = query(`#${pageid} .more_btn`);

  if (buttonContainer.length >= 1) {
    iconsToolbar.forEach((element, index) => {
      element.classList.add('set_width');
      more_Button.style.display = 'block';
    });
  } else {
    more_Button.style.display = 'none';
    iconsToolbar.forEach((element, index) => {
      element.classList.remove('set_width');
    });
  }
  const numOfItems = queryAll(`#${pageid} .pane_h`).length;
  if (numOfItems === 1) {
    const element = query(`#${pageid} .pane_h`)
      .getElementsByTagName('iflight-gantt')[0]
      .shadowRoot.querySelector('.gantt_pane_icons_containter');
    if (element) {
      element.style.display = 'none';
    }
  }
}

/**
 * Need description
 *
 * @param {Integer} pageid
 */
function custDropDown(pageid) {
  /* IFNBAIMPL-3100 */

  let more_Button = query(`#${pageid} .more_btn`);
  more_Button.addEventListener('click', function() {
    var nextOfMoreBtn = more_Button.nextElementSibling;
    nextOfMoreBtn.classList.toggle('open');
  });
}

/**
 * Need description
 *
 * @param {String} pageid
 * @param {String} currKey
 */
function setCustomKeyMap(pageid, currKey) {
  customKeyMap[pageid] = currKey;
}

/**
 * Need description
 */

function removeDuplicates(array) {
  array.forEach(function(element, index) {
    var arr = [];
    var classList = element.getAttribute('class').split(' ');
    for (var i = 0; i < classList.length; i++) {
      var item = classList[i];
      if (arr.indexOf(item) < 0) {
        arr.push(item);
      }
    }
    element.setAttribute('class', arr.join(' '));
  });
}
/**
 * Need description
 */
window.addEventListener('resize', function(event, doNotResizeGantt) {
  arrItems = [];
  arrBars = [];
  if (!event.isTrusted) {
    maxPaneHeight = 0;
  }
  const pageId = ds.getData('app', 'activeTabID');
  if (
    pageId &&
    window.ganttLayoutComplete &&
    window.ganttLayoutComplete[pageId]
  ) {
    if (Math.round((maxPaneHeight / wrpperHeight) * 100) > 50) {
      // if PaneHeight is greater than 50%, the pane can be considered as maximized.
      doNotResizeGantt = true;
      for (i = numItems; i >= xnumber; i--) {
        let paneBarRef = query(`#${pageId} .bar_horiz_${i}`);
        if (paneBarRef) {
          paneBarRef.style.top = 'auto';
        }
      }
    }
    if (!doNotResizeGantt) {
      // eslint-disable-next-line guard-for-in
      for (const pageid in window.ganttLayoutComplete) {
        restorePane(null, pageid);
      }
      if (hideMaxPaneLabel) {
        hideMaxPaneLabel();
      }
    } else {
      executePaneCallbacks(pageId, doNotResizeGantt);
    }
  } else if (
    window.ganttLayoutComplete &&
    Object.keys(window.ganttLayoutComplete).length > 0 &&
    !doNotResizeGantt
  ) {
    // eslint-disable-next-line guard-for-in
    for (const pageid in window.ganttLayoutComplete) {
      restorePane(null, pageid);
    }
  }
  if (
    window.ganttLayoutComplete &&
    pageId &&
    window.ganttLayoutComplete[pageId]
  ) {
    setDisplay(pageId);
  }
});
/**
 * Need description
 *
 * @param {String} pageId
 * @param {Integer} excludeTimeBarHeight
 * @returns {Integer}
 */
function getWrapperHeight(pageId, excludeTimeBarHeight) {
  var isTabularPaneVisible;
  var wrapper_TabularPane_Element = query(
    `#${pageId} .h_pane_wrapper`
  ).getElementsByClassName('tabular_pane_class');
  if (
    wrapper_TabularPane_Element.length == 0 ||
    wrapper_TabularPane_Element.length == undefined
  ) {
    isTabularPaneVisible = false;
  } else {
    isTabularPaneVisible = wrapper_TabularPane_Element.classList.contains(
      'pane_h'
    );
  }

  var tabularPaneHeight = 0;
  var numItems = queryAll(`#${pageId} .pane_h`).length;
  var wrapperHeight;
  queryAll(`#${pageId} .h_pane_wrapper`).forEach((element, index) => {
    if (element.clientHeight > 0) {
      // assume div with class h_pane_wrapper with height > 0 is considered as open pane
      wrapperHeight = element.clientHeight - 2; // 2 is to avoid v-scroll bar
    }
  });
  if (isTabularPaneVisible) {
    var wrapper_pane_Element = query(
      `#${pageId} .h_pane_wrapper`
    ).getElementsByClassName('tabular_pane_class');
    tabularPaneHeight = wrapper_pane_Element.clientHeight;
  }
  wrapperHeight = wrapperHeight - tabularPaneHeight - (numItems - 1) * barsize;
  if (excludeTimeBarHeight) {
    wrapperHeight = wrapperHeight - labelHeights[pageId];
  }
  return wrapperHeight;
}

function setBarSize(size) {
  barsize = size;
}
/**
 * Exporting all public API's in iflight gantt services
 */
export const layouts = {
  getAllPanesStatus,
  getPanePosition,
  getPaneStatus,
  setPaneStatus,
  clearPaneStatus,
  resetLayout: horizLayoutGen,
  ganttLayout: initLayout,
  closeCustompanes,
  hidePane: addToCusList,
  maximizePane,
  restorePane,
  minimizePane,
  closePane,
  openPane,
  disableHorizBarDrag: disableBarDrag,
  enableHorizBarDrag: enableBarDrag,
  registerDragCallback: callOnDrag,
  deRegisterDragCallback,
  setTimebarHeight,
  hideMaxPaneLabelCallBack,
  resetBars,
  setDisplay,
  custDropDown,
  setCustomKeyMap,
  getWrapperHeight,
  setBarSize,
};
