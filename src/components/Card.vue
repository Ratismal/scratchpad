<template>
  <div ref="card" :style="style" class="card" @mousedown="$emit('focus')">
    <div ref="header" class="header" @mousedown.prevent="drag" @mouseup.prevent="stopDrag">
      <button class="button item material-icons" @mousedown.prevent="toggleEdit">edit</button>
      <button class="button item material-icons" @mousedown="setState('DELETE')">close</button>
    </div>
    <div class="content" :style="data.frost ? 'background-color:' + data.frost + '33' : ''">
      <div v-if="state === 'EDIT'">
        <label>Frost</label>
        <input type="color" v-model="data.frost" />
        <label>Content</label>
        <textarea v-model="data.content"></textarea>
      </div>
      <div v-else-if="state === 'DELETE'" class="delete-confirmation">
        <p>Are you sure you'd like to delete this card?</p>
        <p>There's no undo!</p>
        <button class="button material-icons" @click.prevent="setState('VIEW')">close</button>
        <button class="button material-icons" @click.prevent="$emit('delete')">check</button>
      </div>
      <div v-else-if="state === 'VIEW'" v-html="formattedContent"></div>
    </div>
  </div>
</template>

<script>
import marked from "marked";

export default {
  props: {
    data: {
      type: Object,
      default: () => ({
        content: "New Card",
        key: Date.now(),
        x: 50,
        y: 50,
        frost: null
      })
    }
  },
  computed: {
    formattedContent() {
      return marked(this.data.content);
    },
    style() {
      return {
        top: Math.max(0, this.data.y) + "px",
        left: Math.max(0, this.data.x) + "px"
        // top: Math.max(0, this.data.y - card.offsetTop) + "px",
        // left: Math.max(0, this.data.x - card.offsetLeft) + "px"
      };
    }
  },
  data() {
    return {
      state: "VIEW",
      dragging: false,
      tracker: null,
      mouseupTracker: null,
      oldX: null,
      oldY: null,
      wrapper: null
    };
  },
  mounted() {
    if (!this.wrapper) this.wrapper = document.getElementById("content");
    if (!this.tracker) this.tracker = this.trackMouse.bind(this);
    if (!this.mouseupTracker) this.mouseupTracker = this.stopDrag.bind(this);
  },
  methods: {
    toggleEdit() {
      if (this.state === "EDIT") this.state = "VIEW";
      else this.state = "EDIT";
    },
    setState(state) {
      this.state = state;
    },
    trackMouse(event) {
      this.data.x = event.pageX - this.wrapper.offsetLeft - this.oldX;
      this.data.y = event.pageY - this.wrapper.offsetTop - this.oldY;
      // this.data.x = this.oldX - event.clientX;
      // this.data.y = this.oldY - event.clientY;
      // this.oldX = event.clientX;
      // this.oldY = event.clientY;
    },
    drag(event) {
      // this.$emit("drag");
      let offset = {
        x: this.$refs.card.offsetLeft + this.wrapper.offsetLeft,
        y: this.$refs.card.offsetTop + this.wrapper.offsetTop
      };
      this.oldX = event.pageX - offset.x;
      this.oldY = event.pageY - offset.y;
      document.addEventListener("mousemove", this.tracker);
      document.addEventListener("mouseup", this.mouseupTracker);
    },
    stopDrag() {
      document.removeEventListener("mousemove", this.tracker);
      document.removeEventListener("mouseup", this.mouseupTracker);
    }
  }
};
</script>
