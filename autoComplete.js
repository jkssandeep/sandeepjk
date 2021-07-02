
import debounce from "lodash.debounce";

export default {
  
  props: {
    /**
     * Data source for the results
     *   `String` is a url, typed input will be appended
     *   `Function` received typed input, and must return a string; to be used as a url
     *   `Array` and `Object` (see `results-property`) are used directly
     */
    shape: {
      type: String,
    },
    source: {
      type: [String, Function, Array, Object],
      required: true,
    },
    clearOnEscape: {
      type: Boolean,
      default: false,
    },
    disableClearable: {
      type: Boolean,
      default: false,
    },
    autoHighlight: {
      type: Boolean,
      default: false,
    },
    autoSelect: {
      type: Boolean,
      default: false,
    },
    disableCloseOnSelect: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    openOnFocus: {
      type: Boolean,
      default: false,
    },
    debug: {
      type: Boolean,
      default: false,
    },
    includeInputInList: {
      type: Boolean,
      default: false,
    },
    freeSolo: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    disablePortal: {
      type: Boolean,
      default: false,
    },
    disableListWrap: {
      type: Boolean,
      default: false,
    },
    id: {
      type: String,
    },
    fullWidth: {
      type: Boolean,
      default: false,
    },
    disableOption: {
      type: String,
    },
    getOptionSelected: {
      type: String,
    },
    getOptionDisabled: {
      type: String,
    },
    blurOnSelect: {
      type: Boolean,
      default: false,
    },
    getOptionLabel: {
      type: String,
    },
    forcePopupIcon: {
      type: Boolean,
      default: false,
    },
    disableItemsFocusable: {
      type: Boolean,
      default: false,
    },
    autoComplete:{
       type: Boolean,
      default: false,
    },
    filterSelectedOptions:{
       type: Boolean,
      default: false,
    },
     limitTags: {
      type: Number,
    },
    getLimitTagsText: {
      type: String,
    },
    /**
     * http method
     */
    method: {
      type: String,
      default: "get",
    },
    /**
     * Input placeholder
     */
    placeholder: {
      default: "Search",
    },
    /**
     * Preset starting value
     */
    initialValue: {
      type: [String, Number],
    },
    /**
     * Preset starting display value
     */
    initialDisplay: {
      type: String,
    },
    /**
     * CSS class for the surrounding input div
     */
    inputClass: {
      type: [String, Object],
    },
    /**
     * To disable the input
     */
    disableInput: {
      type: Boolean,
    },
    /**
     * name property of the input holding the selected value
     */
    name: {
      type: String,
    },
    /**
     * api - property of results array
     */
    resultsProperty: {
      type: String,
    },
    /**
     * Results property used as the value
     */
    resultsValue: {
      type: String,
      default: "id",
    },
    /**
     * Results property used as the display
     */
    resultsDisplay: {
      type: [String, Function],
    },
    /**
     * Callback to format the server data
     */
    resultsFormatter: {
      type: Function,
    },
    /**
     * Whether to show the no results message
     */
    showNoResults: {
      type: Boolean,
      default: true,
    },
    /**
     * Additional request headers
     */
    requestHeaders: {
      type: Object,
    },
    /**
     * Credentials: same-origin, include, *omit
     */
    credentials: {
      type: String,
    },
    /**
     * Optional clear button icon class
     */
    clearButtonIcon: {
      type: String,
    },
    /**
     * Optional max input length
     */
    maxlength: {
      type: Number,
    },
  },
  data() {
    return {
      value: null,
      display: "",
      visible: false,
      results: null,
      selectedIndex: null,
      isFocussed: false,
      error: null,
      selectedId: null,
      selectedDisplay: null,
      selectedItems: [],
      eventListener: false,
      firstRowHighlight: false,
      upAndDown: true,
      clearOnBlur: !this.freeSolo,
      handleHomeEndKeys: !this.freeSolo,
      selectOnFocus: !this.freeSolo,
      loadingtext: false,
      icon: false,
      items: [],
      option: null,
      disableItem: false,
      labelDisplay: this.resultsDisplay,
      resultslength: null,
      focusinputbox: false,
      inputhover: false,
      elementVisible: true,
      stopAutoFill:false,
      backSpaceEntered:false,
      loadingHide:true,
      load:this.loading,
       showLimits:false,
     
    };
  },
  computed: {
    hasRenderInputSlot()
    {
      return this.$slots.renderInput;
    },
    hasRenderOptionSlot()
    {
      return this.$slots.renderOption;
    },
    showResults() {
      return Array.isArray(this.results) || this.hasError;
    },
    noResults() {
      return Array.isArray(this.results) && this.results.length === 0;
    }, 
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
      if(this.multiple==true)
      return this.selectedItems.length===0
      else
      return this.display==undefined ;
    },
    isLoading() {
      return this.load === true;
    },
    hasError() {
      return this.error !== null;
    },
    listStyle() {
      return { color: "ccc" };
    },
    limitSelectedItems(){
      if(!isNaN(this.limitTags) && this.limitTags != 0 && this.showLimits){
        return this.selectedItems.filter((item,index)=> index < this.limitTags);
      }else{
        return this.selectedItems 
      }
    },
    itemLimits(){
       if(!isNaN(this.limitTags) && this.limitTags != 0){
         return true;
       }else{
         return false;
       }
    }
    
  },
  methods: {

     cloneAttributes(target, source) {
      for (var key in source[0].data.attrs){
          target.setAttribute(key, source[0].data.attrs[key]);
      }
      var allStyles='';
       for (var style in source[0].data.staticStyle){
          allStyles+=style+':'+source[0].data.staticStyle[style]+';';
      }
      target.style.cssText=allStyles;
      var autosearchClass=source[0].data.staticClass;
      target.classList.add(autosearchClass);
    },

      selectedOptionsList(key)
     {
      
        for(let i=0;i<this.selectedItems.length;i++)
        {
          if(this.source[key]===this.selectedItems[i])
          {
            
          return true
          }
        }
        return false
     },

    highlight() {
      this.firstRowHighlight = true;
      this.loadingtext = false;
    },
    loadtext() {
      if (this.firstRowHighlight === true) return true;
      else return false;
    },
    dropdownmethod() {
      setTimeout(() => (this.elementVisible = false), 3000);
      if (this.disabled === false) {
        this.icon = !this.icon;
        if (this.icon === false) {
          this.dropdown();
          this.showLimits = true;
        }
        if (this.icon === true) {this.search();this.showLimits = false;}
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
        let range = document.selection.createRange();
        range.collapse(true);
        range.moveEnd("character", endPos);
        range.moveStart("character", startPos);
        range.select();
      }
    },
    onKeyDown: function (e) {
      this.stopAutoFill = false;
      if (e.keyCode == 8) {
        this.backSpaceEntered = true;
      }
    },
    /**
     * Search wrapper method
     
     */
    search: function (event) {
 
     let textvalue = "";
      if (event != undefined) {
        this.searchtext = event.target.value;
        textvalue = event.target.value;
      }
      if(this.backSpaceEntered)
      {
        this.backSpaceEntered=false;
      }
      else{

        if (!this.stopAutoFill && textvalue != "" && this.autoComplete) {
          let filteredValue = this.getFilteredItems(textvalue)
          if (filteredValue.length) {
            let querylength = textvalue.length;
            let fullstring =filteredValue[0][this.getOptionLabel];
            this.display = fullstring;
            if (event != undefined) {
              event.target.value = fullstring;
              this.setInputSelection(
                event.target,
                querylength,
                fullstring.length
              );
            }
            this.stopAutoFill=true;
          }
        }}
      if (this.openOnFocus === true) {
        this.upAndDown = true;
        this.firstRowHighlight = false;
        this.loadingHide=true;
        
        
       let that=this;
        setTimeout(function () {
          that.loadingHide=false;}, 500);


        this.$emit("onHighlightChange");
        this.labelDisplay = this.label;
        
        this.icon = true;
       
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
          case Array.isArray(this.source): {
           
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
    resourceSearch: debounce(function (url) {
      if (!this.display) {
        this.results = [];
        return;
      }
      this.load = true;
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
        headers: this.getHeaders(),
      });
      return promise
        .then((response) => {
          if (response.ok) {
            this.error = null;
            return response.json();
          }
          throw new Error("Network response was not ok.");
        })
        .then((response) => {
          this.results = this.setResults(response);
          this.emitRequestResultEvent();
          this.load = false;
        })
        .catch((error) => {
          this.error = error.message;
          this.load = false;
        });
    },
    /**
     * Set some default headers and apply user supplied headers
     */
    getHeaders() {
      const headers = {
        Accept: "application/json, text/plain, */*",
      };
      if (this.requestHeaders) {
        for (let prop in this.requestHeaders) {
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
      if(obj[this.labelDisplay]!=undefined){
          if (obj[this.labelDisplay].length > 2) return obj[this.labelDisplay];
      }
    },
    /**
     * Search in results passed via an array
     */
    arrayLikeSearch() {
      this.setEventListener();
      if (!this.display || this.display == this.selectedDisplay) {
         this.setEmptyTextResults();
        
        return true;
      }
        this.resultslength = this.results.length;
         this.$emit("results", { results: this.results });
         this.load = false;

       if (this.display != this.selectedDisplay) {
        this.results = this.source.filter((item) => {
          return this.formatDisplay(item)
            .toLowerCase()
            .includes(this.display.toLowerCase())&& !item.invisible;
        });
       
       
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
    
      this.showLimits = true;
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
        selectedObject: obj,
      });
      this.$emit("input", this.value);
      this.getOptionbyDisabled(this.getOptionDisabled);
      if (this.selectedDisplay != null) {
        if (this.getOptionbySelected(this.getOptionSelected)) {
          console.log(this.getOptionSelected + " is selected");
        } else console.log(this.getOptionSelected + " is not selected");
      }
      if(this.multiple){
      this.selectedItems.push(obj);
    
       if(this.filterSelectedOptions===true){
         this.source.forEach(function (item) {
            
            if (item.id === obj.id) {
            
              item.invisible = true;
            }
         
          });
       }
           this.setEmptyTextResults();
        this.display=null;
      }
      
      if (this.disableCloseOnSelect === false) {
        this.close();
           }
      else
      this.close();
     
    },
    setEmptyTextResults()
    {
      this.results = this.source.filter((item) => {
          return item && !item.invisible; //this.filterOptions(item);
        });
    },
    getOptionbySelected(option) {
      if (option === this.selectedDisplay) return true;
      else return false;
    },
    getOptionbyDisabled(option) {
      for (let i = 0; i < this.items.length; i++) {
        if (this.disableItems(i)) {
          if (this.items[i] === this.getOptionDisabled) {
            this.disableItem = true;
            console.log(option + " is disabled");
            break;
          }
        }
      }
      if (this.disableItem === false) console.log(option + " is not disabled");
    },
    /**
     * @param  {Object} obj
     * @return {String}
     */
    formatDisplay(obj) {
      return obj[this.getOptionLabel];
    },
    /**
     * Register the component as focussed
     */
    focus() {
      this.isFocussed = true;
      this.showLimits = false;
    },
    /**
     * Remove the focussed value
     */
    blur() {
      this.isFocussed = false;
      this.showLimits = true;
    },
    /**
     * Is this item selected?
     * @param {Object}
     * @return {Boolean}
     */
    isSelected(key) {
      return key === this.selectedIndex;
    },
    selectedOption(key) {
      if (key === this.value - 1) {
        return true;
      } else return false;
    },
    disableItems(key) {
      if (this.items[key] === this.disableOption) return true;
      else return false;
    },
    /**
     * Focus on the previous results item
     */
    up() {
      this.upAndDown = false;
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
      this.upAndDown = false;
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
    getFilteredItems(query){
    return this.source.filter((item) =>item[this.getOptionLabel].toLowerCase().startsWith(query.toLowerCase(), 0) && !item.invisible);
    },
   enter: function (e) {
     
      
      
      if(this.multiple){
       
        let filteredValue = this.getFilteredItems(e.target.value);
      
       if (filteredValue.length) {
         let that=this;
                 this.selectedItems.push(filteredValue[0]);
                if(that.filterSelectedOptions===true){
                     filteredValue[0].invisible = true;
                 }
                 this.clear();
                   this.showLimits = true;
       
        }
           if (this.selectedItems.length==0) {
        this.$emit("nothingSelected", this.display);
        return;
      }
      }
      else{
        // this.blur();
        document.getElementById(this.id).blur();
       this.selectedDisplay=this.display;
        if(!this.disableCloseOnSelect)
        this.results=[];
      }
    },
    /**
     * Clear all values, results and errors
     */
    clearAll()
    { 
      this.selectedItems=[];
      this.display = null;
      this.value = null;
      this.results = null;
      this.error = null;
      this.icon = false;
      this.Focusinputbox = false;
       this.source.forEach(function (item) {
       item.invisible = false;
     });

      this.$emit("clear");
         
    },
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
     
      this.Focusinputbox = false;
      if(!this.disableCloseOnSelect)
      {
      this.results =[];
       this.icon = false;
      }
      
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
   
     
      this.$emit("onHighlightChange");
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
    },
    itemRemoved(index) {
    
     let id = this.selectedItems[index].id;
      this.source.forEach(function (item) {
        if (item.id === id) {
          item.invisible = false;
        }
      });
      
      this.search();
      this.selectedItems.splice(index, 1);
    }
  },
  mounted() {
   
    this.value = this.initialValue;
    this.display = this.initialDisplay;
    this.selectedDisplay = this.initialDisplay;
    this.source.forEach(function (item) {
      item.invisible = false;
    });
  
     if(this.hasRenderInputSlot){
      var input= document.getElementById("mainbox");
      this.cloneAttributes(input,this.$slots.renderInput);
    }
  },
};