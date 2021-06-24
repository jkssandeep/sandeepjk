<template>
  <div class="MuiAutocomplete-root">
    <div
      class="autocomplete__box"
      :class="{ autocomplete__searching: showResults,'Mui-focused':Focusinputbox }"
    >
      <img v-if="isLoading" class="autocomplete__icon animate-spin" src="../assets/loading.svg" />

      <div class="MuiAutocomplete-inputRoot" :class="{'blurredinputs':blurOnSelect }">
        <input
          v-model="display"
          :id="id"
          class="MuiAutocomplete-input"
          :placeholder="placeholder"
          :disabled="disabled"
          :maxlength="maxlength"
          :class="{inputClass,'MuiAutocomplete-inputFocused':inputhover}"
          @click="search"
          @input="search"
          @keydown.enter="enter"
          @keydown.tab="close"
          @keydown.up="up"
          @keydown.down="down"
          @keydown.esc="esc"
          @keydown.home="home"
          @keydown.end="end"
          @focus="focus"
          @blur="blur"
          @mouseover=" inputhover=true"
          type="text"
          autocomplete="off"
        />
        <input :name="name" type="hidden" :value="value" />
      </div>

      <span v-if="this.forcePopupIcon" @click="dropdownmethod" :class="clearButtonIcon">
        <img
          class="MuiAutocomplete-hasPopupIcon"
          :class="{'dropup':this.icon, 'dropdown':!this.icon,'disableDiv':this.disabled}"
          src="../assets/Arrow_Up.svg"
        />
      </span>

      <!-- clearButtonIcon -->
      <span
        v-show="
          !disableInput &&
          !isEmpty &&
          !isLoading &&
          !hasError &&
          !disableClearable
        "
        class="MuiAutocomplete-hasClearIcon"
        @click="clear"
      >
        <div :disabled="this.disabled" class="tooltip">
          <span v-if="clearButtonIcon" :class="clearButtonIcon"></span>

          <img v-else src="../assets/close.svg" />
          <span class="tooltiptext">clear</span>
        </div>
      </span>
    </div>

    <ul v-show="showResults" class="MuiAutocomplete-listbox" :style="listStyle">
      <slot name="results">
        <!-- error -->
        <li
          v-if="hasError"
          class="MuiAutocomplete-option autocomplete__results__item--error"
        >{{ error }}</li>

        <!-- results -->
        <template v-if="!hasError">
          <slot name="firstResult"></slot>

          <div>
            <li
              v-show="!disablePortal"
              v-for="(result, key) in results"
              :key="key"
              @click.prevent="select(result)"
              class="MuiAutocomplete-option"
              :class="{
                'autoselect': !firstRowHighlight && autoHighlight && upanddown,

                'autocomplete__selected': isSelected(key) || (selectedvalueee(key)&&selectOnFocus)  ,
              
               'disableDiv':disableitems(key),
               'disabledivunfocus':disableitems(key)&& !disableItemsFocusable,
               'text-wrap':!disableListWrap,
               'fullwidth':fullwidth
               
               
               
              }"
              @mouseover="highlight()"
              v-html="formatDisplay(result)"
            ></li>
            <li class="MuiAutocomplete-option" :class="{'load':!elementVisible}">
              <em>loading....</em>
            </li>
          </div>
          <slot name="lastResult"></slot>
        </template>

        <!-- no results -->
<li
     v-if=" this.display && !freeSolo && this.results.length===0 &&(this.display!==this.selectedDisplay)"
          class="autocomplete__results__item autocomplete__no-results"
           >
          <slot >No Results.</slot>
 </li>
      </slot>
    </ul>
  </div>
  <!-- </popper> -->
</template>

<script type="text/babel">
import debounce from "lodash/debounce";
// import Popper from 'vue-popperjs';
export default {
  //  components: {
  //       'popper': Popper
  //     },
  props: {
    /**
     * Data source for the results
     *   `String` is a url, typed input will be appended
     *   `Function` received typed input, and must return a string; to be used as a url
     *   `Array` and `Object` (see `results-property`) are used directly
     */
    shape: {
      type: String
    },
    source: {
      type: [String, Function, Array, Object],
      required: true
    },
    clearOnEscape: {
      type: Boolean,
      default: false
    },
    disableClearable: {
      type: Boolean,
      default: false
    },
    autoHighlight: {
      type: Boolean,
      default: false
    },
    autoSelect: {
      type: Boolean,
      default: false
    },
    disableCloseOnSelect: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    openOnFocus: {
      type: Boolean,
      default: false
    },
    debug: {
      type: Boolean,
      default: false
    },
    includeInputInList: {
      type: Boolean,
      default: false
    },
    freeSolo: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    },
    disablePortal: {
      type: Boolean,
      default: false
    },
    disableListWrap: {
      type: Boolean,
      default: false
    },
    id: {
      type: String
    },
    fullwidth: {
      type: Boolean,
      default: false
    },
    disableOption: {
      type: String
    },
    getOptionSelected: {
      type: String
    },
    getOptionDisabled: {
      type: String
    },
    blurOnSelect: {
      type: Boolean,
      default: false
    },
    getOptionLabel: {
      type: String
    },
    forcePopupIcon: {
      type: Boolean,
      default: false
    },
    disableItemsFocusable: {
      type: Boolean,
      default: false
    },
    /**
     * http method
     */
    method: {
      type: String,
      default: "get"
    },
    /**
     * Input placeholder
     */
    placeholder: {
      default: "Search"
    },
    /**
     * Preset starting value
     */
    initialValue: {
      type: [String, Number]
    },
    /**
     * Preset starting display value
     */
    initialDisplay: {
      type: String
    },
    /**
     * CSS class for the surrounding input div
     */
    inputClass: {
      type: [String, Object]
    },
    /**
     * To disable the input
     */
    disableInput: {
      type: Boolean
    },
    /**
     * name property of the input holding the selected value
     */
    name: {
      type: String
    },
    /**
     * api - property of results array
     */
    resultsProperty: {
      type: String
    },
    /**
     * Results property used as the value
     */
    resultsValue: {
      type: String,
      default: "id"
    },
    /**
     * Results property used as the display
     */
    resultsDisplay: {
      type: [String, Function]
    },

    /**
     * Callback to format the server data
     */
    resultsFormatter: {
      type: Function
    },

    /**
     * Whether to show the no results message
     */
    showNoResults: {
      type: Boolean,
      default: true
    },

    /**
     * Additional request headers
     */
    requestHeaders: {
      type: Object
    },

    /**
     * Credentials: same-origin, include, *omit
     */
    credentials: {
      type: String
    },

    /**
     * Optional clear button icon class
     */
    clearButtonIcon: {
      type: String
    },

    /**
     * Optional max input length
     */
    maxlength: {
      type: Number
    }
  },
  data() {
    return {
      value: null,
      display: "",
      results:[],
      visible: false,
     /*  results: null, */
      selectedIndex: null,

      isFocussed: false,
      error: null,
      selectedId: null,
      selectedDisplay: null,

      eventListener: false,
      firstRowHighlight: false,
      upanddown: true,
      clearOnBlur: !this.freeSolo,
      handleHomeEndKeys: !this.freeSolo,
      selectOnFocus: !this.freeSolo,
      loadingtext: false,
      icon: false,
      items: [],
      option: null,
      disableitem: false,
      labelDisplay: this.resultsDisplay,
      resultslength: null,
      Focusinputbox: false,
      inputhover: false,
      elementVisible: true
    };
  },
  computed: {
    showResults() {
      return Array.isArray(this.results) || this.hasError;
    },
/*     noResults() {
      return Array.isArray(this.results) && this.results.length === 0;
    }, */
    noResultMessage() {
      return (
        this.noResults &&
        !this.isLoading &&
        this.isFocussed &&
        !this.hasError &&
        this.showNoResults
      );
    },
    isEmpty() {
      return !this.display;
    },
    isLoading() {
      return this.loading === true;
    },
    hasError() {
      return this.error !== null;
    },

    listStyle() {
      return { color: "ccc" };
    }
  },
  methods: {
    highlight() {
      this.firstRowHighlight = true;
      this.loadingtext = false;
    },

    loadtext() {
      if (this.firstRowHighlight === true) return true;
      else return false;
    },
    dropdownmethod() {
      setTimeout(() => this.elementVisible = false, 3000)
      if (this.disabled === false) {
        this.icon = !this.icon;
        if (this.icon === false) {
          this.dropdown();
        }

        if (this.icon === true) this.search();
      }
    },
    getOptionbyLabel(option) {
      return option;
    },
    setInputSelection(input, startPos, endPos) {
      input.focus();
      if (typeof input.selectionStart != "undefined") {
        input.selectionStart = startPos;
        input.selectionEnd = endPos;
      } else if (document.selection && document.selection.createRange) {
        // IE branch
        input.select();
        var range = document.selection.createRange();
        range.collapse(true);
        range.moveEnd("character", endPos);
        range.moveStart("character", startPos);
        range.select();
      }
    },
    onkeydown: function (e) {
      this.stopAutoFill = false;

      if (e.keyCode == 8) {
        this.backspaceentered = true;
      } else if (e.keyCode == 13) {
        if (
          this.source.filter(
            (item) =>
              item["name"]
                .toLowerCase()
                .startsWith(e.target.value.toLowerCase(), 0) && !item.invisible
          ).length > 0
        ) {
          this.selectedDisplay.push(
            this.source.filter(
              (item) =>
                item["name"]
                  .toLowerCase()
                  .startsWith(e.target.value.toLowerCase(), 0) &&
                !item.invisible
            )[0]
          );
          var id = this.source.filter(
            (item) =>
              item["name"]
                .toLowerCase()
                .startsWith(e.target.value.toLowerCase(), 0) && !item.invisible
          )[0].id;
          this.source.forEach(function (item) {
            if (item.id === id) {
              item.invisible = true;
            }
          });

          this.display = "";
          //  this.results.length = 0;
        }
      }
    },

    

    /**
     * Search wrapper method
     
     */
    search: function (event){
      

      var textvalue ='';
      if(event!=undefined){
          this.searchtext = event.target.value;
          textvalue = event.target.value; 
      }
        
      console.log("searchtext in keypressed", this.searchtext);
      if (this.backspaceentered) {
        this.backspaceentered = false;
      } else {
        if (!this.stopAutoFill && textvalue != "") {
          if (
            this.source.filter(
              (item) =>
                item["name"]
                  .toLowerCase()
                  .startsWith(textvalue.toLowerCase(), 0) &&
                !item.invisible
            ).length > 0
          ) {
            var querylength = textvalue.length;
            var fullstring = this.source.filter(
              (item) =>
                item["name"]
                  .toLowerCase()
                  .startsWith(textvalue.toLowerCase(), 0) &&
                !item.invisible
            )[0].name;

            
            this.display = fullstring;
          if (event != undefined){
            event.target.value = fullstring;
            this.setInputSelection(
              event.target,
              querylength,
              fullstring.length
            );
          }
            
            this.stopAutoFill = true;
          }
        }
      }

        if (this.openOnFocus === true ) {
        this.upanddown = true;
        this.firstRowHighlight = false;
            
            this.loadingtextthing="loading..";

           setTimeout(function(){ this.loadingtextthing="" }, 1000);
         



        this.$emit("OnhighlightChange");

        this.labelDisplay=(this.label);
        this.getOptionLabel = this.label;
        
        this.icon=true;
                         
           console.log("typeof this.source", typeof this.source);
        switch (true) {
          case typeof this.source === "string":
            // No resource search with no input
            if (!this.display || this.display.length < 1) {
              return;
            }

            return this.resourceSearch(this.source + this.display);
          case typeof this.source === "function":
            // No resource search with no input
            if (!this.display || this.display.length < 1) {
              return;
            }
            return this.resourceSearch(this.source(this.display));
          case Array.isArray(this.source):
            {

              // this.resultsDisplay="Category"
            return this.arrayLikeSearch();
            
            }
          default:
            throw new TypeError();
        }
      
        }
    },



    /**
     * Debounce the typed search query before making http requests
     * @param {String} url
     */
    resourceSearch: debounce(function(url) {
      if (!this.display) {
        this.results = [];
        return;
      }
      this.loading = true;
      this.setEventListener();
      this.request(url);
    }, 200),

    /**
     * Make an http request for results
     * @param {String} url
     */
    request(url) {
      let promise = fetch(url, {
        method: this.method,
        credentials: this.getCredentials(),
        headers: this.getHeaders()
      });

      return promise
        .then(response => {
          if (response.ok) {
            this.error = null;
            return response.json();
          }
          throw new Error("Network response was not ok.");
        })
        .then(response => {
          this.results = this.setResults(response);
          this.emitRequestResultEvent();
          this.loading = false;
        })
        .catch(error => {
          this.error = error.message;
          this.loading = false;
        });
    },

    /**
     * Set some default headers and apply user supplied headers
     */
    getHeaders() {
      const headers = {
        Accept: "application/json, text/plain, */*"
      };
      if (this.requestHeaders) {
        for (var prop in this.requestHeaders) {
          headers[prop] = this.requestHeaders[prop];
        }
      }
      return new Headers(headers);
    },

    /**
     * Set default credentials and apply user supplied value
     */
    getCredentials() {
      let credentials = "same-origin";
      if (this.credentials) {
        credentials = this.credentials;
      }
      return credentials;
    },

    /**
     * Set results property from api response
     * @param {Object|Array} response
     * @return {Array}
     */
    setResults(response) {
      if (this.resultsFormatter) {
        return this.resultsFormatter(response);
      }
      if (this.resultsProperty && response[this.resultsProperty]) {
        return response[this.resultsProperty];
      }
      if (Array.isArray(response)) {
        return response;
      }
      return [];
    },

    /**
     * Emit an event based on the request results
     */
    emitRequestResultEvent() {
      if (this.results.length === 0) {
        this.$emit("noResults", { query: this.display });
      } else {
        this.$emit("results", { results: this.results });
      }
    },

    filterOptions(obj) {
      if (obj[this.labelDisplay].length > 2) return obj[this.labelDisplay];
    },
    /**
     * Search in results passed via an array
     */
    arrayLikeSearch() {
      this.setEventListener();

      if (!this.display || this.display == this.selectedDisplay) {
        this.results = this.source.filter(item => {
          return this.filterOptions(item);
        });
        this.resultslength = this.results.length;
        console.log("this.results.length - 1", this.results.length - 1);
        this.$emit("results", { results: this.results });
        this.loading = false;
        return true;
      }

      if (this.display != this.selectedDisplay) {
        this.results = this.source.filter(item => {
          return this.formatDisplay(item)
            .toLowerCase()
            .includes(this.display.toLowerCase());
        });
        this.resultslength = this.results.length;
        this.$emit("results", { results: this.results });
        this.loading = false;
      }
    },

    /**
     * Select a result
     * @param {Object}
     */
    select(obj) {
      if (!obj) {
        return;
      }
      this.icon = false;
      this.value =
        this.resultsValue && obj[this.resultsValue]
          ? obj[this.resultsValue]
          : obj.id;
      this.display = this.formatDisplay(obj);
      this.selectedDisplay = this.display;
      this.selectedValue = true;

      this.$emit("OnChange", {
        value: this.value,
        display: this.display,
        selectedObject: obj
      });

      this.$emit("input", this.value);
      this.getOptionbyDisabled(this.getOptionDisabled);
      if (this.selectedDisplay != null) {
        if (this.getOptionbySelected(this.getOptionSelected)) {
          console.log(this.getOptionSelected + " is selected");
        } else console.log(this.getOptionSelected + " is not selected");
      }
      if (this.disableCloseOnSelect === false) {
        this.close();
      }
    },
    getOptionbySelected(option) {
      if (option === this.selectedDisplay) return true;
      else return false;
    },
    getOptionbyDisabled(option) {
      for (let i = 0; i < this.items.length; i++) {
        if (this.disableitems(i)) {
          if (this.items[i] === this.getOptionDisabled) {
            this.disableitem = true;
            console.log(option + " is disabled");
            break;
          }
        }
      }
      if (this.disableitem === false) console.log(option + " is not disabled");
    },

    /**
     * @param  {Object} obj
     * @return {String}
     */
    formatDisplay(obj) {
      switch (typeof this.labelDisplay) {
        case "function":
          return this.labelDisplay(obj);
        case "string":
          if (!obj[this.labelDisplay]) {
            throw new Error(
              `"${this.labelDisplay}" property expected on result but is not defined.`
            );
          }
          if (this.items.length <= this.source.length) {
            this.items.push(obj[this.labelDisplay]);
          }
          return obj[this.labelDisplay];

        default:
          throw new TypeError();
      }
    },

    /**
     * Register the component as focussed
     */
    focus() {
      this.isFocussed = true;
    },

    /**
     * Remove the focussed value
     */
    blur() {
      this.isFocussed = false;
    },

    /**
     * Is this item selected?
     * @param {Object}
     * @return {Boolean}
     */
    isSelected(key) {
      return key === this.selectedIndex;
    },

    selectedvalueee(key) {
      if (key === this.value - 1) {
        return true;
      } else return false;
    },

    disableitems(key) {
      if (this.items[key] === this.disableOption) return true;
      else return false;
    },

    /**
     * Focus on the previous results item
     */
    up() {
      this.upanddown = false;

      this.firstRowHighlight = false;
      if (this.selectedIndex === null) {
        this.selectedIndex = this.results.length - 1;
        return;
      }
      if (this.includeInputInList === false) {
        this.selectedIndex =
          this.selectedIndex === 0
            ? this.results.length - 1
            : this.selectedIndex - 1;
      } else {
        if (this.selectedIndex === 1) {
          this.selectedIndex = 0;
        } else if (this.selectedIndex === 0) {
          this.selectedIndex = null;
        } else {
          this.selectedIndex = this.selectedIndex - 1;
        }
      }
    },

    /**
     * Focus on the next results item
     */
    down() {
      this.upanddown = false;
      this.firstRowHighlight = false;

      if (this.selectedIndex === null) {
        this.selectedIndex = 0;
        return;
      }
      if (this.includeInputInList === false) {
        this.selectedIndex =
          this.selectedIndex === this.results.length - 1
            ? 0
            : this.selectedIndex + 1;
      } else {
        this.selectedIndex =
          this.selectedIndex === this.results.length - 1
            ? null
            : this.selectedIndex + 1;
      }
    },
    /**
     * Select an item via the keyboard
     */
    enter() {
      if (this.selectedIndex === null) {
        this.$emit("nothingSelected", this.display);
        return;
      }
      this.select(this.results[this.selectedIndex]);
      this.$emit("enter", this.display);
    },

    /**
     * Clear all values, results and errors
     */
    clear() {
      this.display = null;
      this.value = null;
      this.results = null;
      this.error = null;
      this.icon = false;
      this.Focusinputbox = false;
      this.$emit("clear");
    },
    dropdown() {
      this.value = null;
      this.results = null;
      this.error = null;

      this.Focusinputbox = false;
      this.$emit("clear");
    },
    esc() {
      console.log("hello", this.clearOnEscape);
      if (this.clearOnEscape === true) {
        this.display = null;
        this.value = null;
        this.results = null;
        this.error = null;
        this.icon = false;

        this.Focusinputbox = false;
        this.$emit("clear");
      }
    },

    home() {
      if (this.handleHomeEndKeys === true) this.selectedIndex = 0;
    },

    end() {
      if (this.handleHomeEndKeys === true)
        this.selectedIndex = this.resultslength - 1;
    },

    /**
     * Close the results list. If nothing was selected clear the search
     */
    close() {
      if (!this.value || !this.selectedDisplay) {
        if (this.freeSolo === false) {
          this.clear();
        }
      }
      if (this.selectedDisplay !== this.display && this.value) {
        this.display = this.selectedDisplay;
      }
      this.Focusinputbox = false;

      this.results = null;
      this.error = null;

      this.removeEventListener();

      this.$emit("close");
    },

    /**
     * Add event listener for clicks outside the results
     */
    setEventListener() {
      if (this.eventListener) {
        return false;
      }
      this.eventListener = true;
      document.addEventListener("click", this.clickOutsideListener, true);
      return true;
    },

    /**
     * Remove the click event listener
     */
    removeEventListener() {
      this.eventListener = false;
      document.removeEventListener("click", this.clickOutsideListener, true);
    },

    /**
     * Method invoked by the event listener
     */
    clickOutsideListener(event) {
      this.elementVisible = true;
      this.$emit("OnhighlightChange");
      if (this.debug === true) {
        if (this.display == "" || this.display == undefined) {
          if (this.$el && !this.$el.contains(event.target)) {
            this.close();
            this.icon = false;
            this.Focusinputbox = false;
          }
        }
      } else {
        if (this.$el && !this.$el.contains(event.target)) {
          this.close();
          this.icon = false;
          this.Focusinputbox = false;
        }
      }
    }
  },
  mounted() {
    this.value = this.initialValue;
    this.display = this.initialDisplay;
    this.selectedDisplay = this.initialDisplay;
  }
};
</script>

<style>
.MuiAutocomplete-root {
  position: relative;
  width: 25%;
  margin: 40px auto;
}
.MuiAutocomplete-root * {
  box-sizing: border-box;
}
.autocomplete__box {
  display: flex;
  align-items: center;
  width: 200px;
  height: 32px;
  /* margin: 14px 140px 212px 207px; */
  padding: 6px 12px;
  border: solid 1px #cccccc;
  background-color: #ffffff;
}
.autocomplete__box_brdbtm {
  border-bottom: 1px solid #ccc !important;
}
.autocomplete__searching {
  border-radius: 3px 3px 0 0;
}
.display {
  display: none;
}
.MuiAutocomplete-inputRoot {
  flex-grow: 1;
  margin: 0 12px 0 0;
  font-family: NotoSansKR;
  font-size: 14px;
  line-height: 2.07;
  color: #959595;
}
.MuiAutocomplete-inputRoot input {
  width: 100%;
  border: 0;
  color: #959595;
}
.MuiAutocomplete-inputRoot input:focus {
  outline: none;
}
/* .MuiAutocomplete-inputFocused {
  opacity: 0.2;
} */
.MuiAutocomplete-hasClearIcon {
  cursor: pointer;
  height: 10px;
  width: 10px;
  position: absolute;
  left: 150px;
  top: 7px;
}
.MuiAutocomplete-hasClearIcon:hover {
  background-color: #f5f0f0;
  border-radius: 50px;
  height: 23px;
  position: absolute;
  padding: 5px;
  width: 23px;
  left: 145px;
  top: 3px;
}
.MuiAutocomplete-listbox {
  margin: 0;
  padding: 0;
  list-style-type: none;
  z-index: 1000;
  position: absolute;
  max-height: 400px;
  overflow-y: auto;
  background: #fff;
  width: 200px;
  border: 1px solid #ccc;
  border-top: 0;
}
.autocomplete__results__item--error {
  color: #f00;
}
.MuiAutocomplete-option {
  padding: 6px 12px;
  cursor: pointer;
}
.fullwidth {
  padding: 0px 0px;
  cursor: pointer;
}
.load {
  display: none;
}
.text-wrap {
  max-width: 100%;
  box-sizing: border-box;
  white-space: normal;
  word-wrap: break-word;
  text-align: left;
  color: #5a5a5a;
  /* line-height: 1.71; */
  font-size: 14px;
}
.MuiAutocomplete-option:hover {
  background: #f7f7f7;
}
.autoselect:first-child {
  background: #f3f1f9;
}
.focusdisable {
  background: rgba(238, 7, 26, 0.075);
}
.focusdisable:hover {
  background: rgba(238, 7, 26, 0.075);
}
.MuiAutocomplete-option.autocomplete__selected {
  background: #dcd3f7;
}
.autocomplete__icon {
  height: 16px;
  width: 16px;
  margin-left: 5px;
}
.animate-spin {
  animation: spin 2s infinite linear;
}
/* .selectOnfocous{
  cursor: none;
    background: rgba(0, 180, 255, 0.075);
} */
.disableDiv {
  opacity: 0.4;
  pointer-events: none;
}
.disabledivunfocus {
  background: #fff !important;
}

.dropdown {
  transform: rotate(90deg);
}
.dropup {
  transform: rotate(-90deg);
}
.MuiAutocomplete-hasPopupIcon {
  cursor: pointer;
  height: 12px;
  width: 12px;
  color: #cccccc;
}
.MuiAutocomplete-hasPopupIcon:hover {
  background-color: #f5f0f0;
  border-radius: 50px;
  height: 25px;
  position: relative;
  padding: 5px;
  width: 25px;
  left: 7px;
}
.blurredinputs {
  opacity: 0.4;
}
/* .tooltip {
  position: relative;
  display: inline-block;
  border-bottom: 1px dotted black;
} */

.tooltip .tooltiptext {
  visibility: hidden;
  background-color: #cacaca;
  color: black;
  text-align: center;
  border-radius: 5px;
  padding: 2px 5px;
  border: 1px solid #cacaca;
  /* Position the tooltip */
  position: absolute;
  z-index: 100000;
  top: 135%;
  right: 35%;
  margin-left: -60px;
  font-size: 12px;
}

.tooltip:hover .tooltiptext {
  visibility: visible;
}
.Mui-focused {
  border: 1px solid #808080;
}

.disabled {
  pointer-events: none;
}

@-moz-keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
@-o-keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
