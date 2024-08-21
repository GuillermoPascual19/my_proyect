<template>
  <aside :class="`${is_expanded ? 'is-expanded' : 'is-collapsed'}`">
    <div class="logo">
      <img :src="logoURL" alt="Vue" />
    </div>

    <div class="menu-toggle-wrap">
      <button class="menu-toggle" @click="ToggleMenu">
        <span class="material-icons"> keyboard_double_arrow_right </span>
      </button>
    </div>

    <h3>Menu</h3>
    <div class="menu">
      <router-link to="/" class="button">
        <span class="material-icons">home</span>
        <span class="text">Home</span>
      </router-link>
      <router-link to="/about" class="button">
        <span class="material-icons">description</span>
        <span class="text">About</span>
      </router-link>
    </div>

    <div class="flex"></div>

    <div class="menu">
      <router-link to="/settings" class="button">
        <span class="material-icons">settings</span>
        <span class="text">Settings</span>
      </router-link>
    </div>
  </aside>
</template>

<script setup>
import { ref } from "vue";
import logoURL from "../assets/logo.png";

const is_expanded = ref(localStorage.getItem("is_expanded") === "true");

const ToggleMenu = () => {
  is_expanded.value = !is_expanded.value;
  localStorage.setItem("is_expanded", is_expanded.value);
};
</script>

<style lang="scss" scoped>
aside {
  width: 240px;
  display: flex;
  flex-direction: column;
  background-color: var(--dark);
  color: var(--light);
  min-height: 100vh;
  transition: width 0.3s, margin-left 0.3s;
  overflow: hidden;
  position: relative;

  .flex {
    flex: 1 1 auto;
  }

  .logo {
    margin-bottom: 1rem;
    padding: 1rem;

    img {
      width: 100%;
      height: auto;
    }
  }

  .menu-toggle-wrap {
    display: flex;
    justify-content: flex-end;
    padding: 0 1rem;
    margin-bottom: 1rem;

    .menu-toggle {
      background: none;
      border: none;
      cursor: pointer;

      .material-icons {
        font-size: 2rem;
        color: var(--light);
        transition: color 0.2s, transform 0.2s;
      }

      &:hover .material-icons {
        color: var(--primary);
        transform: translateX(0.5rem);
      }
    }
  }

  h3 {
    color: var(--grey);
    font-size: 0.875rem;
    margin: 0 1rem 0.5rem;
    text-transform: uppercase;
    transition: opacity 0.3s ease-in-out;
    opacity: 0;
  }

  .menu {
    margin: 0 -1rem;
    padding: 0 1rem;

    .button {
      display: flex;
      align-items: center;
      text-decoration: none;
      transition: background-color 0.2s ease-in-out;
      padding: 0.5rem 1rem;

      .material-icons {
        font-size: 2rem;
        color: var(--light);
        transition: margin-right 0.3s, color 0.2s ease-in-out;
      }

      .text {
        color: var(--light);
        transition: color 0.2s ease-in-out;
        margin-left: 1rem;
        opacity: 0;
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

  &.is-expanded {
    width: 240px;

    h3,
    .button .text {
      opacity: 1;
    }

    .button .material-icons {
      margin-right: 1rem;
    }

    .menu-toggle-wrap .menu-toggle .material-icons {
      transform: rotate(-180deg);
    }
  }

  &.is-collapsed {
    width: 80px;

    h3,
    .button .text {
      opacity: 0;
    }

    .menu-toggle-wrap .menu-toggle .material-icons {
      transform: rotate(0);
    }
  }

  @media (max-width: 1024px) {
    position: absolute;
    z-index: 99;
    width: 100%;
  }
}

.content-container {
  margin-left: 240px;
  transition: margin-left 0.3s;
}

.is-collapsed + .content-container {
  margin-left: 80px;
}
</style>
