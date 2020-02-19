<template>
    <div  id="index">
      <el-container>
        <el-aside>
          <el-menu
            default-active="1"
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose" style="height: 680px">
            <el-submenu index="1">

              <template slot="title">
                <router-link :to="{name:'solutionQuestion',query:{flag:''}}">
                  <i class="el-icon-menu"></i>  用户问题
                </router-link>
              </template>
              <el-menu-item index="1-1">
                <router-link :to="{name:'solutionQuestion',query:{flag:2}}">
                  已解决
                </router-link>
              </el-menu-item>
              <el-menu-item index="1-2">
                <router-link :to="{name:'solutionQuestion',query:{flag:1}}">
                  未解决
                </router-link>
              </el-menu-item>
            </el-submenu>

            <el-submenu index="2">

              <template slot="title">
                <router-link :to="{name:'userRoleAdmin'}">
                  <i class="el-icon-location"></i>    用户权限
                </router-link>
              </template>
              <el-menu-item index="1-1">
                <router-link :to="{name:'userRoleAdmin',query:{role:1}}">
                  管理员
                </router-link>
              </el-menu-item>
              <el-menu-item index="1-2">
                <router-link :to="{name:'userRoleAdmin',query:{role:2}}">
                  普通用户
                </router-link>
              </el-menu-item>
            </el-submenu>
            <!--<el-menu-item index="2">
              <i class="el-icon-menu"></i>
              <span slot="title">
                <router-link to="/admin/userRoleAdmin">
                   用户权限
                </router-link>
              </span>
            </el-menu-item>-->
          </el-menu>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>

    </div>
</template>

<script>
    export default {
      name: "index",
      methods: {
        handleOpen(key, keyPath) {
          console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
          console.log(key, keyPath);
        }
      },
      mounted(){

      }
    }
</script>

<style scoped>
a{
  color: grey;
}
</style>
