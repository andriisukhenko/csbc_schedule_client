<template>
    <NuxtLayout>
        <v-app>
            <NuxtPage/>
        </v-app>
    </NuxtLayout>
</template>

<script lang="ts">
export default { name: "AppMainLayout" };
</script>

<script lang="ts" setup>
import useAppStore from "~/store/app";

const store = useAppStore();
store.loadApiInfo()
    .then(info => console.log("api-info:", info))
    .catch(e => console.error(e));
</script>