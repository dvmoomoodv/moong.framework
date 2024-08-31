<template>
    <UBox direction="col" height="100%">
        <UItem :ratio="1">
            <UBox direction="row" width="100%">
                <UItem :ratio="1" :disabled="listDisabled">
                    <List :sysCd="sysCd" 
                        @focus = "onSelected" 
                        @init = "init"
                        :ref="e => { if(e){ 
                            listComponent = e 
                        }
                    }"/>
                </UItem>
                <UItem :ratio="1" :disabled="formDisabled">
                    <Form :sysCd="sysCd" 
                        @reload = "saved"
                        :ref="e => { if(e){ 
                            formComponent = e 
                        }
                    }"/>
                </UItem>
            </UBox>
        </UItem>
    </UBox>
</template>
<script lang="ts" setup>
import List from './list.vue'
import Form from './form.vue'

const props = defineProps<{
  /**
   * 시스템 코드
   */
  sysCd: string
}>()

const listDisabled = ref(false)
const formDisabled = ref(false)

const listComponent = ref<InstanceType<typeof List>>()
const formComponent = ref<InstanceType<typeof Form>>()

function saved(){
    
    listComponent.value.load()
}

function onSelected(menu: MenuPathText){
    // component.value.init()
    formComponent.value.bindDetail(menu)
    // formComponent.value.bindAuthDetail(menu)
}

function init(menu: Menu){
    formComponent.value.init();
}

</script>
