<template>
  <div class="Layout">
    <div class="container" :class="{ open: isOpen }"
      @mousedown="startDrag"
      @touchstart="startDrag"
    >
      <button class="btn"></button>
      <div class="words" v-if="!isOpen">
        <strong>今天和明天都没课咯~</strong>
      </div>
      <Transition>
        <div class="Drawer" v-if="isOpen">
          <iframe class="html" src="../Timetable.html"></iframe>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import axios from 'axios'
import "@/api/mock.js"

export default {
  setup() {
    const timetable = ref(null)
    const isOpen = ref(false)
    const container = ref(null)
    const startY = ref(0)
    const currentY = ref(0)
    const isDragging = ref(false)

    const fetchTimetable = () => {
      axios({
        url: '/api/App/getTimetable',
        method: 'get'
      }).then(res => {
        console.log(res)
        timetable.value = res.data
      }).catch(error => {
        console.error(error)
      })
    }

    const toggleDrawer = () => {
      isOpen.value = !isOpen.value
      if (isOpen.value) {
        fetchTimetable()
      }
    }

    const startDrag = (event) => {
      isDragging.value = true
      startY.value = event.touches ? event.touches[0].clientY : event.clientY
      document.addEventListener('mousemove', onDrag)
      document.addEventListener('mouseup', endDrag)
      document.addEventListener('touchmove', onDrag)
      document.addEventListener('touchend', endDrag)
    }

    const onDrag = (event) => {
      if (!isDragging.value) return
      currentY.value = event.touches ? event.touches[0].clientY : event.clientY
      const deltaY = startY.value - currentY.value
      const moveY = Math.min(Math.max(deltaY, -container.value.offsetHeight), 0)
      container.value.style.transform = `translateX(-50%) translateY(${moveY}px)`
    }

    const endDrag = () => {
      isDragging.value = false
      document.removeEventListener('mousemove', onDrag)
      document.removeEventListener('mouseup', endDrag)
      document.removeEventListener('touchmove', onDrag)
      document.removeEventListener('touchend', endDrag)
      if (currentY.value < startY.value - 100) { 
        isOpen.value = true
        container.value.style.transform = `translateX(-50%) translateY(-174vw)`
      } else {
        isOpen.value = false
        container.value.style.transform = `translateX(-50%) translateY(-2.5vw)`
      }
    }

    onMounted(() => {
      container.value = document.querySelector('.container')
    })

    onBeforeUnmount(() => {
      document.removeEventListener('mousemove', onDrag)
      document.removeEventListener('mouseup', endDrag)
      document.removeEventListener('touchmove', onDrag)
      document.removeEventListener('touchend', endDrag)
    })

    return {
      fetchTimetable,
      timetable,
      isOpen,
      toggleDrawer,
      startDrag
    }
  }
}
</script>

<style>
html,
body,
#app {
  position: fixed;
  background-image: url('@/assets/images/Layout.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  z-index: -1;
}

.container {
  position: fixed;
  padding-top: 5px;
  left: 50%;
  transform: translateX(-50%) translateY(-2vw);
  margin-top: 722px;
  height: 50px;
  width: 390px;
  color: #15315b;
  background-color: #ffffff;
  z-index: 1;
  cursor: move;
  flex-direction: column;
  transition: transform 0.8s ease-in-out;
}

.container.open {
  height: 200vw;
  transition: transform 0.8s ease-in-out;
}

.btn {
  display: block;
  margin: 0 auto;
  width: 10vw;
  height: 1vw;
  background-color: #e2edfb;
  border: 2px solid #e2edfb;
  border-radius: 20px;
}

.words {
  text-align: center;
  line-height: 45px;
}

.back {
  position: fixed;
  width: 20vw;
  height:9vw;
  right: 6vw;
  margin-top: 0vw;
  background-color: #5958f2;
  color: #e2edfb;
  border: 0;
  border-radius: 8vw;
}

.Choseweek {
  color: #152f50;
  padding-top: 2vw;
  padding-right: 230px;
  font-size: 5vw;
  font-weight: 900;
  background-color: #ffffff;
  border: 0;
}

.Drawer {
  position: relative;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.html {
  flex-grow: 1;
  margin-top: 1vw;
  border: 0;
}
</style>