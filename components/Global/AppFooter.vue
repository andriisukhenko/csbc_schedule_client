<template>
    <footer class="app-footer elevation-2">
        <v-container class="app-footer--container">
            <v-row justify="center" class="app-footer--row">
                <v-col cols="auto" class="app-footer--col">&copy; {{ date }} by {{ author }}</v-col>
            </v-row>
        </v-container>
    </footer>
</template>

<script lang="ts">
export default { name: "AppFooter" }
</script>

<script lang="ts" setup>
const startYear: number = 2024,
    author: string = "Andrii Sukhenko",
    date: ComputedRef<string> = computed(() => {
        const currentYear = new Date().getFullYear()
        return currentYear > startYear ? `${startYear} - ${currentYear}` : `${startYear}`;
    });
</script>