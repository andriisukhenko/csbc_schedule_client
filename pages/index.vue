<template>
    <div class="page">
        <v-container>
            <button @click="login">login</button>
            <button @click="me">me</button>
        </v-container>
    </div>
</template>

<script lang="ts">
export default { name: "MainPage" }
</script>

<script lang="ts" setup>
const login = () => {
    const { data, error } = useFetch("/api/session", { method: "POST", body: { username: "adreysuha2@gmail.com", password: "123123123" } })
    if(data.value) console.log(data.value);
    if(error) console.log(error);
}
const me = () => {
    const { data, error } = useFetch("/api/session", { method: "GET" });
    if(data.value) console.log(data.value);
    if(error) console.log(error.value);
}
</script>