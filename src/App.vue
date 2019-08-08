<template>
  <div id="app" :class="appClass">
    <div class="left-sidebar"></div>
    <div class="header">
      <button class="button" @click.prevent="addCard">New Card</button>
    </div>
    <div id="content">
      <card v-for="card of board.cards" :key="card.key" :data="card"></card>
    </div>
    <div class="right-sidebar" v-if="sidebarActive"></div>
  </div>
</template>

<script>
import "@/assets/scss/main.scss";
import Card from "@/components/Card.vue";

export default {
  name: "app",
  components: { Card },
  computed: {
    appClass() {
      return {
        "sidebar-active": this.sidebarActive
      };
    },
    board() {
      return this.storage ? this.storage.boards[0] : { cards: [] };
    }
  },
  data() {
    return {
      sidebarActive: false,
      storage: null,
      saveInterval: null
    };
  },
  mounted() {
    if (localStorage.storage) this.storage = JSON.parse(localStorage.storage);
    if (!this.storage) {
      this.storage = {
        boards: [
          {
            key: Date.now(),
            cards: []
          }
        ]
      };
    }
    this.save();
    if (!this.saveInterval)
      this.saveInterval = setInterval(this.save.bind(this), 1000);
  },
  methods: {
    save() {
      localStorage.storage = JSON.stringify(this.storage);
    },
    addCard() {
      this.board.cards.push({
        key: Date.now(),
        content: "New Card",
        x: 50,
        y: 50
      });
    }
  }
};
</script>
