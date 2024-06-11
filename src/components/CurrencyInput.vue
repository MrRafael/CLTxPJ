<script setup lang="ts">
import { useCurrencyInput } from 'vue-currency-input'

const props = defineProps({
    modelValue: Number,
    label: String,
    infoText: String
})

const { inputRef } = useCurrencyInput({ currency: 'BRL', precision: 2 })
</script>

<template>
    <div class="field">
        <label class="label">
            {{ label }}
            <span v-if="infoText" class="icon has-text-info" :title="infoText">
                <i class="fas fa-info-circle"></i>
            </span>
        </label>
        <div class="control">
            <input ref="inputRef" class="input" type="text" :placeholder="label" />
        </div>
    </div>
</template>