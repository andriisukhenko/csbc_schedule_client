<template>
    <div class="app">
        <div class="app--content">
            <app-header class="app--header"/>
            <main class="app--main">
                <NuxtPage/>
            </main>
        </div>
        <app-footer class="app--footer"/>
    </div>
</template>

<script lang="ts">
import AppHeader from '~/components/Global/AppHeader.vue';
import AppFooter from '~/components/Global/AppFooter.vue';

export default {
    name: "DefaultLayout",
    components: {
        "app-header": AppHeader,
        "app-footer": AppFooter
    }
}
</script>

<style lang="scss">
html {
    height: 100%;
}

body, body > div#__nuxt {
    height: 100%;
}

.app {
    min-height: 100%;
    display: grid;
    grid-template-rows: 1fr auto;

    &--footer {
        grid-row-start: 2;
        grid-row-end: 3;
    }
}
</style>