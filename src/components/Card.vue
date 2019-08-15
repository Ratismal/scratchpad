<template>
  <div ref="card" :style="style" class="card" @mousedown="$emit('focus')">
    <div ref="header" class="header" @mousedown.prevent="drag" @mouseup.prevent="stopDrag">
      <span class="title">{{data.title}}</span>
      <div class="button-group">
        <button class="button item material-icons" @mousedown.prevent="setState('SCRIPT')">memory</button>
        <button class="button item material-icons" @mousedown.prevent="setState('EDIT')">edit</button>
        <button class="button item material-icons" @mousedown="setState('DELETE')">close</button>
      </div>
    </div>
    <div
      :class="{content:true,'no-padding':data.type === 'iframe'}"
      :style="data.frost ? 'background-color:' + data.frost + '33' : ''"
    >
      <div v-if="state === 'EDIT'">
        <label>Type</label>
        <select v-model="data.type">
          <option value="normal">Normal</option>
          <option value="iframe">iFrame</option>
        </select>
        <label>Title</label>
        <input v-model="data.title" />
        <label>Frost</label>
        <input type="color" v-model="data.frost" />
        <template v-if="data.type === 'iframe'">
          <label>iFrame Source</label>
          <input v-model="data.iframe.src" />
          <label>Height</label>
          <input v-model="data.iframe.height" />
          <label>Width</label>
          <input v-model="data.iframe.width" />
          <label>Frameborder</label>
          <input v-model="data.iframe.frameborder" />
        </template>
        <template v-else>
          <label>Content</label>
          <textarea v-model="data.content"></textarea>
        </template>
      </div>
      <div v-else-if="state === 'DELETE'" class="delete-confirmation">
        <p>Are you sure you'd like to delete this card?</p>
        <p>There's no undo!</p>
        <button class="button material-icons" @click.prevent="setState('VIEW')">close</button>
        <button class="button material-icons" @click.prevent="$emit('delete')">check</button>
      </div>
      <div v-else-if="state === 'SCRIPT'">
        <label>Dynamic Script</label>
        <textarea v-model="data.script"></textarea>
      </div>
      <template v-else>
        <template v-if="data.type === 'iframe'">
          <iframe v-bind="data.iframe" />
        </template>
        <div v-else v-html="formattedContent"></div>
      </template>
    </div>
  </div>
</template>

<script>
import marked from "marked";

import CardData from "@/assets/structs/CardData.js";

export default {
  props: {
    data: {
      type: Object,
      default: () => new CardData()
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

    this.setState("VIEW");
  },
  methods: {
    setState(state) {
      if (this.state === state) this.state = "VIEW";
      else this.state = state;

      if (this.state === "VIEW" && this.data.script) {
        setTimeout(() => {
          eval(this.data.script);
        }, 50);
      }
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
