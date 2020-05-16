<template>
    <div class="hello">This is app.
        <nav-bar></nav-bar>
        <preview-sheet></preview-sheet>
    </div>
</template>

<script>
//# sourceURL=child-component.vue

module.exports = {
    data: function() {
        return {
        }
    },
    components: {
        "nav-bar": "url:components/nav-bar.vue",
        "preview-sheet": "url:components/preview-sheet.vue"
    }
}
</script>

<style>
.hello {
    background-color: #ffe;
}
</style>
