import {
  Column,
  ColumnFilter,
  Filter,
  FilterArguments,
  FilterCallback,
  OperatorType,
  OperatorString,
  SearchTerm,
} from './../models/index';

// using external non-typed js libraries
declare const $: any;

const DEFAULT_MIN_VALUE = 0;
const DEFAULT_MAX_VALUE = 100;
const DEFAULT_STEP = 1;

export class SliderFilter implements Filter {
  protected _clearFilterTriggered = false;
  protected _currentValue = 0;
  protected _shouldTriggerQuery = true;
  protected _elementRangeInputId!: string;
  protected _elementRangeOutputId!: string;
  protected $filterElm: any;
  protected $filterInputElm: any;
  protected $filterNumberElm: any;
  grid: any;
  searchTerms: SearchTerm[] = [];
  columnDef!: Column;
  callback!: FilterCallback;

  /** Getter for the Column Filter */
  get columnFilter(): ColumnFilter {
    return this.columnDef && this.columnDef.filter || {};
  }

  /** Getter to know what would be the default operator when none is specified */
  get defaultOperator(): OperatorType | OperatorString {
    return OperatorType.equal;
  }

  /** Getter for the Filter Generic Params */
  protected get filterParams(): any {
    return this.columnDef && this.columnDef.filter && this.columnDef.filter.params || {};
  }

  /** Getter for the `filter` properties */
  protected get filterProperties(): ColumnFilter {
    return this.columnDef && this.columnDef.filter || {};
  }

  get operator(): OperatorType | OperatorString {
    return this.columnFilter && this.columnFilter.operator || this.defaultOperator;
  }

  /** Setter for the filter operator */
  set operator(operator: OperatorType | OperatorString) {
    if (this.columnFilter) {
      this.columnFilter.operator = operator;
    }
  }

  /**
   * Initialize the Filter
   */
  init(args: FilterArguments) {
    if (!args) {
      throw new Error('[Angular-SlickGrid] A filter must always have an "init()" with valid arguments.');
    }
    this.grid = args.grid;
    this.callback = args.callback;
    this.columnDef = args.columnDef;
    this.searchTerms = (args.hasOwnProperty('searchTerms') ? args.searchTerms : []) || [];

    // define the input & slider number IDs
    this._elementRangeInputId = `rangeInput_${this.columnDef.field}`;
    this._elementRangeOutputId = `rangeOutput_${this.columnDef.field}`;

    // filter input can only have 1 search term, so we will use the 1st array index if it exist
    const searchTerm = (Array.isArray(this.searchTerms) && this.searchTerms.length >= 0) ? this.searchTerms[0] : '';

    // step 1, create HTML string template
    const filterTemplate = this.buildTemplateHtmlString();

    // step 2, create the DOM Element of the filter & initialize it if searchTerm is filled
    this.$filterElm = this.createDomElement(filterTemplate, searchTerm);

    // step 3, subscribe to the change event and run the callback when that happens
    // also add/remove "filled" class for styling purposes
    this.$filterInputElm.change((e: any) => {
      const value = e && e.target && e.target.value;
      this._currentValue = +value;

      if (this._clearFilterTriggered) {
        this.$filterElm.removeClass('filled');
        this.callback(e, { columnDef: this.columnDef, clearFilterTriggered: this._clearFilterTriggered, searchTerms: [], shouldTriggerQuery: this._shouldTriggerQuery });
      } else {
        this.$filterElm.addClass('filled');
        this.callback(e, { columnDef: this.columnDef, operator: this.operator, searchTerms: [value || '0'], shouldTriggerQuery: this._shouldTriggerQuery });
      }
      // reset both flags for next use
      this._clearFilterTriggered = false;
      this._shouldTriggerQuery = true;
    });

    // if user chose to display the slider number on the right side, then update it every time it changes
    // we need to use both "input" and "change" event to be all cross-browser
    if (!this.filterParams.hideSliderNumber) {
      this.$filterInputElm.on('input change', (e: { target: HTMLInputElement }) => {
        const value = e && e.target && e.target.value;
        if (value !== undefined && value !== null) {
          const elements = document.getElementsByClassName(this._elementRangeOutputId);
          if (elements.length) {
            elements[0].innerHTML = value;
          }
        }
      });
    }
  }

  /**
   * Clear the filter value
   */
  clear(shouldTriggerQuery = true) {
    if (this.$filterElm) {
      this._clearFilterTriggered = true;
      this._shouldTriggerQuery = shouldTriggerQuery;
      this.searchTerms = [];
      const clearedValue = this.filterParams.hasOwnProperty('sliderStartValue') ? this.filterParams.sliderStartValue : DEFAULT_MIN_VALUE;
      this._currentValue = +clearedValue;
      this.$filterInputElm.val(clearedValue);
      this.$filterNumberElm.html(clearedValue);
      this.$filterInputElm.trigger('change');
    }
  }

  /**
   * destroy the filter
   */
  destroy() {
    if (this.$filterInputElm) {
      this.$filterInputElm.off('input change').remove();
    }
    this.$filterInputElm = null;
    this.$filterElm = null;
  }

  /**
   * Get selected value retrieved from the slider element
   * @params selected items
   */
  getValues(): number {
    return this._currentValue;
  }

  /** Set value(s) on the DOM element */
  setValues(values: SearchTerm | SearchTerm[], operator?: OperatorType | OperatorString) {
    if (Array.isArray(values)) {
      this.$filterInputElm.val(`${values[0]}`);
      this.$filterNumberElm.html(`${values[0]}`);
      this._currentValue = +values[0];
    } else if (values) {
      this.$filterInputElm.val(values);
      this._currentValue = +values;
    }

    // set the operator when defined
    this.operator = operator || this.defaultOperator;
  }

  //
  // protected functions
  // ------------------

  /**
   * Create the HTML template as a string
   */
  protected buildTemplateHtmlString() {
    const fieldId = this.columnDef && this.columnDef.id;
    const minValue = this.filterProperties.hasOwnProperty('minValue') ? this.filterProperties.minValue : DEFAULT_MIN_VALUE;
    const maxValue = this.filterProperties.hasOwnProperty('maxValue') ? this.filterProperties.maxValue : DEFAULT_MAX_VALUE;
    const defaultValue = this.filterParams.hasOwnProperty('sliderStartValue') ? this.filterParams.sliderStartValue : minValue;
    const step = this.filterProperties.hasOwnProperty('valueStep') ? this.filterProperties.valueStep : DEFAULT_STEP;

    if (this.filterParams.hideSliderNumber) {
      return `
      <div class="search-filter slider-container filter-${fieldId}">
        <input type="range" name="${this._elementRangeInputId}"
          defaultValue="${defaultValue}" value="${defaultValue}"
          min="${minValue}" max="${maxValue}" step="${step}"
          class="form-control slider-filter-input range ${this._elementRangeInputId}" />
      </div>`;
    }

    return `
      <div class="input-group slider-container search-filter filter-${fieldId}">
        <input type="range" name="${this._elementRangeInputId}"
          defaultValue="${defaultValue}" value="${defaultValue}"
          min="${minValue}" max="${maxValue}" step="${step}"
          class="form-control slider-filter-input range ${this._elementRangeInputId}" />
        <div class="input-group-addon input-group-append slider-value">
          <span class="input-group-text ${this._elementRangeOutputId}">${defaultValue}</span>
        </div>
      </div>`;
  }

  /**
   * From the html template string, create a DOM element
   * @param filterTemplate string
   * @param searchTerm optional preset search terms
   */
  protected createDomElement(filterTemplate: string, searchTerm?: SearchTerm) {
    const columnId = this.columnDef && this.columnDef.id;
    const minValue = (this.filterProperties.hasOwnProperty('minValue') ? this.filterProperties.minValue : DEFAULT_MIN_VALUE) as number;
    const startValue = this.filterParams.hasOwnProperty('sliderStartValue') ? this.filterParams.sliderStartValue : minValue;
    const $headerElm = this.grid.getHeaderRowColumn(columnId);
    $($headerElm).empty();

    // create the DOM element & add an ID and filter class
    const $filterElm = $(filterTemplate);
    let searchTermInput = (searchTerm || '0') as string;
    if (+searchTermInput < minValue) {
      searchTermInput = `${minValue}`;
    }
    if (+searchTermInput < startValue) {
      searchTermInput = `${startValue}`;
    }
    this._currentValue = +searchTermInput;

    this.$filterInputElm = $filterElm.children('input');
    this.$filterNumberElm = $filterElm.children('div.input-group-addon.input-group-append').children();
    this.$filterInputElm.val(searchTermInput);
    this.$filterNumberElm.html(searchTermInput);
    $filterElm.data('columnId', columnId);

    // if there's a search term, we will add the "filled" class for styling purposes
    if (searchTerm) {
      $filterElm.addClass('filled');
    }

    // append the new DOM element to the header row
    if ($filterElm && typeof $filterElm.appendTo === 'function') {
      $filterElm.appendTo($headerElm);
    }

    return $filterElm;
  }
}
