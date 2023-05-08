<template>
  <div class="flex flex-row flex-nowrap justify-content-between"
    style="justify-content: space-between; margin-top: 2.5rem;">

    <div v-for="song in songs" :key="song.id" class="card w-96 bg-base-100 shadow-xl">
      <figure class="px-10 pt-10">
        <img :src="song.imageUrl" alt="Shoes" class="rounded-xl" />
      </figure>
      <div  class="card-body items-center text-center">
        <h2 class="card-title">{{ song.name }}</h2>
        <p>By: {{ song.author }}</p>
        <div class="card-actions">
          <RouterLink style="color: white;" :to="`/s/${song.id}`"><button class="btn btn-primary">Read
            More</button></RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { $http } from '../utils/http';
import { RouterLink } from 'vue-router';

const songs = ref([])

onMounted(async () => {
  const data = await $http.get('/songs/getAllSongs')
  songs.value = data
})


</script>