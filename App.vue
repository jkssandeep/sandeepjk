<template>
  <div id="app">
    <HelloWorld msg="Welcome to AutoComplete"/>
    
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
        {id:9, name:'P',Category:'peachfruit'}
      ]" :clearOnEscape="true" :disableClearable="false" :autoHighlight="true"
      :disableCloseOnSelect="false" :disabled="false"  :openOnFocus="true" 
        :debug="false" :includeInputInList="true" :freeSolo="true" 
        :disablePortal="false" 
        :disableListWrap="false"
        :multiple="true"
        :fullwidth="false"
        :blurOnSelect="false"
        :loading="false"
        :forcePopupIcon="true"
        :disableItemsFocusable="true"
        id="id"
        class="shape"
        disableOption="Pear"  
        getOptionSelected="Pear"   
        getOptionDisabled="Orange" 
        getOptionLabel="name" 
        @OnhighlightChange="OnhighlightChange($event)"
        @OnChange="OnChange($event)"
         />
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

import VueAutoComplete from './components/VueAutoComplete.vue'



export default {
  name: 'App',
  
  components: {
    HelloWorld,
   
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

