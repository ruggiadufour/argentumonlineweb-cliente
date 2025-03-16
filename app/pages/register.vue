<script setup lang="ts">
import { useAuthStore } from "@/store/auth.store";

const router = useRouter();
const authStore = useAuthStore();

const form = useState("form", () => ({
  username: "",
  password: "",
  repassword: "",
  email: "",
}));

const handleSave = async () => {
  if (
    !form.value.username ||
    !form.value.password ||
    !form.value.repassword ||
    !form.value.email
  ) {
    return alert("Faltan campos por completar.");
  }

  if (form.value.password != form.value.repassword) {
    return alert("Las contraseñas no coinciden.");
  }

  const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (!regex.test(form.value.email.toLowerCase())) {
    return alert("El email no es válido.");
  }

  const body = {
    name: form.value.username,
    password: form.value.password,
    email: form.value.email.toLowerCase(),
  };

  const result = await $fetch("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (result.error) {
    return alert(result.message);
  }

  authStore.account = result;
  router.push("/home");
};

onBeforeMount(() => {
  if (authStore.account) {
    router.push("/home");
  }
});
</script>

<template>
  <MainContainer>
    <div class="contentLeft">
      <div class="shadow">
        <h4>Registro</h4>
        <div class="register">
          <div class="form">
            <div class="groupInput">
              <label htmlFor="">USUARIO </label>
              <input
                type="text"
                class="inputText"
                name="username"
                v-model="form.username"
              />
            </div>

            <div class="groupInput">
              <label htmlFor="">CONTRASEÑA </label>
              <input
                type="password"
                class="inputText"
                name="password"
                v-model="form.password"
              />
            </div>

            <div class="groupInput">
              <label htmlFor="">RE-CONTRASEÑA </label>
              <input
                type="password"
                class="inputText"
                name="repassword"
                v-model="form.repassword"
              />
            </div>

            <div class="groupInput">
              <label htmlFor="">E-MAIL </label>
              <input type="text" class="inputText" name="email" v-model="form.email" />
            </div>

            <button class="buttonRegister" @click="handleSave">Registrarse</button>
          </div>
        </div>
      </div>
    </div>
  </MainContainer>
</template>

<style scoped>
.contentLeft {
  margin-top: 20px;
  width: 598px;
  background-color: #0b0f13;
  float: left;
  padding: 1px;
  position: relative;
  bottom: 70px;
  .shadow {
    box-shadow: inset 0 0 10px #555657;
    float: left;
    width: 578px;
    padding: 10px;
    h4 {
      color: #ff9000;
      text-align: center;
      font-size: 20px;
      float: left;
      width: 100%;
      margin-top: 10px;
      margin-bottom: 10px;
    }
  }

  .register {
    margin-top: 15px;
    .form {
      margin: 0 auto;
      width: 360px;
      text-align: center;
      margin-top: 60px;
      p {
        margin-top: 5px;
        margin-bottom: 5px;
      }
      .groupInput {
        float: left;
        width: 360px;
        margin-bottom: 10px;
        label {
          color: #496076;
          float: left;
          margin-top: 10px;
        }
        .inputText {
          float: right;
          width: 200px;
          height: 30px;
          background-color: #0b0f13;
          border-color: #151c23;
          border: none;
          color: #525252;
          padding-left: 10px;
          border: 1px solid #1a242d;
          background-color: #000;
          font-size: 15px;
        }
        .inputError {
          border-color: #791111;
        }
      }
      .buttonRegister {
        margin-top: 15px;
        margin-bottom: 15px;
        border: none;
        background: #11171d;
        border: 1px solid #1a242d;
        color: #006e2e;
        font-size: 16px;
        font-weight: normal;
        padding: 5px 30px;
        cursor: pointer;
      }
    }
  }
}
</style>
