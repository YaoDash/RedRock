<template>
  <div class="modal" v-if="visible">
    <div class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <slot></slot> <!-- 这里放置模态框的内容 -->
        <button class="close-button" @click="closeModal">
          关闭
        </button>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'MyModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    toggleWeek(index) {
      this.weeks[index].selected = !this.weeks[index].selected;
    },
    addCourse() {
       const newCourse = { ...this.newCourse };
       let weekData = this.weekCourse.find(w => w.week === newCourse.week);
       if (!weekData) {
             weekData = this.$set(this.weekCourse, this.weekCourse.length, { week: newCourse.week, courses: [] });
       }
       weekData.courses.push(newCourse);
       this.sortData();
       this.showModal = false;
       this.$forceUpdate();
       // 清空新课程表单
       this.newCourse = {
       subject: '',
       major: '',
        classroom: '',
       teacher: '',
       week: 0,
       index: 1,
       duration: 2,
       startTime: '',
       endTime: ''
        };
       }
  }
}
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-overlay {
  background-color: rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.close-button {
  cursor: pointer;
}
</style>