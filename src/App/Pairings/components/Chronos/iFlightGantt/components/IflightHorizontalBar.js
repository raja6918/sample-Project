'use strict';
import { services } from '../services';
import { ds } from '../data';
import { safeConfigEval } from '../core';

export class IflightHorizontalBar extends HTMLElement {
  constructor() {
    super();
    this._scrollOptions = null;
  }

  static get observedAttributes() {
    return ['id'];
  }

  connectedCallback() {}

  disconnectedCallback() {
    // Need to do cleanup
  }

  render() {
    const { shadowRoot } = this;
    shadowRoot.querySelector('.ui-hBar-container').id = `${
      this.id
    }ui-hBar-container`;
    shadowRoot.querySelector('.ui-scrollBarHorizontal').id = `${
      this.id
    }ui-scrollBarHorizontal`;

    const scrollBarOptions = {};
    if (this._scrollOptions) {
      scrollBarOptions.scrollOptions = this._scrollOptions;
    }

    const hScrollBar = services.createHorizontalScollBar(
      `${this.id}ui-scrollBarHorizontal`,
      scrollBarOptions
    );

    ds.addData('page', 'hScrollBar', this.getAttribute('page-id'), hScrollBar);
  }

  initializeHorizontalScrollbarTemplate() {
    const template = document.createElement('template');
    let uniqueID = this.id;
    template.innerHTML = `
		<style>
			.ui-hBar-container{
				width: 100%;
        height: 15px;
        margin: 1px 0;
        margin-right: 15px;
        position: relative;
        transition: all 0.2s ease;
			}
			.ui-scrollBarHorizontal{
				width: 100%;
        height: 15px;
        margin: 0px;
        padding: 0px;
        position: relative;
        transition: all 0.2s ease;
			}
		</style>
		<div id=uniqueID class="ui-hBar-container">
			<div id=uniqueID class="ui-scrollBarHorizontal" chronosresize="true">
				<!-- Horizontal Scrollbar -->
			</div>
		</div>
   `;
    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.appendChild(template.content.cloneNode(true));
    this.render();
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    if (attrName == 'id' && !newVal.toString().startsWith('{{')) {
      this.initializeHorizontalScrollbarTemplate();
    }
  }

  get scrollOptions() {
    return this._scrollOptions;
  }

  set scrollOptions(scrollOptions) {
    if (scrollOptions) {
      this._scrollOptions = scrollOptions;
    }
  }
}

if (window.customElements) {
  window.customElements.define('iflight-horizontal-bar', IflightHorizontalBar);
}
