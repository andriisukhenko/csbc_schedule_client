<template>
    <div class="page">
        <v-container>
            <button @click="login">login</button>
        </v-container>
    </div>
</template>

<script lang="ts">
export default { name: "MainPage" }
</script>

<script lang="ts" setup>
const login = () => {
    const { data, error } = useFetch("/api/session", { method: "POST", body: { username: "andreysuha2@gmail.com", password: "123123123" } })
    console.log(data.value);
}
</script>