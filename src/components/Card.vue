<template>
  <div ref="card" :style="position" class="card">
    <div ref="header" class="header" @mousedown.prevent="drag" @mouseup.prevent="stopDrag"></div>
    <div class="content">
      <div v-if="edit"></div>
      <div v-else v-html="formattedContent"></div>
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
        y: 50
      })
    }
  },
  computed: {
    formattedContent() {
      return marked(this.data.content);
    },
    position() {
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
      edit: false,
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
    trackMouse(event) {
      this.data.x = event.pageX - this.wrapper.offsetLeft - this.oldX;
      this.data.y = event.pageY - this.wrapper.offsetTop - this.oldY;
      // this.data.x = this.oldX - event.clientX;
      // this.data.y = this.oldY - event.clientY;
      // this.oldX = event.clientX;
      // this.oldY = event.clientY;
    },
    drag(event) {
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
