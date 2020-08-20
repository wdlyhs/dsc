module.exports = {
  presets: ['@vue/app'],
  "plugins": [
    [
      "import", {
        "libraryName": "vant",
        "libraryDirectory": "es",
        "style": true
      }
    ],
    [
      "component",
      {
        "libraryName": "element-ui",
        "styleLibraryName": "theme-chalk"
      },
    ]
  ]
}
