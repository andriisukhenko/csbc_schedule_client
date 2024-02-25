<template>
    <header class="app-heaeder elevation-2">
        <v-container class="app-header--container">
            <v-row justify="space-between" class="app-header--row">
                <v-col cols="auto" class="app-header--col">
                    <app-logo class="app-header--logo"/>
                </v-col>
            </v-row>
        </v-container>
    </header>
</template>

<script lang="ts">
import AppLogo from '~/components/Global/AppLogo.vue';

export default {
    name: "AppHeader",
    components: { "app-logo": AppLogo }
}
</script>