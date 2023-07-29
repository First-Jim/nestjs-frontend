<template>
  <div
    class="container d-flex justify-content-center align-items-center vh-100"
  >
    <div class="col-11 col-sm-8 col-lg-6 col-xl-4 col-xxl-4">
      <form class="border shadow-sm rounded p-4">
        <div class="mb-3">
          <label for="exampleInputEmail1" class="form-label">用户名</label>
          <input
            type="username"
            :class="['form-control', { 'is-invalid': loginInfo.usernameMsg }]"
            id="exampleInputEmail1"
            v-model="loginInfo.username"
            aria-describedby="emailHelp"
          />
          <div class="invalid-feedback">{{ loginInfo.usernameMsg }}</div>
        </div>
        <div class="mb-3">
          <label for="exampleInputPassword1" class="form-label">密码</label>
          <input
            type="password"
            :class="['form-control', { 'is-invalid': loginInfo.passwordMsg }]"
            id="exampleInputPassword1"
            v-model="loginInfo.password"
          />
          <div class="invalid-feedback">{{ loginInfo.passwordMsg }}</div>
        </div>
        <div class="mb-3 form-check">
          <input type="checkbox" class="form-check-input" id="exampleCheck1" />
          <label class="form-check-label" for="exampleCheck1">记住我</label>
        </div>
        <div class="d-flex flex-column align-items-center px-1">
          <button
            type="submit"
            class="btn btn-primary w-100 mb-2 text-light"
            @click="submit()"
          >
            登录
          </button>
          <router-link
            to="/register"
            class="border rounded text-decoration-none text-center w-100"
          >
            <button type="submit" class="btn">注册</button>
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, computed } from "vue";
import { Http } from "@/utils";
export default defineComponent({
  setup() {
    const loginInfo = reactive({
      username: "",
      usernameMsg: computed(() => {
        if (
          loginInfo.username &&
          !/[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}/gim.test(loginInfo.username)
        ) {
          return "邮箱格式不正确";
        }
        return "";
      }),
      password: "",
      passwordMsg: computed(() => {
        if (loginInfo.password && loginInfo.password.length < 6) {
          return "密码长度不能小于6个字符";
        }
        return "";
      }),
    });
    const submit = () => {
      console.log(loginInfo);
      Http.post("/auth/login", {
        username: loginInfo.username,
        password: loginInfo.password,
      });
    };
    return {
      loginInfo,
      submit,
    };
  },
});
</script>

<style scoped></style>
