<template>
  <aside :class="`${is_expanded ? 'is-expanded' : ''}`">
    <div class="menu-toggle-wrap">
      <button class="menu-toggle" @click="ToggleMenu">
        <v-icon>mdi-menu-open</v-icon>
      </button>
    </div>

    <h3>Menu</h3>
    <div class="menu">
      <button class="button" @click="goToHome">
        <v-icon large>mdi-home</v-icon>
        <span class="text">Home</span>
      </button>
      <router-link to="/about" class="button">
        <v-icon>mdi-eye</v-icon>
        <span class="text">About</span>
      </router-link>
      <router-link to="/chat" class="button">
        <v-icon>mdi-account-group</v-icon>
        <span class="text">TeamsChat</span>
      </router-link>
      <!-- <router-link to="/contact" class="button">
        <v-icon>mdi-image</v-icon>
        <span class="text">Images</span>
      </router-link> -->
    </div>

    <div class="flex"></div>

    <div class="menu">
      <button class="button" @click="goToChangeCredentials">
        <v-icon>mdi-wrench</v-icon>
        <span class="text">Settings</span>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const is_expanded = ref(localStorage.getItem("is_expanded") === "true");

const ToggleMenu = () => {
  is_expanded.value = !is_expanded.value;
  localStorage.setItem("is_expanded", is_expanded.value);
};

const router = useRouter();
const goToHome = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    console.log("No user, please login");
    console.error("No user, please login");
    router.push("/login");
  } else {
    if (user.role === 1) {
      router.push("/student?token=" + user.access_token);
    } else {
      router.push("/teacher?token=" + user.access_token);
    }
  }
};
const goToChangeCredentials = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    console.log("No user, please login");
    console.error("No user, please login");
    router.push("/login");
  } else {
    router.push("/settings?token=" + user.access_token);
  }
};
</script>

<style lang="scss" scoped>
aside {
  display: flex;
  flex-direction: column;

  background-color: var(--dark);
  color: var(--light);

  width: 10%;
  overflow: hidden;
  min-height: 100vh;
  padding: 1rem;

  transition: 0.2s ease-in-out;

  .flex {
    flex: 1 1 0%;
  }

  .menu-toggle-wrap {
    display: flex;
    // justify-content: flex-end;
    margin-bottom: 1rem;

    // position: relative;
    // top: 0;

    .menu-toggle {
      // transition: 0.2s ease-in-out;
      .material-icons {
        font-size: 2rem;
        color: var(--light);
        transition: 0.2s ease-out;
      }

      &:hover {
        .material-icons {
          color: var(--primary);
          transform: translateX(0.5rem);
        }
      }
    }
  }

  h3,
  .button .text {
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
  }

  h3 {
    color: var(--grey);
    font-size: 0.975rem;
    margin-bottom: 0.5rem;
  }

  .menu {
    margin: 0 -1rem;

    .button {
      display: flex;
      align-items: center;
      text-decoration: none;

      transition: 0.2s ease-in-out;
      padding: 0.5rem 1rem;

      .material-icons {
        font-size: 2rem;
        color: var(--light);
        transition: 0.2s ease-in-out;
      }
      .text {
        color: var(--light);
        transition: 0.2s ease-in-out;
      }

      &:hover {
        background-color: var(--dark-alt);

        .material-icons,
        .text {
          color: var(--primary);
        }
      }

      &.router-link-exact-active {
        background-color: var(--dark-alt);
        border-right: 5px solid var(--primary);

        .material-icons,
        .text {
          color: var(--primary);
        }
      }
    }
  }

  .footer {
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
    p {
      font-size: 0.875rem;
      color: var(--grey);
    }
  }

  &.is-expanded {
    .menu-toggle-wrap {
      top: -3rem;

      .menu-toggle {
        transform: rotate(-180deg);
      }
    }

    h3,
    .button .text {
      opacity: 1;
    }

    .button {
      .material-icons {
        margin-right: 1rem;
      }
    }

    .footer {
      opacity: 0;
    }
  }
}
</style>
