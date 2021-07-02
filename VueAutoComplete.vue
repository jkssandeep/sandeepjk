<template>
  <div  class="MuiAutocomplete-root" :class="{ MuiAutocomplete_fullWidth: fullWidth }">
    <div
      class="autocomplete__box"
      id="mainbox"
      :class="{
        autocomplete__searching: showResults,
        'Mui-focused': focusinputbox,
      }"
    >
      <img
        v-if="isLoading"
        class="MuiAutocomplete-loading animate-spin"
        src="../assets/loading.svg"
      />
      <ul class="MuiAutocomplete-tag">
        <li class="MuiAutocomplete-tagSizeSmall" v-for="(item, index) in limitSelectedItems" :key="item.id">
          {{ item["name"] }}
          <span class="removeitem" @click="itemRemoved(index)"></span>
        </li>
      </ul>
      <span v-if="showLimits && itemLimits && (selectedItems.length - limitTags > 0)"> + {{ selectedItems.length - limitTags}}
</span>
      <div
        class="MuiAutocomplete-inputRoot"
        :class="{ blurredinputs: blurOnSelect }"
      >
        <input
          v-model="display"
          :id="id"
          class="MuiAutocomplete-input"
          :placeholder="placeholder"
          :disabled="disabled"
          :maxlength="maxlength"
          :class="{ inputClass, 'MuiAutocomplete-inputFocused': inputhover }"
          @click="search"
          @input="search"
          @keydown.enter="enter"
          @keydown.tab="close"
          @keydown.up="up"
          @keydown.down="down"
          @keydown.esc="esc"
          @keydown.home="home"
          @keydown.end="end"
          @keydown="onKeyDown"
          @focus="focus"
          @blur="blur"
          @mouseover="inputhover = true"
          @mouseout="inputhover = false"
          type="text"
          autocomplete="off"
        />
        <input :name="name" type="hidden" :value="value" />
        <span
        v-if="this.forcePopupIcon"
        @click="dropdownmethod"
        :class="clearButtonIcon"
      >
        <img
          class="MuiAutocomplete-hasPopupIcon MuiAutocomplete-popupIndicator MuiAutocomplete-popupIndicatorOpen"
          :class="{
            dropup: this.icon,
            dropdown: !this.icon,
            disableDiv: this.disabled,
          }"
          src="../assets/Arrow_Up.svg"
        />
      </span>

      <!-- clearButtonIcon -->
      <span
        v-show="
       
          !isEmpty &&
        
          !disableClearable
        
        "
        class="MuiAutocomplete-hasClearIcon MuiAutocomplete-clearIndicatorDirty"
        @click="clearAll"
      >
        <div :disabled="this.disabled" class="tooltip">
          <span v-if="clearButtonIcon" :class="clearButtonIcon"></span>

          <img v-else src="../assets/close.svg" />
          <span class="MuiAutocomplete-clearIndicator">clear</span>
        </div>
      </span>
      </div>

      
    </div>

    <ul v-show="showResults" class="MuiAutocomplete-listbox" :style="listStyle">
     
        <!-- error -->
        <li
          v-if="hasError"
          class="MuiAutocomplete-option autocomplete__results__item--error"
        >
          {{ error }}
        </li>

        <!-- results -->
        <template v-if="!hasError">
          <li
              class="MuiAutocomplete-option"
              v-if="loadingHide"
              :class="{ load: !elementVisible }"
            >
              <em>loading....</em>
            </li>
          <slot name="firstResult"></slot>
            <li
              v-show="!disablePortal"
              v-for="(result, key) in results"
              :key="key"
              
              @click.prevent="select(result)"
              class="MuiAutocomplete-option"
              :class="{
                autoSelection: !firstRowHighlight && autoHighlight && upAndDown,
                autocomplete__selected:
                  isSelected(key) || (selectedOption(key) && selectOnFocus),
                disableDiv: disableItems(key),
                disabledivunfocus: disableItems(key) && !disableItemsFocusable,
                'text-wrap': !disableListWrap,
                fullwidth: fullWidth,
                selectedOptionsList:selectedOptionsList(key) && !filterSelectedOptions
              }"
              @mouseover="highlight()"
              v-html="formatDisplay(result)"
            ></li>
            
         
          <slot name="lastResult"></slot>
        </template>

        <!-- no results -->
        <li
          v-if="
            this.display &&
            !freeSolo &&
            this.results.length === 0 &&
            this.display !== this.selectedDisplay
          "
          class="autocomplete__results__item MuiAutocomplete-noOptions"
        >
          <slot>No Results.</slot>
        </li>
     
    </ul>
  </div>

</template>

<script src="./autoComplete.js" type="text/babel">

</script>

<style src="./autoComplete.css"></style>