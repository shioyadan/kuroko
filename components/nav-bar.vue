<template>
    <div class="hello">Hello {{who}}</div>
</template>

<script>
//# sourceURL=components/nav-bar.vue

module.exports = {
    data: function() {
        return {
            who: 'Child'
        }
    }
}
</script>

<style>
.hello {
    background-color: #ffe;
}
</style>
