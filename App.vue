<template>
  <div id="app">
   
    
      <hr/>
      <VueAutoComplete :source="[
        {id:1, name:'Apple',Category:'Applefruit'},
        {id:2, name:'Banana',Category:'Bananafruit'},
        {id:3, name:'Orange',Category:'Orangefruit'},
        {id:4, name:'Mango',Category:'Mangofruit'},
        {id:5, name:'Pear',Category:'Pearfruit'},
         {id:6, name:'Peach',Category:'Peachfruit'},
        {id:7, name:'Grape',Category:'Grapefruit'},
        {id:8, name:'Tangerine',Category:'Tangerinefruit'},
      ]" :clearOnEscape="true" :disableClearable="false" :autoHighlight="true"
      :disableCloseOnSelect="false" :disabled="false"  :openOnFocus="true" 
        :debug="false" :includeInputInList="true" :freeSolo="true" 
        :disablePortal="false" 
        :disableListWrap="false"
        :multiple="true"
        :fullWidth="false"
        :blurOnSelect="false"
        :loading="false"
        :forcePopupIcon="true"
        :disableItemsFocusable="true"
        :autoComplete="true"
        :filterSelectedOptions="false"
        id="id"
        class="shape"
        disableOption="Apple"  
        getOptionSelected="Pear"   
        getOptionDisabled="Apple" 
        getOptionLabel="name" 
        @onHighlightChange="OnhighlightChange($event)"
        @OnChange="OnChange($event)"
        
        :limitTags = 2
         >
         <template #renderInput>
        <input type="text" width="10px" class="someclass" style="font-size:20px;background-color:white;" />
      </template>
      
         </VueAutoComplete>
  </div>
</template>

<script>


import VueAutoComplete from './components/VueAutoComplete.vue'



export default {
  name: 'App',
  
  components: {
   
   
    VueAutoComplete
  },
 
  methods:{
   OnhighlightChange()
    {
      
     console.log("there is a change in focus")
     
     
    },
    OnChange(eve)
    {
      console.log("change in selection")
      console.log(eve);
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

