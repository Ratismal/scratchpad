<template>
  <div id="app" :class="appClass">
    <div class="left-sidebar">
      <div class="board-wrapper" v-if="storage">
        <div
          class="board"
          v-for="board of storage.boards"
          :key="board.key"
          @click.prevent="switchBoard(board)"
        >{{board.title}}</div>
      </div>
    </div>
    <div class="header">
      <button class="button material-icons" @click.prevent="addCard" title="New Card">add_to_photos</button>
      <button
        class="button material-icons"
        @click.prevent="repositionCards"
        title="Reposition Cards"
      >center_focus_weak</button>
      <input v-model="board.title" title="Board Name" />
      <button class="button material-icons" @click.prevent="addBoard" title="New Board">note_add</button>
      <button
        class="button material-icons"
        @click.prevent="removeBoard"
        title="Delete Board"
      >delete_forever</button>
    </div>
    <div id="content">
      <card
        v-for="card of board.cards"
        :key="card.key"
        :data="card"
        @focus="focus(card)"
        @delete="removeCard(card)"
        :class="focused === card.key ? 'focused' : 'unfocused'"
      ></card>
    </div>
    <div class="right-sidebar" v-if="sidebarActive"></div>
  </div>
</template>

<script>
import "@/assets/scss/main.scss";
import Card from "@/components/Card.vue";
import CardData from "@/assets/structs/CardData.js";

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
      return this.storage ? this.storage.boards[this.index] : { cards: [] };
    }
  },
  data() {
    return {
      sidebarActive: false,
      storage: null,
      saveInterval: null,
      order: [],
      focused: "",
      index: 0
    };
  },
  mounted() {
    if (localStorage.storage) this.storage = JSON.parse(localStorage.storage);
    if (!this.storage) {
      this.storage = {
        boards: [
          {
            key: Date.now(),
            cards: [],
            title: "General"
          }
        ]
      };
    }
    for (const board of this.storage.boards) {
      board.cards = board.cards.map(c => new CardData(c));
    }
    this.save();
    // if (!this.saveInterval)
    //   this.saveInterval = setInterval(this.save.bind(this), 1000);
  },
  watch: {
    storage: {
      handler(newValue) {
        if (newValue) {
          this.save(newValue);
        }
      },
      deep: true
    }
  },
  methods: {
    switchBoard(board) {
      this.index = this.storage.boards.indexOf(board);
    },
    removeBoard() {
      if (confirm("THIS IS PERMANENT OK?")) {
        this.storage.boards.splice(this.index, 1);
        this.index = 0;
      }
    },
    repositionCards() {
      for (const card of this.board.cards) {
        card.x = 50;
        card.y = 50;
      }
    },
    removeCard(card) {
      let cards = this.board.cards;
      cards.splice(cards.indexOf(card), 1);
    },
    focus(card) {
      let cards = this.board.cards;
      cards.splice(cards.indexOf(card), 1);
      cards.push(card);
      this.focused = card.key;
    },
    save(data) {
      localStorage.storage = JSON.stringify(data || this.storage);
    },
    addCard() {
      this.board.cards.push(new CardData());
    },
    addBoard() {
      this.storage.boards.push({
        key: Date.now(),
        title: "New Board",
        cards: []
      });
    }
  }
};
</script>
