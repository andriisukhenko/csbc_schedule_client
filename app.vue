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

<script setup>
import { apiHTTP } from "~/assets/js/http/api/base";

apiHTTP.check().then((result) => console.log(result))
    .catch(e => console.log(e))
</script>