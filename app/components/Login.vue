<script setup lang="ts">
import { useAuthStore } from "@/store/auth.store";

defineProps<{}>();
defineEmits<{}>();

const authStore = useAuthStore();
const username = useState("username", () => "");
const password = useState("password", () => "");

const handleLogin = async () => {
  if (!username.value || !password.value) return;

  const body = {
    name: username.value,
    password: password.value,
  };

  try {
    const result = await $fetch("api/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (result.error) {
      alert(result.message);
      return;
    }

    authStore.account = result.data.user;
  } catch (error) {
    console.error("Error during login:", error);
    alert("Error al intentar iniciar sesión");
  }
};

const handleLogout = async () => {
  try {
    await $fetch("api/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    authStore.account = {};
  } catch (error) {
    console.error("Error during logout:", error);
    alert("Error al intentar cerrar sesión");
  }
};
</script>

<template>
  <div class="servidores">
    <div class="svtitulo">
      <img src="/static/imgs/deco.png" alt="" />
      <p class="servidorTxt">SERVIDOR</p>
      <p class="cantUser" :style="{ color: 'green' }">Online</p>
    </div>

    <div v-if="authStore.account?.accountId" class="login" style="height: 150px">
      <div class="avatar">
        <img src="/static/imgs/logo-aoweb.png" alt="" />
        <a @click="handleLogout">
          SALIR
          <!-- <FontAwesomeIcon icon={faSignOutAlt} /> -->
        </a>
      </div>
      <span class="name">{{ authStore.account.name }}</span>
    </div>
    <div v-else class="login" style="height: 140px">
      <div class="user">
        <p>USUARIO</p>
        <div class="contentInput">
          <input type="text" name="username" id="username" v-model="username" />
        </div>
      </div>
      <div class="pass">
        <p>CONTRASEÑA</p>
        <div class="contentInput">
          <input type="password" name="password" id="password" v-model="password" />
        </div>
      </div>

      <NuxtLink to="/register">
        <div
          :style="{
            textDecoration: 'none',
            color: '#006e2e',
            marginRight: '44px',
          }"
        >
          CREAR CUENTA
        </div>
      </NuxtLink>

      <button
        @click="handleLogin"
        class="bold"
        :style="{
          color: '#ff9000',
          marginRight: '29px',
        }"
      >
        ENTRAR
      </button>
    </div>
  </div>
</template>

<style scoped>
.servidores {
  margin-top: 20px;
  width: 300px;
  float: right;
  position: relative;
  bottom: 70px;
  .svtitulo {
    background-color: #11171d;
    height: 40px;
    padding-top: 15px;
    color: #73777b;
    padding-left: 20px;
    border: 1px solid #080e13;
    border-radius: 3px 3px 0 0;
    .servidorTxt {
      color: #707477;
      font-size: 11px;
      text-shadow: 1px 1px 1px #000;
      font-size: 11px;
    }
    .cantUser {
      font-size: 13px;
      color: #424d65;
      margin-top: 2px;
      text-shadow: 2px 2px 8px #000;
    }
    .glow {
      background-image: url("/statics/assets/imgs/web/servidoresglow.png");
      height: 63px;
      width: 272px;
      background-repeat: no-repeat;
      background-position: right;
      margin-right: 21px;
      margin-top: 10px;
      position: absolute;
      top: 521px;
    }
    img {
      float: left;
    }
    p {
      margin: 0;
      padding-left: 40px;
      color: #707477;
      font-size: 11px;
    }
  }
  .login {
    text-align: center;
    color: #496076;
    background-color: #11171d;
    border-radius: 0 0 3px 3px;
    height: 175px;
    border: 1px solid #080e13;
    border-top: 0;
    .avatar {
      width: 100px;
      height: 100px;
      border: 1px solid #2b2b2b;
      border-radius: 4px;
      padding: 2px;
      margin-top: 10px;
      margin-left: 10px;
      float: left;
      img {
        width: 100px;
        height: 100px;
      }
      a {
        text-decoration: none;
        font-size: 12px;
        width: 100px;
        text-align: center;
        margin-top: 5px;
        float: left;
        color: #496076;
        text-shadow: 1px 1px 1px #000;
        &:hover {
          text-decoration: underline;
        }
      }
    }
    .name {
      float: left;
      margin-top: 10px;
      margin-left: 10px;
      font-size: 20px;
      width: 172px;
      text-align: left;
      color: #ff9000;
      text-shadow: 1px 1px 1px #000;
    }
    .buttons {
      text-align: left;
      margin-left: 10px;
      margin-top: 10px;
      width: 172px;
      float: left;
      a {
        text-decoration: none;
        font-size: 12px;
        color: #496076;
        float: left;
        width: 174px;
        text-shadow: 1px 1px 1px #000;
        &:hover {
          text-decoration: underline;
        }
      }
      .price {
        float: left;
        margin-top: 12px;
        width: 100px;
        .cont {
          float: left;
          img {
            float: left;
            width: 13px;
            height: 13px;
            padding-right: 5px;
          }
          span {
            float: left;
            color: #ff9000;
            font-size: 12px;
          }
        }
      }
    }
    .user {
      width: 149px;
      float: left;
      .contentInput {
        background-color: #0b0f13;
        padding: 2px;
        width: 134px;
        border-radius: 3px;
        height: 32px;
        margin-left: 8px;
        input {
          width: 124px;
          height: 30px;
          box-shadow: inset 0 0 5px 0px #555657;
          background-color: #0b0f13;
          border-color: #151c23;
          border: none;
          color: #525252;
          padding-left: 10px;
        }
      }
      p {
        font-size: 15px;
      }
    }
    .pass {
      width: 149px;
      float: left;
      .contentInput {
        background-color: #0b0f13;
        padding: 2px;
        width: 134px;
        border-radius: 3px;
        height: 32px;
        margin-left: 4px;
        input {
          width: 124px;
          height: 30px;
          box-shadow: inset 0 0 5px 0px #555657;
          background-color: #0b0f13;
          border-color: #151c23;
          border: none;
          color: #525252;
          padding-left: 10px;
        }
      }
      p {
        font-size: 15px;
      }
    }
    button {
      padding: 0;
      margin-top: 19px;
      margin-right: 20px;
      border: none;
      background: none;
      color: #006e2e;
      font-size: 16px;
      font-weight: normal;
      cursor: pointer;
    }
  }

  @media only screen and (max-width: 768px) {
    display: none;
  }
}
</style>
