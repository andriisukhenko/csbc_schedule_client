<template>
    <div class="page">
        <v-container>
            <div>
                <button @click="login">login</button>
            </div>
            <div>
                <button @click="me">me</button>
            </div>
            <div>
                <button @click="refresh">refresh</button>
            </div>
            <div>
                <button @click="logout">logout</button>
            </div>
        </v-container>
    </div>
</template>

<script lang="ts">
export default { name: "MainPage" }
</script>

<script lang="ts" setup>
const login = async () => {
    const { data, error } = await useFetch("/api/session", { method: "POST", body: { username: "andreysuha2@gmail.com", password: "123123123" } })
    if(data.value) console.log(data.value);
    if(error.value) console.log(error.value);
}
const me = async () => {
    const { data, error } = await useFetch("/api/session", { method: "GET" });
    if(data.value) console.log(data.value);
    if(error.value) console.log(error.value?.data);
}
const refresh = async () => {
    const { data, error } = await useFetch("/api/session", { method: "PUT" });
    if(data.value) console.log(data.value);
    if(error.value) console.log(error.value?.data);
}
const logout = async () => {
    const { data, error } = await useFetch("/api/session", { method: "DELETE" });
    if(data.value) console.log(data.value);
    if(error.value) console.log(error.value?.data);
}
</script>