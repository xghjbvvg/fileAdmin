<template>
  <span id="fileMessage">
    <span v-if="fileItem.name.split('.').length > 1">
                      <span v-if="'/^.+(\\.doc|\\.docx|\\.dot|\\.dotx|\\.docm|\\.dotm)$/'.match(fileItem.name)">
                        <img
                          src="../../assets/img/fileCategoryImg/Word_24_2f2aefb.png"
                          style="float: left;"/>
                      </span>
                      <span v-else-if="'/^.+(\\.ppt|\\.pot|\\.pps|\\.ppa|\\.pptx|\\.potx|\\.ppsx|\\.ppam|\\.pptm|\\.potm|\\.ppsm)$/'.match(fileItem.name)">
                        <img
                          src="../../assets/img/fileCategoryImg/PPT_24_79bc280.png"
                          style="float: left;"/>
                      </span>
                      <span v-else-if="'/^.+(\\.xls|\\.xlt|\\.xla|\\.xlsx|\\.xltx|\\.xlsm|\\.xltm|\\.xlam|\\.xlsb)$/'.match(fileItem.name)">
                        <img
                          src="../../assets/img/fileCategoryImg/Excel_24_851dee6.png"
                          style="float: left;"/>
                      </span>
                    </span>
    <span v-else>
                      <img
                        src="../../assets/img/fileCategoryImg/Folder_54.png"
                        style="float: left;"/>
                    </span>
     {{fileItem.name}}
  </span>
</template>

<script>
    export default {
      name: "FileMessage",
      props:['fileItem'],
    }
</script>

<style scoped>

</style>
